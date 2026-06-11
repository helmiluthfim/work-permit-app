"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Activity, ShieldAlert } from "lucide-react";
import { WorkPermitFormContext } from "../layout";
import {
  SectionCard,
  InfoSummaryBar,
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
  hirarcTemplate?: any;
}

// ─── Skor cell ────────────────────────────────────────────────────────────────
function ScoreCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "red" | "green";
}) {
  const bg =
    highlight === "red"
      ? "bg-red-50 border-red-200 text-red-700"
      : highlight === "green"
        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
        : "bg-slate-50 border-slate-200 text-slate-700";

  return (
    <div
      className={`flex flex-col items-center rounded-lg border p-2.5 text-center ${bg}`}
    >
      <span className="mb-1 text-[10px] font-bold uppercase tracking-wide opacity-60">
        {label}
      </span>
      <span className="text-sm font-black">{value || "—"}</span>
    </div>
  );
}

// ─── HIRARC Card ──────────────────────────────────────────────────────────────
function HirarcCard({ h, index }: { h: any; index: number }) {
  const statusArray =
    h.statusPengendalian && typeof h.statusPengendalian === "string"
      ? h.statusPengendalian.split(", ")
      : Array.isArray(h.statusPengendalian)
        ? h.statusPengendalian
        : [];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Numbered header strip */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-[#0F1F3D] px-5 py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#F5A623] text-xs font-black text-[#F5A623]">
          {index + 1}
        </span>
        <p className="text-sm font-bold text-white">
          {h.potensiBahaya?.[index] || `Bahaya #${index + 1}`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2">
        {/* Kiri: identifikasi */}
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Resiko
            </p>
            <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800">
              {h.resiko?.[index] || "—"}
            </p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Tindakan Pengendalian
            </p>
            <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800">
              {h.pengendalian?.[index] || "—"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Penanggung Jawab
              </p>
              <p className="rounded-xl border border-[#0F1F3D]/10 bg-[#0F1F3D]/5 px-3 py-2 text-sm font-bold text-[#0F1F3D]">
                {h.penanggungJawab?.[index] || "—"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Status
              </p>
              <p className="rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/10 px-3 py-2 text-sm font-bold text-amber-800">
                {statusArray[index] || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Kanan: skor */}
        <div className="space-y-3">
          {/* Skor awal */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Skor Penilaian Awal
            </p>
            <div className="grid grid-cols-3 gap-2">
              <ScoreCell
                label="Keparahan"
                value={h.konsekuensiKeparahan?.[index]}
              />
              <ScoreCell
                label="Kemungkinan"
                value={h.kemungkinanTerjadi?.[index]}
              />
              <ScoreCell
                label="Tingkat"
                value={h.tingkatResiko?.[index]}
                highlight="red"
              />
            </div>
          </div>
          {/* Skor setelah */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Skor Setelah Pengendalian
            </p>
            <div className="grid grid-cols-3 gap-2">
              <ScoreCell
                label="Keparahan"
                value={h.konsekuensiSetelahPengendalian?.[index]}
              />
              <ScoreCell
                label="Kemungkinan"
                value={h.kemungkinanTerjadiSetelahPengendalian?.[index]}
              />
              <ScoreCell
                label="Tingkat"
                value={h.tingkatResikoSetelahPengendalian?.[index]}
                highlight="green"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TabHIRARC() {
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

  const h = selectedJob?.hirarcTemplate;
  const hasData = h?.potensiBahaya?.length > 0;

  if (isFetching)
    return <LoadingSpinner label="Menyiapkan dokumen HIRARC..." />;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <InfoSummaryBar
        formData={formData}
        selectedJob={selectedJob}
        selectedPjTeknik={selectedPjTeknik}
        selectedAhliK3={selectedAhliK3}
      />

      <SectionCard
        title="Hazard Identification, Risk Assessment & Risk Control"
        icon={Activity}
        badge="Read Only"
      >
        {!hasData ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-slate-400">
            <Activity size={36} className="mb-3 text-slate-200" />
            <p className="text-sm font-medium">
              Data HIRARC belum tersedia di Master Pekerjaan ini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {h.potensiBahaya.map((_: string, index: number) => (
              <HirarcCard key={index} h={h} index={index} />
            ))}

            {/* Disclaimer */}
            <div className="flex items-start gap-3 rounded-xl border border-[#0F1F3D]/10 bg-[#0F1F3D]/5 p-4">
              <ShieldAlert
                size={16}
                className="mt-0.5 shrink-0 text-[#0F1F3D]"
              />
              <p className="text-xs leading-relaxed text-slate-600">
                <span className="font-bold text-[#0F1F3D]">
                  Pemberitahuan:{" "}
                </span>
                Seluruh poin HIRARC di atas akan disalin otomatis ke dokumen
                pengajuan akhir. Jika kondisi lapangan berbeda, hubungi Tenaga
                Ahli K3 untuk merevisi Master Pekerjaan.
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      <NavFooter
        step={3}
        totalSteps={5}
        backLabel="JSA"
        nextLabel="Lanjut ke SOP"
        onBack={() => router.push("/work-permits/create/jsa")}
        onNext={() => router.push("/work-permits/create/sop")}
      />
    </div>
  );
}
