"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User, Briefcase, Loader2, Power } from "lucide-react";

export default function EditPersonnelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("Pelaksana");
  const [aktif, setAktif] = useState(true);

  useEffect(() => {
    fetchPersonnel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPersonnel = async () => {
    try {
      const res = await fetch(`/api/personnel/${id}`);
      const result = await res.json();

      if (result.success) {
        const data = result.data;
        setNama(data.nama);
        setJabatan(data.jabatan);
        setAktif(data.aktif);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/personnel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          jabatan,
          aktif,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        alert("Gagal memperbarui data");
        return;
      }

      alert("Data berhasil diperbarui");
      router.push("/master/personnel");
      router.refresh(); // Update data di tabel halaman utama
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── State Loading Awal ──
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
          <p className="text-sm font-medium text-slate-400">
            Mengambil data personel...
          </p>
        </div>
      </div>
    );
  }

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
          Manajemen Data
        </p>
        <h1 className="text-2xl font-black tracking-tight text-[#0F1F3D]">
          Edit Personel
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Perbarui informasi profil dan status keaktifan personel di bawah ini.
        </p>
      </div>

      {/* ── FORM CARD ── */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#0F1F3D]/[0.02] px-6 py-4">
          <h2 className="text-sm font-bold text-[#0F1F3D]">
            Informasi Personel
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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

          {/* ── TOGGLE STATUS AKTIF ── */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                <Power
                  size={18}
                  className={aktif ? "text-emerald-500" : "text-slate-400"}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#0F1F3D]">
                  Status Akun Personel
                </p>
                <p className="text-xs text-slate-500">
                  {aktif
                    ? "Personel ini aktif dan dapat dipilih di dokumen K3."
                    : "Personel nonaktif tidak akan muncul di pilihan dokumen K3."}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={aktif}
                onClick={() => setAktif(!aktif)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0F1F3D]/20 focus:ring-offset-2 ${
                  aktif ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    aktif ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
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
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
