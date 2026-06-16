"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck, FileText, X } from "lucide-react";

interface INotification {
  _id: string;
  title: string;
  message: string;
  type: "SUBMIT" | "APPROVE" | "REJECT" | "RATIFY";
  documentId: string;
  isRead: boolean;
  createdAt: string;
}

/* ── Warna badge per tipe notifikasi ── */
const typeBadge: Record<
  INotification["type"],
  { label: string; color: string }
> = {
  SUBMIT: { label: "Pengajuan", color: "bg-blue-100 text-blue-700" },
  APPROVE: { label: "Disetujui", color: "bg-green-100 text-green-700" },
  REJECT: { label: "Ditolak", color: "bg-red-100 text-red-700" },
  RATIFY: { label: "Disahkan", color: "bg-amber-100 text-amber-700" },
};

/* ── Format waktu relatif ── */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Fetch notifikasi ── */
  async function fetchNotifications() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ── Tandai satu notifikasi sebagai dibaca ── */
  async function markAsRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Gagal menandai notifikasi:", err);
    }
  }

  /* ── Tandai semua sebagai dibaca ── */
  async function markAllAsRead() {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Gagal menandai semua notifikasi:", err);
    }
  }

  /* ── Polling setiap 30 detik ── */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ── Fetch ulang saat dropdown dibuka ── */
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  /* ── Tutup dropdown saat klik di luar ── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Tombol Bell ── */}
      <button
        aria-label="Notifikasi"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition hover:border-slate-300 hover:bg-slate-100 hover:text-[#0F1F3D]"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F5A623] text-[9px] font-black text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Panel Dropdown ── */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#0F1F3D]">
                Notifikasi
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#F5A623] px-1.5 py-0.5 text-[9px] font-black text-white">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 transition hover:text-[#0F1F3D]"
                >
                  <CheckCheck size={12} />
                  Tandai semua dibaca
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-300 transition hover:text-slate-500"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List Notifikasi */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="h-2.5 w-full animate-pulse rounded bg-slate-100" />
                      <div className="h-2 w-1/3 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                <Bell size={28} className="opacity-30" />
                <span className="text-xs">Belum ada notifikasi</span>
              </div>
            ) : (
              <ul>
                {notifications.map((notif) => {
                  const badge = typeBadge[notif.type];
                  return (
                    <li
                      key={notif._id}
                      className={[
                        "flex gap-3 border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50",
                        !notif.isRead ? "bg-amber-50/40" : "",
                      ].join(" ")}
                    >
                      {/* Icon dokumen */}
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                        <FileText size={14} />
                      </div>

                      {/* Konten */}
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold leading-tight text-[#0F1F3D]">
                            {notif.title}
                          </span>
                          {/* Tombol tandai dibaca */}
                          {!notif.isRead && (
                            <button
                              onClick={() => markAsRead(notif._id)}
                              className="shrink-0 text-slate-300 transition hover:text-[#0F1F3D]"
                              aria-label="Tandai dibaca"
                            >
                              <Check size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              "rounded-full px-2 py-0.5 text-[9px] font-bold",
                              badge.color,
                            ].join(" ")}
                          >
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Dot unread */}
                      {!notif.isRead && (
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F5A623]" />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2.5">
              <span className="text-[10px] text-slate-400">
                Menampilkan {notifications.length} notifikasi terbaru
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
