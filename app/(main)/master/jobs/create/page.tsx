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
  GripVertical,
  CornerDownLeft,
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

// ─── ListItemInput ──────────────────────────────────────────────────────────
// Pengganti textarea "satu baris = satu item". User ketik teks lalu tekan
// Enter (atau klik Tambah) untuk menjadikannya item baru pada daftar.
// Setiap item tampil sebagai baris bernomor dengan tombol hapus, sehingga
// jumlah & isi item langsung terlihat jelas — tidak perlu menebak-nebak
// hasil pemecahan baris seperti pada textarea biasa.
function ListItemInput({
  items,
  onChange,
  placeholder,
  helperText,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  helperText?: string;
}) {
  const [draft, setDraft] = useState("");

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
    }
  };

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, value: string) => {
    const next = [...items];
    next[idx] = value;
    onChange(next);
  };

  return (
    <div>
      {/* Daftar item yang sudah ditambahkan */}
      {items.length > 0 && (
        <ul className="mb-2.5 space-y-1.5">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F1F3D]/8 text-[10px] font-black text-[#0F1F3D]">
                {idx + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-[#0F1F3D] outline-none"
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="shrink-0 rounded-md p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                aria-label="Hapus item"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Input untuk menambah item baru */}
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 transition focus-within:border-[#0F1F3D] focus-within:ring-2 focus-within:ring-[#0F1F3D]/10">
        <Plus size={14} className="shrink-0 text-slate-400" />
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ketik item, lalu tekan Enter..."}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#0F1F3D] placeholder-slate-400 outline-none"
        />
        {draft.trim() && (
          <button
            type="button"
            onClick={commitDraft}
            className="flex shrink-0 items-center gap-1 rounded-md bg-[#0F1F3D] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#1a3561]"
          >
            <CornerDownLeft size={11} /> Tambah
          </button>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {helperText || "Tekan Enter setelah mengetik untuk menambah item."}
        </p>
        {items.length > 0 && (
          <span className="text-xs font-semibold text-slate-400">
            {items.length} item
          </span>
        )}
      </div>
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

  // ─── STATE WORK PERMIT (kini berupa array, bukan teks multi-baris) ───
  const [wpKlasifikasi, setWpKlasifikasi] = useState<string[]>([]);
  const [wpProsedur, setWpProsedur] = useState<string[]>([]);
  const [wpLampiran, setWpLampiran] = useState<string[]>([]);

  // ─── STATE JSA MULTI-SECTION (Judul & Items) ───
  const [jsaData, setJsaData] = useState([
    {
      judul: "",
      langkahKerja: [] as string[],
      bahayaResiko: [] as string[],
      pengendalian: [] as string[],
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

  // Ganti state awal SOP — uraianKegiatan.isi kini array, bukan teks multi-baris
  const [sopData, setSopData] = useState([
    {
      perlengkapanKerja: [] as string[],
      peralatanUkur: [] as string[],
      peralatanKerja: [] as string[],
      uraianKegiatan: [{ judul: "", isi: [] as string[] }],
    },
  ]);

  const [ikData, setIkData] = useState([
    {
      perlengkapanKerja: [] as string[],
      peralatanUkur: [] as string[],
      peralatanKerja: [] as string[],
      uraianKegiatan: [{ judul: "", isi: [] as string[] }],
    },
  ]);

  const updateSopField = (i: number, field: string, val: string[]) => {
    const n = [...sopData];
    n[i] = { ...n[i], [field]: val };
    setSopData(n);
  };

  const addSopUraian = (sopIdx: number) => {
    const n = [...sopData];
    n[sopIdx].uraianKegiatan.push({ judul: "", isi: [] });
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
    val: string | string[],
  ) => {
    const n = [...sopData];
    n[sopIdx].uraianKegiatan[uraianIdx][field] = val as never;
    setSopData(n);
  };

  const copySopToIk = () => {
    const confirmCopy = window.confirm(
      "Salin seluruh data SOP ke IK? Data IK yang ada akan ditimpa.",
    );
    if (!confirmCopy) return;

    const copiedData = sopData.map((sop) => ({
      perlengkapanKerja: [...sop.perlengkapanKerja],
      peralatanUkur: [...sop.peralatanUkur],
      peralatanKerja: [...sop.peralatanKerja],
      uraianKegiatan: sop.uraianKegiatan.map((u) => ({
        judul: u.judul,
        isi: [...u.isi],
      })), // deep copy
    }));

    setIkData(copiedData);
  };

  const updateIkField = (i: number, field: string, val: string[]) => {
    const n = [...ikData];
    n[i] = { ...n[i], [field]: val };
    setIkData(n);
  };

  const addIkUraian = (ikIdx: number) => {
    const n = [...ikData];
    n[ikIdx].uraianKegiatan.push({ judul: "", isi: [] });
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
    val: string | string[],
  ) => {
    const n = [...ikData];
    n[ikIdx].uraianKegiatan[uraianIdx][field] = val as never;
    setIkData(n);
  };

  // ─── HANDLER JSA MULTI-SECTION ───
  const addJsaSection = () => {
    setJsaData([
      ...jsaData,
      {
        judul: "",
        langkahKerja: [],
        bahayaResiko: [],
        pengendalian: [],
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

  const updateJsaField = (index: number, field: string, value: string[]) => {
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
        klasifikasiPekerjaan: wpKlasifikasi,
        prosedurPekerjaan: wpProsedur,
        lampiran: wpLampiran,
      },
      // Mapping JSA Data agar menjadi Array of Objects
      jsaTemplate: jsaData.map((sec) => ({
        judulJsa: sec.judul,
        langkahKerja: sec.langkahKerja,
        bahayaResiko: sec.bahayaResiko,
        pengendalian: sec.pengendalian,
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

        // Setiap baris pada "isi" sudah berupa item array tersendiri,
        // jadi tidak perlu lagi memecah teks multi-baris di sini.
        s.uraianKegiatan.forEach((u) => {
          if (u.isi.length === 0) {
            if (u.judul) {
              judulArr.push(u.judul);
              uraianArr.push("");
            }
          } else {
            u.isi.forEach((line, idx) => {
              // Hanya masukkan Judul di baris pertama, sisanya isi string kosong
              judulArr.push(idx === 0 ? u.judul : "");
              uraianArr.push(line);
            });
          }
        });

        return {
          perlengkapanKerja: s.perlengkapanKerja,
          peralatanUkur: s.peralatanUkur,
          peralatanKerja: s.peralatanKerja,
          judulUraianKegiatan: judulArr,
          uraianKegiatan: uraianArr,
        };
      }),

      // ─── PAYLOAD IK ───
      ikTemplate: ikData.map((ik) => {
        const judulArr: string[] = [];
        const uraianArr: string[] = [];

        ik.uraianKegiatan.forEach((u) => {
          if (u.isi.length === 0) {
            if (u.judul) {
              judulArr.push(u.judul);
              uraianArr.push("");
            }
          } else {
            u.isi.forEach((line, idx) => {
              judulArr.push(idx === 0 ? u.judul : "");
              uraianArr.push(line);
            });
          }
        });

        return {
          perlengkapanKerja: ik.perlengkapanKerja,
          peralatanUkur: ik.peralatanUkur,
          peralatanKerja: ik.peralatanKerja,
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
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 bg-[#0F1F3D] px-5 py-3">
                    <h3 className="text-sm font-bold text-white">
                      Template Dokumen Work Permit
                    </h3>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <FieldLabel>Klasifikasi Pekerjaan</FieldLabel>

                      <ListItemInput
                        items={wpKlasifikasi}
                        onChange={setWpKlasifikasi}
                        placeholder="Cth: Pekerjaan Panas"
                        helperText="Tekan Enter untuk menambah klasifikasi baru."
                      />
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <FieldLabel>Prosedur Pekerjaan</FieldLabel>

                      <ListItemInput
                        items={wpProsedur}
                        onChange={setWpProsedur}
                        placeholder="Cth: Persiapan Area"
                        helperText="Akan ditampilkan otomatis pada Work Permit, sesuai urutan."
                      />
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <FieldLabel>Lampiran Tambahan</FieldLabel>

                      <ListItemInput
                        items={wpLampiran}
                        onChange={setWpLampiran}
                        placeholder="Cth: Sertifikat Welder"
                        helperText="Tekan Enter untuk menambah lampiran baru."
                      />
                    </div>
                  </div>
                </div>
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
                          onChange={(e) => updateJsaJudul(i, e.target.value)}
                          placeholder="JSA Pekerjaan Pengelasan"
                          className={inputClass}
                        />
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Langkah Kerja</FieldLabel>

                          <ListItemInput
                            items={section.langkahKerja}
                            onChange={(val) =>
                              updateJsaField(i, "langkahKerja", val)
                            }
                            placeholder="Cth: Pasang APD lengkap"
                          />
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <FieldLabel>Bahaya & Resiko</FieldLabel>

                          <ListItemInput
                            items={section.bahayaResiko}
                            onChange={(val) =>
                              updateJsaField(i, "bahayaResiko", val)
                            }
                            placeholder="Cth: Terpapar asap las"
                          />
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                          <FieldLabel>Pengendalian</FieldLabel>

                          <ListItemInput
                            items={section.pengendalian}
                            onChange={(val) =>
                              updateJsaField(i, "pengendalian", val)
                            }
                            placeholder="Cth: Gunakan respirator"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                          <ListItemInput
                            items={section.perlengkapanKerja}
                            onChange={(val) =>
                              updateSopField(i, "perlengkapanKerja", val)
                            }
                            placeholder="Cth: Helm safety"
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Ukur</FieldLabel>
                          <ListItemInput
                            items={section.peralatanUkur}
                            onChange={(val) =>
                              updateSopField(i, "peralatanUkur", val)
                            }
                            placeholder="Cth: Multimeter"
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Kerja</FieldLabel>
                          <ListItemInput
                            items={section.peralatanKerja}
                            onChange={(val) =>
                              updateSopField(i, "peralatanKerja", val)
                            }
                            placeholder="Cth: Kunci pas set"
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
                                <ListItemInput
                                  items={uraian.isi}
                                  onChange={(val) =>
                                    updateSopUraian(i, j, "isi", val)
                                  }
                                  placeholder="Cth: Pastikan area kerja bersih"
                                  helperText="Setiap langkah jadi satu item pada daftar."
                                />
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
                          <ListItemInput
                            items={section.perlengkapanKerja}
                            onChange={(val) =>
                              updateIkField(i, "perlengkapanKerja", val)
                            }
                            placeholder="Cth: Helm safety"
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Ukur</FieldLabel>
                          <ListItemInput
                            items={section.peralatanUkur}
                            onChange={(val) =>
                              updateIkField(i, "peralatanUkur", val)
                            }
                            placeholder="Cth: Multimeter"
                          />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <FieldLabel>Peralatan Kerja</FieldLabel>
                          <ListItemInput
                            items={section.peralatanKerja}
                            onChange={(val) =>
                              updateIkField(i, "peralatanKerja", val)
                            }
                            placeholder="Cth: Kunci pas set"
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
                                <ListItemInput
                                  items={uraian.isi}
                                  onChange={(val) =>
                                    updateIkUraian(i, j, "isi", val)
                                  }
                                  placeholder="Cth: Pastikan area kerja bersih"
                                  helperText="Setiap langkah jadi satu item pada daftar."
                                />
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
