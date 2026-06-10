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
  hirarcTemplate?: any; // Tambahkan ini untuk menghindari error TypeScript
}

export default function TabHIRARC() {
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
        console.error("Gagal memuat data referensi HIRARC", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMasterData();
  }, []);

  const selectedJob = jobTemplates.find((j) => j._id === formData.pekerjaanId);
  const selectedPjTeknik = allPersonnel.find(
    (p) => p._id === formData.pjTeknik,
  );
  const selectedAhliK3 = allPersonnel.find(
    (p) => p._id === formData.tenagaAhliK3,
  );

  const handleNext = () => {
    router.push("/work-permits/create/sop");
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="animate-pulse text-gray-500 text-sm">
          Menyiapkan dokumen HIRARC...
        </p>
      </div>
    );
  }

  // Alias untuk mempermudah pemanggilan data HIRARC dari Master Pekerjaan
  const h = selectedJob?.hirarcTemplate;
  // Memastikan bahwa data array tersedia
  const hasHirarcData = h && h.potensiBahaya && h.potensiBahaya.length > 0;

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

      {/* KOTAK DETAIL HIRARC (READ-ONLY BERBASIS KARTU) */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Dokumen HIRARC (Master)
            </h2>
          </div>
          <span className="px-3 py-1 bg-indigo-200/50 text-indigo-800 text-xs font-bold rounded uppercase tracking-wider border border-indigo-200">
            Read Only
          </span>
        </div>

        <div className="p-6">
          {!hasHirarcData ? (
            <div className="text-center py-10 bg-gray-50 border border-dashed rounded-lg">
              <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                Data HIRARC belum tersedia di Master Pekerjaan ini.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {h.potensiBahaya.map((potensi: string, index: number) => {
                // Handle pemecahan string koma jika database menyimpannya demikian
                const statusArray =
                  h.statusPengendalian &&
                  typeof h.statusPengendalian === "string"
                    ? h.statusPengendalian.split(", ")
                    : Array.isArray(h.statusPengendalian)
                      ? h.statusPengendalian
                      : [];

                return (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Badge Nomor */}
                    <div className="absolute -top-3 -left-3 bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-sm border-2 border-white">
                      {index + 1}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* KOLOM KIRI: Identifikasi Bahaya */}
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
                            Potensi Bahaya
                          </span>
                          <p className="text-sm font-semibold text-gray-900 bg-white p-3 rounded-lg border">
                            {potensi || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
                            Resiko
                          </span>
                          <p className="text-sm font-semibold text-gray-900 bg-white p-3 rounded-lg border">
                            {h.resiko?.[index] || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
                            Tindakan Pengendalian
                          </span>
                          <p className="text-sm font-semibold text-gray-900 bg-white p-3 rounded-lg border">
                            {h.pengendalian?.[index] || "-"}
                          </p>
                        </div>
                      </div>

                      {/* KOLOM KANAN: Penilaian Resiko (Skor) & Info Tambahan */}
                      <div className="space-y-4">
                        {/* Skor Awal */}
                        <div className="bg-white border rounded-lg p-3">
                          <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                            Skor Penilaian Awal
                          </span>
                          <div className="flex gap-2 text-center">
                            <div className="w-1/3 border rounded p-2 text-xs bg-gray-50">
                              <span className="text-gray-400 block mb-0.5">
                                Keparahan
                              </span>
                              <span className="font-bold">
                                {h.konsekuensiKeparahan?.[index] || "-"}
                              </span>
                            </div>
                            <div className="w-1/3 border rounded p-2 text-xs bg-gray-50">
                              <span className="text-gray-400 block mb-0.5">
                                Kemungkinan
                              </span>
                              <span className="font-bold">
                                {h.kemungkinanTerjadi?.[index] || "-"}
                              </span>
                            </div>
                            <div className="w-1/3 border rounded p-2 text-xs bg-red-50 border-red-200">
                              <span className="text-red-400 block mb-0.5">
                                Tingkat
                              </span>
                              <span className="font-bold text-red-700">
                                {h.tingkatResiko?.[index] || "-"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Skor Setelah Pengendalian */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <span className="text-[10px] font-bold text-green-700 uppercase mb-2 block">
                            Skor Setelah Pengendalian
                          </span>
                          <div className="flex gap-2 text-center">
                            <div className="w-1/3 border border-green-100 rounded p-2 text-xs bg-white">
                              <span className="text-gray-400 block mb-0.5">
                                Keparahan
                              </span>
                              <span className="font-bold">
                                {h.konsekuensiSetelahPengendalian?.[index] ||
                                  "-"}
                              </span>
                            </div>
                            <div className="w-1/3 border border-green-100 rounded p-2 text-xs bg-white">
                              <span className="text-gray-400 block mb-0.5">
                                Kemungkinan
                              </span>
                              <span className="font-bold">
                                {h.kemungkinanTerjadiSetelahPengendalian?.[
                                  index
                                ] || "-"}
                              </span>
                            </div>
                            <div className="w-1/3 border border-green-300 rounded p-2 text-xs bg-green-100">
                              <span className="text-green-600 block mb-0.5">
                                Tingkat
                              </span>
                              <span className="font-bold text-green-800">
                                {h.tingkatResikoSetelahPengendalian?.[index] ||
                                  "-"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Info PIC & Status */}
                        <div className="flex gap-3 mt-4 text-sm">
                          <div className="w-1/2 bg-white border p-3 rounded-lg">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                              Penanggung Jawab
                            </span>
                            <span className="font-semibold text-blue-700">
                              {h.penanggungJawab?.[index] || "-"}
                            </span>
                          </div>
                          <div className="w-1/2 bg-white border p-3 rounded-lg">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                              Status Pengendalian
                            </span>
                            <span className="font-semibold text-gray-800">
                              {statusArray[index] || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex items-start gap-3 mt-6">
                <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong>Pemberitahuan:</strong> Seluruh poin identifikasi
                  HIRARC di atas akan disalin secara otomatis ke dokumen
                  pengajuan akhir Anda. Jika kondisi di lapangan berbeda,
                  hubungi Tenaga Ahli K3 untuk merevisi Master Pekerjaan.
                </p>
              </div>
            </div>
          )}
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
