"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  CalendarClock,
  UserSquare2,
  Phone,
  ShieldAlert,
  Save,
  CheckCircle, // Tambahkan icon ini
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

export default function TabIK() {
  const router = useRouter();
  const { formData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // STATE BARU UNTUK NOTIFIKASI SUKSES
  const [showSuccess, setShowSuccess] = useState(false);

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
        console.error("Gagal memuat data referensi IK", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMasterData();
  }, []);

  // FUNGSI PARSING CERDAS UNTUK TAMPILAN
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

  // HELPER UNTUK MENGEMBALIKAN TEKS MENJADI ARRAY (Untuk Disimpan ke DB)
  const textToArray = (text: string) => {
    if (!text) return [];
    return text
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const selectedJob = jobTemplates.find((j) => j._id === formData.pekerjaanId);
  const selectedPjTeknik = allPersonnel.find(
    (p) => p._id === formData.pjTeknik,
  );
  const selectedAhliK3 = allPersonnel.find(
    (p) => p._id === formData.tenagaAhliK3,
  );

  // ========================================================
  // FUNGSI FINAL SUBMIT (MENYIMPAN SELURUH DOKUMEN)
  // ========================================================
  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      pekerjaan: formData.pekerjaanId,
      lokasi: formData.lokasi,
      tanggalMulai: formData.tanggalMulai,
      waktuMulai: formData.waktuMulai,
      tanggalSelesai: formData.tanggalSelesai,
      waktuSelesai: formData.waktuSelesai,
      pjTeknik: formData.pjTeknik,
      noTelpPjTeknik: formData.noTelpPjTeknik,
      tenagaAhliK3: formData.tenagaAhliK3,
      noTelpTenagaAhliK3: formData.noTelpTenagaAhliK3,

      workPermitData: {
        klasifikasiPekerjaan: textToArray(formData.wpKlasifikasi),
        prosedurPekerjaan: textToArray(formData.wpProsedur),
        lampiran: textToArray(formData.wpLampiran),
      },

      jsaData: {
        pelaksana: formData.jsaPelaksana || [],
        langkahKerja: textToArray(formData.jsaLangkah),
        bahayaResiko: textToArray(formData.jsaBahaya),
        pengendalian: textToArray(formData.jsaPengendalian),
      },

      hirarcData: {
        potensiBahaya: textToArray(formData.hirarcPotensi),
        resiko: textToArray(formData.hirarcResiko),
        konsekuensiKeparahan: textToArray(formData.hirarcKeparahan),
        kemungkinanTerjadi: textToArray(formData.hirarcKemungkinan),
        tingkatResiko: textToArray(formData.hirarcTingkat),
        pengendalian: textToArray(formData.hirarcPengendalian),
        konsekuensiSetelahPengendalian: textToArray(
          formData.hirarcKeparahanSetelah,
        ),
        kemungkinanTerjadiSetelahPengendalian: textToArray(
          formData.hirarcKemungkinanSetelah,
        ),
        tingkatResikoSetelahPengendalian: textToArray(
          formData.hirarcTingkatSetelah,
        ),
        statusPengendalian: formData.hirarcStatusPengendalian || "",
        penanggungJawab: textToArray(formData.hirarcPenanggungJawab),
      },

      sopData: {
        perlengkapanKerja: textToArray(formData.sopPerlengkapan),
        peralatanUkur: textToArray(formData.sopAlatUkur),
        peralatanKerja: textToArray(formData.sopAlatKerja),
        uraianKegiatan: textToArray(formData.sopUraian),
      },

      ikData: {
        perlengkapanKerja: textToArray(formData.ikPerlengkapan),
        peralatanUkur: textToArray(formData.ikAlatUkur),
        peralatanKerja: textToArray(formData.ikAlatKerja),
        uraianKegiatan: textToArray(formData.ikUraian),
      },
    };

    try {
      const res = await fetch("/api/work-permits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Gagal menyimpan pengajuan Izin Kerja.",
        );
      }

      // 1. Tampilkan Pop-up Berhasil
      setShowSuccess(true);

      // 2. Tunda 2.5 Detik, baru pindah ke halaman Dashboard
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2500);
    } catch (error: any) {
      setErrorMsg(error.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsSubmitting(false); // Kembalikan tombol jika gagal
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        <p className="animate-pulse text-gray-500 text-sm">
          Menyiapkan dokumen Instruksi Kerja...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">
      {/* ========================================= */}
      {/* OVERLAY NOTIFIKASI SUKSES                 */}
      {/* ========================================= */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm mx-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-5">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Berhasil Disimpan!
            </h3>
            <p className="text-gray-500 text-sm">
              Dokumen K3 lengkap telah berhasil diajukan ke dalam sistem.
              Mengalihkan ke dashboard...
            </p>
            <div className="mt-6 flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        </div>
      )}

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

      {/* KOTAK DETAIL IK (READ-ONLY) */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Instruksi Kerja (IK)
            </h2>
          </div>
          <span className="px-3 py-1 bg-emerald-200/50 text-emerald-800 text-xs font-bold rounded uppercase tracking-wider border border-emerald-200">
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
              {renderFormattedText(formData.ikPerlengkapan)}
            </div>
          </div>

          {/* Peralatan Ukur */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Peralatan Ukur
            </label>
            <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[8rem] shadow-inner overflow-hidden">
              {renderFormattedText(formData.ikAlatUkur)}
            </div>
          </div>

          {/* Peralatan Kerja */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Peralatan Kerja
            </label>
            <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-4 min-h-[8rem] shadow-inner overflow-hidden">
              {renderFormattedText(formData.ikAlatKerja)}
            </div>
          </div>

          {/* Uraian Kegiatan */}
          <div className="md:col-span-3 mt-2">
            <label className="block text-sm font-bold mb-2 text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Uraian Kegiatan Detail
            </label>
            <div className="bg-gray-50/80 border border-gray-200 rounded-lg p-5 min-h-[12rem] shadow-inner overflow-hidden">
              {renderFormattedText(formData.ikUraian)}
            </div>
          </div>

          <div className="md:col-span-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex items-start gap-3 mt-2">
            <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>Pernyataan Kepatuhan:</strong> Dengan menekan tombol
              ajukan di bawah, Anda selaku Penanggung Jawab Teknik memastikan
              bahwa seluruh data Work Permit beserta dokumen pendukungnya (JSA,
              HIRARC, SOP, IK) telah ditinjau dan sesuai dengan kondisi
              lapangan.
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGASI & TOMBOL SUBMIT FINAL */}
      <div className="flex justify-between items-center pt-6 pb-8">
        <button
          type="button"
          onClick={() => router.push("/work-permits/create/sop")}
          disabled={isSubmitting || showSuccess} // Kunci tombol saat sedang submit/sukses
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali ke SOP
        </button>

        <button
          type="button"
          onClick={handleSubmitFinal}
          disabled={isSubmitting || showSuccess}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-md font-bold text-base"
        >
          {isSubmitting || showSuccess ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses Dokumen...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Ajukan Dokumen K3
            </>
          )}
        </button>
      </div>
    </div>
  );
}
