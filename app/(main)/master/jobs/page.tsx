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
  Briefcase,
  ListChecks,
  Activity,
  ClipboardList,
  BookOpen,
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
  if (!items || !Array.isArray(items) || items.length === 0)
    return (
      <span className="text-sm italic text-slate-400">Tidak ada data</span>
    );
  return (
    <div className="mt-1 space-y-1">
      {items.map((item, i) => {
        const t = item?.trim() || "";
        if (!t) return null;
        if (/^\d+\./.test(t))
          return (
            <p
              key={i}
              className="mt-3 text-xs font-black uppercase tracking-wide text-[#0F1F3D] first:mt-0"
            >
              {t}
            </p>
          );
        return (
          <div
            key={i}
            className="ml-2 flex items-start gap-2 text-sm text-slate-700"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
            <span className="break-words">{t.replace(/^- /, "")}</span>
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
      ? "border-red-200 bg-red-50 text-red-700"
      : variant === "green"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-slate-50 text-slate-700";
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
      setJobs(result.data || []);
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

  const filtered = jobs.filter((j) => {
    const namaPekerjaan = j.namaPekerjaan || "";
    const kodePekerjaan = j.kodePekerjaan || "";
    const query = search.toLowerCase();

    return (
      namaPekerjaan.toLowerCase().includes(query) ||
      kodePekerjaan.toLowerCase().includes(query)
    );
  });

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
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-5 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 hover:-translate-y-px hover:bg-[#1a3561]"
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
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm text-[#0F1F3D] outline-none transition focus:border-[#0F1F3D] focus:ring-2 focus:ring-[#0F1F3D]/10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0F1F3D]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead className="border-b border-slate-100 bg-[#0F1F3D]/[0.03]">
              <tr>
                {["Kode", "Nama Pekerjaan", "Status", "Dibuat", "Aksi"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            {filtered.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
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
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-100">
                {filtered.map((job) => (
                  <tr key={job._id} className="transition hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-bold text-[#0F1F3D]">
                      {job.kodePekerjaan}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {job.namaPekerjaan}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                          job.status === "active"
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {job.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 bg-white px-5 py-3">
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F1F3D]/60 p-4 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center">
          <div className="flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 animate-in slide-in-from-bottom-4 sm:zoom-in-95 sm:slide-in-from-bottom-0">
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
                {!selectedJob.jsaTemplate?.length ? (
                  <p className="text-sm text-slate-500">
                    Data JSA belum tersedia.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedJob.jsaTemplate.map((jsa: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <h4 className="mb-4 border-b border-slate-100 pb-2 font-bold text-[#0F1F3D]">
                          {jsa.judulJsa || `Dokumen JSA #${index + 1}`}
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="mb-2 text-xs font-bold">
                              Langkah Kerja
                            </p>
                            <SmartList items={jsa.langkahKerja} />
                          </div>

                          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                            <p className="mb-2 text-xs font-bold">
                              Bahaya & Resiko
                            </p>
                            <SmartList items={jsa.bahayaResiko} />
                          </div>

                          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="mb-2 text-xs font-bold">
                              Pengendalian
                            </p>
                            <SmartList items={jsa.pengendalian} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                            <div className="flex items-center gap-3 border-b border-slate-100 bg-[#0F1F3D]/[0.04] px-4 py-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#F5A623] text-[10px] font-black text-[#0F1F3D]">
                                {i + 1}
                              </span>
                              <p className="text-sm font-bold text-[#0F1F3D]">
                                {potensi || `Bahaya #${i + 1}`}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
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
                {!selectedJob.sopTemplate?.length ? (
                  <p className="text-sm text-slate-500">
                    Data SOP belum tersedia.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedJob.sopTemplate.map((sop: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <h4 className="mb-4 border-b border-slate-100 pb-2 font-bold text-[#0F1F3D]">
                          Dokumen SOP #{index + 1}
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="mb-2 font-semibold">
                              Perlengkapan Kerja
                            </p>
                            <SmartList items={sop.perlengkapanKerja} />
                          </div>

                          <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                            <p className="mb-2 font-semibold">Peralatan Ukur</p>
                            <SmartList items={sop.peralatanUkur} />
                          </div>

                          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                            <p className="mb-2 font-semibold">
                              Peralatan Kerja
                            </p>
                            <SmartList items={sop.peralatanKerja} />
                          </div>

                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="mb-2 font-semibold">
                              Judul Uraian Kegiatan
                            </p>
                            <SmartList items={sop.judulUraianKegiatan} />
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                            <p className="mb-2 font-semibold">
                              Uraian Kegiatan
                            </p>
                            <SmartList items={sop.uraianKegiatan} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ModalSection>

              {/* ── 5. IK ── */}
              <ModalSection
                number={5}
                title="Instruksi Kerja (IK)"
                icon={BookOpen}
                accent="bg-emerald-600"
              >
                {!selectedJob.ikTemplate?.length ? (
                  <p className="text-sm text-slate-500">
                    Data IK belum tersedia.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedJob.ikTemplate.map((ik: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <h4 className="mb-4 border-b border-slate-100 pb-2 font-bold text-[#0F1F3D]">
                          Dokumen IK #{index + 1}
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="mb-2 font-semibold">
                              Perlengkapan Kerja
                            </p>
                            <SmartList items={ik.perlengkapanKerja} />
                          </div>

                          <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                            <p className="mb-2 font-semibold">Peralatan Ukur</p>
                            <SmartList items={ik.peralatanUkur} />
                          </div>

                          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                            <p className="mb-2 font-semibold">
                              Peralatan Kerja
                            </p>
                            <SmartList items={ik.peralatanKerja} />
                          </div>

                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="mb-2 font-semibold">
                              Judul Uraian Kegiatan
                            </p>
                            <SmartList items={ik.judulUraianKegiatan} />
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                            <p className="mb-2 font-semibold">
                              Uraian Kegiatan
                            </p>
                            <SmartList items={ik.uraianKegiatan} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ModalSection>
            </div>

            {/* Modal footer */}
            <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
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
