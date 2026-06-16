"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

/**
 * useAutoLogout
 *
 * Hook ini memastikan user otomatis logout jika tab/browser ditutup
 * (atau diminimize / pindah aplikasi) lebih lama dari batas waktu tertentu.
 *
 * Cara kerja:
 * - Saat tab disembunyikan (visibilitychange -> hidden) atau saat halaman
 *   akan unload (beforeunload/pagehide), simpan timestamp ke localStorage.
 *   localStorage dipakai (bukan sessionStorage) karena nilainya tetap ada
 *   walau tab/browser ditutup total.
 * - Saat tab kembali terlihat (atau saat hook pertama kali mount setelah
 *   reload), bandingkan timestamp tersimpan dengan waktu sekarang.
 * - Jika selisihnya melebihi limitMs, paksa logout. Jika belum melebihi
 *   (misal hanya refresh atau pindah tab sebentar), tidak ada aksi.
 */

const DEFAULT_LIMIT_MS = 15 * 60 * 1000; // 15 menit, sesuaikan kebutuhan
const STORAGE_KEY = "lastHiddenAt";

export function useAutoLogout(limitMs: number = DEFAULT_LIMIT_MS) {
  const { status } = useSession();
  const hasCheckedOnMount = useRef(false);

  // Cek sekali saat status pertama kali authenticated (termasuk setelah reload)
  useEffect(() => {
    if (status !== "authenticated") return;
    if (hasCheckedOnMount.current) return;
    hasCheckedOnMount.current = true;

    const lastHiddenAt = localStorage.getItem(STORAGE_KEY);
    if (lastHiddenAt) {
      const elapsed = Date.now() - Number(lastHiddenAt);
      if (elapsed > limitMs) {
        signOut({ callbackUrl: "/login" });
        return;
      }
    }
    localStorage.removeItem(STORAGE_KEY);
  }, [status, limitMs]);

  // Pantau perpindahan visibilitas tab + sinyal akan menutup halaman
  useEffect(() => {
    if (status !== "authenticated") return;

    const recordHiddenTime = () => {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        recordHiddenTime();
        return;
      }

      // visibilityState === "visible"
      const lastHiddenAt = localStorage.getItem(STORAGE_KEY);
      if (!lastHiddenAt) return;

      const elapsed = Date.now() - Number(lastHiddenAt);
      if (elapsed > limitMs) {
        signOut({ callbackUrl: "/login" });
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", recordHiddenTime);
    window.addEventListener("pagehide", recordHiddenTime);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", recordHiddenTime);
      window.removeEventListener("pagehide", recordHiddenTime);
    };
  }, [status, limitMs]);

  // Bersihkan flag saat user memang sudah logout
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem(STORAGE_KEY);
      hasCheckedOnMount.current = false;
    }
  }, [status]);
}
