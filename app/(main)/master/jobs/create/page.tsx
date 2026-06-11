"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Plus, Trash2 } from "lucide-react"; // Tambahkan ikon Info

const TABS = [
  { id: "info", label: "1. Info Utama" },
  { id: "wp", label: "2. Work Permit" },
  { id: "jsa", label: "3. JSA" },
  { id: "hirarc", label: "4. HIRARC" },
  { id: "sop", label: "5. SOP" },
  { id: "ik", label: "6. Instruksi Kerja" },
];

export default function CreateJobTemplatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [activeTab, setActiveTab] = useState(TABS[0].id);

  // --- STATE DATA ---
  const [kodePekerjaan, setKodePekerjaan] = useState("");
  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [status, setStatus] = useState("active");

  const [wpKlasifikasi, setWpKlasifikasi] = useState("");
  const [wpProsedur, setWpProsedur] = useState("");
  const [wpLampiran, setWpLampiran] = useState("");

  const [jsaLangkah, setJsaLangkah] = useState("");
  const [jsaBahaya, setJsaBahaya] = useState("");
  const [jsaPengendalian, setJsaPengendalian] = useState("");

  const [hirarcList, setHirarcList] = useState([
    {
      potensi: "",
      resiko: "",
      pengendalian: "",
      penanggungJawab: "",
      keparahan: "",
      kemungkinan: "",
      tingkat: "",
      keparahanSetelah: "",
      kemungkinanSetelah: "",
      tingkatSetelah: "",
      statusPengendalian: "",
    },
  ]);

  const [sopPerlengkapan, setSopPerlengkapan] = useState("");
  const [sopAlatUkur, setSopAlatUkur] = useState("");
  const [sopAlatKerja, setSopAlatKerja] = useState("");
  const [sopUraian, setSopUraian] = useState("");

  const [ikPerlengkapan, setIkPerlengkapan] = useState("");
  const [ikAlatUkur, setIkAlatUkur] = useState("");
  const [ikAlatKerja, setIkAlatKerja] = useState("");
  const [ikUraian, setIkUraian] = useState("");

  const textToArray = (text: string) => {
    return text
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  // Fungsi untuk update salah satu field di dalam array
  const handleHirarcChange = (index: number, field: string, value: string) => {
    const newList = [...hirarcList];
    newList[index] = { ...newList[index], [field]: value };
    setHirarcList(newList);
  };

  // Fungsi tambah baris potensi bahaya baru
  const addHirarcItem = () => {
    setHirarcList([
      ...hirarcList,
      {
        potensi: "",
        resiko: "",
        pengendalian: "",
        penanggungJawab: "",
        keparahan: "",
        kemungkinan: "",
        tingkat: "",
        keparahanSetelah: "",
        kemungkinanSetelah: "",
        tingkatSetelah: "",
        statusPengendalian: "",
      },
    ]);
  };

  // Fungsi hapus baris
  const removeHirarcItem = (index: number) => {
    const newList = hirarcList.filter((_, i) => i !== index);
    setHirarcList(newList);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      if ((e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault();
      }
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
        potensiBahaya: hirarcList.map((h) => h.potensi),
        resiko: hirarcList.map((h) => h.resiko),
        pengendalian: hirarcList.map((h) => h.pengendalian),
        penanggungJawab: hirarcList.map((h) => h.penanggungJawab),
        konsekuensiKeparahan: hirarcList.map((h) => h.keparahan),
        kemungkinanTerjadi: hirarcList.map((h) => h.kemungkinan),
        tingkatResiko: hirarcList.map((h) => h.tingkat),
        konsekuensiSetelahPengendalian: hirarcList.map(
          (h) => h.keparahanSetelah,
        ),
        kemungkinanTerjadiSetelahPengendalian: hirarcList.map(
          (h) => h.kemungkinanSetelah,
        ),
        tingkatResikoSetelahPengendalian: hirarcList.map(
          (h) => h.tingkatSetelah,
        ),
        // Gabungkan dengan koma jika di schema database statusPengendalian bukan berupa Array
        statusPengendalian: hirarcList
          .map((h) => h.statusPengendalian)
          .join(", "),
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
      const res = await fetch("/api/job-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan data");

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

  // Komponen Helper Text untuk digunakan berulang di tiap tab
  const SmartFormatHelper = () => (
    <div className="mb-5 bg-blue-50/80 border border-blue-200 rounded-lg p-4 flex gap-3 text-sm text-blue-900 shadow-sm animate-in fade-in">
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold mb-1 uppercase tracking-wide text-xs text-blue-700">
          Panduan Penulisan Cerdas
        </p>
        <p>
          Sistem ini akan merapikan teks Anda secara otomatis di dokumen Izin
          Kerja:
        </p>
        <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-800">
          <li>
            Awali baris dengan angka (contoh:{" "}
            <strong>1. Safety Briefing</strong>) untuk menjadikannya{" "}
            <strong>Sub-Judul</strong> tebal.
          </li>
          <li>
            Ketik baris biasa di bawahnya, sistem akan mengubahnya menjadi
            daftar titik (bullet).
          </li>
          <li>
            Gunakan tombol <strong>Enter</strong> untuk berpindah baris.
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Buat Master Pekerjaan K3
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Lengkapi template dokumen langkah demi langkah.
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
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: WP-001"
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
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Pengelasan Pipa"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORK PERMIT */}
          {activeTab === "wp" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold mb-4">Template Work Permit</h2>
              <SmartFormatHelper />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Klasifikasi Pekerjaan
                  </label>
                  <textarea
                    rows={4}
                    value={wpKlasifikasi}
                    onChange={(e) => setWpKlasifikasi(e.target.value)}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="1. Pekerjaan Panas&#10;Melibatkan mesin las&#10;2. Pekerjaan Ketinggian"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prosedur Pekerjaan
                  </label>
                  <textarea
                    rows={4}
                    value={wpProsedur}
                    onChange={(e) => setWpProsedur(e.target.value)}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Isi prosedur..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lampiran Tambahan
                  </label>
                  <textarea
                    rows={3}
                    value={wpLampiran}
                    onChange={(e) => setWpLampiran(e.target.value)}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Sertifikat Welder&#10;Foto Area"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JSA */}
          {activeTab === "jsa" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold mb-4">
                Template Job Safety Analysis (JSA)
              </h2>
              <SmartFormatHelper />

              <div className="grid grid-cols-1 gap-8">
                {/* FIELD: LANGKAH KERJA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Langkah Kerja{" "}
                      <span className="text-xs font-normal text-gray-400">
                        (Input Editor)
                      </span>
                    </label>
                    <textarea
                      rows={5}
                      value={jsaLangkah}
                      onChange={(e) => setJsaLangkah(e.target.value)}
                      className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="1. Persiapan&#10;Mengecek APD&#10;2. Eksekusi"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Pratinjau Hasil{" "}
                      <span className="text-xs font-normal text-blue-500">
                        (Otomatis Bold & Bullet)
                      </span>
                    </label>
                    <div className="w-full h-[132px] overflow-y-auto border border-dashed border-gray-300 bg-gray-50 rounded-md p-3 text-sm">
                      {!jsaLangkah ? (
                        <span className="text-gray-400 italic text-xs">
                          Mulai mengetik untuk melihat hasil...
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {jsaLangkah.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            // Jika diawali angka dan titik (cth: "1. ") -> BOLD
                            if (/^\d+\./.test(trimmed)) {
                              return (
                                <div
                                  key={idx}
                                  className="font-bold text-gray-900 mt-3 mb-1"
                                >
                                  {trimmed}
                                </div>
                              );
                            }
                            // Jika bukan, jadikan bullet
                            return (
                              <div
                                key={idx}
                                className="text-gray-700 ml-3 flex gap-2 items-start"
                              >
                                <span className="text-blue-500 font-bold mt-0.5">
                                  •
                                </span>
                                <span>{trimmed.replace(/^- /, "")}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* FIELD: BAHAYA & RESIKO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Bahaya & Resiko{" "}
                      <span className="text-xs font-normal text-gray-400">
                        (Input Editor)
                      </span>
                    </label>
                    <textarea
                      rows={5}
                      value={jsaBahaya}
                      onChange={(e) => setJsaBahaya(e.target.value)}
                      className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Pratinjau Hasil
                    </label>
                    <div className="w-full h-[132px] overflow-y-auto border border-dashed border-gray-300 bg-gray-50 rounded-md p-3 text-sm">
                      {!jsaBahaya ? (
                        <span className="text-gray-400 italic text-xs">
                          Mulai mengetik untuk melihat hasil...
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {jsaBahaya.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            if (/^\d+\./.test(trimmed)) {
                              return (
                                <div
                                  key={idx}
                                  className="font-bold text-gray-900 mt-3 mb-1"
                                >
                                  {trimmed}
                                </div>
                              );
                            }
                            return (
                              <div
                                key={idx}
                                className="text-gray-700 ml-3 flex gap-2 items-start"
                              >
                                <span className="text-blue-500 font-bold mt-0.5">
                                  •
                                </span>
                                <span>{trimmed.replace(/^- /, "")}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* FIELD: PENGENDALIAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Pengendalian{" "}
                      <span className="text-xs font-normal text-gray-400">
                        (Input Editor)
                      </span>
                    </label>
                    <textarea
                      rows={5}
                      value={jsaPengendalian}
                      onChange={(e) => setJsaPengendalian(e.target.value)}
                      className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Pratinjau Hasil
                    </label>
                    <div className="w-full h-[132px] overflow-y-auto border border-dashed border-gray-300 bg-gray-50 rounded-md p-3 text-sm">
                      {!jsaPengendalian ? (
                        <span className="text-gray-400 italic text-xs">
                          Mulai mengetik untuk melihat hasil...
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {jsaPengendalian.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            if (/^\d+\./.test(trimmed)) {
                              return (
                                <div
                                  key={idx}
                                  className="font-bold text-gray-900 mt-3 mb-1"
                                >
                                  {trimmed}
                                </div>
                              );
                            }
                            return (
                              <div
                                key={idx}
                                className="text-gray-700 ml-3 flex gap-2 items-start"
                              >
                                <span className="text-blue-500 font-bold mt-0.5">
                                  •
                                </span>
                                <span>{trimmed.replace(/^- /, "")}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HIRARC */}
          {activeTab === "hirarc" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Template HIRARC</h2>
                <button
                  type="button"
                  onClick={addHirarcItem}
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah Potensi Bahaya
                </button>
              </div>

              {/* Looping Form HIRARC */}
              <div className="space-y-6">
                {hirarcList.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative shadow-sm"
                  >
                    {/* Header Item & Tombol Hapus */}
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        Identifikasi Bahaya ke-{index + 1}
                      </h3>
                      {hirarcList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHirarcItem(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold"
                        >
                          <Trash2 className="w-4 h-4" /> Hapus
                        </button>
                      )}
                    </div>

                    {/* Baris 1: Bahaya, Resiko, Pengendalian */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Potensi Bahaya
                        </label>
                        <textarea
                          rows={2}
                          value={item.potensi}
                          onChange={(e) =>
                            handleHirarcChange(index, "potensi", e.target.value)
                          }
                          className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          placeholder="Cth: Bekerja dalam bertegangan"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Resiko
                        </label>
                        <textarea
                          rows={2}
                          value={item.resiko}
                          onChange={(e) =>
                            handleHirarcChange(index, "resiko", e.target.value)
                          }
                          className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          placeholder="Cth: Tersengat listrik, kematian"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Tindakan Pengendalian
                        </label>
                        <textarea
                          rows={2}
                          value={item.pengendalian}
                          onChange={(e) =>
                            handleHirarcChange(
                              index,
                              "pengendalian",
                              e.target.value,
                            )
                          }
                          className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          placeholder="Cth: LOTO, APD Lengkap"
                        ></textarea>
                      </div>
                    </div>

                    {/* Baris 2: Skor Awal, Skor Setelah */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border rounded-lg p-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                          Skor Penilaian Awal
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.keparahan}
                            onChange={(e) =>
                              handleHirarcChange(
                                index,
                                "keparahan",
                                e.target.value,
                              )
                            }
                            placeholder="Keparahan"
                            className="w-1/3 border rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            value={item.kemungkinan}
                            onChange={(e) =>
                              handleHirarcChange(
                                index,
                                "kemungkinan",
                                e.target.value,
                              )
                            }
                            placeholder="Kemungkinan"
                            className="w-1/3 border rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            value={item.tingkat}
                            onChange={(e) =>
                              handleHirarcChange(
                                index,
                                "tingkat",
                                e.target.value,
                              )
                            }
                            placeholder="Tingkat (H/M/L)"
                            className="w-1/3 border rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-red-50 text-red-700 font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <span className="text-[10px] font-bold text-green-700 uppercase mb-2 block">
                          Skor Setelah Pengendalian
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.keparahanSetelah}
                            onChange={(e) =>
                              handleHirarcChange(
                                index,
                                "keparahanSetelah",
                                e.target.value,
                              )
                            }
                            placeholder="Keparahan"
                            className="w-1/3 border rounded p-2 text-xs focus:ring-2 focus:ring-green-500 outline-none"
                          />
                          <input
                            type="text"
                            value={item.kemungkinanSetelah}
                            onChange={(e) =>
                              handleHirarcChange(
                                index,
                                "kemungkinanSetelah",
                                e.target.value,
                              )
                            }
                            placeholder="Kemungkinan"
                            className="w-1/3 border rounded p-2 text-xs focus:ring-2 focus:ring-green-500 outline-none"
                          />
                          <input
                            type="text"
                            value={item.tingkatSetelah}
                            onChange={(e) =>
                              handleHirarcChange(
                                index,
                                "tingkatSetelah",
                                e.target.value,
                              )
                            }
                            placeholder="Tingkat (H/M/L)"
                            className="w-1/3 border border-green-300 rounded p-2 text-xs focus:ring-2 focus:ring-green-500 outline-none bg-green-100 text-green-800 font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-white border rounded-lg p-3 flex gap-2">
                        <div className="w-1/2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                            P. Jawab
                          </span>
                          <input
                            type="text"
                            value={item.penanggungJawab}
                            onChange={(e) =>
                              handleHirarcChange(
                                index,
                                "penanggungJawab",
                                e.target.value,
                              )
                            }
                            placeholder="Nama PIC"
                            className="w-full border rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div className="w-1/2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                            Status
                          </span>
                          <input
                            type="text"
                            value={item.statusPengendalian}
                            onChange={(e) =>
                              handleHirarcChange(
                                index,
                                "statusPengendalian",
                                e.target.value,
                              )
                            }
                            placeholder="Open / Closed"
                            className="w-full border rounded p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SOP */}
          {activeTab === "sop" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold">
                  Template Standard Operating Procedure (SOP)
                </h2>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Data yang diisi di sini akan otomatis menyalin ke IK
                </span>
              </div>
              <SmartFormatHelper />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perlengkapan Kerja
                  </label>
                  <textarea
                    rows={4}
                    value={sopPerlengkapan}
                    onChange={(e) => {
                      setSopPerlengkapan(e.target.value);
                      setIkPerlengkapan(e.target.value); // <--- Auto-fill ke IK
                    }}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peralatan Ukur
                  </label>
                  <textarea
                    rows={4}
                    value={sopAlatUkur}
                    onChange={(e) => {
                      setSopAlatUkur(e.target.value);
                      setIkAlatUkur(e.target.value); // <--- Auto-fill ke IK
                    }}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peralatan Kerja
                  </label>
                  <textarea
                    rows={4}
                    value={sopAlatKerja}
                    onChange={(e) => {
                      setSopAlatKerja(e.target.value);
                      setIkAlatKerja(e.target.value); // <--- Auto-fill ke IK
                    }}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uraian Kegiatan
                  </label>
                  <textarea
                    rows={4}
                    value={sopUraian}
                    onChange={(e) => {
                      setSopUraian(e.target.value);
                      setIkUraian(e.target.value); // <--- Auto-fill ke IK
                    }}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: IK */}
          {activeTab === "ik" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold">
                  Template Instruksi Kerja (IK)
                </h2>
                {/* Tombol manual jika user terlanjur menghapus IK dan ingin mengembalikan dari SOP */}
                <button
                  type="button"
                  onClick={() => {
                    setIkPerlengkapan(sopPerlengkapan);
                    setIkAlatUkur(sopAlatUkur);
                    setIkAlatKerja(sopAlatKerja);
                    setIkUraian(sopUraian);
                  }}
                  className="text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded border border-gray-300 transition-colors"
                >
                  ↻ Salin Ulang dari SOP
                </button>
              </div>
              <SmartFormatHelper />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perlengkapan Kerja
                  </label>
                  <textarea
                    rows={4}
                    value={ikPerlengkapan}
                    onChange={(e) => setIkPerlengkapan(e.target.value)}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peralatan Ukur
                  </label>
                  <textarea
                    rows={4}
                    value={ikAlatUkur}
                    onChange={(e) => setIkAlatUkur(e.target.value)}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peralatan Kerja
                  </label>
                  <textarea
                    rows={4}
                    value={ikAlatKerja}
                    onChange={(e) => setIkAlatKerja(e.target.value)}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uraian Kegiatan
                  </label>
                  <textarea
                    rows={4}
                    value={ikUraian}
                    onChange={(e) => setIkUraian(e.target.value)}
                    className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition font-medium"
              >
                {isLoading ? "Menyimpan..." : "Simpan Template K3"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
