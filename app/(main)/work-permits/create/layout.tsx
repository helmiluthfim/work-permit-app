"use client";

import { createContext, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FileText,
  ShieldAlert,
  Activity,
  ClipboardList,
  BookOpen,
  Lock,
  CheckCircle2,
} from "lucide-react";

export const WorkPermitFormContext = createContext<any>(null);

const TABS = [
  {
    name: "Work Permit",
    shortName: "WP",
    path: "/work-permits/create/work-permit",
    icon: FileText,
    desc: "Info & Jadwal",
  },
  {
    name: "JSA",
    shortName: "JSA",
    path: "/work-permits/create/jsa",
    icon: ShieldAlert,
    desc: "Analisis Bahaya",
  },
  {
    name: "HIRARC",
    shortName: "HRC",
    path: "/work-permits/create/hirarc",
    icon: Activity,
    desc: "Penilaian Risiko",
  },
  {
    name: "SOP",
    shortName: "SOP",
    path: "/work-permits/create/sop",
    icon: ClipboardList,
    desc: "Prosedur Kerja",
  },
  {
    name: "Instruksi Kerja",
    shortName: "IK",
    path: "/work-permits/create/ik",
    icon: BookOpen,
    desc: "Panduan Teknis",
  },
];

export default function CreateWorkPermitLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [formData, setFormData] = useState({
    pekerjaanId: "",
    lokasi: "",
    tanggalMulai: "",
    waktuMulai: "",
    tanggalSelesai: "",
    waktuSelesai: "",
    pjTeknik: "",
    noTelpPjTeknik: "",
    tenagaAhliK3: "",
    noTelpTenagaAhliK3: "",
    wpKlasifikasi: "",
    wpProsedur: "",
    wpLampiran: "",
    jsaPelaksana: [],
    jsaLangkah: "",
    jsaBahaya: "",
    jsaPengendalian: "",
    hirarcPotensi: "",
    hirarcResiko: "",
    hirarcPengendalian: "",
    hirarcPenanggungJawab: "",
    hirarcKeparahan: "",
    hirarcKemungkinan: "",
    hirarcTingkat: "",
    hirarcKeparahanSetelah: "",
    hirarcKemungkinanSetelah: "",
    hirarcTingkatSetelah: "",
    hirarcStatusPengendalian: "",
    sopPerlengkapan: "",
    sopAlatUkur: "",
    sopAlatKerja: "",
    sopJudulUraianKegiatan: "",
    sopUraian: "",
    ikPerlengkapan: "",
    ikAlatUkur: "",
    ikAlatKerja: "",
    ikJudulUraianKegiatan: "",
    ikUraian: "",
  });

  const isWpValid = () =>
    !!(
      formData.pekerjaanId &&
      formData.lokasi &&
      formData.tanggalMulai &&
      formData.waktuMulai &&
      formData.tanggalSelesai &&
      formData.waktuSelesai &&
      formData.pjTeknik &&
      formData.noTelpPjTeknik &&
      formData.tenagaAhliK3 &&
      formData.noTelpTenagaAhliK3
    );

  const isJsaValid = () =>
    isWpValid() && formData.jsaPelaksana && formData.jsaPelaksana.length > 0;

  const canAccessTab = (index: number) => {
    if (index === 0) return true;
    if (index === 1) return isWpValid();
    if (index >= 2) return isJsaValid();
    return false;
  };

  const isTabDone = (index: number) => {
    if (index === 0) return isWpValid();
    if (index === 1) return isJsaValid();
    return false;
  };

  const activeIndex = TABS.findIndex((t) => pathname.includes(t.path));

  return (
    <WorkPermitFormContext.Provider value={{ formData, setFormData }}>
      <div className="min-h-full w-full bg-[#F7F8FA]">
        {/* ── TOP HEADER BAR ── */}
        <div className="bg-[#0F1F3D] px-6 py-5 md:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              Dokumen K3
            </p>
            <h1 className="text-xl font-black tracking-tight text-white">
              Buat Work Permit Baru
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Lengkapi seluruh dokumen secara berurutan untuk mengajukan izin
              kerja.
            </p>
          </div>
        </div>

        {/* ── STEPPER TAB ── */}
        <div className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto max-w-5xl">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {TABS.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = pathname.includes(tab.path);
                const unlocked = canAccessTab(index);
                const done = isTabDone(index);
                const isPast = activeIndex > index;

                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => unlocked && router.push(tab.path)}
                    disabled={!unlocked}
                    title={
                      !unlocked
                        ? "Lengkapi tab sebelumnya untuk membuka"
                        : tab.name
                    }
                    className={`
                      group relative flex min-w-[120px] flex-1 flex-col items-center gap-1.5 
                      px-4 py-4 text-center transition-all
                      ${
                        isActive
                          ? "cursor-default"
                          : unlocked
                            ? "cursor-pointer hover:bg-slate-50"
                            : "cursor-not-allowed"
                      }
                    `}
                  >
                    {/* Step indicator circle */}
                    <div
                      className={`
                        flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all
                        ${
                          isActive
                            ? "bg-[#0F1F3D] text-white shadow-md ring-2 ring-[#F5A623] ring-offset-2"
                            : done || isPast
                              ? "bg-emerald-500 text-white"
                              : unlocked
                                ? "border-2 border-slate-300 bg-white text-slate-500 group-hover:border-[#0F1F3D] group-hover:text-[#0F1F3D]"
                                : "border-2 border-slate-200 bg-slate-50 text-slate-300"
                        }
                      `}
                    >
                      {done || (isPast && !isActive) ? (
                        <CheckCircle2 size={16} />
                      ) : !unlocked ? (
                        <Lock size={12} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Tab name */}
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-bold whitespace-nowrap ${
                          isActive
                            ? "text-[#0F1F3D]"
                            : unlocked
                              ? "text-slate-600"
                              : "text-slate-300"
                        }`}
                      >
                        {tab.name}
                      </span>
                      <span
                        className={`hidden text-[10px] sm:block ${
                          isActive
                            ? "text-[#F5A623]"
                            : unlocked
                              ? "text-slate-400"
                              : "text-slate-300"
                        }`}
                      >
                        {tab.desc}
                      </span>
                    </div>

                    {/* Active bottom bar */}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all ${
                        isActive ? "bg-[#F5A623]" : "bg-transparent"
                      }`}
                    />

                    {/* Connector line between steps */}
                    {index < TABS.length - 1 && (
                      <span
                        className={`absolute right-0 top-[2.1rem] h-px w-1/4 translate-x-1/2 transition-colors ${
                          isPast || done ? "bg-emerald-300" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="h-1 w-full bg-slate-200">
          <div
            className="h-full bg-[#F5A623] transition-all duration-500"
            style={{
              width: `${activeIndex < 0 ? 0 : ((activeIndex + 1) / TABS.length) * 100}%`,
            }}
          />
        </div>

        {/* ── KONTEN ── */}
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">{children}</div>
      </div>
    </WorkPermitFormContext.Provider>
  );
}
