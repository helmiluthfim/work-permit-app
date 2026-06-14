"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Search,
  X,
  Plus,
  Eye,
  CheckCircle,
  CheckCheck,
  XCircle,
  Clock,
  History,
  FileEdit,
  Download,
} from "lucide-react";

interface WorkPermit {
  _id: string;
  nomorWP: string;
  pekerjaan: {
    _id: string;
    kodePekerjaan: string;
    namaPekerjaan: string;
  };
  pjTeknik: {
    _id: string;
    nama: string;
  };
  tanggalMulai: string;
  tanggalSelesai: string;
  status:
    | "draft"
    | "submitted"
    | "approved_k3"
    | "approved_director"
    | "rejected";
  createdAt: string;
}

export default function WorkPermitHistoryPage() {
  const { data: session } = useSession();
  const [permits, setPermits] = useState<WorkPermit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchPermits = async () => {
    try {
      const res = await fetch("/api/work-permits");
      const result = await res.json();

      if (result.success) {
        setPermits(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const filtered = permits.filter((p) => {
    // Filter status (tetap sama)
    if (
      filterStatus === "proses" &&
      !["submitted", "approved_k3"].includes(p.status)
    )
      return false;
    if (filterStatus === "disetujui" && p.status !== "approved_director")
      return false;
    if (filterStatus === "ditolak" && !["rejected", "draft"].includes(p.status))
      return false;

    // Search query
    const searchString = search.toLowerCase();
    const nomor = p.nomorWP?.toLowerCase() || "";
    const pekerjaan = p.pekerjaan?.namaPekerjaan?.toLowerCase() || "";

    // Format tanggal ke string persis seperti yang tampil di tabel agar bisa dicari
    const tglDibuat = new Date(p.createdAt)
      .toLocaleDateString("id-ID")
      .toLowerCase();
    const tglMulai = new Date(p.tanggalMulai)
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toLowerCase();
    const tglSelesai = new Date(p.tanggalSelesai)
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toLowerCase();

    return (
      nomor.includes(searchString) ||
      pekerjaan.includes(searchString) ||
      tglDibuat.includes(searchString) ||
      tglMulai.includes(searchString) ||
      tglSelesai.includes(searchString)
    );
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved_director":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            <CheckCheck size={12} /> Selesai / Disetujui
          </span>
        );
      case "approved_k3":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
            <Clock size={12} /> Menunggu Direktur
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
            <Clock size={12} /> Menunggu Review K3
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-700">
            <XCircle size={12} /> Ditolak
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
            <FileEdit size={12} /> Draft
          </span>
        );
      default:
        return null;
    }
  };

  // Fungsi Placeholder untuk Cetak PDF
  const handleExportPDF = (id: string) => {
    // Membuka tab baru yang mengarah ke halaman cetak khusus
    window.open(`/work-permits/print/${id}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
          <p className="text-sm font-medium text-slate-400">
            Memuat riwayat pengajuan...
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
            Dashboard
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#0F1F3D]">
            Riwayat Work Permit
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola dan pantau status dokumen SIKA yang telah Anda ajukan.
          </p>
        </div>
        <Link
          href="/work-permits/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#1a3561] active:scale-95"
        >
          <Plus size={16} />
          Buat Pengajuan Baru
        </Link>
      </div>

      {/* ── FILTER TABS & SEARCH ── */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* TABS KATEGORI */}
        <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm scrollbar-hide">
          {[
            { id: "all", label: "Semua" },
            { id: "proses", label: "Dalam Proses" },
            { id: "disetujui", label: "Disetujui" },
            { id: "ditolak", label: "Ditolak / Draft" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? "bg-[#0F1F3D] text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full max-w-sm shrink-0">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. dokumen, pekerjaan, atau tanggal..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm text-[#0F1F3D] outline-none transition focus:border-[#0F1F3D] focus:ring-2 focus:ring-[#0F1F3D]/10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F1F3D] transition"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className={`overflow-x-auto ${filtered.length > 10 ? "max-h-[700px] overflow-y-auto" : ""}`}
        >
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50">
              <tr>
                {[
                  "No. Dokumen",
                  "Pekerjaan",
                  "Jadwal Pelaksanaan",
                  "Status Terkini",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {filtered.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <History size={36} className="text-slate-200" />
                      <p className="text-sm">
                        {search || filterStatus !== "all"
                          ? "Dokumen tidak ditemukan."
                          : "Anda belum memiliki riwayat pengajuan Work Permit."}
                      </p>
                      {!search && filterStatus === "all" && (
                        <Link
                          href="/work-permits/create"
                          className="mt-2 rounded-lg bg-[#0F1F3D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                        >
                          Buat Pengajuan Baru
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-100">
                {filtered.map((permit) => (
                  <tr
                    key={permit._id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {/* No Dokumen */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-mono text-xs font-bold text-[#0F1F3D]">
                        {permit.nomorWP}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Diajukan:{" "}
                        {new Date(permit.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </td>

                    {/* Nama Pekerjaan */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700 line-clamp-2">
                        {permit.pekerjaan?.namaPekerjaan || "—"}
                      </p>
                    </td>

                    {/* Tanggal Pelaksanaan */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-600">
                      {new Date(permit.tanggalMulai).toLocaleDateString(
                        "id-ID",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                      {" - "}
                      {new Date(permit.tanggalSelesai).toLocaleDateString(
                        "id-ID",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {renderStatusBadge(permit.status)}
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/work-permits/review/${permit._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#0F1F3D] hover:text-[#0F1F3D]"
                        >
                          <Eye size={12} /> Detail
                        </Link>

                        {/* Tombol Cetak PDF - Opsional hanya bisa dicetak jika sudah disetujui (hilangkan kondisinya jika ingin bisa dicetak kapan saja) */}
                        {permit.status === "approved_director" && (
                          <button
                            onClick={() => handleExportPDF(permit._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            <Download size={12} /> PDF
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Footer Count */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
            <p className="text-xs text-slate-400">
              Menampilkan{" "}
              <span className="font-bold text-[#0F1F3D]">
                {filtered.length}
              </span>{" "}
              dokumen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
