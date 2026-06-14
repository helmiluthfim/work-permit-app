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
import { HirarcHTML } from "./_components/HirarcHTML";
import { SopHTML } from "./_components/SopHTML";
import { IkHTML } from "./_components/IkHTML";

export default function WorkPermitPrintPage() {
  const params = useParams();
  const id = params?.id as string;

  const [permit, setPermit] = useState<Permit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/work-permits/${id}`, {
          credentials: "include",
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
    <>
      {/*
        ── CSS Print Global ──────────────────────────────────────────
        - Halaman default: portrait
        - Khusus .page-landscape: landscape (untuk HIRARC)
        - Sembunyikan tombol aksi saat print
      */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .page-landscape { page: landscape-page; }
          @page landscape-page { size: A4 landscape; margin: 8mm; }
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-200 py-8 print:bg-white print:py-0">
        {/* Tombol Aksi — hanya tampil di layar */}
        {isClient && <ActionButtons permit={permit} />}

        {/* ── Dokumen HTML ── */}
        <div className="space-y-12 print:space-y-0">
          {/* Halaman 1: Work Permit — Portrait */}
          <div className="mx-auto max-w-4xl">
            <WorkPermitHTML permit={permit} />
          </div>

          {/* Halaman 2: JSA — Portrait */}
          <div className="mx-auto max-w-4xl">
            <JsaHTML permit={permit} />
          </div>

          {/* Halaman 3: HIRARC — Landscape */}
          <div className="page-landscape mx-auto max-w-[270mm]">
            <HirarcHTML permit={permit} />
          </div>

          {/* Halaman 4: SOP — Portrait */}
          <div className="mx-auto max-w-4xl">
            <SopHTML permit={permit} />
          </div>

          {/* Halaman 5: IK — Portrait */}
          <div className="mx-auto max-w-4xl">
            <IkHTML permit={permit} />
          </div>
        </div>
      </div>
    </>
  );
}
