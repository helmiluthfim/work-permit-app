"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileSearch,
  FileSignature,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface WorkPermitSummary {
  _id: string;
  nomorWP: string;
  namaPekerjaan: string;
  lokasi: string;
  tanggalMulai: string;
  status:
    | "draft"
    | "submitted"
    | "approved_k3"
    | "approved_director"
    | "rejected";
  pekerjaan?: { namaPekerjaan: string };
  pemohon?: string;
  catatanPenolakan?: string;
}

export default function DashboardK3() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [allPermits, setAllPermits] = useState<WorkPermitSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const username =
    (session?.user as any)?.username || session?.user?.name || "Pengguna";

  useEffect(() => {
    if (sessionStatus === "unauthenticated") router.push("/login");
  }, [router, sessionStatus]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    setIsLoading(true);
    fetch("/api/work-permits")
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setAllPermits(result.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [sessionStatus]);

  if (sessionStatus === "loading") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
          <p className="text-sm font-medium text-slate-400">Memuat...</p>
        </div>
      </div>
    );
  }
  if (sessionStatus !== "authenticated") return null;

  const pendingReviews = allPermits.filter((w) => w.status === "submitted");
  const selesai = allPermits.filter(
    (w) => w.status === "approved_k3" || w.status === "approved_director",
  ).length;
  const ditolak = allPermits.filter((w) => w.status === "rejected").length;

  const statCards = [
    {
      label: "Antrean Review",
      value: pendingReviews.length,
      icon: Clock,
      accent: "text-[#F5A623]",
      bg: "bg-[#F5A623]/10",
      border: "border-[#F5A623]/20",
      numColor: "text-[#0F1F3D]",
    },
    {
      label: "Selesai Diperiksa",
      value: selesai,
      icon: CheckCircle,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      numColor: "text-emerald-700",
    },
    {
      label: "Ditolak / Revisi",
      value: ditolak,
      icon: AlertTriangle,
      accent: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
      numColor: "text-red-600",
    },
  ];

  return (
    <div className="min-h-full w-full p-6 md:p-8">
      {/* GREETING */}
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#F5A623]">
            Dashboard Evaluasi K3
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#0F1F3D]">
            {username}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <p className="text-xs text-slate-400 sm:text-right">
          Periksa dan validasi dokumen JSA, HIRARC,
          <br className="hidden sm:block" /> dan kelengkapan izin kerja.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-4 rounded-2xl border ${s.border} ${s.bg} p-5`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${s.accent}`}
            >
              <s.icon size={22} />
            </div>
            <div>
              <p className={`text-3xl font-black ${s.numColor}`}>{s.value}</p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Antrean review — 2/3 */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <FileSearch size={16} className="text-[#F5A623]" />
                <h2 className="text-sm font-bold text-[#0F1F3D]">
                  Menunggu Evaluasi Anda
                </h2>
                {!isLoading && pendingReviews.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5A623] text-[10px] font-black text-[#0F1F3D]">
                    {pendingReviews.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => router.push("/work-permits/review")}
                className="flex items-center gap-1 text-xs font-semibold text-[#F5A623] transition hover:text-amber-600"
              >
                Lihat Semua <ArrowRight size={12} />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : pendingReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-slate-400">
                <ShieldCheck size={36} className="text-slate-200" />
                <p className="text-sm font-medium">
                  Semua dokumen sudah dievaluasi.
                </p>
                <p className="text-xs text-slate-300">
                  Tidak ada antrean review saat ini.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {pendingReviews.map((wp) => (
                  <li key={wp._id}>
                    <button
                      onClick={() =>
                        router.push(`/work-permits/${wp._id}/review`)
                      }
                      className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
                    >
                      {/* urgency dot */}
                      <span className="mt-0.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#F5A623]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#0F1F3D]">
                          {wp.pekerjaan?.namaPekerjaan ||
                            wp.namaPekerjaan ||
                            "—"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {wp.nomorWP} · {wp.lokasi}
                        </p>
                      </div>
                      <span className="hidden shrink-0 text-xs text-slate-400 sm:block">
                        {wp.tanggalMulai}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0F1F3D] px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-[#1a3561]">
                        <FileSignature size={10} /> Review
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Kanan: aksi cepat + status ringkasan */}
        <div className="flex flex-col gap-6">
          {/* Aksi cepat */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-[#0F1F3D]">
              Aksi Cepat
            </h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/work-permits/review")}
                className="flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#1a3561]"
              >
                <FileSignature size={14} /> Review Work Permit
              </button>
              <button
                onClick={() => router.push("/jsa/review")}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <FileSearch size={14} /> Review JSA
              </button>
              <button
                onClick={() => router.push("/hirarc/review")}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <FileSearch size={14} /> Review HIRARC
              </button>
            </div>
          </div>

          {/* Status ringkasan */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-[#0F1F3D]">
              Ringkasan Aktivitas
            </h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  label: "Menunggu review",
                  value: pendingReviews.length,
                  dot: "bg-[#F5A623]",
                },
                {
                  label: "Selesai diperiksa",
                  value: selesai,
                  dot: "bg-emerald-500",
                },
                { label: "Dikembalikan", value: ditolak, dot: "bg-red-500" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-[#0F1F3D]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
