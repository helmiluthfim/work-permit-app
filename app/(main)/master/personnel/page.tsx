"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Users, Pencil, Trash2, X, UserX } from "lucide-react";

interface Personnel {
  _id: string;
  nama: string;
  jabatan: string;
  aktif: boolean;
  createdAt: string;
}

export default function PersonnelPage() {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPersonnels = async () => {
    try {
      const res = await fetch("/api/personnel");
      const result = await res.json();

      if (result.success) {
        setPersonnels(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnels();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus personel ini?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/personnel/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!result.success) {
        alert("Gagal menghapus data");
        return;
      }

      fetchPersonnels();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter pencarian berdasarkan nama atau jabatan
  const filtered = personnels.filter((p) => {
    const nama = p.nama || "";
    const jabatan = p.jabatan || "";
    const query = search.toLowerCase();

    return (
      nama.toLowerCase().includes(query) ||
      jabatan.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
          <p className="text-sm font-medium text-slate-400">
            Memuat data personel...
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
            Master Personel
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola data Penanggung Jawab Teknik dan Tenaga Ahli Pelaksana.
          </p>
        </div>
        <Link
          href="/master/personnel/create"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#1a3561] active:scale-95"
        >
          <Plus size={16} />
          Tambah Personel
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
          placeholder="Cari nama atau jabatan..."
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

      {/* ── TABLE ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead className="bg-[#0F1F3D]/[0.03] border-b border-slate-100">
              <tr>
                {[
                  "Nama Personel",
                  "Jabatan",
                  "Status",
                  "Terdaftar",
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
                      {search ? (
                        <UserX size={36} className="text-slate-200" />
                      ) : (
                        <Users size={36} className="text-slate-200" />
                      )}
                      <p className="text-sm">
                        {search
                          ? "Personel tidak ditemukan."
                          : "Belum ada data personel."}
                      </p>
                      {!search && (
                        <Link
                          href="/master/personnel/create"
                          className="mt-1 rounded-lg bg-[#0F1F3D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                        >
                          Tambah Sekarang
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-100">
                {filtered.map((personnel) => (
                  <tr
                    key={personnel._id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {/* Nama */}
                    <td className="px-5 py-4 text-sm font-bold text-[#0F1F3D] whitespace-nowrap">
                      {personnel.nama}
                    </td>

                    {/* Jabatan */}
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                      {personnel.jabatan}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                          personnel.aktif
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {personnel.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    {/* Tanggal Terdaftar */}
                    <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {personnel.createdAt
                        ? new Date(personnel.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/master/personnel/${personnel._id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#F5A623]/30 bg-[#F5A623]/10 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-[#F5A623]/20"
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(personnel._id)}
                          disabled={deletingId === personnel._id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                          {deletingId === personnel._id ? "..." : "Hapus"}
                        </button>
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
          <div className="border-t border-slate-100 px-5 py-3 bg-white">
            <p className="text-xs text-slate-400">
              Menampilkan{" "}
              <span className="font-bold text-[#0F1F3D]">
                {filtered.length}
              </span>{" "}
              dari {personnels.length} personel
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
