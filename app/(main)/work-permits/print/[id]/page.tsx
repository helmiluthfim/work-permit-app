// ==========================================
// MAIN PAGE: WORK PERMIT PRINT
// ==========================================

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Permit } from "./_lib/types";
import { ActionButtons } from "./_components/ActionButtons";
import { WorkPermitHTML } from "./_components/WorkPermitHTML";
import { JsaHTML } from "./_components/JsaHTML";

export default function WorkPermitPrintPage() {
  const params = useParams();
  const id = params?.id as string;

  const [permit, setPermit] = useState<Permit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!id) return; // guard: tunggu sampai id tersedia

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/work-permits/${id}`, {
          credentials: "include", // kirim session cookie Next-Auth
        });

        if (!res.ok) {
          console.error("Fetch gagal, status:", res.status);
          setLoading(false);
          return;
        }

        const result = await res.json();
        if (result.success) {
          setPermit(result.data);
        } else {
          console.error("API error:", result.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center print:hidden">
        <p className="animate-pulse text-sm font-medium text-slate-500">
          Menyiapkan dokumen...
        </p>
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="p-8 text-center text-slate-500 print:hidden">
        Dokumen tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 py-8 print:bg-white print:py-0">
      {/* Tombol Aksi (hanya tampil di layar) */}
      {isClient && <ActionButtons permit={permit} />}

      {/* Dokumen HTML */}
      <div className="mx-auto max-w-4xl space-y-12">
        <WorkPermitHTML permit={permit} />
        <JsaHTML permit={permit} />
      </div>
    </div>
  );
}
