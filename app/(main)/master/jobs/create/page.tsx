"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Info,
  Plus,
  Trash2,
  FileText,
  ShieldAlert,
  Activity,
  ClipboardList,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Save,
  Lightbulb,
} from "lucide-react";

const TABS = [
  { id: "info", label: "Info Utama", icon: Briefcase, desc: "Kode & Nama" },
  { id: "wp", label: "Work Permit", icon: FileText, desc: "Template WP" },
  { id: "jsa", label: "JSA", icon: ShieldAlert, desc: "Analisis Bahaya" },
  { id: "hirarc", label: "HIRARC", icon: Activity, desc: "Penilaian Risiko" },
  { id: "sop", label: "SOP", icon: ClipboardList, desc: "Prosedur Kerja" },
  {
    id: "ik",
    label: "Instruksi Kerja",
    icon: BookOpen,
    desc: "Panduan Teknis",
  },
];

// ─── Shared field components ─────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-[#0F1F3D] placeholder-slate-400 outline-none transition focus:border-[#0F1F3D] focus:bg-white focus:ring-2 focus:ring-[#0F1F3D]/10";

const textareaClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-[#0F1F3D] placeholder-slate-400 outline-none transition focus:border-[#0F1F3D] focus:bg-white focus:ring-2 focus:ring-[#0F1F3D]/10 resize-none";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
      {children}
    </label>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-[#0F1F3D]/[0.03] px-6 py-3.5">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1F3D]">
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function CreateJobTemplatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const [kodePekerjaan, setKodePekerjaan] = useState("");
  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [status, setStatus] = useState("active");
  const [wpKlasifikasi, setWpKlasifikasi] = useState("");
  const [wpProsedur, setWpProsedur] = useState("");
  const [wpLampiran, setWpLampiran] = useState("");

  // ─── STATE JSA MULTI-SECTION (Judul & Items) ───
  const [jsaData, setJsaData] = useState([
    {
      judul: "",
      langkahKerja: "",
      bahayaResiko: "",
      pengendalian: "",
    },
  ]);

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

  // Ganti state awal SOP
  const [sopData, setSopData] = useState([
    {
      perlengkapanKerja: "",
      peralatanUkur: "",
      peralatanKerja: "",
      uraianKegiatan: [{ judul: "", isi: "" }], // ← array of objects
    },
  ]);

  const [ikData, setIkData] = useState([
    {
      perlengkapanKerja: "",
      peralatanUkur: "",
      peralatanKerja: "",
      uraianKegiatan: [{ judul: "", isi: "" }], // ← array of objects
    },
  ]);

  const updateSopField = (i: number, field: string, val: string) => {
    const n = [...sopData];
    n[i] = { ...n[i], [field]: val };
    setSopData(n);
  };

  const addSopUraian = (sopIdx: number) => {
    const n = [...sopData];
    n[sopIdx].uraianKegiatan.push({ judul: "", isi: "" });
    setSopData(n);
  };

  const removeSopUraian = (sopIdx: number, uraianIdx: number) => {
    const n = [...sopData];
    n[sopIdx].uraianKegiatan = n[sopIdx].uraianKegiatan.filter(
      (_, i) => i !== uraianIdx,
    );
    setSopData(n);
  };

  const updateSopUraian = (
    sopIdx: number,
    uraianIdx: number,
    field: "judul" | "isi",
    val: string,
  ) => {
    const n = [...sopData];
    n[sopIdx].uraianKegiatan[uraianIdx][field] = val;
    setSopData(n);
  };

  const copySopToIk = () => {
    const confirmCopy = window.confirm(
      "Salin seluruh data SOP ke IK? Data IK yang ada akan ditimpa.",
    );
    if (!confirmCopy) return;

    const copiedData = sopData.map((sop) => ({
      perlengkapanKerja: sop.perlengkapanKerja,
      peralatanUkur: sop.peralatanUkur,
      peralatanKerja: sop.peralatanKerja,
      uraianKegiatan: sop.uraianKegiatan.map((u) => ({ ...u })), // deep copy
    }));

    setIkData(copiedData);
  };

  const updateIkField = (i: number, field: string, val: string) => {
    const n = [...ikData];
    n[i] = { ...n[i], [field]: val };
    setIkData(n);
  };

  const addIkUraian = (ikIdx: number) => {
    const n = [...ikData];
    n[ikIdx].uraianKegiatan.push({ judul: "", isi: "" });
    setIkData(n);
  };

  const removeIkUraian = (ikIdx: number, uraianIdx: number) => {
    const n = [...ikData];
    n[ikIdx].uraianKegiatan = n[ikIdx].uraianKegiatan.filter(
      (_, i) => i !== uraianIdx,
    );
    setIkData(n);
  };

  const updateIkUraian = (
    ikIdx: number,
    uraianIdx: number,
    field: "judul" | "isi",
    val: string,
  ) => {
    const n = [...ikData];
    n[ikIdx].uraianKegiatan[uraianIdx][field] = val;
    setIkData(n);
  };

  const textToArray = (text: string) =>
    text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  // ─── HANDLER JSA MULTI-SECTION ───
  const addJsaSection = () => {
    setJsaData([
      ...jsaData,
      {
        judul: "",
        langkahKerja: "",
        bahayaResiko: "",
        pengendalian: "",
      },
    ]);
  };

  const removeJsaSection = (secIdx: number) => {
    setJsaData(jsaData.filter((_, idx) => idx !== secIdx));
  };

  const updateJsaJudul = (secIdx: number, val: string) => {
    const newData = [...jsaData];
    newData[secIdx].judul = val;
    setJsaData(newData);
  };

  const updateJsaField = (index: number, field: string, value: string) => {
    const newData = [...jsaData];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    setJsaData(newData);
  };

  // ─── HANDLER HIRARC ───
  const handleHirarcChange = (index: number, field: string, value: string) => {
    const n = [...hirarcList];
    n[index] = { ...n[index], [field]: value };
    setHirarcList(n);
  };

  const addHirarcItem = () =>
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

  const removeHirarcItem = (i: number) =>
    setHirarcList(hirarcList.filter((_, idx) => idx !== i));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA")
      e.preventDefault();
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
      // Mapping JSA Data agar menjadi Array of Objects
      jsaTemplate: jsaData.map((sec) => ({
        judulJsa: sec.judul,
        langkahKerja: textToArray(sec.langkahKerja),
        bahayaResiko: textToArray(sec.bahayaResiko),
        pengendalian: textToArray(sec.pengendalian),
      })),
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
        statusPengendalian: hirarcList.map((h) => h.statusPengendalian),
      },
      // ─── PAYLOAD SOP ───
      sopTemplate: sopData.map((s) => {
        const judulArr: string[] = [];
        const uraianArr: string[] = [];

        // Proses memecah baris (Enter) sekaligus menjaga array tetap sejajar
        s.uraianKegiatan.forEach((u) => {
          const lines = textToArray(u.isi);
          if (lines.length === 0) {
            if (u.judul) {
              judulArr.push(u.judul);
              uraianArr.push("");
            }
          } else {
            lines.forEach((line, idx) => {
              // Hanya masukkan Judul di baris pertama, sisanya isi string kosong
              judulArr.push(idx === 0 ? u.judul : "");
              uraianArr.push(line);
            });
          }
        });

        return {
          perlengkapanKerja: textToArray(s.perlengkapanKerja),
          peralatanUkur: textToArray(s.peralatanUkur),
          peralatanKerja: textToArray(s.peralatanKerja),
          judulUraianKegiatan: judulArr,
          uraianKegiatan: uraianArr,
        };
      }),

      // ─── PAYLOAD IK ───
      ikTemplate: ikData.map((ik) => {
        const judulArr: string[] = [];
        const uraianArr: string[] = [];

        ik.uraianKegiatan.forEach((u) => {
          const lines = textToArray(u.isi);
          if (lines.length === 0) {
            if (u.judul) {
              judulArr.push(u.judul);
              uraianArr.push("");
            }
          } else {
            lines.forEach((line, idx) => {
              judulArr.push(idx === 0 ? u.judul : "");
              uraianArr.push(line);
            });
          }
        });

        return {
          perlengkapanKerja: textToArray(ik.perlengkapanKerja),
          peralatanUkur: textToArray(ik.peralatanUkur),
          peralatanKerja: textToArray(ik.peralatanKerja),
          judulUraianKegiatan: judulArr,
          uraianKegiatan: uraianArr,
        };
      }),
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
    } catch (err: any) {
      setErrorMsg(err.message);
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

  return (
    <div className="min-h-full w-full bg-[#F7F8FA]">
      {/* ── TOP HEADER ── */}
      <div className="bg-[#0F1F3D] px-6 py-5 md:px-10">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              Master Data K3
            </p>
            <h1 className="text-xl font-black text-white">
              Buat Master Pekerjaan K3
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Lengkapi template dokumen langkah demi langkah.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70 transition hover:bg-white/10"
          >
            Batal
          </button>
        </div>
      </div>

      {/* ── TAB NAV ── */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDone = i < currentIndex;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex min-w-[100px] flex-1 flex-col items-center gap-1 px-3 py-4 transition ${isActive ? "cursor-default" : "hover:bg-slate-50 cursor-pointer"}`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition ${isActive ? "bg-[#0F1F3D] text-white ring-2 ring-[#F5A623] ring-offset-1" : isDone ? "bg-emerald-500 text-white" : "border-2 border-slate-200 text-slate-400 group-hover:border-[#0F1F3D] group-hover:text-[#0F1F3D]"}`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs font-bold whitespace-nowrap ${isActive ? "text-[#0F1F3D]" : "text-slate-500"}`}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={`hidden text-[10px] sm:block ${isActive ? "text-[#F5A623]" : "text-slate-400"}`}
                  >
                    {tab.desc}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full ${isActive ? "bg-[#F5A623]" : "bg-transparent"}`}
                  />
                </button>
              );
            })}
          </nav>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 w-full bg-slate-100">
          <div
            className="h-full bg-[#F5A623] transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / TABS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        {errorMsg && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-red-500" />
            <p className="text-sm font-bold text-red-700">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="space-y-5">
            {/* ── TAB 1: INFO ── */}
            {activeTab === "info" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <SectionCard title="Informasi Utama Pekerjaan">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel>Kode Pekerjaan *</FieldLabel>
                      <input
                        type="text"
                        required
                        value={kodePekerjaan}
                        onChange={(e) => setKodePekerjaan(e.target.value)}
                        placeholder="Contoh: WP-001"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <FieldLabel>Nama Pekerjaan *</FieldLabel>
                      <input
                        type="text"
                        required
                        value={namaPekerjaan}
                        onChange={(e) => setNamaPekerjaan(e.target.value)}
                        placeholder="Contoh: Pengelasan Pipa"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <FieldLabel>Status</FieldLabel>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={inputClass}
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                      </select>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── TAB 2: WORK PERMIT ── */}
            {activeTab === "wp" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                      Work Permit
                    </p>
                    <h2 className="text-base font-black text-[#0F1F3D]">
                      Template Work Permit
                    </h2>
                  </div>
                </div>
                ```
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 bg-[#0F1F3D] px-5 py-3">
                    <h3 className="text-sm font-bold text-white">
                      Template Dokumen Work Permit
                    </h3>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <FieldLabel>Klasifikasi Pekerjaan</FieldLabel>

                      <textarea
                        rows={5}
                        value={wpKlasifikasi}
                        onChange={(e) => setWpKlasifikasi(e.target.value)}
                        placeholder="Pekerjaan Panas&#10;Pekerjaan Ketinggian&#10;Ruang Terbatas"
                        className={textareaClass}
                      />

                      <p className="mt-2 text-xs text-slate-500">
                        Satu klasifikasi pekerjaan per baris.
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <FieldLabel>Prosedur Pekerjaan</FieldLabel>

                      <textarea
                        rows={8}
                        value={wpProsedur}
                        onChange={(e) => setWpProsedur(e.target.value)}
                        placeholder="Persiapan Area&#10;Pemeriksaan Peralatan&#10;Pelaksanaan Pekerjaan"
                        className={textareaClass}
                      />

                      <p className="mt-2 text-xs text-slate-500">
                        Akan ditampilkan otomatis pada Work Permit.
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <FieldLabel>Lampiran Tambahan</FieldLabel>

                      <textarea
                        rows={5}
                        value={wpLampiran}
                        onChange={(e) => setWpLampiran(e.target.value)}
                        placeholder="Sertifikat Welder&#10;Checklist Peralatan&#10;Foto Area"
                        className={textareaClass}
                      />

                      <p className="mt-2 text-xs text-slate-500">
                        Satu lampiran pada setiap baris.
                      </p>
                    </div>
                  </div>
                </div>
                ```
              </div>
            )}

            {/* ── TAB 3: JSA (MULTI-SECTION) ── */}
            {activeTab === "jsa" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                      JSA
                    </p>
                    <h2 className="text-base font-black text-[#0F1F3D]">
                      Job Safety Analysis Template
                    </h2>
                  </div>
                  ```
                  <button
                    type="button"
                    onClick={addJsaSection}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#0F1F3D]/20 bg-[#0F1F3D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                  >
                    <Plus size={14} />
                    Tambah JSA
                  </button>
                </div>
                {jsaData.map((section, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 bg-[#0F1F3D] px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F5A623] text-xs font-black text-[#F5A623]">
                          {i + 1}
                        </span>

                        <span className="text-sm font-bold text-white">
                          Dokumen JSA #{i + 1}
                        </span>
                      </div>

                      {jsaData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeJsaSection(i)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300"
                        >
                          <Trash2 size={12} />
                          Hapus
                        </button>
                      )}
                    </div>

                    <div className="space-y-5 p-5">
                      <div>
                        <FieldLabel>Judul Dokumen JSA</FieldLabel>

                        <input
                          type="text"
                          value={section.judul}
                          onChange={(e) =>
                            updateJsaField(i, "judul", e.target.value)
                          }
                          placeholder="JSA Pekerjaan Pengelasan"
                          className={inputClass}
                        />
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Langkah Kerja</FieldLabel>

                          <textarea
                            rows={8}
                            value={section.langkahKerja}
                            onChange={(e) =>
                              updateJsaField(i, "langkahKerja", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <FieldLabel>Bahaya & Resiko</FieldLabel>

                          <textarea
                            rows={8}
                            value={section.bahayaResiko}
                            onChange={(e) =>
                              updateJsaField(i, "bahayaResiko", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                          <FieldLabel>Pengendalian</FieldLabel>

                          <textarea
                            rows={8}
                            value={section.pengendalian}
                            onChange={(e) =>
                              updateJsaField(i, "pengendalian", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                ```
              </div>
            )}

            {/* ── TAB 4: HIRARC ── */}
            {activeTab === "hirarc" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                      HIRARC
                    </p>
                    <h2 className="text-base font-black text-[#0F1F3D]">
                      Template Penilaian Risiko
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={addHirarcItem}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#0F1F3D]/20 bg-[#0F1F3D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                  >
                    <Plus size={14} /> Tambah Potensi Bahaya
                  </button>
                </div>

                {hirarcList.map((item, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-[#0F1F3D] px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F5A623] text-xs font-black text-[#F5A623]">
                          {index + 1}
                        </span>
                        <span className="text-sm font-bold text-white">
                          Identifikasi Bahaya #{index + 1}
                        </span>
                      </div>
                      {hirarcList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHirarcItem(index)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/30"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      )}
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Row 1 */}
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {[
                          {
                            label: "Potensi Bahaya",
                            field: "potensi",
                            val: item.potensi,
                            ph: "Cth: Bekerja bertegangan",
                          },
                          {
                            label: "Resiko",
                            field: "resiko",
                            val: item.resiko,
                            ph: "Cth: Tersengat listrik",
                          },
                          {
                            label: "Tindakan Pengendalian",
                            field: "pengendalian",
                            val: item.pengendalian,
                            ph: "Cth: LOTO, APD Lengkap",
                          },
                        ].map((f) => (
                          <div key={f.field}>
                            <FieldLabel>{f.label}</FieldLabel>
                            <textarea
                              rows={2}
                              value={f.val}
                              onChange={(e) =>
                                handleHirarcChange(
                                  index,
                                  f.field,
                                  e.target.value,
                                )
                              }
                              placeholder={f.ph}
                              className={textareaClass}
                            />
                          </div>
                        ))}
                      </div>
                      {/* Row 2: Scores */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Skor awal */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Skor Penilaian Awal
                          </p>
                          <div className="flex gap-2">
                            {[
                              {
                                ph: "Keparahan",
                                field: "keparahan",
                                val: item.keparahan,
                                cls: "",
                              },
                              {
                                ph: "Kemungkinan",
                                field: "kemungkinan",
                                val: item.kemungkinan,
                                cls: "",
                              },
                              {
                                ph: "Tingkat",
                                field: "tingkat",
                                val: item.tingkat,
                                cls: "bg-red-50 border-red-200 text-red-700 font-bold",
                              },
                            ].map((f) => (
                              <input
                                key={f.field}
                                type="text"
                                value={f.val}
                                onChange={(e) =>
                                  handleHirarcChange(
                                    index,
                                    f.field,
                                    e.target.value,
                                  )
                                }
                                placeholder={f.ph}
                                className={`w-1/3 rounded-lg border p-2 text-xs outline-none focus:ring-1 focus:ring-[#0F1F3D] ${f.cls || "border-slate-200 bg-white"}`}
                              />
                            ))}
                          </div>
                        </div>
                        {/* Skor setelah */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                            Skor Setelah Pengendalian
                          </p>
                          <div className="flex gap-2">
                            {[
                              {
                                ph: "Keparahan",
                                field: "keparahanSetelah",
                                val: item.keparahanSetelah,
                                cls: "",
                              },
                              {
                                ph: "Kemungkinan",
                                field: "kemungkinanSetelah",
                                val: item.kemungkinanSetelah,
                                cls: "",
                              },
                              {
                                ph: "Tingkat",
                                field: "tingkatSetelah",
                                val: item.tingkatSetelah,
                                cls: "bg-emerald-100 border-emerald-300 text-emerald-800 font-bold",
                              },
                            ].map((f) => (
                              <input
                                key={f.field}
                                type="text"
                                value={f.val}
                                onChange={(e) =>
                                  handleHirarcChange(
                                    index,
                                    f.field,
                                    e.target.value,
                                  )
                                }
                                placeholder={f.ph}
                                className={`w-1/3 rounded-lg border p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500 ${f.cls || "border-emerald-100 bg-white"}`}
                              />
                            ))}
                          </div>
                        </div>
                        {/* PIC & Status */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <FieldLabel>Penanggung Jawab</FieldLabel>
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
                                className={`${inputClass} text-xs`}
                              />
                            </div>
                            <div className="flex-1">
                              <FieldLabel>Status</FieldLabel>
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
                                className={`${inputClass} text-xs`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB 5: SOP ── */}
            {activeTab === "sop" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                    SOP
                  </p>
                  <h2 className="text-base font-black text-[#0F1F3D]">
                    Standard Operating Procedure
                  </h2>
                </div>

                {sopData.map((section, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-slate-100 bg-[#0F1F3D] px-5 py-3">
                      <span className="text-sm font-bold text-white">
                        SOP #{i + 1}
                      </span>
                    </div>

                    <div className="space-y-5 p-5">
                      {/* Peralatan */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Perlengkapan Kerja</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.perlengkapanKerja}
                            onChange={(e) =>
                              updateSopField(
                                i,
                                "perlengkapanKerja",
                                e.target.value,
                              )
                            }
                            className={textareaClass}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Ukur</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.peralatanUkur}
                            onChange={(e) =>
                              updateSopField(i, "peralatanUkur", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Kerja</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.peralatanKerja}
                            onChange={(e) =>
                              updateSopField(
                                i,
                                "peralatanKerja",
                                e.target.value,
                              )
                            }
                            className={textareaClass}
                          />
                        </div>
                      </div>

                      {/* Card Uraian Kegiatan */}
                      <div className="overflow-hidden rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-4 py-3">
                          <p className="text-xs font-black uppercase tracking-widest text-amber-700">
                            Uraian Kegiatan
                          </p>
                          <button
                            type="button"
                            onClick={() => addSopUraian(i)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600"
                          >
                            <Plus size={12} /> Tambah Uraian
                          </button>
                        </div>

                        <div className="divide-y divide-amber-100 bg-white">
                          {section.uraianKegiatan.map((uraian, j) => (
                            <div key={j} className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-black text-amber-700">
                                  {j + 1}
                                </span>
                                {section.uraianKegiatan.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSopUraian(i, j)}
                                    className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-500 transition hover:bg-red-100"
                                  >
                                    <Trash2 size={11} /> Hapus
                                  </button>
                                )}
                              </div>
                              <div>
                                <FieldLabel>Judul Uraian Kegiatan</FieldLabel>
                                <input
                                  type="text"
                                  value={uraian.judul}
                                  onChange={(e) =>
                                    updateSopUraian(
                                      i,
                                      j,
                                      "judul",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Contoh: Persiapan Area Kerja"
                                  className={inputClass}
                                />
                              </div>
                              <div>
                                <FieldLabel>Uraian Kegiatan</FieldLabel>
                                <textarea
                                  rows={4}
                                  value={uraian.isi}
                                  onChange={(e) =>
                                    updateSopUraian(i, j, "isi", e.target.value)
                                  }
                                  placeholder="Pastikan area kerja bersih&#10;Pasang safety sign&#10;Siapkan peralatan"
                                  className={textareaClass}
                                />
                                <p className="mt-1.5 text-xs text-slate-400">
                                  Satu uraian per baris.
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB 6: IK ── */}
            {activeTab === "ik" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                      IK
                    </p>
                    <h2 className="text-base font-black text-[#0F1F3D]">
                      Instruksi Kerja
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={copySopToIk}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600"
                  >
                    <ClipboardList size={14} /> Salin dari SOP
                  </button>
                </div>

                {ikData.map((section, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-slate-100 bg-[#0F1F3D] px-5 py-3">
                      <span className="text-sm font-bold text-white">
                        IK #{i + 1}
                      </span>
                    </div>

                    <div className="space-y-5 p-5">
                      {/* Peralatan */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Perlengkapan Kerja</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.perlengkapanKerja}
                            onChange={(e) =>
                              updateIkField(
                                i,
                                "perlengkapanKerja",
                                e.target.value,
                              )
                            }
                            className={textareaClass}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Ukur</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.peralatanUkur}
                            onChange={(e) =>
                              updateIkField(i, "peralatanUkur", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Kerja</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.peralatanKerja}
                            onChange={(e) =>
                              updateIkField(i, "peralatanKerja", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                      </div>

                      {/* Card Uraian Kegiatan */}
                      <div className="overflow-hidden rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-4 py-3">
                          <p className="text-xs font-black uppercase tracking-widest text-amber-700">
                            Uraian Kegiatan
                          </p>
                          <button
                            type="button"
                            onClick={() => addIkUraian(i)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600"
                          >
                            <Plus size={12} /> Tambah Uraian
                          </button>
                        </div>

                        <div className="divide-y divide-amber-100 bg-white">
                          {section.uraianKegiatan.map((uraian, j) => (
                            <div key={j} className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-black text-amber-700">
                                  {j + 1}
                                </span>
                                {section.uraianKegiatan.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeIkUraian(i, j)}
                                    className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-500 transition hover:bg-red-100"
                                  >
                                    <Trash2 size={11} /> Hapus
                                  </button>
                                )}
                              </div>
                              <div>
                                <FieldLabel>Judul Uraian Kegiatan</FieldLabel>
                                <input
                                  type="text"
                                  value={uraian.judul}
                                  onChange={(e) =>
                                    updateIkUraian(
                                      i,
                                      j,
                                      "judul",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Contoh: Persiapan Area Kerja"
                                  className={inputClass}
                                />
                              </div>
                              <div>
                                <FieldLabel>Uraian Kegiatan</FieldLabel>
                                <textarea
                                  rows={4}
                                  value={uraian.isi}
                                  onChange={(e) =>
                                    updateIkUraian(i, j, "isi", e.target.value)
                                  }
                                  placeholder="Pastikan area kerja bersih&#10;Pasang safety sign&#10;Siapkan peralatan"
                                  className={textareaClass}
                                />
                                <p className="mt-1.5 text-xs text-slate-400">
                                  Satu uraian per baris.
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── NAV FOOTER ── */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronLeft size={15} /> Sebelumnya
              </button>
              <p className="hidden text-xs text-slate-400 sm:block">
                Langkah{" "}
                <span className="font-bold text-[#0F1F3D]">
                  {currentIndex + 1}
                </span>{" "}
                dari {TABS.length}
              </p>
            </div>
            <div className="flex gap-2">
              {currentIndex < TABS.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-[#1a3561]"
                >
                  Lanjut <ChevronRight size={15} />
                </button>
              )}
              {currentIndex === TABS.length - 1 && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F5A623] px-6 py-2.5 text-sm font-black text-[#0F1F3D] shadow-sm transition hover:-translate-y-px hover:bg-amber-400 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F1F3D] border-t-transparent" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={15} /> Simpan Template K3
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
