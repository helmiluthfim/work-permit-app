"use client";

import { useState, useEffect, use } from "react"; // 1. Impor 'use' dari react jika pakai Next.js 15
import { useRouter } from "next/navigation";

const TABS = [
  { id: "info", label: "1. Info Utama" },
  { id: "wp", label: "2. Work Permit" },
  { id: "jsa", label: "3. JSA" },
  { id: "hirarc", label: "4. HIRARC" },
  { id: "sop", label: "5. SOP" },
  { id: "ik", label: "6. Instruksi Kerja" },
];

export default function EditJobTemplatePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }; // Mendukung Next.js 14 & 15
}) {
  const router = useRouter();

  // 2. Trik AMAN: Deteksi apakah params berbentuk Promise (Next.js 15) atau Objek biasa (Next.js 14)
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const id = resolvedParams?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  // --- STATE DATA ---
  const [kodePekerjaan, setKodePekerjaan] = useState("");
  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [status, setStatus] = useState("active");
  // ... (Sisa semua state data kamu ke bawah biarkan tetap sama) ...
  const [wpKlasifikasi, setWpKlasifikasi] = useState("");
  const [wpProsedur, setWpProsedur] = useState("");
  const [wpLampiran, setWpLampiran] = useState("");
  const [jsaLangkah, setJsaLangkah] = useState("");
  const [jsaBahaya, setJsaBahaya] = useState("");
  const [jsaPengendalian, setJsaPengendalian] = useState("");
  const [hirarcPotensi, setHirarcPotensi] = useState("");
  const [hirarcResiko, setHirarcResiko] = useState("");
  const [hirarcKeparahan, setHirarcKeparahan] = useState("");
  const [hirarcKemungkinan, setHirarcKemungkinan] = useState("");
  const [hirarcTingkat, setHirarcTingkat] = useState("");
  const [hirarcPengendalian, setHirarcPengendalian] = useState("");
  const [hirarcKeparahanSetelah, setHirarcKeparahanSetelah] = useState("");
  const [hirarcKemungkinanSetelah, setHirarcKemungkinanSetelah] = useState("");
  const [hirarcTingkatSetelah, setHirarcTingkatSetelah] = useState("");
  const [hirarcStatusPengendalian, setHirarcStatusPengendalian] = useState("");
  const [hirarcPenanggungJawab, setHirarcPenanggungJawab] = useState("");
  const [sopPerlengkapan, setSopPerlengkapan] = useState("");
  const [sopAlatUkur, setSopAlatUkur] = useState("");
  const [sopAlatKerja, setSopAlatKerja] = useState("");
  const [sopUraian, setSopUraian] = useState("");
  const [ikPerlengkapan, setIkPerlengkapan] = useState("");
  const [ikAlatUkur, setIkAlatUkur] = useState("");
  const [ikAlatKerja, setIkAlatKerja] = useState("");
  const [ikUraian, setIkUraian] = useState("");

  const textToArray = (text: string) =>
    text
      .split("\n")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
  const arrayToText = (arr?: string[]) =>
    !arr || !Array.isArray(arr) ? "" : arr.join("\n");

  // ========================================================
  // PERBAIKAN UTAMA: Perubahan struktur Fetching di useEffect
  // ========================================================
  useEffect(() => {
    // Jika id dari Next.js router belum siap/terbaca, tahan dulu jangan fetch apa-apa
    if (!id) return;

    const fetchJobTemplate = async () => {
      try {
        setIsFetching(true); // Pastikan status loading aktif saat fetch dimulai
        const res = await fetch(`/api/job-templates/${id}`);

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.message || "Gagal mengambil data dari server");
        }

        const result = await res.json();
        const data = result.data;

        // Set semua state dari database
        setKodePekerjaan(data.kodePekerjaan || "");
        setNamaPekerjaan(data.namaPekerjaan || "");
        setStatus(data.status || "active");

        if (data.workPermitTemplate) {
          setWpKlasifikasi(
            arrayToText(data.workPermitTemplate.klasifikasiPekerjaan),
          );
          setWpProsedur(arrayToText(data.workPermitTemplate.prosedurPekerjaan));
          setWpLampiran(arrayToText(data.workPermitTemplate.lampiran));
        }
        if (data.jsaTemplate) {
          setJsaLangkah(arrayToText(data.jsaTemplate.langkahKerja));
          setJsaBahaya(arrayToText(data.jsaTemplate.bahayaResiko));
          setJsaPengendalian(arrayToText(data.jsaTemplate.pengendalian));
        }
        if (data.hirarcTemplate) {
          setHirarcPotensi(arrayToText(data.hirarcTemplate.potensiBahaya));
          setHirarcResiko(arrayToText(data.hirarcTemplate.resiko));
          setHirarcKeparahan(
            arrayToText(data.hirarcTemplate.konsekuensiKeparahan),
          );
          setHirarcKemungkinan(
            arrayToText(data.hirarcTemplate.kemungkinanTerjadi),
          );
          setHirarcTingkat(arrayToText(data.hirarcTemplate.tingkatResiko));
          setHirarcPengendalian(arrayToText(data.hirarcTemplate.pengendalian));
          setHirarcKeparahanSetelah(
            arrayToText(data.hirarcTemplate.konsekuensiSetelahPengendalian),
          );
          setHirarcKemungkinanSetelah(
            arrayToText(
              data.hirarcTemplate.kemungkinanTerjadiSetelahPengendalian,
            ),
          );
          setHirarcTingkatSetelah(
            arrayToText(data.hirarcTemplate.tingkatResikoSetelahPengendalian),
          );
          setHirarcStatusPengendalian(
            data.hirarcTemplate.statusPengendalian || "",
          );
          setHirarcPenanggungJawab(
            arrayToText(data.hirarcTemplate.penanggungJawab),
          );
        }
        if (data.sopTemplate) {
          setSopPerlengkapan(arrayToText(data.sopTemplate.perlengkapanKerja));
          setSopAlatUkur(arrayToText(data.sopTemplate.peralatanUkur));
          setSopAlatKerja(arrayToText(data.sopTemplate.peralatanKerja));
          setSopUraian(arrayToText(data.sopTemplate.uraianKegiatan));
        }
        if (data.ikTemplate) {
          setIkPerlengkapan(arrayToText(data.ikTemplate.perlengkapanKerja));
          setIkAlatUkur(arrayToText(data.ikTemplate.peralatanUkur));
          setIkAlatKerja(arrayToText(data.ikTemplate.peralatanKerja));
          setIkUraian(arrayToText(data.ikTemplate.uraianKegiatan));
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setErrorMsg(err.message);
      } finally {
        // PENTING: ini akan dipanggil baik sukses maupun gagal,
        // sehingga menjamin loading screen akan tertutup dan memunculkan pesan error jika gagal.
        setIsFetching(false);
      }
    };

    fetchJobTemplate();
  }, [id]); // useEffect hanya akan memicu ulang jika id berubah

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const payload = {
      kodePekerjaan,
      namaPekerjaan,
      status,
      workPermitTemplate: {
        klasifikasiPekerjaan: textToArray(wpKlasifikasi),
        prosedurPekerjaan: textToArray(wpProsedur),
        lampiran: textToArray(wpLampiran),
      },
      jsaTemplate: {
        langkahKerja: textToArray(jsaLangkah),
        bahayaResiko: textToArray(jsaBahaya),
        pengendalian: textToArray(jsaPengendalian),
      },
      hirarcTemplate: {
        potensiBahaya: textToArray(hirarcPotensi),
        resiko: textToArray(hirarcResiko),
        konsekuensiKeparahan: textToArray(hirarcKeparahan),
        kemungkinanTerjadi: textToArray(hirarcKemungkinan),
        tingkatResiko: textToArray(hirarcTingkat),
        pengendalian: textToArray(hirarcPengendalian),
        konsekuensiSetelahPengendalian: textToArray(hirarcKeparahanSetelah),
        kemungkinanTerjadiSetelahPengendalian: textToArray(
          hirarcKemungkinanSetelah,
        ),
        tingkatResikoSetelahPengendalian: textToArray(hirarcTingkatSetelah),
        statusPengendalian: hirarcStatusPengendalian,
        penanggungJawab: textToArray(hirarcPenanggungJawab),
      },
      sopTemplate: {
        perlengkapanKerja: textToArray(sopPerlengkapan),
        peralatanUkur: textToArray(sopAlatUkur),
        peralatanKerja: textToArray(sopAlatKerja),
        uraianKegiatan: textToArray(sopUraian),
      },
      ikTemplate: {
        perlengkapanKerja: textToArray(ikPerlengkapan),
        peralatanUkur: textToArray(ikAlatUkur),
        peralatanKerja: textToArray(ikAlatKerja),
        uraianKegiatan: textToArray(ikUraian),
      },
    };

    try {
      // PERBEDAAN DI SINI: Gunakan PUT untuk Update ke endpoint spesifik ID
      const res = await fetch(`/api/job-templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui data");

      router.push("/master/jobs");
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentIndex = TABS.findIndex((t) => t.id === activeTab);
  const handleNext = () => {
    if (currentIndex < TABS.length - 1) setActiveTab(TABS[currentIndex + 1].id);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1].id);
  };

  if (isFetching) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <p className="text-gray-500">Memuat data template...</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Master Pekerjaan K3
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Perbarui template dokumen K3 untuk {kodePekerjaan}.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-50 transition"
        >
          Batal & Kembali
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errorMsg}
        </div>
      )}

      {/* NAVIGASI TAB MENU */}
      <div className="flex overflow-x-auto border-b mb-6 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-6 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="bg-white p-6 rounded-lg border shadow-sm min-h-[400px] flex flex-col justify-between"
      >
        <div className="mb-8">
          {/* TAB 1: INFO UTAMA */}
          {activeTab === "info" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold mb-4">
                Informasi Utama Pekerjaan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pekerjaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={kodePekerjaan}
                    onChange={(e) => setKodePekerjaan(e.target.value)}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pekerjaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaPekerjaan}
                    onChange={(e) => setNamaPekerjaan(e.target.value)}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full md:w-1/2 border rounded-md p-2"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORK PERMIT */}
          {activeTab === "wp" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold mb-4">Template Work Permit</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Klasifikasi Pekerjaan
                  </label>
                  <textarea
                    rows={3}
                    value={wpKlasifikasi}
                    onChange={(e) => setWpKlasifikasi(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prosedur Pekerjaan
                  </label>
                  <textarea
                    rows={3}
                    value={wpProsedur}
                    onChange={(e) => setWpProsedur(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lampiran
                  </label>
                  <textarea
                    rows={2}
                    value={wpLampiran}
                    onChange={(e) => setWpLampiran(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JSA */}
          {activeTab === "jsa" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold mb-4">Template JSA</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Langkah Kerja
                  </label>
                  <textarea
                    rows={3}
                    value={jsaLangkah}
                    onChange={(e) => setJsaLangkah(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bahaya & Resiko
                  </label>
                  <textarea
                    rows={3}
                    value={jsaBahaya}
                    onChange={(e) => setJsaBahaya(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pengendalian
                  </label>
                  <textarea
                    rows={3}
                    value={jsaPengendalian}
                    onChange={(e) => setJsaPengendalian(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HIRARC */}
          {activeTab === "hirarc" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold mb-4">Template HIRARC</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Potensi Bahaya
                    </label>
                    <textarea
                      rows={2}
                      value={hirarcPotensi}
                      onChange={(e) => setHirarcPotensi(e.target.value)}
                      className="w-full border rounded-md p-2 text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resiko
                    </label>
                    <textarea
                      rows={2}
                      value={hirarcResiko}
                      onChange={(e) => setHirarcResiko(e.target.value)}
                      className="w-full border rounded-md p-2 text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pengendalian
                    </label>
                    <textarea
                      rows={2}
                      value={hirarcPengendalian}
                      onChange={(e) => setHirarcPengendalian(e.target.value)}
                      className="w-full border rounded-md p-2 text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penanggung Jawab
                    </label>
                    <textarea
                      rows={2}
                      value={hirarcPenanggungJawab}
                      onChange={(e) => setHirarcPenanggungJawab(e.target.value)}
                      className="w-full border rounded-md p-2 text-sm"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <span className="text-xs font-bold text-gray-600 uppercase mb-2 block">
                      Skor Awal
                    </span>
                    <input
                      type="text"
                      value={hirarcKeparahan}
                      onChange={(e) => setHirarcKeparahan(e.target.value)}
                      placeholder="Nilai Keparahan"
                      className="w-full mb-2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      value={hirarcKemungkinan}
                      onChange={(e) => setHirarcKemungkinan(e.target.value)}
                      placeholder="Nilai Kemungkinan"
                      className="w-full mb-2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      value={hirarcTingkat}
                      onChange={(e) => setHirarcTingkat(e.target.value)}
                      placeholder="Tingkat Resiko (Tinggi/Sedang/Rendah)"
                      className="w-full border rounded p-2 text-sm"
                    />
                  </div>
                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <span className="text-xs font-bold text-green-700 uppercase mb-2 block">
                      Skor Setelah Pengendalian
                    </span>
                    <input
                      type="text"
                      value={hirarcKeparahanSetelah}
                      onChange={(e) =>
                        setHirarcKeparahanSetelah(e.target.value)
                      }
                      placeholder="Nilai Keparahan"
                      className="w-full mb-2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      value={hirarcKemungkinanSetelah}
                      onChange={(e) =>
                        setHirarcKemungkinanSetelah(e.target.value)
                      }
                      placeholder="Nilai Kemungkinan"
                      className="w-full mb-2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      value={hirarcTingkatSetelah}
                      onChange={(e) => setHirarcTingkatSetelah(e.target.value)}
                      placeholder="Tingkat Resiko Baru"
                      className="w-full border rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Pengendalian
                    </label>
                    <input
                      type="text"
                      value={hirarcStatusPengendalian}
                      onChange={(e) =>
                        setHirarcStatusPengendalian(e.target.value)
                      }
                      className="w-full border rounded p-2 text-sm"
                      placeholder="Open / Closed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SOP */}
          {activeTab === "sop" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold mb-4">Template SOP</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perlengkapan Kerja
                  </label>
                  <textarea
                    rows={3}
                    value={sopPerlengkapan}
                    onChange={(e) => setSopPerlengkapan(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peralatan Ukur
                  </label>
                  <textarea
                    rows={3}
                    value={sopAlatUkur}
                    onChange={(e) => setSopAlatUkur(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peralatan Kerja
                  </label>
                  <textarea
                    rows={3}
                    value={sopAlatKerja}
                    onChange={(e) => setSopAlatKerja(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uraian Kegiatan
                  </label>
                  <textarea
                    rows={3}
                    value={sopUraian}
                    onChange={(e) => setSopUraian(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: IK */}
          {activeTab === "ik" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold mb-4">
                Template Instruksi Kerja (IK)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perlengkapan Kerja
                  </label>
                  <textarea
                    rows={3}
                    value={ikPerlengkapan}
                    onChange={(e) => setIkPerlengkapan(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peralatan Ukur
                  </label>
                  <textarea
                    rows={3}
                    value={ikAlatUkur}
                    onChange={(e) => setIkAlatUkur(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peralatan Kerja
                  </label>
                  <textarea
                    rows={3}
                    value={ikAlatKerja}
                    onChange={(e) => setIkAlatKerja(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uraian Kegiatan
                  </label>
                  <textarea
                    rows={3}
                    value={ikUraian}
                    onChange={(e) => setIkUraian(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TOMBOL NAVIGASI BAWAH */}
        <div className="flex justify-between items-center border-t pt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-2 border rounded-md text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            ← Sebelumnya
          </button>

          <div className="flex gap-2">
            {currentIndex < TABS.length - 1 && (
              <button
                key="btn-lanjut"
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
              >
                Lanjut →
              </button>
            )}

            {currentIndex === TABS.length - 1 && (
              <button
                key="btn-simpan"
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-yellow-300 transition font-medium"
              >
                {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan K3"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
