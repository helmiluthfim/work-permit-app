"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  FileSignature,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ListFilter,
  CheckCheck,
} from "lucide-react";

// Menyesuaikan dengan model IWorkPermit
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

export default function WorkPermitReviewPage() {
  const [permits, setPermits] = useState<WorkPermit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchPermits = async () => {
    try {
      // Menarik semua data (Pastikan API GET /api/work-permits tidak dilimit status tertentu lagi)
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

  // Logika Filter Multi-lapis (Status & Pencarian Teks)
  const filtered = permits.filter((p) => {
    // 1. Jangan tampilkan "draft" di halaman Review
    if (p.status === "draft") return false;

    // 2. Filter berdasarkan Tab Status
    if (filterStatus === "review_k3" && p.status !== "submitted") return false;
    if (filterStatus === "review_direktur" && p.status !== "approved_k3")
      return false;
    if (
      filterStatus === "selesai" &&
      !["approved_director", "rejected"].includes(p.status)
    )
      return false;

    // 3. Filter berdasarkan Pencarian Teks
    const searchString = search.toLowerCase();
    const nomor = p.nomorWP?.toLowerCase() || "";
    const pekerjaan = p.pekerjaan?.namaPekerjaan?.toLowerCase() || "";
    const pj = p.pjTeknik?.nama?.toLowerCase() || "";

    return (
      nomor.includes(searchString) ||
      pekerjaan.includes(searchString) ||
      pj.includes(searchString)
    );
  });

  // Helper untuk merender badge status sesuai hierarki
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved_director":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            <CheckCheck size={12} /> Accepted
          </span>
        );
      case "approved_k3":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
            <Clock size={12} /> Review Direktur
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-700">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "submitted":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
            <Clock size={12} /> Review K3
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
          <p className="text-sm font-medium text-slate-400">
            Memuat daftar Work Permit...
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
            Persetujuan Dokumen
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#0F1F3D]">
            Review Work Permit
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Periksa dan evaluasi pengajuan Surat Izin Kerja Aman (SIKA).
          </p>
        </div>

        {/* Counter Rekapitulasi */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold text-amber-800">
              {permits.filter((p) => p.status === "submitted").length} Review K3
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-bold text-blue-800">
              {permits.filter((p) => p.status === "approved_k3").length} Review
              Direktur
            </span>
          </div>
        </div>
      </div>

      {/* ── FILTER TABS & SEARCH ── */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* TABS KATEGORI */}
        <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm scrollbar-hide">
          {[
            { id: "all", label: "Semua Pengajuan" },
            { id: "review_k3", label: "Menunggu K3" },
            { id: "review_direktur", label: "Menunggu Direktur" },
            { id: "selesai", label: "Selesai (Accepted/Rejected)" },
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
            placeholder="Cari no. dokumen, pekerjaan, PJ Teknik..."
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-[#0F1F3D]/[0.03] border-b border-slate-100">
              <tr>
                {[
                  "No. Dokumen",
                  "Pekerjaan",
                  "PJ Teknik",
                  "Jadwal Pelaksanaan",
                  "Status",
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
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ListFilter size={36} className="text-slate-200" />
                      <p className="text-sm">
                        {search || filterStatus !== "all"
                          ? "Dokumen tidak ditemukan untuk filter ini."
                          : "Belum ada pengajuan Work Permit untuk di-review."}
                      </p>
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

                    {/* PJ Teknik (Pemohon) */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F1F3D]/5 text-xs font-bold text-[#0F1F3D]">
                          {permit.pjTeknik?.nama?.charAt(0).toUpperCase() ||
                            "?"}
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          {permit.pjTeknik?.nama || "—"}
                        </p>
                      </div>
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
                      <Link
                        href={`/work-permits/review/${permit._id}`}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                          ["submitted", "approved_k3"].includes(permit.status)
                            ? "border-[#0F1F3D] bg-[#0F1F3D] text-white hover:bg-[#1a3561]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#0F1F3D] hover:text-[#0F1F3D]"
                        }`}
                      >
                        {["submitted", "approved_k3"].includes(
                          permit.status,
                        ) ? (
                          <>
                            <FileSignature size={12} /> Evaluasi
                          </>
                        ) : (
                          <>
                            <Eye size={12} /> Detail
                          </>
                        )}
                      </Link>
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
