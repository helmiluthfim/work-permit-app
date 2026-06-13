"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  Wrench,
  Ruler,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Send,
} from "lucide-react";
import { WorkPermitFormContext } from "../layout";
import {
  SectionCard,
  InfoSummaryBar,
  FormattedText,
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

// ─── Kartu peralatan IK ──────────────────────────────────────────────────────
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
      <div className="flex-1 px-5 py-4">
        <FormattedText text={content} />
      </div>
    </div>
  );
}

// ─── helper ──────────────────────────────────────────────────────────────────
const textToArray = (text: string) =>
  text
    ? text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

export default function TabIK() {
  const router = useRouter();
  const { formData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  // ✅ Baca dari ikDocs (array baru) — letakkan setelah selectedAhliK3
  const ikDocs: any[] = formData.ikDocs || [];

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      pekerjaan: formData.pekerjaanId,
      lokasi: formData.lokasi,
      tanggalMulai: formData.tanggalMulai,
      waktuMulai: formData.waktuMulai,
      tanggalSelesai: formData.tanggalSelesai,
      waktuSelesai: formData.waktuSelesai,
      pjTeknik: formData.pjTeknik,
      noTelpPjTeknik: formData.noTelpPjTeknik,
      tenagaAhliK3: formData.tenagaAhliK3,
      noTelpTenagaAhliK3: formData.noTelpTenagaAhliK3,

      workPermitData: {
        klasifikasiPekerjaan: textToArray(formData.wpKlasifikasi),
        prosedurPekerjaan: textToArray(formData.wpProsedur),
        lampiran: textToArray(formData.wpLampiran),
      },

      // ✅ pelaksana di root
      pelaksana: formData.jsaPelaksana || [],

      // ✅ jsaData array — map dari jsaDocs
      jsaData: (formData.jsaDocs || []).map((jsa: any) => ({
        judulJsa: jsa.judulJsa || "",
        langkahKerja: textToArray(jsa.langkahKerja),
        bahayaResiko: textToArray(jsa.bahayaResiko),
        pengendalian: textToArray(jsa.pengendalian),
      })),

      hirarcData: {
        potensiBahaya: textToArray(formData.hirarcPotensi),
        resiko: textToArray(formData.hirarcResiko),
        konsekuensiKeparahan: textToArray(formData.hirarcKeparahan),
        kemungkinanTerjadi: textToArray(formData.hirarcKemungkinan),
        tingkatResiko: textToArray(formData.hirarcTingkat),
        pengendalian: textToArray(formData.hirarcPengendalian),
        konsekuensiSetelahPengendalian: textToArray(
          formData.hirarcKeparahanSetelah,
        ),
        kemungkinanTerjadiSetelahPengendalian: textToArray(
          formData.hirarcKemungkinanSetelah,
        ),
        tingkatResikoSetelahPengendalian: textToArray(
          formData.hirarcTingkatSetelah,
        ),
        statusPengendalian: formData.hirarcStatusPengendalian || "",
        penanggungJawab: textToArray(formData.hirarcPenanggungJawab),
      },

      // ✅ sopData & ikData array — map dari sopDocs/ikDocs
      sopData: (formData.sopDocs || []).map((sop: any) => ({
        judulSop: sop.judulSop || "",
        perlengkapanKerja: textToArray(sop.perlengkapanKerja),
        peralatanUkur: textToArray(sop.peralatanUkur),
        peralatanKerja: textToArray(sop.peralatanKerja),
        judulUraianKegiatan: textToArray(sop.judulUraianKegiatan),
        uraianKegiatan: textToArray(sop.uraianKegiatan),
      })),

      ikData: (formData.ikDocs || []).map((ik: any) => ({
        judulIk: ik.judulIk || "",
        perlengkapanKerja: textToArray(ik.perlengkapanKerja),
        peralatanUkur: textToArray(ik.peralatanUkur),
        peralatanKerja: textToArray(ik.peralatanKerja),
        judulUraianKegiatan: textToArray(ik.judulUraianKegiatan),
        uraianKegiatan: textToArray(ik.uraianKegiatan),
      })),
    };
    try {
      const res = await fetch("/api/work-permits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Gagal menyimpan pengajuan.");

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2800);
    } catch (err: any) {
      setErrorMsg(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsSubmitting(false);
    }
  };

  if (isFetching)
    return <LoadingSpinner label="Menyiapkan dokumen Instruksi Kerja..." />;

  return (
    <div className="relative space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* ── OVERLAY SUKSES ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1F3D]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="mx-4 flex max-w-sm flex-col items-center rounded-3xl bg-white p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={44} className="text-emerald-500" />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              Pengajuan Berhasil
            </p>
            <h3 className="mb-2 text-xl font-black text-[#0F1F3D]">
              Dokumen K3 Diajukan!
            </h3>
            <p className="text-sm text-slate-500">
              Semua dokumen telah tersimpan ke sistem. Mengalihkan ke
              dashboard...
            </p>
            <div className="mt-6 flex gap-1.5">
              {[0, 75, 150].map((delay) => (
                <div
                  key={delay}
                  className="h-2 w-2 animate-bounce rounded-full bg-[#F5A623]"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error banner */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-in fade-in">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-bold text-red-700">Pengajuan gagal</p>
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

      {/* ── PERALATAN IK 3 kolom ── */}
      {/* ── DOKUMEN IK ── */}
      {ikDocs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
          <p className="text-sm text-slate-400">
            Data IK belum tersedia untuk template pekerjaan ini.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {ikDocs.map((ik: any, idx: number) => (
            <div key={idx} className="space-y-4">
              {/* Header dokumen IK */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                    Instruksi Kerja
                  </p>
                  <h2 className="text-base font-black text-[#0F1F3D]">
                    {ik.judulIk || `IK #${idx + 1}`}
                  </h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Read Only
                </span>
              </div>

              {/* 3 Kolom Peralatan */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <EquipCard
                  icon={Shield}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-600"
                  label="Perlengkapan Kerja (APD)"
                  content={ik.perlengkapanKerja}
                />
                <EquipCard
                  icon={Ruler}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                  label="Peralatan Ukur"
                  content={ik.peralatanUkur}
                />
                <EquipCard
                  icon={Wrench}
                  iconBg="bg-[#F5A623]/15"
                  iconColor="text-amber-600"
                  label="Peralatan Kerja"
                  content={ik.peralatanKerja}
                />
              </div>

              {/* Judul Uraian Kegiatan */}
              <SectionCard
                title="Judul Uraian Kegiatan"
                icon={FileText}
                badge="Read Only"
              >
                <div className="min-h-[6rem]">
                  <FormattedText text={ik.judulUraianKegiatan} />
                </div>
              </SectionCard>

              {/* Uraian Kegiatan */}
              <SectionCard
                title="Uraian Kegiatan Detail"
                icon={FileText}
                badge="Read Only"
              >
                <div className="min-h-[12rem]">
                  <FormattedText text={ik.uraianKegiatan} />
                </div>
              </SectionCard>

              {/* Divider antar dokumen */}
              {idx < ikDocs.length - 1 && <hr className="border-slate-200" />}
            </div>
          ))}
        </div>
      )}

      {/* ── PERNYATAAN KEPATUHAN ── */}
      <div className="rounded-2xl border border-[#0F1F3D]/15 bg-[#0F1F3D]/[0.03] p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-1 w-6 rounded-full bg-[#F5A623]" />
          <p className="text-xs font-black uppercase tracking-widest text-[#0F1F3D]">
            Pernyataan Kepatuhan
          </p>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Dengan menekan{" "}
          <span className="font-bold text-[#0F1F3D]">Ajukan Dokumen K3</span>,
          Anda selaku Penanggung Jawab Teknik memastikan bahwa seluruh data Work
          Permit beserta dokumen pendukungnya{" "}
          <span className="font-semibold">(JSA, HIRARC, SOP, IK)</span> telah
          ditinjau dan sesuai dengan kondisi lapangan aktual.
        </p>
      </div>

      {/* ── NAVIGASI FINAL ── */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/work-permits/create/sop")}
            disabled={isSubmitting || showSuccess}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
          >
            ← SOP
          </button>
          <p className="hidden text-xs text-slate-400 sm:block">
            Langkah <span className="font-bold text-[#0F1F3D]">5</span> dari 5 —
            Langkah Terakhir
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmitFinal}
          disabled={isSubmitting || showSuccess}
          className="inline-flex items-center gap-2 rounded-xl bg-[#F5A623] px-7 py-2.5 text-sm font-black text-[#0F1F3D] shadow-md transition hover:-translate-y-px hover:bg-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting || showSuccess ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F1F3D] border-t-transparent" />
              Memproses...
            </>
          ) : (
            <>
              <Send size={15} />
              Ajukan Dokumen K3
            </>
          )}
        </button>
      </div>
    </div>
  );
}
