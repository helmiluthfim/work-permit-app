"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Paperclip,
  ScrollText,
  ShieldAlert,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  ChevronDown,
  Sparkles,
  Upload,
  CheckCircle2,
  Camera, // <-- Ditambahkan Ikon Kamera
} from "lucide-react";
import { WorkPermitFormContext } from "../layout";

const arrayToText = (arr?: string[]) =>
  !arr || !Array.isArray(arr) ? "" : arr.join("\n");

// ─── Reusable field components ───────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-[#0F1F3D]/[0.03] px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F1F3D]/10">
          <Icon size={16} className="text-[#0F1F3D]" />
        </div>
        <h2 className="text-sm font-black uppercase tracking-wide text-[#0F1F3D]">
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
      {children}
      {required && <span className="ml-1 text-[#F5A623]">*</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-[#0F1F3D] placeholder-slate-400 outline-none transition focus:border-[#0F1F3D] focus:bg-white focus:ring-2 focus:ring-[#0F1F3D]/10";

const selectClass =
  "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-9 text-sm text-[#0F1F3D] outline-none transition focus:border-[#0F1F3D] focus:bg-white focus:ring-2 focus:ring-[#0F1F3D]/10 cursor-pointer";

// ─── Template Preview Row ─────────────────────────────────────────────────────

function TemplateRow({
  icon: Icon,
  accentColor,
  label,
  value,
}: {
  icon: React.ElementType;
  accentColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-white">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={13} className={accentColor} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {value || (
          <span className="italic text-slate-300">Tidak ada data...</span>
        )}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TabWorkPermit() {
  const router = useRouter();
  const { formData, setFormData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<any[]>([]);
  const [pjTeknikOptions, setPjTeknikOptions] = useState<any[]>([]);
  const [ahliK3Options, setAhliK3Options] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resJobs, resPjTeknik, resAhliK3] = await Promise.all([
          fetch("/api/job-templates"),
          fetch("/api/personnel?jabatan=PJ Teknik"),
          fetch("/api/personnel?jabatan=Tenaga Ahli K3"),
        ]);
        const [dataJobs, dataPjTeknik, dataAhliK3] = await Promise.all([
          resJobs.json(),
          resPjTeknik.json(),
          resAhliK3.json(),
        ]);
        if (dataJobs.success) setJobTemplates(dataJobs.data);
        if (dataPjTeknik.success) setPjTeknikOptions(dataPjTeknik.data);
        if (dataAhliK3.success) setAhliK3Options(dataAhliK3.data);
      } finally {
        setIsFetching(false);
      }
    };
    fetchMasterData();
  }, []);

  const handleJobChange = (jobId: string) => {
    const selectedJob = jobTemplates.find((j) => j._id === jobId);
    if (!selectedJob) return;
    setErrorMsg("");
    setFormData((prev: any) => ({
      ...prev,
      pekerjaanId: jobId,

      // Work Permit
      wpKlasifikasi: arrayToText(
        selectedJob.workPermitTemplate?.klasifikasiPekerjaan,
      ),
      wpProsedur: arrayToText(
        selectedJob.workPermitTemplate?.prosedurPekerjaan,
      ),
      wpLampiran: arrayToText(selectedJob.workPermitTemplate?.lampiran),

      // JSA
      jsaDocs: (selectedJob.jsaTemplate || []).map((jsa: any) => ({
        judulJsa: jsa.judulJsa || "",
        langkahKerja: arrayToText(jsa.langkahKerja),
        bahayaResiko: arrayToText(jsa.bahayaResiko),
        pengendalian: arrayToText(jsa.pengendalian),
      })),

      // HIRARC
      hirarcPotensi: arrayToText(selectedJob.hirarcTemplate?.potensiBahaya),
      hirarcResiko: arrayToText(selectedJob.hirarcTemplate?.resiko),
      hirarcKeparahan: arrayToText(
        selectedJob.hirarcTemplate?.konsekuensiKeparahan,
      ),
      hirarcKemungkinan: arrayToText(
        selectedJob.hirarcTemplate?.kemungkinanTerjadi,
      ),
      hirarcTingkat: arrayToText(selectedJob.hirarcTemplate?.tingkatResiko),
      hirarcPengendalian: arrayToText(selectedJob.hirarcTemplate?.pengendalian),
      hirarcKeparahanSetelah: arrayToText(
        selectedJob.hirarcTemplate?.konsekuensiSetelahPengendalian,
      ),
      hirarcKemungkinanSetelah: arrayToText(
        selectedJob.hirarcTemplate?.kemungkinanTerjadiSetelahPengendalian,
      ),
      hirarcTingkatSetelah: arrayToText(
        selectedJob.hirarcTemplate?.tingkatResikoSetelahPengendalian,
      ),
      hirarcStatusPengendalian:
        selectedJob.hirarcTemplate?.statusPengendalian || "",
      hirarcPenanggungJawab: arrayToText(
        selectedJob.hirarcTemplate?.penanggungJawab,
      ),

      // SOP
      sopDocs: (selectedJob.sopTemplate || []).map((sop: any) => ({
        judulSop: sop.judulSop || "",
        perlengkapanKerja: arrayToText(sop.perlengkapanKerja),
        peralatanUkur: arrayToText(sop.peralatanUkur),
        peralatanKerja: arrayToText(sop.peralatanKerja),
        judulUraianKegiatan: arrayToText(sop.judulUraianKegiatan),
        uraianKegiatan: arrayToText(sop.uraianKegiatan),
      })),

      // IK
      ikDocs: (selectedJob.ikTemplate || []).map((ik: any) => ({
        judulIk: ik.judulIk || "",
        perlengkapanKerja: arrayToText(ik.perlengkapanKerja),
        peralatanUkur: arrayToText(ik.peralatanUkur),
        peralatanKerja: arrayToText(ik.peralatanKerja),
        judulUraianKegiatan: arrayToText(ik.judulUraianKegiatan),
        uraianKegiatan: arrayToText(ik.uraianKegiatan),
      })),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (errorMsg) setErrorMsg("");
    const { name, value } = e.target;

    setFormData((prev: any) => {
      const updated = { ...prev, [name]: value };

      // Reset tanggal selesai jika tanggal mulai diubah melebihi tanggal selesai
      if (
        name === "tanggalMulai" &&
        prev.tanggalSelesai &&
        value > prev.tanggalSelesai
      ) {
        updated.tanggalSelesai = "";
      }

      return updated;
    });
  };

  // Fungsi khusus untuk menangani upload file (KTP)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) setErrorMsg("");
    const { name, files } = e.target;

    if (files && files.length > 0) {
      setFormData((prev: any) => ({
        ...prev,
        [name]: files[0], // Menyimpan object File ke dalam state
      }));
    } else {
      setFormData((prev: any) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleNext = () => {
    const {
      pekerjaanId,
      lokasi,
      tanggalMulai,
      waktuMulai,
      tanggalSelesai,
      waktuSelesai,
      pjTeknik,
      noTelpPjTeknik,
      tenagaAhliK3,
      noTelpTenagaAhliK3,
      fileKtp,
    } = formData;

    // Validasi field wajib.
    if (
      !pekerjaanId ||
      !lokasi ||
      !tanggalMulai ||
      !waktuMulai ||
      !tanggalSelesai ||
      !waktuSelesai ||
      !pjTeknik ||
      !noTelpPjTeknik ||
      !tenagaAhliK3 ||
      !noTelpTenagaAhliK3 ||
      (!fileKtp && !formData.existingKtp)
    ) {
      setErrorMsg(
        "Semua kolom bertanda (*) wajib diisi (termasuk dokumen KTP) sebelum lanjut ke tab JSA.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (tanggalSelesai < tanggalMulai) {
      setErrorMsg("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (tanggalSelesai === tanggalMulai && waktuSelesai <= waktuMulai) {
      setErrorMsg(
        "Jam selesai harus setelah jam mulai jika tanggal pelaksanaan sama.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrorMsg("");
    const queryStr = formData.editId ? `?editId=${formData.editId}` : "";
    router.push(`/work-permits/create/jsa${queryStr}`);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
          <p className="text-sm font-medium text-slate-400">
            Memuat referensi data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* ── ERROR BANNER ── */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-in fade-in slide-in-from-top-2">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-bold text-red-700">
              Formulir belum lengkap
            </p>
            <p className="mt-0.5 text-xs text-red-500">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* ── 1. TEMPLATE PEKERJAAN ── */}
      <SectionCard title="Template Pekerjaan" icon={FileText}>
        <div className="space-y-4">
          <div>
            <FieldLabel required>Pilih Template Pekerjaan</FieldLabel>
            <div className="relative">
              <select
                name="pekerjaanId"
                value={formData.pekerjaanId}
                onChange={(e) => handleJobChange(e.target.value)}
                className={selectClass}
                disabled={formData.editMode} // Disable ubah template saat revisi (opsional)
              >
                <option value="" disabled>
                  — Pilih template pekerjaan —
                </option>
                {jobTemplates.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.kodePekerjaan} · {job.namaPekerjaan}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
            {formData.editMode && (
              <p className="mt-2 text-xs text-slate-500 italic">
                *Template pekerjaan tidak dapat diubah pada saat proses revisi.
              </p>
            )}
          </div>

          {/* Template preview */}
          {formData.pekerjaanId && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#F5A623]/10 px-3 py-2">
                <Sparkles size={13} className="text-[#F5A623]" />
                <p className="text-xs font-bold text-[#0F1F3D]">
                  Data template berhasil dimuat — semua tab terisi otomatis
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <TemplateRow
                  icon={Briefcase}
                  accentColor="text-indigo-500"
                  label="Klasifikasi Pekerjaan"
                  value={formData.wpKlasifikasi}
                />
                <TemplateRow
                  icon={ScrollText}
                  accentColor="text-sky-500"
                  label="Prosedur Pekerjaan"
                  value={formData.wpProsedur}
                />
                <TemplateRow
                  icon={Paperclip}
                  accentColor="text-slate-500"
                  label="Lampiran"
                  value={formData.wpLampiran}
                />
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── 2. LOKASI ── */}
      <SectionCard title="Lokasi Pekerjaan" icon={MapPin}>
        <div>
          <FieldLabel required>Lokasi Aktual Pekerjaan</FieldLabel>
          <input
            type="text"
            name="lokasi"
            value={formData.lokasi}
            onChange={handleChange}
            placeholder="Contoh: Area Workshop Utama, Gedung B Lt. 2"
            className={inputClass}
          />
        </div>
      </SectionCard>

      {/* ── 3. JADWAL ── */}
      <SectionCard title="Jadwal Pelaksanaan" icon={Calendar}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Mulai */}
          <div>
            <FieldLabel required>Tanggal &amp; Jam Mulai</FieldLabel>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  name="tanggalMulai"
                  value={formData.tanggalMulai}
                  onChange={handleChange}
                  className={`${inputClass} pl-9`}
                />
              </div>
              <div className="relative">
                <Clock
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="time"
                  name="waktuMulai"
                  value={formData.waktuMulai}
                  onChange={handleChange}
                  className={`${inputClass} pl-9 w-32`}
                />
              </div>
            </div>
          </div>

          {/* Selesai */}
          <div>
            <FieldLabel required>Tanggal &amp; Jam Selesai</FieldLabel>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={formData.tanggalSelesai}
                  onChange={handleChange}
                  min={formData.tanggalMulai || undefined}
                  className={`${inputClass} pl-9`}
                />
              </div>
              <div className="relative">
                <Clock
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="time"
                  name="waktuSelesai"
                  value={formData.waktuSelesai}
                  onChange={handleChange}
                  min={
                    formData.tanggalSelesai &&
                    formData.tanggalSelesai === formData.tanggalMulai
                      ? formData.waktuMulai || undefined
                      : undefined
                  }
                  className={`${inputClass} pl-9 w-32`}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 4. PERSONEL ── */}
      <SectionCard title="Personel Bertanggung Jawab" icon={Users}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* PJ Teknik */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="h-2 w-2 rounded-full bg-[#0F1F3D]" />
              <span className="text-xs font-black uppercase tracking-wide text-[#0F1F3D]">
                PJ Teknik
              </span>
            </div>
            <div>
              <FieldLabel required>Nama PJ Teknik</FieldLabel>
              <div className="relative">
                <select
                  name="pjTeknik"
                  value={formData.pjTeknik}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">— Pilih PJ Teknik —</option>
                  {pjTeknikOptions.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
            <div>
              <FieldLabel required>No. Telepon</FieldLabel>
              <div className="relative">
                <Phone
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  name="noTelpPjTeknik"
                  value={formData.noTelpPjTeknik}
                  onChange={handleChange}
                  placeholder="08xx-xxxx-xxxx"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Tenaga Ahli K3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="h-2 w-2 rounded-full bg-[#F5A623]" />
              <span className="text-xs font-black uppercase tracking-wide text-[#0F1F3D]">
                Tenaga Ahli K3
              </span>
            </div>
            <div>
              <FieldLabel required>Nama Ahli K3</FieldLabel>
              <div className="relative">
                <select
                  name="tenagaAhliK3"
                  value={formData.tenagaAhliK3}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">— Pilih Ahli K3 —</option>
                  {ahliK3Options.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
            <div>
              <FieldLabel required>No. Telepon</FieldLabel>
              <div className="relative">
                <Phone
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  name="noTelpTenagaAhliK3"
                  value={formData.noTelpTenagaAhliK3}
                  onChange={handleChange}
                  placeholder="08xx-xxxx-xxxx"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 5. DOKUMEN PENDUKUNG (Upload KTP) ── */}
      <SectionCard title="Dokumen Pendukung" icon={Upload}>
        <div className="space-y-4">
          <div>
            <FieldLabel required>
              Upload KTP / Identitas Diri Pekerja
            </FieldLabel>

            {/* ✅ PERUBAHAN: Layout fleksibel untuk File Input dan Kamera */}
            <div className="mt-1 flex flex-col sm:flex-row gap-3">
              {/* Pilihan 1: File/Gallery Explorer */}
              <div className="relative flex-1">
                <input
                  type="file"
                  name="fileKtp"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[#0F1F3D]/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#0F1F3D] hover:file:bg-[#0F1F3D]/20 focus:outline-none"
                />
              </div>

              {/* Pilihan 2: Ambil Foto Bawaan Kamera (Khusus Mobile) */}
              <div className="relative">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F1F3D]/10 px-4 py-2.5 text-sm font-semibold text-[#0F1F3D] transition hover:bg-[#0F1F3D]/20">
                  <Camera size={16} />
                  <span>Ambil Foto</span>
                  <input
                    type="file"
                    name="fileKtp"
                    accept="image/*"
                    capture="environment" // <-- Ini yang memicu kamera terbuka secara native
                    onChange={handleFileChange}
                    className="hidden" // Disembunyikan agar UI digantikan oleh label di atasnya
                  />
                </label>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Format yang didukung: JPG, PNG, atau PDF (Maksimal 2MB)
            </p>

            {/* Indikator File Berhasil Dipilih atau Menggunakan KTP Lama */}
            {formData.fileKtp ? (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                <FileText size={18} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-none">
                    File terpilih
                  </span>
                  <span className="mt-1 text-xs opacity-80">
                    {formData.fileKtp.name}
                  </span>
                </div>
              </div>
            ) : formData.existingKtp ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                <CheckCircle2 size={16} />
                KTP lama Anda telah tersimpan. Unggah/foto ulang HANYA JIKA Anda
                ingin menggantinya.
              </div>
            ) : null}
          </div>
        </div>
      </SectionCard>

      {/* ── NAVIGASI ── */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4">
        <p className="text-xs text-slate-400">
          Langkah <span className="font-bold text-[#0F1F3D]">1</span> dari 5 —
          Work Permit
        </p>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F1F3D] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#1a3561] active:scale-95"
        >
          Lanjut ke JSA
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
