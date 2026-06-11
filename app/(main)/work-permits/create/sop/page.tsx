"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Wrench,
  Ruler,
  Shield,
  Info,
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
}

// ─── Kartu peralatan ─────────────────────────────────────────────────────────
function EquipCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  content,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  content: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-slate-100 px-5 py-3.5">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon size={15} className={iconColor} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-[#0F1F3D]">
          {label}
        </span>
      </div>
      {/* Content */}
      <div className="flex-1 px-5 py-4">
        <FormattedText text={content} />
      </div>
    </div>
  );
}

export default function TabSOP() {
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
      } catch (err) {
        console.error(err);
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

  if (isFetching) return <LoadingSpinner label="Menyiapkan dokumen SOP..." />;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <InfoSummaryBar
        formData={formData}
        selectedJob={selectedJob}
        selectedPjTeknik={selectedPjTeknik}
        selectedAhliK3={selectedAhliK3}
      />

      {/* ── PERALATAN 3 kolom ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              Standar Operasional Prosedur
            </p>
            <h2 className="text-base font-black text-[#0F1F3D]">
              Perlengkapan & Peralatan
            </h2>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Read Only
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <EquipCard
            icon={Shield}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            label="Perlengkapan Kerja (APD)"
            content={formData.sopPerlengkapan}
          />
          <EquipCard
            icon={Ruler}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            label="Peralatan Ukur"
            content={formData.sopAlatUkur}
          />
          <EquipCard
            icon={Wrench}
            iconBg="bg-[#F5A623]/15"
            iconColor="text-amber-600"
            label="Peralatan Kerja"
            content={formData.sopAlatKerja}
          />
        </div>
      </div>

      {/* ── URAIAN KEGIATAN ── */}
      <SectionCard title="Uraian Kegiatan" icon={FileText} badge="Read Only">
        <div className="min-h-[10rem]">
          <FormattedText text={formData.sopUraian} />
        </div>
      </SectionCard>

      {/* ── DISCLAIMER ── */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#F5A623]/30 bg-[#F5A623]/8 px-5 py-4">
        <Info size={16} className="mt-0.5 shrink-0 text-[#F5A623]" />
        <p className="text-xs leading-relaxed text-slate-600">
          <span className="font-black uppercase tracking-wide text-[#0F1F3D]">
            PENTING:{" "}
          </span>
          Prosedur ini adalah standar mutlak perusahaan. Semua pihak di lapangan
          wajib mematuhi panduan dan menggunakan peralatan yang tertulis tanpa
          pengecualian.
        </p>
      </div>

      <NavFooter
        step={4}
        totalSteps={5}
        backLabel="HIRARC"
        nextLabel="Lanjut ke Instruksi Kerja"
        onBack={() => router.push("/work-permits/create/hirarc")}
        onNext={() => router.push("/work-permits/create/ik")}
      />
    </div>
  );
}
