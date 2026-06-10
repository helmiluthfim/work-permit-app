"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Briefcase,
  CalendarClock,
  UserSquare2,
  Phone,
  ShieldAlert,
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

export default function TabSOP() {
  const router = useRouter();
  const { formData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resJobs, resPersonnel] = await Promise.all([
          fetch("/api/job-templates"),
          fetch("/api/personnel"),
        ]);

        const dataJobs = await resJobs.json();
        const dataPersonnel = await resPersonnel.json();

        if (dataJobs.success) setJobTemplates(dataJobs.data);
        if (dataPersonnel.success) setAllPersonnel(dataPersonnel.data);
      } catch (error) {
        console.error("Gagal memuat data referensi SOP", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMasterData();
  }, []);

  // FUNGSI PARSING CERDAS UNTUK SUB-JUDUL & BULLET
  const renderFormattedText = (text: string) => {
    if (!text)
      return (
        <span className="text-gray-400 italic">
          Data kosong dari template master...
        </span>
      );

    const lines = text.split("\n");

    return (
      <div className="space-y-1">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;

          const isSubJudul = /^\d+\./.test(trimmedLine);

          if (isSubJudul) {
            return (
              <div
                key={index}
                className="font-bold text-gray-900 mt-4 mb-2 uppercase tracking-wide text-xs"
              >
                {trimmedLine}
              </div>
            );
          } else {
            const cleanText = trimmedLine.replace(/^- /, "");
            return (
              <div
                key={index}
                className="text-gray-700 ml-3 flex gap-2 items-start"
              >
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span className="text-sm">{cleanText}</span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const selectedJob = jobTemplates.find((j) => j._id === formData.pekerjaanId);
  const selectedPjTeknik = allPersonnel.find(
    (p) => p._id === formData.pjTeknik,
  );
  const selectedAhliK3 = allPersonnel.find(
    (p) => p._id === formData.tenagaAhliK3,
  );

  const handleNext = () => {
    router.push("/work-permits/create/ik");
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="animate-pulse text-gray-500 text-sm">
          Menyiapkan dokumen SOP...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* ======================================================== */}
      {/* KOTAK INFO READ-ONLY KOMPLET */}
      {/* ======================================================== */}
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
      {/* ======================================================== */}

      {/* KOTAK DETAIL SOP (READ-ONLY) */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Standar Operasional Prosedur (SOP)
            </h2>
          </div>
          <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded uppercase tracking-wider">
            Read Only
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Perlengkapan Kerja */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Perlengkapan Kerja (APD)
            </label>
            <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[8rem] shadow-inner overflow-hidden">
              {renderFormattedText(formData.sopPerlengkapan)}
            </div>
          </div>

          {/* Peralatan Ukur */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Peralatan Ukur
            </label>
            <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[8rem] shadow-inner overflow-hidden">
              {renderFormattedText(formData.sopAlatUkur)}
            </div>
          </div>

          {/* Peralatan Kerja */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Peralatan Kerja
            </label>
            <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[8rem] shadow-inner overflow-hidden">
              {renderFormattedText(formData.sopAlatKerja)}
            </div>
          </div>

          {/* Uraian Kegiatan (Dibuat lebar penuh ke bawah) */}
          <div className="md:col-span-3 mt-2">
            <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Uraian Kegiatan
            </label>
            <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-5 min-h-[12rem] shadow-inner overflow-hidden">
              {renderFormattedText(formData.sopUraian)}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded border border-gray-100">
              *Prosedur ini adalah standar mutlak dari perusahaan. Semua pihak
              di lapangan wajib mematuhi panduan dan menggunakan peralatan yang
              tertulis pada dokumen ini.
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGASI BAWAH */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => router.push("/work-permits/create/hirarc")}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke HIRARC
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
        >
          Lanjut ke Instruksi Kerja <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
