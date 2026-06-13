"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ShieldAlert,
  Activity,
  ClipboardList,
  BookOpen,
  User,
  Users,
  Calendar,
  MapPin,
  MessageSquareX,
  CheckCheck,
  Download,
  Copy,
} from "lucide-react";

// Helper Component: Menampilkan List Array
function SmartList({ items }: { items?: string[] }) {
  if (!items || items.length === 0)
    return (
      <span className="text-sm italic text-slate-400">Tidak ada data</span>
    );
  return (
    <div className="space-y-1.5 mt-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

// Helper Component: Section Card
function DocumentSection({
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div className={`flex items-center gap-3 px-5 py-4 ${accent}`}>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-black text-white">
          {number}
        </span>
        <Icon size={18} className="text-white/90" />
        <h3 className="text-sm font-black text-white">{title}</h3>
      </div>
      <div className="bg-white p-5 md:p-6">{children}</div>
    </div>
  );
}

export default function WorkPermitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params?.id as string;

  const [permit, setPermit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [catatanPenolakan, setCatatanPenolakan] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Re-submit (Duplikasi) States - Ditambah State Waktu
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [newTanggalMulai, setNewTanggalMulai] = useState("");
  const [newWaktuMulai, setNewWaktuMulai] = useState("");
  const [newTanggalSelesai, setNewTanggalSelesai] = useState("");
  const [newWaktuSelesai, setNewWaktuSelesai] = useState("");

  const userRole = (session?.user as any)?.role || "";
  const isK3 = userRole === "TENAGA_AHLI_K3";
  const isDirektur = userRole === "DIREKTUR";
  const isPjTeknik = userRole === "PJ_TEKNIK";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/work-permits/${id}`);
        const result = await res.json();
        if (result.success) setPermit(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Fungsi: Update Status (Approve/Reject)
  const updateStatus = async (newStatus: string, catatan = "") => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/work-permits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, catatanPenolakan: catatan }),
      });
      const result = await res.json();

      if (result.success) {
        setIsRejectModalOpen(false);
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/work-permits/review");
          router.refresh();
        }, 3000);
      } else {
        alert(result.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
      setIsSubmitting(false);
    }
  };

  // Fungsi: Cetak PDF
  const handleExportPDF = () => {
    window.open(`/work-permits/print/${id}`, "_blank");
  };

  // Fungsi: Duplikasi/Ajukan Ulang dengan tanggal & waktu baru
  const handleResubmit = async () => {
    if (
      !newTanggalMulai ||
      !newTanggalSelesai ||
      !newWaktuMulai ||
      !newWaktuSelesai
    ) {
      alert("Mohon lengkapi tanggal dan waktu pelaksanaan yang baru!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Menyalin format data dari permit saat ini, lalu menyesuaikan value-nya
      const payload = {
        pekerjaan: permit.pekerjaan._id,
        lokasi: permit.lokasi,
        tanggalMulai: newTanggalMulai,
        waktuMulai: newWaktuMulai, // Gunakan waktu yang baru diisi
        tanggalSelesai: newTanggalSelesai,
        waktuSelesai: newWaktuSelesai, // Gunakan waktu yang baru diisi
        pjTeknik: permit.pjTeknik._id,
        noTelpPjTeknik: permit.noTelpPjTeknik,
        tenagaAhliK3: permit.tenagaAhliK3._id,
        noTelpTenagaAhliK3: permit.noTelpTenagaAhliK3,
        workPermitData: permit.workPermitData,
        // Map pelaksana kembali menjadi array of IDs agar API POST mau menerimanya
        jsaData: {
          ...permit.jsaData,
          pelaksana: permit.jsaData.pelaksana.map((p: any) => p._id),
        },
        hirarcData: permit.hirarcData,
        sopData: permit.sopData,
        ikData: permit.ikData,
      };

      const res = await fetch("/api/work-permits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setIsResubmitModalOpen(false);
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/work-permits");
          router.refresh();
        }, 3000);
      } else {
        alert(result.message || "Gagal membuat pengajuan baru.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
      setIsSubmitting(false);
    }
  };

  // Saat membuka modal, opsional kita bisa mengisikan input waktu dengan waktu sebelumnya
  const openResubmitModal = () => {
    setNewWaktuMulai(permit.waktuMulai);
    setNewWaktuSelesai(permit.waktuSelesai);
    setIsResubmitModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="p-8 text-center text-slate-500">
        Dokumen tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#F7F8FA] p-6 md:p-8 relative">
      {/* ── MODAL SUKSES ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1F3D]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="mx-4 flex max-w-sm flex-col items-center rounded-3xl bg-white p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={44} className="text-emerald-500" />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              Proses Berhasil
            </p>
            <h3 className="mb-2 text-xl font-black text-[#0F1F3D]">
              Operasi Berhasil Selesai!
            </h3>
            <p className="text-sm text-slate-500">
              Sistem telah menyimpan perubahan Anda. Mengalihkan...
            </p>
            <div className="mt-6 flex gap-1.5">
              {[0, 75, 150].map((delay) => (
                <div
                  key={delay}
                  className="h-2 w-2 animate-bounce rounded-full bg-[#F5A623]"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL PENOLAKAN (Khusus K3 / Direktur) ── */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1F3D]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-black text-[#0F1F3D] flex items-center gap-2">
              <XCircle className="text-red-600" /> Tolak Work Permit
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Silakan berikan alasan atau catatan mengapa dokumen ini ditolak
              agar pemohon dapat memperbaikinya.
            </p>
            <textarea
              value={catatanPenolakan}
              onChange={(e) => setCatatanPenolakan(e.target.value)}
              placeholder="Contoh: Dokumen JSA kurang lengkap pada bagian pengendalian risiko."
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 min-h-[120px]"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => updateStatus("rejected", catatanPenolakan)}
                disabled={!catatanPenolakan.trim() || isSubmitting}
                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? "Memproses..." : "Konfirmasi Penolakan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL AJUKAN ULANG (Khusus PJ Teknik) ── */}
      {isResubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1F3D]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-black text-[#0F1F3D] flex items-center gap-2">
              <Copy className="text-blue-600" /> Ajukan Ulang / Perpanjang
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pengajuan baru akan dibuat menyalin dokumen saat ini. Silakan atur
              jadwal pelaksanaan (Tanggal & Waktu) yang baru.
            </p>

            {/* Grid 2x2 untuk Tanggal & Waktu */}
            <div className="mt-5 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {/* Mulai */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tanggal Mulai Baru
                </label>
                <input
                  type="date"
                  value={newTanggalMulai}
                  onChange={(e) => setNewTanggalMulai(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Jam Mulai Baru
                </label>
                <input
                  type="time"
                  value={newWaktuMulai}
                  onChange={(e) => setNewWaktuMulai(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Selesai */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tanggal Selesai Baru
                </label>
                <input
                  type="date"
                  value={newTanggalSelesai}
                  onChange={(e) => setNewTanggalSelesai(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Jam Selesai Baru
                </label>
                <input
                  type="time"
                  value={newWaktuSelesai}
                  onChange={(e) => setNewWaktuSelesai(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsResubmitModalOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleResubmit}
                disabled={
                  !newTanggalMulai ||
                  !newTanggalSelesai ||
                  !newWaktuMulai ||
                  !newWaktuSelesai ||
                  isSubmitting
                }
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Buat Pengajuan Baru"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER & ACTIONS ── */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0F1F3D]"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-[#0F1F3D]">
              {permit.nomorWP}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                permit.status === "approved_director"
                  ? "bg-emerald-100 text-emerald-700"
                  : permit.status === "approved_k3"
                    ? "bg-blue-100 text-blue-700"
                    : permit.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
              }`}
            >
              {permit.status === "approved_director" && (
                <CheckCheck size={14} />
              )}
              {permit.status === "approved_k3" && <CheckCircle size={14} />}
              {permit.status === "rejected" && <XCircle size={14} />}
              {permit.status === "submitted" && <Clock size={14} />}
              {permit.status.replace("_", " ")}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Diajukan pada: {new Date(permit.createdAt).toLocaleString("id-ID")}
          </p>
        </div>

        {/* Action Buttons Group (Berdasarkan Role) */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          {/* ----- AKSI KHUSUS K3 / DIREKTUR ----- */}
          {(isK3 && permit.status === "submitted") ||
          (isDirektur && permit.status === "approved_k3") ? (
            <button
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              <XCircle size={16} /> Tolak
            </button>
          ) : null}

          {isK3 && permit.status === "submitted" && (
            <button
              onClick={() => updateStatus("approved_k3")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
            >
              <CheckCircle size={16} /> Setujui (K3)
            </button>
          )}

          {isDirektur && permit.status === "approved_k3" && (
            <button
              onClick={() => updateStatus("approved_director")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F1F3D] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1a3561] disabled:opacity-50"
            >
              <CheckCheck size={16} /> Setujui (Direktur)
            </button>
          )}

          {/* ----- AKSI KHUSUS PJ TEKNIK ----- */}
          {isPjTeknik && permit.status === "approved_director" && (
            <>
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                <Download size={16} /> Unduh PDF
              </button>

              <button
                onClick={openResubmitModal}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0F1F3D] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1a3561]"
              >
                <Copy size={16} /> Ajukan Ulang / Perpanjang
              </button>
            </>
          )}

          {/* Pesan jika tidak punya akses aksi */}
          {((!isK3 && !isDirektur && !isPjTeknik) ||
            (isK3 && permit.status !== "submitted") ||
            (isDirektur && permit.status !== "approved_k3") ||
            (isPjTeknik && permit.status !== "approved_director")) && (
            <span className="px-3 text-xs font-semibold text-slate-400">
              Hanya lihat (Read-Only)
            </span>
          )}
        </div>
      </div>

      {permit.status === "rejected" && permit.catatanPenolakan && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <MessageSquareX className="mt-0.5 text-red-600" size={20} />
            <div>
              <p className="text-sm font-bold text-red-800">
                Catatan Penolakan:
              </p>
              <p className="text-sm text-red-700 mt-1">
                {permit.catatanPenolakan}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── KONTEN DOKUMEN ── */}
      <div className="space-y-6">
        {/* INFO UMUM */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Pekerjaan
            </p>
            <p className="text-sm font-bold text-[#0F1F3D]">
              {permit.pekerjaan?.namaPekerjaan}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Lokasi
            </p>
            <p className="flex items-center gap-1.5 text-sm font-bold text-[#0F1F3D]">
              <MapPin size={14} className="text-[#F5A623]" /> {permit.lokasi}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Waktu Pelaksanaan
            </p>
            <p className="flex items-center gap-1.5 text-sm font-bold text-[#0F1F3D]">
              <Calendar size={14} className="text-[#F5A623]" />
              {permit.tanggalMulai} s/d {permit.tanggalSelesai}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Pukul: {permit.waktuMulai} - {permit.waktuSelesai}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Personel Inti
            </p>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <User size={14} className="text-slate-400" /> PJ:{" "}
              {permit.pjTeknik?.nama}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <User size={14} className="text-slate-400" /> K3:{" "}
              {permit.tenagaAhliK3?.nama}
            </p>
          </div>
        </div>

        {/* 1. WORK PERMIT */}
        <DocumentSection
          number={1}
          title="Data Work Permit"
          icon={FileText}
          accent="bg-[#0F1F3D]"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Klasifikasi Pekerjaan
              </p>
              <SmartList items={permit.workPermitData?.klasifikasiPekerjaan} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Prosedur Pekerjaan
              </p>
              <SmartList items={permit.workPermitData?.prosedurPekerjaan} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Lampiran Persyaratan
              </p>
              <SmartList items={permit.workPermitData?.lampiran} />
            </div>
          </div>
        </DocumentSection>

        {/* 2. JSA */}
        <DocumentSection
          number={2}
          title="Job Safety Analysis (JSA)"
          icon={ShieldAlert}
          accent="bg-blue-600"
        >
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 flex items-center gap-2">
              <Users size={14} /> Daftar Pelaksana
            </p>
            <div className="flex flex-wrap gap-2">
              {permit.jsaData?.pelaksana?.map((p: any) => (
                <span
                  key={p._id}
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold border border-blue-100 text-blue-900 shadow-sm"
                >
                  {p.nama}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Langkah Kerja
              </p>
              <SmartList items={permit.jsaData?.langkahKerja} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Bahaya & Resiko
              </p>
              <SmartList items={permit.jsaData?.bahayaResiko} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Tindakan Pengendalian
              </p>
              <SmartList items={permit.jsaData?.pengendalian} />
            </div>
          </div>
        </DocumentSection>

        {/* 3. HIRARC */}
        <DocumentSection
          number={3}
          title="Matriks HIRARC"
          icon={Activity}
          accent="bg-red-600"
        >
          <div className="space-y-4">
            {permit.hirarcData?.potensiBahaya?.map(
              (potensi: string, i: number) => {
                const h = permit.hirarcData;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F1F3D] text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-sm font-bold text-[#0F1F3D]">
                        {potensi}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Resiko & Pengendalian
                        </p>
                        <p className="mt-1 text-sm font-semibold text-red-700">
                          Risiko: {h.resiko[i]}
                        </p>
                        <p className="mt-1 text-sm text-emerald-700">
                          Kontrol: {h.pengendalian[i]}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          PIC: {h.penanggungJawab[i]}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {/* Baris 1: Keparahan & Kemungkinan Awal */}
                        <div className="flex gap-2">
                          <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
                              Keparahan
                            </p>
                            <p className="text-xs font-black mt-0.5">
                              {h.konsekuensiKeparahan[i]}
                            </p>
                          </div>
                          <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
                              Kemungkinan
                            </p>
                            <p className="text-xs font-black mt-0.5">
                              {h.kemungkinanTerjadi[i]}
                            </p>
                          </div>
                          <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100 text-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
                              Skor Awal
                            </p>
                            <p className="text-xs font-black mt-0.5">
                              {h.tingkatResiko[i]}
                            </p>
                          </div>
                        </div>

                        {/* Baris 2: Keparahan & Kemungkinan Setelah */}
                        <div className="flex gap-2">
                          <div className="flex-1 bg-emerald-50 p-2 rounded border border-emerald-100 text-center">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase leading-tight">
                              Keparahan*
                            </p>
                            <p className="text-xs font-black text-emerald-700 mt-0.5">
                              {h.konsekuensiSetelahPengendalian[i]}
                            </p>
                          </div>
                          <div className="flex-1 bg-emerald-50 p-2 rounded border border-emerald-100 text-center">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase leading-tight">
                              Kemungkinan*
                            </p>
                            <p className="text-xs font-black text-emerald-700 mt-0.5">
                              {h.kemungkinanTerjadiSetelahPengendalian[i]}
                            </p>
                          </div>
                          <div className="flex-1 bg-emerald-50 p-2 rounded border border-emerald-100 text-center">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase leading-tight">
                              Skor Sisa
                            </p>
                            <p className="text-xs font-black text-emerald-700 mt-0.5">
                              {h.tingkatResikoSetelahPengendalian[i]}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="bg-blue-50 p-2 rounded border border-blue-100 text-center">
                          <p className="text-[9px] font-bold text-blue-600 uppercase leading-tight">
                            Status Pengendalian
                          </p>
                          <p className="text-xs font-semibold text-blue-700 mt-0.5">
                            {h.statusPengendalian[i] || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </DocumentSection>

        {/* 4. SOP & IK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentSection
            number={4}
            title="SOP"
            icon={ClipboardList}
            accent="bg-violet-600"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  APD / Perlengkapan
                </p>
                <SmartList items={permit.sopData?.perlengkapanKerja} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Peralatan Ukur
                </p>
                <SmartList items={permit.sopData?.peralatanUkur} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Peralatan Kerja
                </p>
                <SmartList items={permit.sopData?.peralatanKerja} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Judul Uraian Kegiatan
                </p>
                <SmartList items={permit.sopData?.judulUraianKegiatan} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Uraian Kegiatan
                </p>
                <SmartList items={permit.sopData?.uraianKegiatan} />
              </div>
            </div>
          </DocumentSection>

          <DocumentSection
            number={5}
            title="Instruksi Kerja (IK)"
            icon={BookOpen}
            accent="bg-emerald-600"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  APD / Perlengkapan
                </p>
                <SmartList items={permit.ikData?.perlengkapanKerja} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Peralatan Ukur
                </p>
                <SmartList items={permit.ikData?.peralatanUkur} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Peralatan Kerja
                </p>
                <SmartList items={permit.ikData?.peralatanKerja} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Judul Uraian Kegiatan
                </p>
                <SmartList items={permit.ikData?.judulUraianKegiatan} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Uraian Kegiatan
                </p>
                <SmartList items={permit.ikData?.uraianKegiatan} />
              </div>
            </div>
          </DocumentSection>
        </div>
      </div>
    </div>
  );
}
