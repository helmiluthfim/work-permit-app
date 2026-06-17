"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Users,
  X,
  CheckSquare,
  ListChecks,
  AlertTriangle,
  ShieldCheck,
  Info,
  UserCheck,
  FileText,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import { WorkPermitFormContext } from "../layout";
import {
  SectionCard,
  InfoSummaryBar,
  FormattedText,
  NavFooter,
  LoadingSpinner,
} from "../shared-components";

interface Personnel {
  _id: string;
  nama: string;
  jabatan: string;
}

interface JobTemplate {
  _id: string;
  kodePekerjaan: string;
  namaPekerjaan: string;
  jsaTemplate?: any[]; // Ditambahkan untuk mencegah error TypeScript
}

// Kolom JSA read-only
function JsaColumn({
  icon: Icon,
  accentBg,
  accentBorder,
  accentIcon,
  label,
  children,
}: {
  icon: React.ElementType;
  accentBg: string;
  accentBorder: string;
  accentIcon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border ${accentBorder} ${accentBg} p-5`}>
      <div className="mb-3 flex items-center gap-2 border-b border-black/5 pb-3">
        <Icon size={15} className={accentIcon} />
        <span className="text-xs font-black uppercase tracking-widest text-[#0F1F3D]">
          {label}
        </span>
      </div>
      <div className="min-h-[5rem]">{children}</div>
    </div>
  );
}

// Dropdown pelaksana dengan search bar
function PelaksanaDropdown({
  options,
  selectedIds,
  onToggle,
}: {
  options: Personnel[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Tutup dropdown saat klik di luar area
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search bar saat dropdown dibuka
  useEffect(() => {
    if (isOpen) {
      // delay kecil agar elemen sudah ter-render sebelum difokuskan
      const t = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredOptions = options.filter((person) =>
    person.nama.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
          isOpen
            ? "border-[#0F1F3D]/40 bg-white ring-2 ring-[#0F1F3D]/10"
            : "border-slate-200 bg-slate-50 hover:bg-white"
        }`}
      >
        <span className="flex items-center gap-2 text-slate-500">
          <Search size={15} className="text-slate-400" />
          {selectedIds.length > 0
            ? `${selectedIds.length} pelaksana dipilih`
            : "Cari & pilih pelaksana pekerjaan..."}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Panel dropdown */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search bar */}
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nama pelaksana..."
              className="w-full bg-transparent text-sm text-[#0F1F3D] placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="shrink-0 rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* List opsi (scrollable, dikunci agar tidak menyebar ke scroll halaman) */}
          <ul
            onWheel={(e) => {
              const el = e.currentTarget;
              const atTop = el.scrollTop === 0;
              const atBottom =
                Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
              if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="max-h-64 overflow-y-auto p-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
            style={{ scrollbarWidth: "thin", overscrollBehavior: "contain" }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((person) => {
                const isSelected = selectedIds.includes(person._id);
                return (
                  <li key={person._id}>
                    <button
                      type="button"
                      onClick={() => onToggle(person._id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                        isSelected
                          ? "bg-[#0F1F3D]/5 text-[#0F1F3D]"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            isSelected
                              ? "border-[#0F1F3D] bg-[#0F1F3D]"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <Check size={11} className="text-white" />
                          )}
                        </span>
                        {person.nama}
                      </span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="py-6 text-center text-sm text-slate-400">
                Tidak ditemukan pelaksana dengan nama tersebut.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TabJSA() {
  const router = useRouter();
  const { formData, setFormData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [pelaksanaOptions, setPelaksanaOptions] = useState<Personnel[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!formData.jsaPelaksana) {
      setFormData((prev: any) => ({ ...prev, jsaPelaksana: [] }));
    }
    const fetchMasterData = async () => {
      try {
        const [resJobs, resPersonnel] = await Promise.all([
          fetch("/api/job-templates"),
          fetch("/api/personnel"),
        ]);
        const dataJobs = await resJobs.json();
        const dataPersonnel = await resPersonnel.json();
        if (dataJobs.success) setJobTemplates(dataJobs.data);
        if (dataPersonnel.success) {
          setAllPersonnel(dataPersonnel.data);
          setPelaksanaOptions(
            dataPersonnel.data.filter(
              (p: Personnel) => p.jabatan === "Pelaksana",
            ),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchMasterData();
  }, []);

  const togglePelaksana = (id: string) => {
    if (errorMsg) setErrorMsg("");
    setFormData((prev: any) => {
      const curr = prev.jsaPelaksana || [];
      const isSelected = curr.includes(id);
      return {
        ...prev,
        jsaPelaksana: isSelected
          ? curr.filter((item: string) => item !== id)
          : [...curr, id],
      };
    });
  };

  const handleNext = () => {
    if (!formData.jsaPelaksana || formData.jsaPelaksana.length === 0) {
      setErrorMsg("Pilih minimal 1 Pelaksana Pekerjaan untuk melanjutkan.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrorMsg("");
    router.push("/work-permits/create/hirarc");
  };

  const selectedJob = jobTemplates.find((j) => j._id === formData.pekerjaanId);
  const selectedPjTeknik = allPersonnel.find(
    (p) => p._id === formData.pjTeknik,
  );
  const selectedAhliK3 = allPersonnel.find(
    (p) => p._id === formData.tenagaAhliK3,
  );

  if (isFetching) return <LoadingSpinner label="Memuat data JSA..." />;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Error banner */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-in fade-in">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-bold text-red-700">
              Pelaksana belum dipilih
            </p>
            <p className="mt-0.5 text-xs text-red-500">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Info bar */}
      <InfoSummaryBar
        formData={formData}
        selectedJob={selectedJob}
        selectedPjTeknik={selectedPjTeknik}
        selectedAhliK3={selectedAhliK3}
      />

      {/* ── 1. Pelaksana ── */}
      <SectionCard title="1. Pelaksana Pekerjaan" icon={Users}>
        <p className="mb-4 text-sm text-slate-500">
          Pilih pekerja yang terlibat di lapangan. Mereka wajib membaca dan
          memahami dokumen JSA ini sebelum bekerja.
        </p>

        {/* Dropdown dengan search bar */}
        {pelaksanaOptions.length > 0 ? (
          <PelaksanaDropdown
            options={pelaksanaOptions}
            selectedIds={formData.jsaPelaksana || []}
            onToggle={togglePelaksana}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
            <p className="text-sm text-slate-400">
              Tidak ada data personel dengan jabatan "Pelaksana".
            </p>
          </div>
        )}

        {/* Chip selected */}
        <div className="mt-4 flex min-h-9 flex-wrap gap-2">
          {!formData.jsaPelaksana || formData.jsaPelaksana.length === 0 ? (
            <span className="flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-400">
              <UserCheck size={12} /> Belum ada pelaksana dipilih
            </span>
          ) : (
            formData.jsaPelaksana.map((id: string) => {
              const person = pelaksanaOptions.find((p) => p._id === id);
              if (!person) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0F1F3D]/20 bg-[#0F1F3D] px-3 py-1.5 text-xs font-bold text-white"
                >
                  {person.nama}
                  <button
                    type="button"
                    onClick={() => togglePelaksana(id)}
                    className="rounded-full p-0.5 transition hover:bg-white/20"
                  >
                    <X size={11} />
                  </button>
                </span>
              );
            })
          )}
        </div>
      </SectionCard>

      {/* ── 2. Dokumen JSA ── */}
      <SectionCard
        title="2. Analisis Keselamatan Kerja (JSA)"
        icon={CheckSquare}
        badge="Read Only"
      >
        {!formData.jsaDocs || formData.jsaDocs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
            <p className="text-sm text-slate-400">
              Data JSA belum tersedia untuk template pekerjaan ini.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {formData.jsaDocs.map((jsa: any, idx: number) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
              >
                {/* Judul JSA */}
                <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F1F3D]/5">
                    <FileText size={16} className="text-[#0F1F3D]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Dokumen JSA
                    </p>
                    <h4 className="text-sm font-bold text-[#0F1F3D]">
                      {jsa.judulJsa || `JSA #${idx + 1}`}
                    </h4>
                  </div>
                </div>

                {/* Tiga Kolom */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <JsaColumn
                    icon={ListChecks}
                    accentBg="bg-blue-50/50"
                    accentBorder="border-blue-100"
                    accentIcon="text-blue-500"
                    label="Langkah Kerja"
                  >
                    <FormattedText text={jsa.langkahKerja} />
                  </JsaColumn>
                  <JsaColumn
                    icon={AlertTriangle}
                    accentBg="bg-red-50/50"
                    accentBorder="border-red-100"
                    accentIcon="text-red-500"
                    label="Bahaya & Resiko"
                  >
                    <FormattedText text={jsa.bahayaResiko} />
                  </JsaColumn>
                  <JsaColumn
                    icon={ShieldCheck}
                    accentBg="bg-emerald-50/50"
                    accentBorder="border-emerald-100"
                    accentIcon="text-emerald-600"
                    label="Tindakan Pengendalian"
                  >
                    <FormattedText text={jsa.pengendalian} />
                  </JsaColumn>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Catatan */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/8 p-4">
          <Info size={16} className="mt-0.5 shrink-0 text-[#F5A623]" />
          <p className="text-xs leading-relaxed text-slate-600">
            <span className="font-bold text-[#0F1F3D]">Catatan Penting: </span>
            Dokumen JSA ini bersifat baku berdasarkan Master Template K3. Jika
            kondisi lapangan memerlukan penyesuaian, hubungi Tenaga Ahli K3
            untuk memperbarui Master Data.
          </p>
        </div>
      </SectionCard>

      {/* Nav */}
      <NavFooter
        step={2}
        totalSteps={5}
        backLabel="Work Permit"
        nextLabel="Lanjut ke HIRARC"
        onBack={() => router.push("/work-permits/create/work-permit")}
        onNext={handleNext}
      />
    </div>
  );
}
