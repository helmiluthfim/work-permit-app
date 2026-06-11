"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Username atau password tidak valid.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-sans md:flex-row">
      <style>{`
        .stripe-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 28px,
            rgba(245,166,35,0.06) 28px,
            rgba(245,166,35,0.06) 30px
          );
          pointer-events: none;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin-fast { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* ── MOBILE HEADER (hanya muncul di mobile) ── */}
      <div className="stripe-bg relative flex flex-col justify-center overflow-hidden bg-[#0F1F3D] px-6 pb-8 pt-14 md:hidden">
        {/* Tombol kembali — mobile */}
        <Link
          href="/"
          aria-label="Kembali ke halaman utama"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        {/* Brand */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-7 w-7 shrink-0 rounded-md bg-[#F5A623]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#F5A623]">
            PT Eksavindo Mitra Mandiri
          </span>
        </div>

        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5A623]/70">
          Sistem Perizinan Kerja
        </p>
        <h1 className="text-2xl font-black leading-tight tracking-tight text-white">
          Keselamatan <span className="text-[#F5A623]">adalah</span> Prioritas
          Utama
        </h1>
        <div className="mt-4 h-[3px] w-10 rounded-full bg-[#F5A623]" />
      </div>

      {/* ── LEFT PANEL (hanya desktop) ── */}
      <div className="stripe-bg relative hidden w-1/2 flex-col justify-center overflow-hidden bg-[#0F1F3D] p-16 md:flex">
        {/* Company badge */}
        <div className="relative mb-12 flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-md bg-[#F5A623]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5A623]">
            PT Eksavindo Mitra Mandiri
          </span>
        </div>

        {/* Headline */}
        <div className="relative mb-10">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5A623]/80">
            Sistem Perizinan Kerja
          </p>
          <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white xl:text-5xl">
            Keselamatan
            <br />
            <span className="text-[#F5A623]">adalah</span>
            <br />
            Prioritas Utama
          </h1>
          <div className="mt-5 h-[3px] w-12 rounded-full bg-[#F5A623]" />
        </div>

        {/* Description */}
        <p className="mb-10 max-w-[340px] text-sm leading-relaxed text-white/50">
          Platform terpadu pengelolaan izin kerja dan pengawasan K3 di seluruh
          area operasional perusahaan.
        </p>

        {/* Stat cards */}
        <div className="flex flex-wrap gap-3">
          {[
            { value: "100%", label: "Kepatuhan SOP" },
            { value: "24/7", label: "Pemantauan Aktif" },
            { value: "Zero", label: "Target Kecelakaan" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-0.5 rounded-xl border border-[#F5A623]/20 bg-white/[0.06] px-5 py-4"
            >
              <span className="text-xl font-black text-[#F5A623]">
                {s.value}
              </span>
              <span className="text-[11px] tracking-wide text-white/40">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Watermark shield */}
        <div className="pointer-events-none absolute bottom-10 right-10 opacity-[0.07]">
          <svg width="100" height="112" viewBox="0 0 90 100" fill="none">
            <path
              d="M45 4 L80 18 L80 52 C80 72 62 88 45 96 C28 88 10 72 10 52 L10 18 Z"
              fill="#F5A623"
            />
            <path
              d="M28 50 L40 62 L62 38"
              stroke="#0F1F3D"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* ── RIGHT PANEL / FORM ── */}
      <div className="relative flex w-full flex-1 flex-col items-center justify-center bg-white px-6 py-10 md:w-1/2 md:px-16 md:py-12">
        {/* Tombol kembali — desktop only */}
        <Link
          href="/"
          aria-label="Kembali ke halaman utama"
          className="absolute right-5 top-5 hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 transition hover:border-slate-300 hover:bg-slate-100 hover:text-[#0F1F3D] md:flex"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <h2 className="mb-1.5 text-2xl font-black tracking-tight text-[#0F1F3D] md:text-3xl">
              Selamat Datang
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Masuk dengan akun yang telah didaftarkan oleh administrator.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-0.5 shrink-0"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v3.5M8 11h.01"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm leading-relaxed text-red-600">
                {error}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Username
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="5.5"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M2.5 13.5C2.5 11 5 9 8 9s5.5 2 5.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-[#0F1F3D] placeholder-slate-300 outline-none transition focus:border-[#F5A623] focus:bg-white focus:ring-2 focus:ring-[#F5A623]/20 md:py-3"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="3"
                      y="7"
                      width="10"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M5 7V5.5a3 3 0 016 0V7"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <circle cx="8" cy="10.5" r="1" fill="currentColor" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-11 text-sm text-[#0F1F3D] placeholder-slate-300 outline-none transition focus:border-[#F5A623] focus:bg-white focus:ring-2 focus:ring-[#F5A623]/20 md:py-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-300 transition hover:text-[#0F1F3D]"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M2 9s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <circle
                        cx="9"
                        cy="9"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M2 2l14 14"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M2 9s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <circle
                        cx="9"
                        cy="9"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F1F3D] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:-translate-y-px hover:bg-[#1a3561] disabled:cursor-not-allowed disabled:bg-slate-400 md:py-3.5"
              >
                {loading ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="animate-spin-fast"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 2a6 6 0 016 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-6 md:mt-10">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
            <p className="text-xs text-slate-400">
              Akses terbatas untuk personel yang berwenang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
