"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Paperclip,
  ScrollText,
  ShieldAlert,
} from "lucide-react";
import { WorkPermitFormContext } from "../layout";

const arrayToText = (arr?: string[]) =>
  !arr || !Array.isArray(arr) ? "" : arr.join("\n");

export default function TabWorkPermit() {
  const router = useRouter();

  // Ambil Data Global dari Layout
  const { formData, setFormData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<any[]>([]);
  const [pjTeknikOptions, setPjTeknikOptions] = useState<any[]>([]);
  const [ahliK3Options, setAhliK3Options] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // State untuk peringatan validasi
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resJobs, resPjTeknik, resAhliK3] = await Promise.all([
          fetch("/api/job-templates"),
          fetch("/api/personnel?jabatan=PJ Teknik"),
          fetch("/api/personnel?jabatan=Tenaga Ahli K3"),
        ]);
        const [dataJobs, dataPjTeknik, dataAhliK3] = await Promise.all([
          resJobs.json(),
          resPjTeknik.json(),
          resAhliK3.json(),
        ]);
        if (dataJobs.success) setJobTemplates(dataJobs.data);
        if (dataPjTeknik.success) setPjTeknikOptions(dataPjTeknik.data);
        if (dataAhliK3.success) setAhliK3Options(dataAhliK3.data);
      } finally {
        setIsFetching(false);
      }
    };
    fetchMasterData();
  }, []);

  // FUNGSI UTAMA: Autofill SELURUH dokumen ke Global State
  const handleJobChange = (jobId: string) => {
    const selectedJob = jobTemplates.find((j) => j._id === jobId);
    if (!selectedJob) return;

    // Menghapus pesan error jika sebelumnya ada, karena user baru saja melakukan perbaikan
    setErrorMsg("");

    setFormData((prev: any) => ({
      ...prev,
      pekerjaanId: jobId,

      // 1. Autofill Work Permit
      wpKlasifikasi: arrayToText(
        selectedJob.workPermitTemplate?.klasifikasiPekerjaan,
      ),
      wpProsedur: arrayToText(
        selectedJob.workPermitTemplate?.prosedurPekerjaan,
      ),
      wpLampiran: arrayToText(selectedJob.workPermitTemplate?.lampiran),

      // 2. Autofill JSA
      jsaLangkah: arrayToText(selectedJob.jsaTemplate?.langkahKerja),
      jsaBahaya: arrayToText(selectedJob.jsaTemplate?.bahayaResiko),
      jsaPengendalian: arrayToText(selectedJob.jsaTemplate?.pengendalian),

      // 3. Autofill HIRARC
      hirarcPotensi: arrayToText(selectedJob.hirarcTemplate?.potensiBahaya),
      hirarcResiko: arrayToText(selectedJob.hirarcTemplate?.resiko),
      hirarcKeparahan: arrayToText(
        selectedJob.hirarcTemplate?.konsekuensiKeparahan,
      ),
      hirarcKemungkinan: arrayToText(
        selectedJob.hirarcTemplate?.kemungkinanTerjadi,
      ),
      hirarcTingkat: arrayToText(selectedJob.hirarcTemplate?.tingkatResiko),
      hirarcPengendalian: arrayToText(selectedJob.hirarcTemplate?.pengendalian),
      hirarcKeparahanSetelah: arrayToText(
        selectedJob.hirarcTemplate?.konsekuensiSetelahPengendalian,
      ),
      hirarcKemungkinanSetelah: arrayToText(
        selectedJob.hirarcTemplate?.kemungkinanTerjadiSetelahPengendalian,
      ),
      hirarcTingkatSetelah: arrayToText(
        selectedJob.hirarcTemplate?.tingkatResikoSetelahPengendalian,
      ),
      hirarcStatusPengendalian:
        selectedJob.hirarcTemplate?.statusPengendalian || "",
      hirarcPenanggungJawab: arrayToText(
        selectedJob.hirarcTemplate?.penanggungJawab,
      ),

      // 4. Autofill SOP
      sopPerlengkapan: arrayToText(selectedJob.sopTemplate?.perlengkapanKerja),
      sopAlatUkur: arrayToText(selectedJob.sopTemplate?.peralatanUkur),
      sopAlatKerja: arrayToText(selectedJob.sopTemplate?.peralatanKerja),
      sopUraian: arrayToText(selectedJob.sopTemplate?.uraianKegiatan),

      // 5. Autofill IK
      ikPerlengkapan: arrayToText(selectedJob.ikTemplate?.perlengkapanKerja),
      ikAlatUkur: arrayToText(selectedJob.ikTemplate?.peralatanUkur),
      ikAlatKerja: arrayToText(selectedJob.ikTemplate?.peralatanKerja),
      ikUraian: arrayToText(selectedJob.ikTemplate?.uraianKegiatan),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    // Sembunyikan error ketika user mulai mengetik ulang
    if (errorMsg) setErrorMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // FUNGSI VALIDASI SEBELUM PINDAH TAB
  const handleNext = () => {
    const {
      pekerjaanId,
      lokasi,
      tanggalMulai,
      waktuMulai,
      tanggalSelesai,
      waktuSelesai,
      pjTeknik,
      noTelpPjTeknik,
      tenagaAhliK3,
      noTelpTenagaAhliK3,
    } = formData;

    // Cek apakah ada satupun field wajib yang kosong
    if (
      !pekerjaanId ||
      !lokasi ||
      !tanggalMulai ||
      !waktuMulai ||
      !tanggalSelesai ||
      !waktuSelesai ||
      !pjTeknik ||
      !noTelpPjTeknik ||
      !tenagaAhliK3 ||
      !noTelpTenagaAhliK3
    ) {
      setErrorMsg(
        "Mohon lengkapi semua kolom yang wajib diisi (berciri tanda *) sebelum melanjutkan ke tab JSA.",
      );

      // Menggulir (scroll) layar ke atas agar user melihat pesan error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return; // Hentikan eksekusi, jangan pindah rute
    }

    // Jika semua sudah terisi, baru pindah halaman
    setErrorMsg("");
    router.push("/work-permits/create/jsa");
  };

  if (isFetching)
    return (
      <p className="animate-pulse text-gray-500">Memuat referensi data...</p>
    );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* KOTAK PESAN ERROR VALIDASI */}
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* 1. INFORMASI PEKERJAAN */}
      <div className="bg-white rounded-xl shadow-sm border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">
            Pilih Template Pekerjaan *
          </label>
          <select
            name="pekerjaanId"
            value={formData.pekerjaanId}
            onChange={(e) => handleJobChange(e.target.value)}
            className="w-full border rounded-lg p-3 bg-blue-50/30 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="" disabled>
              -- Pilih Template Pekerjaan --
            </option>
            {jobTemplates.map((job) => (
              <option key={job._id} value={job._id}>
                {job.kodePekerjaan} - {job.namaPekerjaan}
              </option>
            ))}
          </select>

          {formData.pekerjaanId && (
            <div className="mt-4 bg-gray-50 rounded-xl border border-gray-200 p-6 animate-in fade-in duration-300 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-200 pb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                Isi Dokumen Work Permit (Template)
              </h3>

              <div className="space-y-5">
                {/* Klasifikasi Pekerjaan */}
                <div className="relative pl-4 border-l-4 border-indigo-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Klasifikasi Pekerjaan
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-r-lg p-3.5 text-sm text-gray-700 whitespace-pre-wrap shadow-sm min-h-[4rem]">
                    {formData.wpKlasifikasi || (
                      <span className="text-gray-400 italic">
                        Tidak ada data klasifikasi...
                      </span>
                    )}
                  </div>
                </div>

                {/* Prosedur Pekerjaan */}
                <div className="relative pl-4 border-l-4 border-sky-500">
                  <div className="flex items-center gap-2 mb-2">
                    <ScrollText className="w-4 h-4 text-sky-500" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Prosedur Pekerjaan
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-r-lg p-3.5 text-sm text-gray-700 whitespace-pre-wrap shadow-sm min-h-[4rem]">
                    {formData.wpProsedur || (
                      <span className="text-gray-400 italic">
                        Tidak ada data prosedur...
                      </span>
                    )}
                  </div>
                </div>

                {/* Lampiran */}
                <div className="relative pl-4 border-l-4 border-slate-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Paperclip className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Lampiran
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-r-lg p-3.5 text-sm text-gray-700 whitespace-pre-wrap shadow-sm min-h-[4rem]">
                    {formData.wpLampiran || (
                      <span className="text-gray-400 italic">
                        Tidak ada data lampiran...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">
            Lokasi Aktual Pekerjaan *
          </label>
          <input
            type="text"
            name="lokasi"
            value={formData.lokasi}
            onChange={handleChange}
            placeholder="Contoh: Area Workshop Utama"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 2. JADWAL */}
      <div className="bg-white rounded-xl shadow-sm border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Tanggal & Jam Mulai *
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              name="tanggalMulai"
              value={formData.tanggalMulai}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="time"
              name="waktuMulai"
              value={formData.waktuMulai}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">
            Tanggal & Jam Selesai *
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              name="tanggalSelesai"
              value={formData.tanggalSelesai}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="time"
              name="waktuSelesai"
              value={formData.waktuSelesai}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. PERSONEL */}
      <div className="bg-white rounded-xl shadow-sm border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            PJ Teknik *
          </label>
          <select
            name="pjTeknik"
            value={formData.pjTeknik}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mb-2 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="">-- Pilih PJ Teknik --</option>
            {pjTeknikOptions.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nama}
              </option>
            ))}
          </select>
          <input
            type="tel"
            name="noTelpPjTeknik"
            value={formData.noTelpPjTeknik}
            onChange={handleChange}
            placeholder="No. Telp PJ Teknik"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">
            Tenaga Ahli K3 *
          </label>
          <select
            name="tenagaAhliK3"
            value={formData.tenagaAhliK3}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mb-2 focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">-- Pilih Ahli K3 --</option>
            {ahliK3Options.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nama}
              </option>
            ))}
          </select>
          <input
            type="tel"
            name="noTelpTenagaAhliK3"
            value={formData.noTelpTenagaAhliK3}
            onChange={handleChange}
            placeholder="No. Telp Ahli K3"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>

      {/* NAVIGASI BAWAH (Sudah diganti dari router.push biasa ke fungsi validasi) */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          Lanjut ke JSA <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
