"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PenTool,
} from "lucide-react";

const roleLabel: Record<string, string> = {
  PJ_TEKNIK: "PJ Teknik",
  TENAGA_AHLI_K3: "Tenaga Ahli K3",
  DIREKTUR: "Direktur",
};

export default function ProfilePage() {
  const { data: session } = useSession();

  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSignature();
  }, []);

  async function fetchSignature() {
    try {
      const res = await fetch("/api/profile/signature");
      if (res.ok) {
        const data = await res.json();
        setSignatureUrl(data.signatureUrl);
      }
    } catch {
      // biarkan, tampilkan state kosong
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSuccess(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(selected.type)) {
      setError("Format file harus PNG atau JPG");
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/signature", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Gagal mengunggah tanda tangan");

      setSignatureUrl(data.signatureUrl);
      setFile(null);
      setPreview(null);
      setSuccess("Tanda tangan berhasil diunggah");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/profile/signature", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus tanda tangan");
      }
      setSignatureUrl(null);
      setSuccess("Tanda tangan berhasil dihapus");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setDeleting(false);
    }
  }

  function cancelPreview() {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const username =
    session?.user?.name || (session?.user as any)?.username || "Pengguna";
  const role = (session?.user as any)?.role as string | undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#0F1F3D]">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola informasi akun dan tanda tangan digital Anda.
        </p>
      </div>

      {/* Info akun */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Informasi Akun
        </p>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0F1F3D] text-base font-bold text-white">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#0F1F3D]">
              {username}
            </p>
            {role && (
              <span className="mt-1 inline-block rounded-full bg-[#F5A623]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#F5A623]">
                {roleLabel[role] ?? role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tanda tangan */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Tanda Tangan Digital
            </p>
            {role && (
              <p className="mt-0.5 text-xs text-slate-400">
                Untuk role:{" "}
                <span className="font-semibold text-[#0F1F3D]">
                  {roleLabel[role] ?? role}
                </span>
              </p>
            )}
          </div>
          {signatureUrl && !preview && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 size={13} /> Tersimpan
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center text-slate-400">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : (
          <>
            {/* Area pratinjau */}
            <div className="mb-4 flex min-h-[140px] items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Pratinjau tanda tangan"
                  className="max-h-32 object-contain"
                />
              ) : signatureUrl ? (
                <img
                  src={signatureUrl}
                  alt="Tanda tangan"
                  className="max-h-32 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <PenTool size={22} strokeWidth={1.5} />
                  <p className="text-xs">
                    Belum ada tanda tangan yang diunggah
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {success && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={14} /> {success}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              className="hidden"
              id="signature-input"
            />

            {preview ? (
              <div className="flex gap-2">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#F5A623] px-4 py-2.5 text-sm font-bold text-[#0F1F3D] transition hover:brightness-95 disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Upload size={15} />
                  )}
                  {uploading ? "Mengunggah..." : "Simpan Tanda Tangan"}
                </button>
                <button
                  onClick={cancelPreview}
                  disabled={uploading}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <label
                  htmlFor="signature-input"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0F1F3D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0F1F3D]/90"
                >
                  <Upload size={15} />
                  {signatureUrl ? "Ganti Tanda Tangan" : "Unggah Tanda Tangan"}
                </label>
                {signatureUrl && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleting ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                )}
              </div>
            )}
            <p className="mt-2 text-[11px] text-slate-400">
              Format PNG atau JPG, ukuran maksimal 2MB. Gunakan gambar tanda
              tangan dengan latar belakang transparan atau putih.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
