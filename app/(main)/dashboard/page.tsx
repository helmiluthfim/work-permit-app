"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
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
  catatanPenolakan?: string;
}

const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: FileText,
    dot: "bg-slate-400",
  },
  submitted: {
    label: "Menunggu Review",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: Clock,
    dot: "bg-blue-400",
  },
  approved_k3: {
    label: "Disetujui K3",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: CheckCircle,
    dot: "bg-amber-400",
  },
  approved_director: {
    label: "Disetujui Direktur",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: ShieldCheck,
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Ditolak",
    color: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
    dot: "bg-red-500",
  },
};

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [workPermits, setWorkPermits] = useState<WorkPermitSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") router.push("/login");
  }, [router, sessionStatus]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    setIsLoading(true);
    fetch("/api/work-permits")
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setWorkPermits(result.data);
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

  const role = (session?.user as any)?.role as string;
  const username =
    (session?.user as any)?.username || session?.user?.name || "Pengguna";

  // Hitung statistik per status
  const stats = {
    total: workPermits.length,
    pending: workPermits.filter((w) => w.status === "submitted").length,
    approved: workPermits.filter((w) => w.status === "approved_director")
      .length,
    rejected: workPermits.filter((w) => w.status === "rejected").length,
    draft: workPermits.filter((w) => w.status === "draft").length,
  };

  // 5 dokumen terbaru untuk preview ringkas
  const recentPermits = workPermits.slice(0, 5);

  return (
    <div className="min-h-full w-full p-6 md:p-8">
      {/* ── GREETING ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#F5A623]">
            Selamat Datang
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

        {role === "PJ_TEKNIK" && (
          <button
            onClick={() => router.push("/work-permits/create")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#1a3561] active:scale-95"
          >
            <Plus size={16} />
            Buat Izin Kerja Baru
          </button>
        )}
      </div>

      {/* ── STAT CARDS ── */}
      {isLoading ? (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              label: "Total Dokumen",
              value: stats.total,
              icon: FileText,
              accent: "text-[#0F1F3D]",
              bg: "bg-[#0F1F3D]/5",
              border: "border-[#0F1F3D]/10",
            },
            {
              label: "Menunggu Review",
              value: stats.pending,
              icon: Clock,
              accent: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              label: "Disetujui",
              value: stats.approved,
              icon: ShieldCheck,
              accent: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              label: "Ditolak",
              value: stats.rejected,
              icon: AlertTriangle,
              accent: "text-red-500",
              bg: "bg-red-50",
              border: "border-red-100",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex flex-col justify-between rounded-2xl border ${s.border} ${s.bg} p-5`}
            >
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${s.bg} ${s.accent}`}
              >
                <s.icon size={18} />
              </div>
              <div>
                <p className={`text-3xl font-black ${s.accent}`}>{s.value}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MAIN GRID: recent + quick info ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent dokumen — 2/3 lebar */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-bold text-[#0F1F3D]">
                Dokumen Terbaru
              </h2>
              <button
                onClick={() => router.push("/work-permits")}
                className="flex items-center gap-1 text-xs font-semibold text-[#F5A623] transition hover:text-amber-600"
              >
                Lihat Semua
                <ArrowRight size={12} />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : recentPermits.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-slate-400">
                <FileText size={36} className="text-slate-200" />
                <p className="text-sm">Belum ada dokumen Work Permit.</p>
                {role === "PJ_TEKNIK" && (
                  <button
                    onClick={() => router.push("/work-permits/create")}
                    className="mt-1 rounded-lg bg-[#0F1F3D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                  >
                    Buat Sekarang
                  </button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {recentPermits.map((wp) => {
                  const cfg = statusConfig[wp.status] ?? statusConfig.draft;
                  const Icon = cfg.icon;
                  return (
                    <li key={wp._id}>
                      <button
                        onClick={() => router.push(`/work-permits/${wp._id}`)}
                        className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
                      >
                        {/* Status dot */}
                        <span
                          className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`}
                        />

                        {/* Info */}
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

                        {/* Badge */}
                        <span
                          className={`hidden shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold sm:inline-flex ${cfg.color}`}
                        >
                          <Icon size={10} />
                          {cfg.label}
                        </span>

                        <ArrowRight
                          size={14}
                          className="shrink-0 text-slate-300"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Panel kanan: status breakdown + shortcut */}
        <div className="flex flex-col gap-6">
          {/* Status breakdown */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-[#F5A623]" />
              <h2 className="text-sm font-bold text-[#0F1F3D]">
                Sebaran Status
              </h2>
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 animate-pulse rounded-lg bg-slate-100"
                  />
                ))}
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {(
                  Object.entries(statusConfig) as [
                    string,
                    (typeof statusConfig)[keyof typeof statusConfig],
                  ][]
                ).map(([key, cfg]) => {
                  const count = workPermits.filter(
                    (w) => w.status === key,
                  ).length;
                  const pct = stats.total
                    ? Math.round((count / stats.total) * 100)
                    : 0;
                  return (
                    <li key={key} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {cfg.label}
                        </span>
                        <span className="text-xs font-bold text-[#0F1F3D]">
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cfg.dot}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-[#0F1F3D]">
              Aksi Cepat
            </h2>
            <div className="flex flex-col gap-2">
              {role === "PJ_TEKNIK" && (
                <>
                  <button
                    onClick={() => router.push("/work-permits/create")}
                    className="flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                  >
                    <Plus size={14} /> Buat Work Permit
                  </button>
                  <button
                    onClick={() => router.push("/jsa")}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <FileText size={14} /> Buat JSA
                  </button>
                  <button
                    onClick={() => router.push("/hirarc")}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <FileText size={14} /> Buat HIRARC
                  </button>
                </>
              )}
              {role === "TENAGA_AHLI_K3" && (
                <>
                  <button
                    onClick={() => router.push("/work-permits/review")}
                    className="flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                  >
                    <ShieldCheck size={14} /> Review Work Permit
                  </button>
                  <button
                    onClick={() => router.push("/jsa/review")}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <ShieldCheck size={14} /> Review JSA
                  </button>
                </>
              )}
              {role === "DIREKTUR" && (
                <button
                  onClick={() => router.push("/approval")}
                  className="flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                >
                  <CheckCircle size={14} /> Approval Dokumen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
