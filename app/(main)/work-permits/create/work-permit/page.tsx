"use client";

import { useState, useEffect, useContext, useRef } from "react";
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
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { WorkPermitFormContext } from "../layout";

const arrayToText = (arr?: string[]) =>
  !arr || !Array.isArray(arr) ? "" : arr.join("\n");

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

export default function TabWorkPermit() {
  const router = useRouter();
  const { formData, setFormData } = useContext(WorkPermitFormContext);

  const [jobTemplates, setJobTemplates] = useState<any[]>([]);
  const [pjTeknikOptions, setPjTeknikOptions] = useState<any[]>([]);
  const [ahliK3Options, setAhliK3Options] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewKtp, setPreviewKtp] = useState<string | null>(null);

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

  // ✅ Logika Pratinjau Gambar
  useEffect(() => {
    if (formData.fileKtp) {
      // Jika ada file baru dipilih
      const objectUrl = URL.createObjectURL(formData.fileKtp);
      setPreviewKtp(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (formData.fileKtpBase64) {
      // Jika sedang merevisi dan ada Base64 KTP lama dari backend
      setPreviewKtp(formData.fileKtpBase64);
    } else {
      setPreviewKtp(null);
    }
  }, [formData.fileKtp, formData.fileKtpBase64]);

  const handleJobChange = (jobId: string) => {
    const selectedJob = jobTemplates.find((j) => j._id === jobId);
    if (!selectedJob) return;
    setErrorMsg("");
    setFormData((prev: any) => ({
      ...prev,
      pekerjaanId: jobId,
      wpKlasifikasi: arrayToText(
        selectedJob.workPermitTemplate?.klasifikasiPekerjaan,
      ),
      wpProsedur: arrayToText(
        selectedJob.workPermitTemplate?.prosedurPekerjaan,
      ),
      wpLampiran: arrayToText(selectedJob.workPermitTemplate?.lampiran),
      // ... tab lainnya (JSA, HIRARC, dll) sesuai bawaan template
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (errorMsg) setErrorMsg("");
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const updated = { ...prev, [name]: value };
      if (
        name === "tanggalMulai" &&
        prev.tanggalSelesai &&
        value > prev.tanggalSelesai
      )
        updated.tanggalSelesai = "";
      return updated;
    });
  };

  // ✅ Handler Ganti Foto (Seperti di Profil)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) setErrorMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal 2MB");
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      fileKtp: file,
      existingKtp: false, // Menandakan tidak lagi menggunakan KTP lama
    }));
  };

  // ✅ Handler Hapus Foto (Batal Upload / Buang KTP Lama)
  const handleDeleteKtp = () => {
    setFormData((prev: any) => ({
      ...prev,
      fileKtp: null,
      fileKtpBase64: null, // Hapus gambar lama dari tampilan
      existingKtp: false, // Wajibkan user upload yang baru
    }));
    setPreviewKtp(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    // Periksa KTP: Jika tidak ada file baru DAN tidak menggunakan existingKtp, berarti wajib upload!
    const isKtpMissing = !fileKtp && !formData.existingKtp;

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
      isKtpMissing
    ) {
      setErrorMsg(
        "Semua kolom bertanda (*) wajib diisi (termasuk dokumen KTP) sebelum lanjut ke tab JSA.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrorMsg("");
    const queryStr = formData.editId ? `?editId=${formData.editId}` : "";
    router.push(`/work-permits/create/jsa${queryStr}`);
  };

  if (isFetching)
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
      </div>
    );

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
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
                disabled={formData.editMode}
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

          {formData.pekerjaanId && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#F5A623]/10 px-3 py-2">
                <Sparkles size={13} className="text-[#F5A623]" />
                <p className="text-xs font-bold text-[#0F1F3D]">
                  Data template berhasil dimuat
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
        <FieldLabel required>Lokasi Aktual Pekerjaan</FieldLabel>
        <input
          type="text"
          name="lokasi"
          value={formData.lokasi}
          onChange={handleChange}
          placeholder="Contoh: Area Workshop Utama, Gedung B Lt. 2"
          className={inputClass}
        />
      </SectionCard>

      {/* ── 3. JADWAL ── */}
      <SectionCard title="Jadwal Pelaksanaan" icon={Calendar}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel required>Tanggal &amp; Jam Mulai</FieldLabel>
            <div className="flex gap-2">
              <input
                type="date"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                className={`${inputClass} flex-1`}
              />
              <input
                type="time"
                name="waktuMulai"
                value={formData.waktuMulai}
                onChange={handleChange}
                className={`${inputClass} w-32`}
              />
            </div>
          </div>
          <div>
            <FieldLabel required>Tanggal &amp; Jam Selesai</FieldLabel>
            <div className="flex gap-2">
              <input
                type="date"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                min={formData.tanggalMulai}
                onChange={handleChange}
                className={`${inputClass} flex-1`}
              />
              <input
                type="time"
                name="waktuSelesai"
                value={formData.waktuSelesai}
                onChange={handleChange}
                className={`${inputClass} w-32`}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 4. PERSONEL ── */}
      <SectionCard title="Personel Bertanggung Jawab" icon={Users}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="h-2 w-2 rounded-full bg-[#0F1F3D]" />
              <span className="text-xs font-black uppercase text-[#0F1F3D]">
                PJ Teknik
              </span>
            </div>
            <div>
              <FieldLabel required>Nama PJ Teknik</FieldLabel>
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
            </div>
            <div>
              <FieldLabel required>No. Telepon</FieldLabel>
              <input
                type="tel"
                name="noTelpPjTeknik"
                value={formData.noTelpPjTeknik}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="h-2 w-2 rounded-full bg-[#F5A623]" />
              <span className="text-xs font-black uppercase text-[#0F1F3D]">
                Tenaga Ahli K3
              </span>
            </div>
            <div>
              <FieldLabel required>Nama Ahli K3</FieldLabel>
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
            </div>
            <div>
              <FieldLabel required>No. Telepon</FieldLabel>
              <input
                type="tel"
                name="noTelpTenagaAhliK3"
                value={formData.noTelpTenagaAhliK3}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 5. DOKUMEN PENDUKUNG (Upload KTP) ── */}
      <SectionCard title="Dokumen Pendukung" icon={Upload}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <FieldLabel required>
              Upload KTP / Identitas Diri Pekerja
            </FieldLabel>
            {formData.existingKtp && !formData.fileKtp && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 size={13} /> Tersimpan
              </span>
            )}
          </div>

          <div className="mb-4 flex min-h-[140px] items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4">
            {previewKtp ? (
              <img
                src={previewKtp}
                alt="Pratinjau KTP"
                className="max-h-40 object-contain rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <ImageIcon size={28} strokeWidth={1.5} />
                <p className="text-xs">Belum ada KTP yang diunggah</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            name="fileKtp"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="ktp-upload"
          />

          {previewKtp ? (
            <div className="flex gap-2">
              <label
                htmlFor="ktp-upload"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Upload size={15} /> Ganti File
              </label>
              <button
                type="button"
                onClick={handleDeleteKtp}
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <Trash2 size={15} /> Hapus
              </button>
            </div>
          ) : (
            <label
              htmlFor="ktp-upload"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0F1F3D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0F1F3D]/90"
            >
              <Upload size={15} /> Pilih File KTP
            </label>
          )}

          <p className="mt-3 text-[11px] text-slate-400 text-center">
            Format yang didukung: JPG, PNG, atau PDF (Maksimal 2MB)
          </p>
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
          Lanjut ke JSA <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
