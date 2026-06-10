"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Activity, 
  Briefcase,
  CalendarClock,
  UserSquare2,
  Phone,
  ShieldAlert
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

export default function TabHIRARC() {
  const router = useRouter();
  const { formData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Kita tetap perlu mengambil data master untuk merender nama asli (bukan sekadar ID) pada kotak Info
    const fetchMasterData = async () => {
      try {
        const [resJobs, resPersonnel] = await Promise.all([
          fetch("/api/job-templates"),
          fetch("/api/personnel")
        ]);

        const dataJobs = await resJobs.json();
        const dataPersonnel = await resPersonnel.json();
        
        if (dataJobs.success) setJobTemplates(dataJobs.data);
        if (dataPersonnel.success) setAllPersonnel(dataPersonnel.data);
      } catch (error) {
        console.error("Gagal memuat data referensi HIRARC", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMasterData();
  }, []);

  // FUNGSI PARSING CERDAS UNTUK SUB-JUDUL & BULLET (Sama dengan JSA)
  const renderFormattedText = (text: string) => {
    if (!text) return <span className="text-gray-400 italic">Data kosong dari template master...</span>;

    const lines = text.split('\n');

    return (
      <div className="space-y-1">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;

          // Cek apakah diawali dengan angka dan titik
          const isSubJudul = /^\d+\./.test(trimmedLine);

          if (isSubJudul) {
            return (
              <div key={index} className="font-bold text-gray-900 mt-4 mb-2 uppercase tracking-wide text-xs">
                {trimmedLine}
              </div>
            );
          } else {
            const cleanText = trimmedLine.replace(/^- /, '');
            return (
              <div key={index} className="text-gray-700 ml-3 flex gap-2 items-start">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span className="text-sm">{cleanText}</span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Mencari nama asli berdasarkan ID
  const selectedJob = jobTemplates.find((j) => j._id === formData.pekerjaanId);
  const selectedPjTeknik = allPersonnel.find((p) => p._id === formData.pjTeknik);
  const selectedAhliK3 = allPersonnel.find((p) => p._id === formData.tenagaAhliK3);

  // Fungsi pindah ke tab selanjutnya (SOP)
  const handleNext = () => {
    router.push("/work-permits/create/sop");
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="animate-pulse text-gray-500 text-sm">Menyiapkan dokumen HIRARC...</p>
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
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wide block">Nama Pekerjaan</span>
            <span className="font-bold text-gray-800">
              {selectedJob ? `${selectedJob.kodePekerjaan} - ${selectedJob.namaPekerjaan}` : "-"}
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">Lokasi: {formData.lokasi || "-"}</span>
          </div>
        </div>
        <div className="flex gap-3 border-t sm:border-t-0 sm:border-l border-blue-100 sm:pl-4 lg:pl-5">
          <CalendarClock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide block">Mulai</span>
              <span className="font-semibold text-gray-700 text-xs">
                {formData.tanggalMulai || "-"} <span className="text-gray-400">|</span> {formData.waktuMulai || "-"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide block">Selesai</span>
              <span className="font-semibold text-gray-700 text-xs">
                {formData.tanggalSelesai || "-"} <span className="text-gray-400">|</span> {formData.waktuSelesai || "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t lg:border-t-0 lg:border-l border-blue-100 lg:pl-5">
          <UserSquare2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-teal-500 uppercase tracking-wide block">PJ Teknik</span>
            <span className="font-semibold text-gray-800">{selectedPjTeknik?.nama || "-"}</span>
            <span className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-gray-400" /> {formData.noTelpPjTeknik || "-"}
            </span>
          </div>
        </div>
        <div className="flex gap-3 border-t lg:border-t-0 lg:border-l border-blue-100 lg:pl-5">
          <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wide block">Tenaga Ahli K3</span>
            <span className="font-semibold text-gray-800">{selectedAhliK3?.nama || "-"}</span>
            <span className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-gray-400" /> {formData.noTelpTenagaAhliK3 || "-"}
            </span>
          </div>
        </div>
      </div>
      {/* ======================================================== */}

      {/* KOTAK DETAIL HIRARC (READ-ONLY) */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-800">Dokumen HIRARC</h2>
          </div>
          <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded uppercase tracking-wider">
            Read Only
          </span>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* KOLOM KIRI: Identifikasi Bahaya */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                Potensi Bahaya
              </label>
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[6rem] shadow-inner overflow-hidden">
                {renderFormattedText(formData.hirarcPotensi)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                Resiko
              </label>
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[6rem] shadow-inner overflow-hidden">
                {renderFormattedText(formData.hirarcResiko)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                Tindakan Pengendalian
              </label>
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[6rem] shadow-inner overflow-hidden">
                {renderFormattedText(formData.hirarcPengendalian)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                Penanggung Jawab Pengendalian
              </label>
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[4rem] shadow-inner overflow-hidden">
                {renderFormattedText(formData.hirarcPenanggungJawab)}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Penilaian Resiko (Skor) */}
          <div className="space-y-6">
            
            {/* Skor Awal */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Skor Penilaian Awal</span>
              </div>
              <div className="p-4 bg-white grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Keparahan</span>
                  <div className="bg-gray-50 border rounded p-2 text-sm font-semibold text-gray-800 whitespace-pre-wrap">
                    {formData.hirarcKeparahan || "-"}
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Kemungkinan</span>
                  <div className="bg-gray-50 border rounded p-2 text-sm font-semibold text-gray-800 whitespace-pre-wrap">
                    {formData.hirarcKemungkinan || "-"}
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Tingkat Resiko</span>
                  <div className="bg-red-50 border border-red-200 rounded p-2 text-sm font-bold text-red-700 whitespace-pre-wrap">
                    {formData.hirarcTingkat || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Skor Setelah Pengendalian */}
            <div className="border border-green-200 rounded-xl overflow-hidden">
              <div className="bg-green-100/50 px-4 py-2 border-b border-green-200">
                <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Skor Setelah Pengendalian</span>
              </div>
              <div className="p-4 bg-white grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Keparahan Baru</span>
                  <div className="bg-gray-50 border rounded p-2 text-sm font-semibold text-gray-800 whitespace-pre-wrap">
                    {formData.hirarcKeparahanSetelah || "-"}
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Kemungkinan Baru</span>
                  <div className="bg-gray-50 border rounded p-2 text-sm font-semibold text-gray-800 whitespace-pre-wrap">
                    {formData.hirarcKemungkinanSetelah || "-"}
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Tingkat Resiko Baru</span>
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-sm font-bold text-green-700 whitespace-pre-wrap">
                    {formData.hirarcTingkatSetelah || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Pengendalian */}
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wide">
                Status Pengendalian Akhir
              </label>
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-3 text-sm font-bold text-gray-800 shadow-inner">
                {formData.hirarcStatusPengendalian || <span className="text-gray-400 font-normal italic">-</span>}
              </div>
            </div>

            <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded border border-gray-100 mt-4">
              *Detail identifikasi bahaya dan perhitungan resiko ini bersifat mengikat dan mengikuti protokol K3 yang disetujui pada Master Pekerjaan.
            </p>

          </div>
        </div>
      </div>

      {/* NAVIGASI BAWAH */}
      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => router.push("/work-permits/create/jsa")} 
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke JSA
        </button>
        <button 
          type="button" 
          onClick={handleNext} 
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
        >
          Lanjut ke SOP <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}