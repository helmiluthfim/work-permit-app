"use client";

import { useState, useEffect, use } from "react";
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

function LivePreview({ text, label }: { text: string; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Pratinjau — {label}</FieldLabel>
      <div className="min-h-[132px] overflow-y-auto rounded-xl border border-dashed border-[#F5A623]/40 bg-[#F5A623]/5 p-4 text-sm">
        {!text ? (
          <span className="text-xs italic text-slate-400">
            Mulai mengetik untuk melihat pratinjau...
          </span>
        ) : (
          <div className="space-y-1">
            {text.split("\n").map((line, i) => {
              const t = line.trim();
              if (!t) return null;
              if (/^\d+\./.test(t))
                return (
                  <p
                    key={i}
                    className="mt-3 text-xs font-black uppercase tracking-wide text-[#0F1F3D] first:mt-0"
                  >
                    {t}
                  </p>
                );
              return (
                <div
                  key={i}
                  className="ml-2 flex items-start gap-2 text-sm text-slate-700"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
                  <span>{t.replace(/^- /, "")}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FormatHelper() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/8 p-4">
      <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#F5A623]" />
      <div>
        <p className="mb-1 text-xs font-black uppercase tracking-wide text-[#0F1F3D]">
          Panduan Penulisan
        </p>
        <p className="text-xs leading-relaxed text-slate-600">
          Setiap kotak data mewakili satu baris/langkah. Tekan{" "}
          <strong>Enter (baris baru)</strong> di dalam kotak untuk membuat
          sub-list.
        </p>
      </div>
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

  // ─── STATE UMUM ───
  const [kodePekerjaan, setKodePekerjaan] = useState("");
  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [status, setStatus] = useState("active");

  // ─── STATE WORK PERMIT ───
  const [wpKlasifikasi, setWpKlasifikasi] = useState("");
  const [wpProsedur, setWpProsedur] = useState("");
  const [wpLampiran, setWpLampiran] = useState("");

  // ─── STATE JSA ───
  const [jsaData, setJsaData] = useState([
    { judul: "", items: [{ langkah: "", bahaya: "", pengendalian: "" }] },
  ]);

  // ─── STATE HIRARC ───
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

  // ─── STATE SOP ───
  const [sopData, setSopData] = useState([
    {
      perlengkapan: "",
      alatUkur: "",
      alatKerja: "",
      uraianKegiatan: [{ judul: "", isi: "" }],
    },
  ]);

  // ─── STATE IK ───
  const [ikData, setIkData] = useState([
    {
      perlengkapan: "",
      alatUkur: "",
      alatKerja: "",
      uraianKegiatan: [{ judul: "", isi: "" }],
    },
  ]);

  const arrayToText = (arr?: string[]) =>
    !arr || !Array.isArray(arr) ? "" : arr.join("\n");
  const textToArray = (text: string) =>
    text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

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

        // Parsing JSA
        if (data.jsaTemplate) {
          const source = Array.isArray(data.jsaTemplate)
            ? data.jsaTemplate
            : [data.jsaTemplate];
          if (source.length > 0) {
            setJsaData(
              source.map((sec: any) => {
                const len = Math.max(
                  sec.langkahKerja?.length || 0,
                  sec.bahayaResiko?.length || 0,
                  sec.pengendalian?.length || 0,
                  1,
                );
                return {
                  judul: sec.judulJsa || "",
                  items: Array.from({ length: len }).map((_, i) => ({
                    langkah: sec.langkahKerja?.[i] || "",
                    bahaya: sec.bahayaResiko?.[i] || "",
                    pengendalian: sec.pengendalian?.[i] || "",
                  })),
                };
              }),
            );
          }
        }

        // Parsing HIRARC
        if (data.hirarcTemplate?.potensiBahaya?.length) {
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
              statusPengendalian:
                data.hirarcTemplate.statusPengendalian?.[i] || "",
            })),
          );
        }

        // ── PARSING SOP ──
        if (data.sopTemplate) {
          const source = Array.isArray(data.sopTemplate)
            ? data.sopTemplate
            : [data.sopTemplate];
          if (source.length > 0) {
            setSopData(
              source.map((sec: any) => {
                const juduls = sec.judulUraianKegiatan || [];
                const isis = sec.uraianKegiatan || [];
                const reconstructedUraian: { judul: string; isi: string }[] =
                  [];

                // Menjahit kembali array 1D ke UI array of objects
                isis.forEach((isiText: string, idx: number) => {
                  const jdl = juduls[idx] || "";
                  if (jdl !== "" || reconstructedUraian.length === 0) {
                    reconstructedUraian.push({ judul: jdl, isi: isiText });
                  } else {
                    reconstructedUraian[reconstructedUraian.length - 1].isi +=
                      "\n" + isiText;
                  }
                });

                if (reconstructedUraian.length === 0) {
                  reconstructedUraian.push({ judul: "", isi: "" });
                }

                return {
                  perlengkapan: arrayToText(sec.perlengkapanKerja),
                  alatUkur: arrayToText(sec.peralatanUkur),
                  alatKerja: arrayToText(sec.peralatanKerja),
                  uraianKegiatan: reconstructedUraian,
                };
              }),
            );
          }
        }

        // ── PARSING IK ──
        if (data.ikTemplate) {
          const source = Array.isArray(data.ikTemplate)
            ? data.ikTemplate
            : [data.ikTemplate];
          if (source.length > 0) {
            setIkData(
              source.map((sec: any) => {
                const juduls = sec.judulUraianKegiatan || [];
                const isis = sec.uraianKegiatan || [];
                const reconstructedUraian: { judul: string; isi: string }[] =
                  [];

                isis.forEach((isiText: string, idx: number) => {
                  const jdl = juduls[idx] || "";
                  if (jdl !== "" || reconstructedUraian.length === 0) {
                    reconstructedUraian.push({ judul: jdl, isi: isiText });
                  } else {
                    reconstructedUraian[reconstructedUraian.length - 1].isi +=
                      "\n" + isiText;
                  }
                });

                if (reconstructedUraian.length === 0) {
                  reconstructedUraian.push({ judul: "", isi: "" });
                }

                return {
                  perlengkapan: arrayToText(sec.perlengkapanKerja),
                  alatUkur: arrayToText(sec.peralatanUkur),
                  alatKerja: arrayToText(sec.peralatanKerja),
                  uraianKegiatan: reconstructedUraian,
                };
              }),
            );
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchJobTemplate();
  }, [id]);

  // ─── HANDLER JSA & HIRARC ─── (Disederhanakan untuk ruang)
  const addJsaSection = () =>
    setJsaData([
      ...jsaData,
      { judul: "", items: [{ langkah: "", bahaya: "", pengendalian: "" }] },
    ]);
  const removeJsaSection = (secIdx: number) =>
    setJsaData(jsaData.filter((_, idx) => idx !== secIdx));
  const updateJsaJudul = (secIdx: number, val: string) => {
    const n = [...jsaData];
    n[secIdx].judul = val;
    setJsaData(n);
  };
  const addJsaItem = (secIdx: number) => {
    const n = [...jsaData];
    n[secIdx].items.push({ langkah: "", bahaya: "", pengendalian: "" });
    setJsaData(n);
  };
  const removeJsaItem = (secIdx: number, itemIdx: number) => {
    const n = [...jsaData];
    n[secIdx].items = n[secIdx].items.filter((_, idx) => idx !== itemIdx);
    setJsaData(n);
  };
  const handleJsaItemChange = (
    secIdx: number,
    itemIdx: number,
    field: string,
    val: string,
  ) => {
    const n = [...jsaData];
    n[secIdx].items[itemIdx] = { ...n[secIdx].items[itemIdx], [field]: val };
    setJsaData(n);
  };

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

  // ─── HANDLER SOP ───
  const addSopSection = () =>
    setSopData([
      ...sopData,
      {
        perlengkapan: "",
        alatUkur: "",
        alatKerja: "",
        uraianKegiatan: [{ judul: "", isi: "" }],
      },
    ]);
  const removeSopSection = (secIdx: number) =>
    setSopData(sopData.filter((_, idx) => idx !== secIdx));
  const updateSopField = (secIdx: number, field: string, val: string) => {
    const n = [...sopData];
    n[secIdx] = { ...n[secIdx], [field]: val };
    setSopData(n);
  };

  const addSopUraian = (secIdx: number) => {
    const n = [...sopData];
    n[secIdx].uraianKegiatan.push({ judul: "", isi: "" });
    setSopData(n);
  };
  const removeSopUraian = (secIdx: number, itemIdx: number) => {
    const n = [...sopData];
    n[secIdx].uraianKegiatan.splice(itemIdx, 1);
    setSopData(n);
  };
  const updateSopUraian = (
    secIdx: number,
    itemIdx: number,
    field: "judul" | "isi",
    val: string,
  ) => {
    const n = [...sopData];
    n[secIdx].uraianKegiatan[itemIdx] = {
      ...n[secIdx].uraianKegiatan[itemIdx],
      [field]: val,
    };
    setSopData(n);
  };

  // ─── HANDLER IK ───
  const addIkSection = () =>
    setIkData([
      ...ikData,
      {
        perlengkapan: "",
        alatUkur: "",
        alatKerja: "",
        uraianKegiatan: [{ judul: "", isi: "" }],
      },
    ]);
  const removeIkSection = (secIdx: number) =>
    setIkData(ikData.filter((_, idx) => idx !== secIdx));
  const updateIkField = (secIdx: number, field: string, val: string) => {
    const n = [...ikData];
    n[secIdx] = { ...n[secIdx], [field]: val };
    setIkData(n);
  };

  const addIkUraian = (secIdx: number) => {
    const n = [...ikData];
    n[secIdx].uraianKegiatan.push({ judul: "", isi: "" });
    setIkData(n);
  };
  const removeIkUraian = (secIdx: number, itemIdx: number) => {
    const n = [...ikData];
    n[secIdx].uraianKegiatan.splice(itemIdx, 1);
    setIkData(n);
  };
  const updateIkUraian = (
    secIdx: number,
    itemIdx: number,
    field: "judul" | "isi",
    val: string,
  ) => {
    const n = [...ikData];
    n[secIdx].uraianKegiatan[itemIdx] = {
      ...n[secIdx].uraianKegiatan[itemIdx],
      [field]: val,
    };
    setIkData(n);
  };

  const copySopToIk = () => {
    // Deep clone array untuk uraian kegiatan
    const copied = sopData.map((sop) => ({
      ...sop,
      uraianKegiatan: sop.uraianKegiatan.map((u) => ({ ...u })),
    }));
    setIkData(copied);
  };

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
      jsaTemplate: jsaData.map((sec) => ({
        judulJsa: sec.judul,
        langkahKerja: sec.items.map((i) => i.langkah),
        bahayaResiko: sec.items.map((i) => i.bahaya),
        pengendalian: sec.items.map((i) => i.pengendalian),
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

      // ── MAPPING PAYLOAD SOP ──
      sopTemplate: sopData.map((s) => {
        const judulArr: string[] = [];
        const uraianArr: string[] = [];

        s.uraianKegiatan.forEach((u) => {
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
          perlengkapanKerja: textToArray(s.perlengkapan),
          peralatanUkur: textToArray(s.alatUkur),
          peralatanKerja: textToArray(s.alatKerja),
          judulUraianKegiatan: judulArr,
          uraianKegiatan: uraianArr,
        };
      }),

      // ── MAPPING PAYLOAD IK ──
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
          perlengkapanKerja: textToArray(ik.perlengkapan),
          peralatanUkur: textToArray(ik.alatUkur),
          peralatanKerja: textToArray(ik.alatKerja),
          judulUraianKegiatan: judulArr,
          uraianKegiatan: uraianArr,
        };
      }),
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
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
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
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <FormatHelper />
                <SectionCard title="Template Work Permit">
                  <div className="space-y-5">
                    {[
                      {
                        label: "Klasifikasi Pekerjaan",
                        val: wpKlasifikasi,
                        set: setWpKlasifikasi,
                        ph: "1. Pekerjaan Panas\nMelibatkan mesin las",
                      },
                      {
                        label: "Prosedur Pekerjaan",
                        val: wpProsedur,
                        set: setWpProsedur,
                        ph: "Isi prosedur pekerjaan...",
                      },
                      {
                        label: "Lampiran Tambahan",
                        val: wpLampiran,
                        set: setWpLampiran,
                        ph: "Sertifikat Welder\nFoto Area",
                      },
                    ].map((f) => (
                      <div
                        key={f.label}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                      >
                        <div>
                          <FieldLabel>{f.label}</FieldLabel>
                          <textarea
                            rows={4}
                            value={f.val}
                            onChange={(e) => f.set(e.target.value)}
                            placeholder={f.ph}
                            className={textareaClass}
                          />
                        </div>
                        <LivePreview text={f.val} label={f.label} />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── TAB 3: JSA ── */}
            {activeTab === "jsa" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                {jsaData.map((section, secIdx) => (
                  <div
                    key={secIdx}
                    className="rounded-2xl border border-slate-200 bg-[#0F1F3D]/[0.02] p-5 shadow-sm"
                  >
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex-1">
                        <FieldLabel>Judul Dokumen JSA #{secIdx + 1}</FieldLabel>
                        <input
                          type="text"
                          value={section.judul}
                          onChange={(e) =>
                            updateJsaJudul(secIdx, e.target.value)
                          }
                          placeholder="Contoh: Job Safety Analysis Pekerjaan Pengelasan"
                          className={inputClass}
                        />
                      </div>
                      {jsaData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeJsaSection(secIdx)}
                          className="flex h-[42px] shrink-0 items-center gap-2 rounded-xl bg-red-100 px-4 text-xs font-bold text-red-600 transition hover:bg-red-200"
                        >
                          <Trash2 size={14} /> Hapus Dokumen Ini
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 bg-[#0F1F3D] px-4 py-2.5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#F5A623] text-[10px] font-black text-[#F5A623]">
                                {itemIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-white">
                                Langkah Kerja #{itemIdx + 1}
                              </span>
                            </div>
                            {section.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeJsaItem(secIdx, itemIdx)}
                                className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-2 py-1 text-[10px] font-bold text-red-300 transition hover:bg-red-500/30"
                              >
                                <Trash2 size={12} /> Hapus
                              </button>
                            )}
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                              <div>
                                <FieldLabel>Uraian Langkah Kerja</FieldLabel>
                                <textarea
                                  rows={3}
                                  value={item.langkah}
                                  onChange={(e) =>
                                    handleJsaItemChange(
                                      secIdx,
                                      itemIdx,
                                      "langkah",
                                      e.target.value,
                                    )
                                  }
                                  className={textareaClass}
                                />
                              </div>
                              <div>
                                <FieldLabel>Potensi Bahaya</FieldLabel>
                                <textarea
                                  rows={3}
                                  value={item.bahaya}
                                  onChange={(e) =>
                                    handleJsaItemChange(
                                      secIdx,
                                      itemIdx,
                                      "bahaya",
                                      e.target.value,
                                    )
                                  }
                                  className={textareaClass}
                                />
                              </div>
                              <div>
                                <FieldLabel>Tindakan Pengendalian</FieldLabel>
                                <textarea
                                  rows={3}
                                  value={item.pengendalian}
                                  onChange={(e) =>
                                    handleJsaItemChange(
                                      secIdx,
                                      itemIdx,
                                      "pengendalian",
                                      e.target.value,
                                    )
                                  }
                                  className={textareaClass}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <button
                        type="button"
                        onClick={() => addJsaItem(secIdx)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D]/5 px-4 py-2.5 text-xs font-bold text-[#0F1F3D] transition hover:bg-[#0F1F3D]/10"
                      >
                        <Plus size={14} /> Tambah Langkah Baru
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addJsaSection}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#0F1F3D]/20 bg-transparent px-4 py-5 text-sm font-bold text-[#0F1F3D] transition hover:border-[#0F1F3D]/40 hover:bg-[#0F1F3D]/5"
                >
                  <Plus size={18} /> Tambah Dokumen JSA Baru
                </button>
              </div>
            )}

            {/* ── TAB 4: HIRARC ── */}
            {activeTab === "hirarc" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-[#0F1F3D]">
                      Edit Template Penilaian Risiko
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
                            Skor Awal
                          </p>
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
                              className="w-1/3 rounded-lg border p-2 text-xs outline-none"
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
                              className="w-1/3 rounded-lg border p-2 text-xs outline-none"
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
                              placeholder="Tingkat"
                              className="w-1/3 rounded-lg border p-2 text-xs outline-none bg-red-50 font-bold text-red-700"
                            />
                          </div>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                            Skor Setelah Pengendalian
                          </p>
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
                              className="w-1/3 rounded-lg border p-2 text-xs outline-none"
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
                              className="w-1/3 rounded-lg border p-2 text-xs outline-none"
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
                              placeholder="Tingkat"
                              className="w-1/3 rounded-lg border p-2 text-xs outline-none bg-emerald-100 font-bold text-emerald-800"
                            />
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-4 flex gap-3">
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
                    <div className="border-b border-slate-100 bg-[#0F1F3D] px-5 py-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        SOP #{i + 1}
                      </span>
                      {sopData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSopSection(i)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-2 py-1 text-[10px] font-bold text-red-300 transition hover:bg-red-500/30"
                        >
                          <Trash2 size={12} /> Hapus Dokumen
                        </button>
                      )}
                    </div>

                    <div className="space-y-5 p-5">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Perlengkapan Kerja</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.perlengkapan}
                            onChange={(e) =>
                              updateSopField(i, "perlengkapan", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Ukur</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.alatUkur}
                            onChange={(e) =>
                              updateSopField(i, "alatUkur", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Kerja</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.alatKerja}
                            onChange={(e) =>
                              updateSopField(i, "alatKerja", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                      </div>

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
                                  Tekan Enter untuk memisah uraian ke dalam list
                                  point.
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSopSection}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#0F1F3D]/20 bg-transparent px-4 py-5 text-sm font-bold text-[#0F1F3D] transition hover:border-[#0F1F3D]/40 hover:bg-[#0F1F3D]/5"
                >
                  <Plus size={18} /> Tambah Dokumen SOP Baru
                </button>
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
                    <div className="border-b border-slate-100 bg-[#0F1F3D] px-5 py-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        IK #{i + 1}
                      </span>
                      {ikData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIkSection(i)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-2 py-1 text-[10px] font-bold text-red-300 transition hover:bg-red-500/30"
                        >
                          <Trash2 size={12} /> Hapus Dokumen
                        </button>
                      )}
                    </div>

                    <div className="space-y-5 p-5">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Perlengkapan Kerja</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.perlengkapan}
                            onChange={(e) =>
                              updateIkField(i, "perlengkapan", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Ukur</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.alatUkur}
                            onChange={(e) =>
                              updateIkField(i, "alatUkur", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Kerja</FieldLabel>
                          <textarea
                            rows={4}
                            value={section.alatKerja}
                            onChange={(e) =>
                              updateIkField(i, "alatKerja", e.target.value)
                            }
                            className={textareaClass}
                          />
                        </div>
                      </div>

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
                                  Tekan Enter untuk memisah uraian ke dalam list
                                  point.
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addIkSection}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#0F1F3D]/20 bg-transparent px-4 py-5 text-sm font-bold text-[#0F1F3D] transition hover:border-[#0F1F3D]/40 hover:bg-[#0F1F3D]/5"
                >
                  <Plus size={18} /> Tambah Dokumen IK Baru
                </button>
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
