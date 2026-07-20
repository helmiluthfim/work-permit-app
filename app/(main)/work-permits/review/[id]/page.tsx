"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  History, // ✅ Tambahan icon untuk riwayat
} from "lucide-react";

// Helper Component: Menampilkan List Array
function SmartList({ items }: { items?: any[] }) {
  if (!items || !Array.isArray(items) || items.length === 0)
    return (
      <span className="text-sm italic text-slate-400">Tidak ada data</span>
    );
  return (
    <div className="mt-2 space-y-1.5">
      {items.map((item, i) => {
        const t = typeof item === "string" ? item.trim() : String(item || "");
        if (!t) return null;
        if (/^\d+\./.test(t))
          return (
            <p
              key={i}
              className="mt-2 text-xs font-black uppercase tracking-wide text-[#0F1F3D] first:mt-0"
            >
              {t}
            </p>
          );
        return (
          <div
            key={i}
            className="flex items-start gap-2 text-sm text-slate-700"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
            <span className="break-words">{t.replace(/^- /, "")}</span>
          </div>
        );
      })}
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

  // Re-submit (Duplikasi) States
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

  const handleExportPDF = () => {
    window.open(`/work-permits/print/${id}`, "_blank");
  };

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
      // Ekstrak pelaksana array dengan aman
      const currentPelaksana = (permit.pelaksana || []).map(
        (p: any) => p._id || p,
      );

      const payload = {
        pekerjaan: permit.pekerjaan._id,
        lokasi: permit.lokasi,
        tanggalMulai: newTanggalMulai,
        waktuMulai: newWaktuMulai,
        tanggalSelesai: newTanggalSelesai,
        waktuSelesai: newWaktuSelesai,
        pjTeknik: permit.pjTeknik._id,
        noTelpPjTeknik: permit.noTelpPjTeknik,
        tenagaAhliK3: permit.tenagaAhliK3._id,
        noTelpTenagaAhliK3: permit.noTelpTenagaAhliK3,
        pelaksana: currentPelaksana, // ✅ pindah ke root
        workPermitData: permit.workPermitData,
        jsaData: permit.jsaData, // ✅ jsaData langsung tanpa modifikasi
        hirarcData: permit.hirarcData,
        sopData: permit.sopData,
        ikData: permit.ikData,
      };

      console.log("=== RESUBMIT PAYLOAD ===");
      console.log("pelaksana:", currentPelaksana);
      console.log("payload:", JSON.stringify(payload, null, 2));

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

  // ✅ Ekstrak array langsung dari DB
  const jsaDocs = Array.isArray(permit.jsaData) ? permit.jsaData : [];
  const sopDocs = Array.isArray(permit.sopData) ? permit.sopData : [];
  const ikDocs = Array.isArray(permit.ikData) ? permit.ikData : [];
  const pelaksanaList = permit.pelaksana || [];

  // ✅ Ekstrak Riwayat Persetujuan
  const historyList = permit.history || [];

  return (
    <div className="relative min-h-full w-full bg-[#F7F8FA] p-6 md:p-8">
      {/* ── MODAL SUKSES ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1F3D]/60 backdrop-blur-sm duration-300 animate-in fade-in">
          <div className="mx-4 flex max-w-sm flex-col items-center rounded-3xl bg-white p-10 text-center shadow-2xl duration-300 animate-in zoom-in-95">
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

      {/* ── MODAL PENOLAKAN ── */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1F3D]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="flex items-center gap-2 text-lg font-black text-[#0F1F3D]">
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
              className="mt-4 min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
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

      {/* ── MODAL AJUKAN ULANG ── */}
      {isResubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1F3D]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="flex items-center gap-2 text-lg font-black text-[#0F1F3D]">
              <Copy className="text-blue-600" /> Ajukan Ulang / Perpanjang
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pengajuan baru akan dibuat menyalin dokumen saat ini. Silakan atur
              jadwal pelaksanaan (Tanggal & Waktu) yang baru.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
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

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
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
              <p className="mt-1 text-sm text-red-700">
                {permit.catatanPenolakan}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── RIWAYAT PERSETUJUAN (TIMELINE) ── */}
      {historyList.length > 0 && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-black text-[#0F1F3D]">
            <History size={18} className="text-blue-600" /> Riwayat Status &
            Persetujuan
          </h3>
          <div className="relative ml-3 space-y-6 border-l-2 border-slate-100">
            {historyList.map((log: any, idx: number) => {
              const isApproval = log.status.includes("approved");
              const isRejection = log.status === "rejected";

              // Fungsi untuk memformat role menjadi lebih enak dibaca
              const formatRole = (role: string) => {
                if (role === "TENAGA_AHLI_K3") return "Tenaga Ahli K3";
                if (role === "DIREKTUR") return "Direktur";
                if (role === "PJ_TEKNIK") return "Penanggung Jawab Teknik";
                if (!role) return "Sistem";
                // Fallback jika ada role lain
                return role
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());
              };

              return (
                <div key={idx} className="relative pl-6">
                  {/* Timeline Dot */}
                  <span
                    className={`absolute -left-[11px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white ${
                      isApproval
                        ? "bg-emerald-100 text-emerald-600"
                        : isRejection
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {isApproval ? (
                      <CheckCircle2 size={12} />
                    ) : isRejection ? (
                      <XCircle size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                  </span>

                  {/* Content */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-bold text-[#0F1F3D] capitalize">
                        {log.status.replace("_", " ")}
                      </p>
                      <p className="text-xs font-semibold text-slate-400">
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                    {log.actionBy && (
                      <p className="mt-1 text-xs text-slate-500">
                        Oleh:{" "}
                        <span className="font-medium text-slate-500">
                          {formatRole(log.actionBy.role)}
                        </span>
                      </p>
                    )}
                    {log.catatan && (
                      <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs italic text-slate-600 border border-slate-100">
                        "{log.catatan}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
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
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Users size={14} /> Daftar Pelaksana
            </p>
            <div className="flex flex-wrap gap-2">
              {pelaksanaList.map((p: any, idx: number) => (
                <span
                  key={p._id || idx}
                  className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-sm font-bold text-blue-900 shadow-sm"
                >
                  {p.nama || "Pelaksana Pekerjaan"}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {jsaDocs.map((jsa: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <h4 className="mb-4 border-b border-slate-100 pb-3 text-sm font-bold text-[#0F1F3D]">
                  {jsa.judulJsa || `Dokumen JSA #${index + 1}`}
                </h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Langkah Kerja
                    </p>
                    <SmartList items={jsa.langkahKerja || jsa.jsaLangkah} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Bahaya &amp; Resiko
                    </p>
                    <SmartList items={jsa.bahayaResiko || jsa.jsaBahaya} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Tindakan Pengendalian
                    </p>
                    <SmartList
                      items={jsa.pengendalian || jsa.jsaPengendalian}
                    />
                  </div>
                </div>
              </div>
            ))}
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
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F1F3D] text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="text-sm font-bold text-[#0F1F3D]">
                        {potensi}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">
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
                        <div className="flex gap-2">
                          <div className="flex-1 rounded border border-slate-100 bg-slate-50 p-2 text-center">
                            <p className="text-[9px] font-bold uppercase leading-tight text-slate-400">
                              Keparahan
                            </p>
                            <p className="mt-0.5 text-xs font-black">
                              {h.konsekuensiKeparahan[i]}
                            </p>
                          </div>
                          <div className="flex-1 rounded border border-slate-100 bg-slate-50 p-2 text-center">
                            <p className="text-[9px] font-bold uppercase leading-tight text-slate-400">
                              Kemungkinan
                            </p>
                            <p className="mt-0.5 text-xs font-black">
                              {h.kemungkinanTerjadi[i]}
                            </p>
                          </div>
                          <div className="flex-1 rounded border border-slate-100 bg-slate-50 p-2 text-center">
                            <p className="text-[9px] font-bold uppercase leading-tight text-slate-400">
                              Skor Awal
                            </p>
                            <p className="mt-0.5 text-xs font-black">
                              {h.tingkatResiko[i]}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 rounded border border-emerald-100 bg-emerald-50 p-2 text-center">
                            <p className="text-[9px] font-bold uppercase leading-tight text-emerald-600">
                              Keparahan*
                            </p>
                            <p className="mt-0.5 text-xs font-black text-emerald-700">
                              {h.konsekuensiSetelahPengendalian[i]}
                            </p>
                          </div>
                          <div className="flex-1 rounded border border-emerald-100 bg-emerald-50 p-2 text-center">
                            <p className="text-[9px] font-bold uppercase leading-tight text-emerald-600">
                              Kemungkinan*
                            </p>
                            <p className="mt-0.5 text-xs font-black text-emerald-700">
                              {h.kemungkinanTerjadiSetelahPengendalian[i]}
                            </p>
                          </div>
                          <div className="flex-1 rounded border border-emerald-100 bg-emerald-50 p-2 text-center">
                            <p className="text-[9px] font-bold uppercase leading-tight text-emerald-600">
                              Skor Sisa
                            </p>
                            <p className="mt-0.5 text-xs font-black text-emerald-700">
                              {h.tingkatResikoSetelahPengendalian[i]}
                            </p>
                          </div>
                        </div>
                        <div className="rounded border border-blue-100 bg-blue-50 p-2 text-center">
                          <p className="text-[9px] font-bold uppercase leading-tight text-blue-600">
                            Status Pengendalian
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-blue-700">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DocumentSection
            number={4}
            title="SOP"
            icon={ClipboardList}
            accent="bg-violet-600"
          >
            <div className="space-y-6">
              {sopDocs.map((sop: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <h4 className="mb-4 border-b border-slate-100 pb-3 text-sm font-bold text-[#0F1F3D]">
                    {sop.judulSop || `Dokumen SOP #${idx + 1}`}
                  </h4>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        APD / Perlengkapan
                      </p>
                      <SmartList items={sop.perlengkapanKerja} />
                    </div>
                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Peralatan Ukur
                      </p>
                      <SmartList items={sop.peralatanUkur} />
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Peralatan Kerja
                      </p>
                      <SmartList items={sop.peralatanKerja} />
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Judul Uraian Kegiatan
                      </p>
                      <SmartList items={sop.judulUraianKegiatan} />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Uraian Kegiatan
                      </p>
                      <SmartList items={sop.uraianKegiatan} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DocumentSection>

          <DocumentSection
            number={5}
            title="Instruksi Kerja (IK)"
            icon={BookOpen}
            accent="bg-emerald-600"
          >
            <div className="space-y-6">
              {ikDocs.map((ik: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <h4 className="mb-4 border-b border-slate-100 pb-3 text-sm font-bold text-[#0F1F3D]">
                    {ik.judulIk || `Dokumen IK #${idx + 1}`}
                  </h4>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        APD / Perlengkapan
                      </p>
                      <SmartList items={ik.perlengkapanKerja} />
                    </div>
                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Peralatan Ukur
                      </p>
                      <SmartList items={ik.peralatanUkur} />
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Peralatan Kerja
                      </p>
                      <SmartList items={ik.peralatanKerja} />
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Judul Uraian Kegiatan
                      </p>
                      <SmartList items={ik.judulUraianKegiatan} />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Uraian Kegiatan
                      </p>
                      <SmartList items={ik.uraianKegiatan} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DocumentSection>
        </div>
      </div>
    </div>
  );
}
