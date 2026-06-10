"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Users,
  X,
  CheckSquare,
  Briefcase,
  CalendarClock,
  UserSquare2,
  Phone,
  ShieldCheck,
  ListChecks,
  AlertTriangle,
  Info,
} from "lucide-react";
import { WorkPermitFormContext } from "../layout";

interface Personnel {
  _id: string;
  nama: string;
  jabatan: string;
}

interface JobTemplate {
  _id: string;
  kodePekerjaan: string;
  namaPekerjaan: string;
}

export default function TabJSA() {
  const router = useRouter();
  const { formData, setFormData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [pelaksanaOptions, setPelaksanaOptions] = useState<Personnel[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!formData.jsaPelaksana) {
      setFormData((prev: any) => ({ ...prev, jsaPelaksana: [] }));
    }

    const fetchMasterData = async () => {
      try {
        const [resJobs, resPersonnel] = await Promise.all([
          fetch("/api/job-templates"),
          fetch("/api/personnel"),
        ]);

        const dataJobs = await resJobs.json();
        const dataPersonnel = await resPersonnel.json();

        if (dataJobs.success) setJobTemplates(dataJobs.data);
        if (dataPersonnel.success) {
          setAllPersonnel(dataPersonnel.data);
          const pelaksanaOnly = dataPersonnel.data.filter(
            (p: Personnel) => p.jabatan === "Pelaksana",
          );
          setPelaksanaOptions(pelaksanaOnly);
        }
      } catch (error) {
        console.error("Gagal memuat data referensi JSA", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMasterData();
  }, []);

  const togglePelaksana = (id: string) => {
    if (errorMsg) setErrorMsg("");

    setFormData((prev: any) => {
      const currentList = prev.jsaPelaksana || [];
      const isSelected = currentList.includes(id);
      const newList = isSelected
        ? currentList.filter((item: string) => item !== id)
        : [...currentList, id];

      return { ...prev, jsaPelaksana: newList };
    });
  };

  const handleNext = () => {
    if (!formData.jsaPelaksana || formData.jsaPelaksana.length === 0) {
      setErrorMsg("Mohon pilih minimal 1 Pelaksana Pekerjaan untuk JSA ini.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrorMsg("");
    router.push("/work-permits/create/hirarc");
  };

  const selectedJob = jobTemplates.find((j) => j._id === formData.pekerjaanId);
  const selectedPjTeknik = allPersonnel.find(
    (p) => p._id === formData.pjTeknik,
  );
  const selectedAhliK3 = allPersonnel.find(
    (p) => p._id === formData.tenagaAhliK3,
  );

  if (isFetching) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600"></div>
        <p className="animate-pulse text-gray-500 text-sm">
          Memuat data JSA...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* KOTAK INFO READ-ONLY KOMPLET */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm animate-in fade-in duration-300">
        <div className="flex gap-3">
          <Briefcase className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wide block">
              Nama Pekerjaan
            </span>
            <span className="font-bold text-gray-800">
              {selectedJob
                ? `${selectedJob.kodePekerjaan} - ${selectedJob.namaPekerjaan}`
                : "-"}
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              Lokasi: {formData.lokasi || "-"}
            </span>
          </div>
        </div>
        <div className="flex gap-3 border-t sm:border-t-0 sm:border-l border-blue-100 sm:pl-4 lg:pl-5">
          <CalendarClock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide block">
                Mulai
              </span>
              <span className="font-semibold text-gray-700 text-xs">
                {formData.tanggalMulai || "-"}{" "}
                <span className="text-gray-400">|</span>{" "}
                {formData.waktuMulai || "-"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide block">
                Selesai
              </span>
              <span className="font-semibold text-gray-700 text-xs">
                {formData.tanggalSelesai || "-"}{" "}
                <span className="text-gray-400">|</span>{" "}
                {formData.waktuSelesai || "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t lg:border-t-0 lg:border-l border-blue-100 lg:pl-5">
          <UserSquare2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-teal-500 uppercase tracking-wide block">
              PJ Teknik
            </span>
            <span className="font-semibold text-gray-800">
              {selectedPjTeknik?.nama || "-"}
            </span>
            <span className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-gray-400" />{" "}
              {formData.noTelpPjTeknik || "-"}
            </span>
          </div>
        </div>
        <div className="flex gap-3 border-t lg:border-t-0 lg:border-l border-blue-100 lg:pl-5">
          <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wide block">
              Tenaga Ahli K3
            </span>
            <span className="font-semibold text-gray-800">
              {selectedAhliK3?.nama || "-"}
            </span>
            <span className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-gray-400" />{" "}
              {formData.noTelpTenagaAhliK3 || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* 1. KOTAK PEMILIHAN PELAKSANA */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">
            1. Pelaksana Pekerjaan (JSA)
          </h2>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Pilih pekerja yang terlibat di lapangan. Nama-nama ini wajib membaca
            dan memahami dokumen JSA ini.
          </p>
          <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
            {(!formData.jsaPelaksana || formData.jsaPelaksana.length === 0) && (
              <span className="text-sm text-gray-400 italic">
                Belum ada pelaksana yang dipilih...
              </span>
            )}
            {formData.jsaPelaksana?.map((id: string) => {
              const person = pelaksanaOptions.find((p) => p._id === id);
              if (!person) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
                >
                  {person.nama}
                  <button
                    type="button"
                    onClick={() => togglePelaksana(id)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>

          <div className="border border-gray-200 rounded-lg max-h-56 overflow-y-auto bg-gray-50/50 p-2 space-y-1">
            {pelaksanaOptions.length > 0 ? (
              pelaksanaOptions.map((person) => {
                const isSelected = formData.jsaPelaksana?.includes(person._id);
                return (
                  <label
                    key={person._id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors border ${isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-100 border-transparent"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => togglePelaksana(person._id)}
                      className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <p
                      className={`text-sm font-semibold ${isSelected ? "text-blue-900" : "text-gray-700"}`}
                    >
                      {person.nama}
                    </p>
                  </label>
                );
              })
            ) : (
              <p className="p-4 text-center text-sm text-gray-500">
                Tidak ada data personel dengan jabatan "Pelaksana".
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. KOTAK DETAIL DOKUMEN JSA (READ-ONLY) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-50/80 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <CheckSquare className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                2. Analisis Keselamatan Kerja (JSA)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Dokumen panduan keselamatan standar
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider border border-gray-200 shadow-sm">
            Read Only
          </span>
        </div>

        {/* Content Section - Stacked Layout */}
        <div className="p-6 space-y-8">
          {/* Langkah Kerja */}
          <div className="relative pl-5 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Langkah Kerja
              </h3>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-blue-50/30 p-4 rounded-r-lg border border-blue-50/50">
              {formData.jsaLangkah || (
                <span className="text-gray-400 italic">
                  Data kosong dari template master...
                </span>
              )}
            </div>
          </div>

          {/* Bahaya & Resiko */}
          <div className="relative pl-5 border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Bahaya & Resiko
              </h3>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-red-50/30 p-4 rounded-r-lg border border-red-50/50">
              {formData.jsaBahaya || (
                <span className="text-gray-400 italic">
                  Data kosong dari template master...
                </span>
              )}
            </div>
          </div>

          {/* Tindakan Pengendalian */}
          <div className="relative pl-5 border-l-4 border-emerald-500">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Tindakan Pengendalian
              </h3>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-emerald-50/30 p-4 rounded-r-lg border border-emerald-50/50">
              {formData.jsaPengendalian || (
                <span className="text-gray-400 italic">
                  Data kosong dari template master...
                </span>
              )}
            </div>
          </div>

          {/* Info / Warning Banner */}
          <div className="mt-8 pt-2">
            <div className="flex items-start gap-3 bg-amber-50/50 border border-amber-200 p-4 rounded-lg">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">
                  Catatan Penting:
                </span>{" "}
                Dokumen JSA ini bersifat baku berdasarkan Master Template K3.
                Jika terdapat kondisi lapangan yang memerlukan penambahan
                langkah kerja, harap hubungi Tenaga Ahli K3 untuk memperbarui
                Master Data.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* NAVIGASI BAWAH */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => router.push("/work-permits/create/work-permit")}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
        >
          Lanjut ke HIRARC <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
