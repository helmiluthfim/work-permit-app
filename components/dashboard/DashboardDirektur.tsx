"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  Activity,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
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
  evaluatorK3?: string;
  catatanPenolakan?: string;
}

export default function DashboardDirektur() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [allPermits, setAllPermits] = useState<WorkPermitSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const username =
    (session?.user as any)?.username || session?.user?.name || "Direktur";

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

  const pendingApprovals = allPermits.filter((w) => w.status === "approved_k3");
  const aktif = allPermits.filter(
    (w) => w.status === "submitted" || w.status === "approved_k3",
  ).length;
  const totalDisetujui = allPermits.filter(
    (w) => w.status === "approved_director",
  ).length;
  const totalDitolak = allPermits.filter((w) => w.status === "rejected").length;

  return (
    <div className="min-h-full w-full p-6 md:p-8">
      {/* GREETING */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#F5A623]">
            Executive Dashboard
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
        {/* Approval badge — alert jika ada yang menunggu */}
        {!isLoading && pendingApprovals.length > 0 && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-2.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#F5A623]" />
            <span className="text-xs font-bold text-[#0F1F3D]">
              {pendingApprovals.length} dokumen menunggu persetujuan Anda
            </span>
          </div>
        )}
      </div>

      {/* STAT CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-slate-100"
              />
            ))
          : [
              {
                label: "Butuh Approval",
                value: pendingApprovals.length,
                icon: Clock,
                bg: "bg-[#0F1F3D]",
                iconBg: "bg-[#F5A623]/20",
                iconColor: "text-[#F5A623]",
                numColor: "text-white",
                labelColor: "text-white/60",
                border: "border-transparent",
                urgent: true,
              },
              {
                label: "Pekerjaan Aktif",
                value: aktif,
                icon: Activity,
                bg: "bg-white",
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
                numColor: "text-[#0F1F3D]",
                labelColor: "text-slate-500",
                border: "border-slate-100",
                urgent: false,
              },
              {
                label: "Total Disetujui",
                value: totalDisetujui,
                icon: CheckCircle,
                bg: "bg-white",
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                numColor: "text-[#0F1F3D]",
                labelColor: "text-slate-500",
                border: "border-slate-100",
                urgent: false,
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`flex items-center justify-between rounded-2xl border ${s.border} ${s.bg} p-5 shadow-sm`}
              >
                <div>
                  <p className={`text-3xl font-black ${s.numColor}`}>
                    {s.value}
                  </p>
                  <p className={`mt-0.5 text-xs font-medium ${s.labelColor}`}>
                    {s.label}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}
                >
                  <s.icon size={22} />
                </div>
              </div>
            ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Antrean approval — 2/3 */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#F5A623]" />
                <h2 className="text-sm font-bold text-[#0F1F3D]">
                  Menunggu Persetujuan Anda
                </h2>
                {!isLoading && pendingApprovals.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5A623] text-[10px] font-black text-[#0F1F3D]">
                    {pendingApprovals.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => router.push("/work-permits/approval")}
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
            ) : pendingApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-slate-400">
                <CheckCircle size={36} className="text-slate-200" />
                <p className="text-sm font-medium">
                  Tidak ada dokumen yang menunggu.
                </p>
                <p className="text-xs text-slate-300">
                  Semua pengajuan sudah diproses.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {pendingApprovals.map((wp) => (
                  <li key={wp._id}>
                    <button
                      onClick={() =>
                        router.push(`/work-permits/${wp._id}/approval`)
                      }
                      className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
                    >
                      {/* K3-verified badge */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                        <ShieldCheck size={15} className="text-emerald-500" />
                      </div>
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
                        <CheckSquare size={10} /> Setujui
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Kanan: ringkasan & aksi */}
        <div className="flex flex-col gap-6">
          {/* Ringkasan persetujuan */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-[#F5A623]" />
              <h2 className="text-sm font-bold text-[#0F1F3D]">
                Ringkasan Persetujuan
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {[
                {
                  label: "Menunggu approval",
                  value: pendingApprovals.length,
                  dot: "bg-[#F5A623]",
                },
                { label: "Pekerjaan aktif", value: aktif, dot: "bg-blue-400" },
                {
                  label: "Total disetujui",
                  value: totalDisetujui,
                  dot: "bg-emerald-500",
                },
                { label: "Ditolak", value: totalDitolak, dot: "bg-red-500" },
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

          {/* Aksi cepat */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-[#0F1F3D]">
              Aksi Cepat
            </h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/approval")}
                className="flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#1a3561]"
              >
                <CheckSquare size={14} /> Beri Approval Dokumen
              </button>
              <button
                onClick={() => router.push("/work-permits")}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <Activity size={14} /> Lihat Semua Pekerjaan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
