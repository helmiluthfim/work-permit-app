"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User, Briefcase, Loader2 } from "lucide-react";

export default function CreatePersonnelPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("Pelaksana");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/personnel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          jabatan,
        }),
      });

      if (res.ok) {
        router.push("/master/personnel");
        router.refresh(); // Memastikan data di tabel utama ter-update
      } else {
        alert("Gagal menambahkan personel.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full w-full p-6 md:p-8">
      {/* ── HEADER ── */}
      <div className="mb-8 w-full">
        <Link
          href="/master/personnel"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0F1F3D]"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Personel
        </Link>

        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
          Tambah Data
        </p>
        <h1 className="text-2xl font-black tracking-tight text-[#0F1F3D]">
          Tambah Personel Baru
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Lengkapi formulir di bawah ini untuk menambahkan data personel ke
          dalam sistem.
        </p>
      </div>

      {/* ── FORM CARD ── */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#0F1F3D]/[0.02] px-6 py-4">
          <h2 className="text-sm font-bold text-[#0F1F3D]">
            Informasi Personel
          </h2>
        </div>

        <form onSubmit={submit} className="p-6">
          {/* Diubah menjadi Grid agar tampil bersebelahan di layar besar */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Input Nama */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-[#0F1F3D] outline-none transition focus:border-[#0F1F3D] focus:bg-white focus:ring-2 focus:ring-[#0F1F3D]/10"
                />
              </div>
            </div>

            {/* Select Jabatan */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Jabatan / Posisi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Briefcase size={16} className="text-slate-400" />
                </div>
                <select
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium text-[#0F1F3D] outline-none transition focus:border-[#0F1F3D] focus:bg-white focus:ring-2 focus:ring-[#0F1F3D]/10"
                >
                  <option value="Pelaksana">Pelaksana</option>
                  <option value="PJ Teknik">
                    Penanggung Jawab (PJ) Teknik
                  </option>
                  <option value="Tenaga Ahli K3">Tenaga Ahli K3</option>
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── FOOTER ACTIONS ── */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <Link
              href="/master/personnel"
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !nama.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#1a3561] active:scale-95 disabled:pointer-events-none disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
