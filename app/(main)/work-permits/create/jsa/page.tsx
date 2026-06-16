"use client";

import { useState, useEffect, useContext } from "react";
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

        {/* Chip selected */}
        <div className="mb-4 flex min-h-9 flex-wrap gap-2">
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

        {/* Checklist */}
        <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
          {pelaksanaOptions.length > 0 ? (
            <ul className="space-y-1">
              {pelaksanaOptions.map((person) => {
                const isSelected = formData.jsaPelaksana?.includes(person._id);
                return (
                  <li key={person._id}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                        isSelected
                          ? "border-[#0F1F3D]/20 bg-[#0F1F3D]/5"
                          : "border-transparent hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={() => togglePelaksana(person._id)}
                        className="h-4 w-4 rounded border-slate-300 text-[#0F1F3D] accent-[#0F1F3D]"
                      />
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-[#0F1F3D]" : "text-slate-600"
                        }`}
                      >
                        {person.nama}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              Tidak ada data personel dengan jabatan "Pelaksana".
            </p>
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
