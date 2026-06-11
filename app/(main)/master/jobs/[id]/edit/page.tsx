"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
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
  Info,
  RefreshCw,
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

function FormatHelper() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/8 p-4">
      <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#F5A623]" />
      <p className="text-xs leading-relaxed text-slate-600">
        <span className="font-black uppercase tracking-wide text-[#0F1F3D]">
          Panduan Penulisan:{" "}
        </span>
        Awali baris dengan angka (mis.{" "}
        <span className="font-bold text-[#0F1F3D]">1. Persiapan</span>) untuk
        membuat <strong>sub-judul tebal</strong>. Baris biasa otomatis menjadi
        bullet point.
      </p>
    </div>
  );
}

export default function EditJobTemplatePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const id = resolvedParams?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState(TABS[0].id);

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

  const textToArray = (text: string) =>
    text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const arrayToText = (arr?: string[]) =>
    !arr || !Array.isArray(arr) ? "" : arr.join("\n");

  useEffect(() => {
    if (!id) return;
    const fetchJobTemplate = async () => {
      try {
        setIsFetching(true);
        const res = await fetch(`/api/job-templates/${id}`);
        if (!res.ok) {
          const r = await res.json();
          throw new Error(r.message);
        }
        const result = await res.json();
        const data = result.data;

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
        if (data.hirarcTemplate?.potensiBahaya?.length) {
          const statusArray = data.hirarcTemplate.statusPengendalian
            ? data.hirarcTemplate.statusPengendalian.split(", ")
            : [];
          setHirarcList(
            Array.from({
              length: data.hirarcTemplate.potensiBahaya.length,
            }).map((_, i) => ({
              potensi: data.hirarcTemplate.potensiBahaya[i] || "",
              resiko: data.hirarcTemplate.resiko[i] || "",
              pengendalian: data.hirarcTemplate.pengendalian[i] || "",
              penanggungJawab: data.hirarcTemplate.penanggungJawab[i] || "",
              keparahan: data.hirarcTemplate.konsekuensiKeparahan[i] || "",
              kemungkinan: data.hirarcTemplate.kemungkinanTerjadi[i] || "",
              tingkat: data.hirarcTemplate.tingkatResiko[i] || "",
              keparahanSetelah:
                data.hirarcTemplate.konsekuensiSetelahPengendalian[i] || "",
              kemungkinanSetelah:
                data.hirarcTemplate.kemungkinanTerjadiSetelahPengendalian[i] ||
                "",
              tingkatSetelah:
                data.hirarcTemplate.tingkatResikoSetelahPengendalian[i] || "",
              statusPengendalian: statusArray[i] || "",
            })),
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
        setErrorMsg(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchJobTemplate();
  }, [id]);

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
        statusPengendalian: hirarcList
          .map((h) => h.statusPengendalian)
          .filter(Boolean)
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
      const res = await fetch(`/api/job-templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui data");
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

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
          <p className="text-sm font-medium text-slate-400">
            Memuat data template...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#F7F8FA]">
      {/* ── HEADER ── */}
      <div className="bg-[#0F1F3D] px-6 py-5 md:px-10">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              Edit Master Data K3
            </p>
            <h1 className="text-xl font-black text-white">
              Edit Master Pekerjaan K3
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Memperbarui template untuk{" "}
              <span className="font-bold text-white/70">{kodePekerjaan}</span>
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
                  className={`group relative flex min-w-[100px] flex-1 flex-col items-center gap-1 px-3 py-4 transition ${isActive ? "cursor-default" : "cursor-pointer hover:bg-slate-50"}`}
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
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <FormatHelper />
                <SectionCard title="Template Work Permit">
                  <div className="space-y-5">
                    {[
                      {
                        label: "Klasifikasi Pekerjaan",
                        val: wpKlasifikasi,
                        set: setWpKlasifikasi,
                      },
                      {
                        label: "Prosedur Pekerjaan",
                        val: wpProsedur,
                        set: setWpProsedur,
                      },
                      {
                        label: "Lampiran Tambahan",
                        val: wpLampiran,
                        set: setWpLampiran,
                      },
                    ].map((f) => (
                      <div key={f.label}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <textarea
                          rows={4}
                          value={f.val}
                          onChange={(e) => f.set(e.target.value)}
                          className={textareaClass}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── TAB 3: JSA ── */}
            {activeTab === "jsa" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <FormatHelper />
                <SectionCard title="Template JSA">
                  <div className="space-y-5">
                    {[
                      {
                        label: "Langkah Kerja",
                        val: jsaLangkah,
                        set: setJsaLangkah,
                      },
                      {
                        label: "Bahaya & Resiko",
                        val: jsaBahaya,
                        set: setJsaBahaya,
                      },
                      {
                        label: "Tindakan Pengendalian",
                        val: jsaPengendalian,
                        set: setJsaPengendalian,
                      },
                    ].map((f) => (
                      <div key={f.label}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <textarea
                          rows={4}
                          value={f.val}
                          onChange={(e) => f.set(e.target.value)}
                          className={textareaClass}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
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
                      Edit Template Penilaian Risiko
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={addHirarcItem}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1a3561]"
                  >
                    <Plus size={14} /> Tambah Potensi Bahaya
                  </button>
                </div>

                {hirarcList.map((item, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
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
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {[
                          {
                            label: "Potensi Bahaya",
                            field: "potensi",
                            val: item.potensi,
                          },
                          {
                            label: "Resiko",
                            field: "resiko",
                            val: item.resiko,
                          },
                          {
                            label: "Tindakan Pengendalian",
                            field: "pengendalian",
                            val: item.pengendalian,
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
                              className={textareaClass}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <FormatHelper />
                <SectionCard title="Template SOP">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {[
                      {
                        label: "Perlengkapan Kerja (APD)",
                        val: sopPerlengkapan,
                        set: setSopPerlengkapan,
                      },
                      {
                        label: "Peralatan Ukur",
                        val: sopAlatUkur,
                        set: setSopAlatUkur,
                      },
                      {
                        label: "Peralatan Kerja",
                        val: sopAlatKerja,
                        set: setSopAlatKerja,
                      },
                      {
                        label: "Uraian Kegiatan",
                        val: sopUraian,
                        set: setSopUraian,
                      },
                    ].map((f) => (
                      <div key={f.label}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <textarea
                          rows={4}
                          value={f.val}
                          onChange={(e) => f.set(e.target.value)}
                          className={textareaClass}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── TAB 6: IK ── */}
            {activeTab === "ik" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <div className="flex items-center justify-between">
                  <FormatHelper />
                  <button
                    type="button"
                    onClick={() => {
                      setIkPerlengkapan(sopPerlengkapan);
                      setIkAlatUkur(sopAlatUkur);
                      setIkAlatKerja(sopAlatKerja);
                      setIkUraian(sopUraian);
                    }}
                    className="ml-4 inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    <RefreshCw size={12} /> Salin dari SOP
                  </button>
                </div>
                <SectionCard title="Template Instruksi Kerja (IK)">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {[
                      {
                        label: "Perlengkapan Kerja (APD)",
                        val: ikPerlengkapan,
                        set: setIkPerlengkapan,
                      },
                      {
                        label: "Peralatan Ukur",
                        val: ikAlatUkur,
                        set: setIkAlatUkur,
                      },
                      {
                        label: "Peralatan Kerja",
                        val: ikAlatKerja,
                        set: setIkAlatKerja,
                      },
                      {
                        label: "Uraian Kegiatan",
                        val: ikUraian,
                        set: setIkUraian,
                      },
                    ].map((f) => (
                      <div key={f.label}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <textarea
                          rows={4}
                          value={f.val}
                          onChange={(e) => f.set(e.target.value)}
                          className={textareaClass}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
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
                      <Save size={15} /> Simpan Perubahan K3
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
