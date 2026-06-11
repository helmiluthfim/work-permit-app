"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  Briefcase,
  ListChecks,
  AlertTriangle,
  ShieldCheck,
  ClipboardList,
  BookOpen,
  Shield,
  Ruler,
  Wrench,
  Activity,
} from "lucide-react";

interface JobTemplate {
  _id: string;
  kodePekerjaan: string;
  namaPekerjaan: string;
  status: string;
  createdAt: string;
  workPermitTemplate?: any;
  jsaTemplate?: any;
  hirarcTemplate?: any;
  sopTemplate?: any;
  ikTemplate?: any;
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function SmartList({ items }: { items?: string[] }) {
  if (!items || items.length === 0)
    return (
      <span className="italic text-slate-400 text-sm">Tidak ada data</span>
    );
  return (
    <div className="space-y-1 mt-1">
      {items.map((item, i) => {
        const t = item.trim();
        if (!t) return null;
        if (/^\d+\./.test(t))
          return (
            <p
              key={i}
              className="text-xs font-black uppercase tracking-wide text-[#0F1F3D] mt-3 first:mt-0"
            >
              {t}
            </p>
          );
        return (
          <div
            key={i}
            className="flex items-start gap-2 ml-2 text-sm text-slate-700"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
            <span>{t.replace(/^- /, "")}</span>
          </div>
        );
      })}
    </div>
  );
}

// Modal section wrapper
function ModalSection({
  number,
  title,
  icon: Icon,
  accent,
  children,
}: {
  number: number;
  title: string;
  icon: React.ElementType;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className={`flex items-center gap-3 px-5 py-3.5 ${accent}`}>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-black text-white">
          {number}
        </span>
        <Icon size={15} className="text-white/80" />
        <h3 className="text-sm font-black text-white">{title}</h3>
      </div>
      <div className="bg-white p-5">{children}</div>
    </div>
  );
}

// Score cell for HIRARC
function ScoreCell({
  label,
  value,
  variant,
}: {
  label: string;
  value?: string;
  variant?: "red" | "green";
}) {
  const style =
    variant === "red"
      ? "bg-red-50 border-red-200 text-red-700"
      : variant === "green"
        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
        : "bg-slate-50 border-slate-200 text-slate-700";
  return (
    <div
      className={`flex flex-col items-center rounded-lg border p-2 text-center ${style}`}
    >
      <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wide opacity-60">
        {label}
      </span>
      <span className="text-sm font-black">{value || "—"}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobTemplatePage() {
  const [jobs, setJobs] = useState<JobTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/job-templates");
      const result = await res.json();
      setJobs(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus template ini?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/job-templates/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
        return;
      }
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = jobs.filter(
    (j) =>
      j.namaPekerjaan.toLowerCase().includes(search.toLowerCase()) ||
      j.kodePekerjaan.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
          <p className="text-sm font-medium text-slate-400">
            Memuat data template...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full p-6 md:p-8">
      {/* ── HEADER ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
            Master Data
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#0F1F3D]">
            Master Pekerjaan K3
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola template dokumen K3 untuk setiap jenis pekerjaan.
          </p>
        </div>
        <Link
          href="/master/jobs/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#1a3561] active:scale-95"
        >
          <Plus size={16} />
          Tambah Template
        </Link>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="relative mb-5 max-w-sm">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode atau nama pekerjaan..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-[#0F1F3D] outline-none transition focus:border-[#0F1F3D] focus:ring-2 focus:ring-[#0F1F3D]/10"
        />
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_2fr_100px_140px_160px] border-b border-slate-100 bg-[#0F1F3D]/[0.03] px-5 py-3">
          {["Kode", "Nama Pekerjaan", "Status", "Dibuat", "Aksi"].map((h) => (
            <span
              key={h}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
            <FileText size={36} className="text-slate-200" />
            <p className="text-sm">
              {search
                ? "Tidak ditemukan hasil pencarian."
                : "Belum ada template pekerjaan."}
            </p>
            {!search && (
              <Link
                href="/master/jobs/create"
                className="mt-1 rounded-lg bg-[#0F1F3D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a3561]"
              >
                Buat Sekarang
              </Link>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {filtered.map((job) => (
              <li
                key={job._id}
                className="grid grid-cols-[1fr_2fr_100px_140px_160px] items-center px-5 py-4 transition hover:bg-slate-50"
              >
                {/* Kode */}
                <span className="font-mono text-xs font-bold text-[#0F1F3D]">
                  {job.kodePekerjaan}
                </span>

                {/* Nama */}
                <span className="text-sm font-semibold text-slate-700">
                  {job.namaPekerjaan}
                </span>

                {/* Status */}
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                    job.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {job.status === "active" ? "Aktif" : "Nonaktif"}
                </span>

                {/* Tanggal */}
                <span className="text-xs text-slate-400">
                  {new Date(job.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                {/* Aksi */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#0F1F3D] hover:text-[#0F1F3D]"
                  >
                    <Eye size={12} /> Detail
                  </button>
                  <Link
                    href={`/master/jobs/${job._id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#F5A623]/30 bg-[#F5A623]/10 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-[#F5A623]/20"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={deletingId === job._id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    {deletingId === job._id ? "..." : "Hapus"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Menampilkan{" "}
              <span className="font-bold text-[#0F1F3D]">
                {filtered.length}
              </span>{" "}
              dari {jobs.length} template
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL DETAIL                                             */}
      {/* ======================================================== */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F1F3D]/60 backdrop-blur-sm p-4 sm:items-center animate-in fade-in duration-200">
          <div className="flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between bg-[#0F1F3D] px-6 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                  Detail Template K3
                </p>
                <h2 className="text-base font-black text-white">
                  {selectedJob.kodePekerjaan} · {selectedJob.namaPekerjaan}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/master/jobs/${selectedJob._id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5A623] px-4 py-2 text-xs font-black text-[#0F1F3D] transition hover:bg-amber-400"
                >
                  <Pencil size={12} /> Edit
                </Link>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 space-y-5 overflow-y-auto bg-[#F7F8FA] p-6">
              {/* ── 1. WORK PERMIT ── */}
              <ModalSection
                number={1}
                title="Work Permit"
                icon={FileText}
                accent="bg-[#0F1F3D]"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "Klasifikasi Pekerjaan",
                      items:
                        selectedJob.workPermitTemplate?.klasifikasiPekerjaan,
                    },
                    {
                      label: "Prosedur Pekerjaan",
                      items: selectedJob.workPermitTemplate?.prosedurPekerjaan,
                    },
                    {
                      label: "Lampiran",
                      items: selectedJob.workPermitTemplate?.lampiran,
                    },
                  ].map((col) => (
                    <div
                      key={col.label}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {col.label}
                      </p>
                      <SmartList items={col.items} />
                    </div>
                  ))}
                </div>
              </ModalSection>

              {/* ── 2. JSA ── */}
              <ModalSection
                number={2}
                title="Job Safety Analysis (JSA)"
                icon={ListChecks}
                accent="bg-blue-600"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "Langkah Kerja",
                      icon: ListChecks,
                      items: selectedJob.jsaTemplate?.langkahKerja,
                      bg: "bg-blue-50/50 border-blue-100",
                    },
                    {
                      label: "Bahaya & Resiko",
                      icon: AlertTriangle,
                      items: selectedJob.jsaTemplate?.bahayaResiko,
                      bg: "bg-red-50/50 border-red-100",
                    },
                    {
                      label: "Tindakan Pengendalian",
                      icon: ShieldCheck,
                      items: selectedJob.jsaTemplate?.pengendalian,
                      bg: "bg-emerald-50/50 border-emerald-100",
                    },
                  ].map((col) => (
                    <div
                      key={col.label}
                      className={`rounded-xl border p-4 ${col.bg}`}
                    >
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {col.label}
                      </p>
                      <SmartList items={col.items} />
                    </div>
                  ))}
                </div>
              </ModalSection>

              {/* ── 3. HIRARC ── */}
              <ModalSection
                number={3}
                title="Hazard Identification, Risk Assessment & Control (HIRARC)"
                icon={Activity}
                accent="bg-red-600"
              >
                {!selectedJob.hirarcTemplate?.potensiBahaya?.length ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-slate-400">
                    <Activity size={28} className="mb-2 text-slate-200" />
                    <p className="text-sm">Data HIRARC belum tersedia.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedJob.hirarcTemplate.potensiBahaya.map(
                      (potensi: string, i: number) => {
                        const h = selectedJob.hirarcTemplate;
                        const statusArr =
                          typeof h.statusPengendalian === "string"
                            ? h.statusPengendalian.split(", ")
                            : Array.isArray(h.statusPengendalian)
                              ? h.statusPengendalian
                              : [];
                        return (
                          <div
                            key={i}
                            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                          >
                            {/* Card header strip */}
                            <div className="flex items-center gap-3 border-b border-slate-100 bg-[#0F1F3D]/[0.04] px-4 py-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#F5A623] text-[10px] font-black text-[#0F1F3D]">
                                {i + 1}
                              </span>
                              <p className="text-sm font-bold text-[#0F1F3D]">
                                {potensi || `Bahaya #${i + 1}`}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                              {/* Left */}
                              <div className="space-y-3">
                                {[
                                  { label: "Resiko", val: h.resiko?.[i] },
                                  {
                                    label: "Tindakan Pengendalian",
                                    val: h.pengendalian?.[i],
                                  },
                                ].map((f) => (
                                  <div key={f.label}>
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                      {f.label}
                                    </p>
                                    <p className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
                                      {f.val || "—"}
                                    </p>
                                  </div>
                                ))}
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                      Penanggung Jawab
                                    </p>
                                    <p className="rounded-lg border border-[#0F1F3D]/10 bg-[#0F1F3D]/5 px-3 py-2 text-xs font-bold text-[#0F1F3D]">
                                      {h.penanggungJawab?.[i] || "—"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                      Status
                                    </p>
                                    <p className="rounded-lg border border-[#F5A623]/30 bg-[#F5A623]/10 px-3 py-2 text-xs font-bold text-amber-800">
                                      {statusArr[i] || "—"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* Right: scores */}
                              <div className="space-y-3">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Skor Awal
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    <ScoreCell
                                      label="Keparahan"
                                      value={h.konsekuensiKeparahan?.[i]}
                                    />
                                    <ScoreCell
                                      label="Kemungkinan"
                                      value={h.kemungkinanTerjadi?.[i]}
                                    />
                                    <ScoreCell
                                      label="Tingkat"
                                      value={h.tingkatResiko?.[i]}
                                      variant="red"
                                    />
                                  </div>
                                </div>
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
                                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                    Setelah Pengendalian
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    <ScoreCell
                                      label="Keparahan"
                                      value={
                                        h.konsekuensiSetelahPengendalian?.[i]
                                      }
                                    />
                                    <ScoreCell
                                      label="Kemungkinan"
                                      value={
                                        h
                                          .kemungkinanTerjadiSetelahPengendalian?.[
                                          i
                                        ]
                                      }
                                    />
                                    <ScoreCell
                                      label="Tingkat"
                                      value={
                                        h.tingkatResikoSetelahPengendalian?.[i]
                                      }
                                      variant="green"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </ModalSection>

              {/* ── 4. SOP ── */}
              <ModalSection
                number={4}
                title="Standar Operasional Prosedur (SOP)"
                icon={ClipboardList}
                accent="bg-violet-600"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: "Perlengkapan Kerja (APD)",
                      icon: Shield,
                      items: selectedJob.sopTemplate?.perlengkapanKerja,
                      bg: "bg-emerald-50 border-emerald-100",
                    },
                    {
                      label: "Peralatan Ukur",
                      icon: Ruler,
                      items: selectedJob.sopTemplate?.peralatanUkur,
                      bg: "bg-violet-50 border-violet-100",
                    },
                    {
                      label: "Peralatan Kerja",
                      icon: Wrench,
                      items: selectedJob.sopTemplate?.peralatanKerja,
                      bg: "bg-amber-50 border-amber-100",
                    },
                    {
                      label: "Uraian Kegiatan",
                      icon: FileText,
                      items: selectedJob.sopTemplate?.uraianKegiatan,
                      bg: "bg-slate-50 border-slate-200",
                      full: true,
                    },
                  ].map((col) => (
                    <div
                      key={col.label}
                      className={`rounded-xl border p-4 ${col.bg} ${col.full ? "sm:col-span-2" : ""}`}
                    >
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {col.label}
                      </p>
                      <SmartList items={col.items} />
                    </div>
                  ))}
                </div>
              </ModalSection>

              {/* ── 5. IK ── */}
              <ModalSection
                number={5}
                title="Instruksi Kerja (IK)"
                icon={BookOpen}
                accent="bg-emerald-600"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: "Perlengkapan Kerja (APD)",
                      items: selectedJob.ikTemplate?.perlengkapanKerja,
                      bg: "bg-emerald-50 border-emerald-100",
                    },
                    {
                      label: "Peralatan Kerja",
                      items: selectedJob.ikTemplate?.peralatanKerja,
                      bg: "bg-amber-50 border-amber-100",
                    },
                    {
                      label: "Uraian Kegiatan",
                      items: selectedJob.ikTemplate?.uraianKegiatan,
                      bg: "bg-slate-50 border-slate-200",
                      full: true,
                    },
                  ].map((col) => (
                    <div
                      key={col.label}
                      className={`rounded-xl border p-4 ${col.bg} ${col.full ? "sm:col-span-2" : ""}`}
                    >
                      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {col.label}
                      </p>
                      <SmartList items={col.items} />
                    </div>
                  ))}
                </div>
              </ModalSection>
            </div>

            {/* Modal footer */}
            <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Dibuat:{" "}
                <span className="font-semibold text-slate-600">
                  {new Date(selectedJob.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={14} /> Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
