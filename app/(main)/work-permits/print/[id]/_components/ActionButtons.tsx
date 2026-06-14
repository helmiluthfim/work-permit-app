// ==========================================
// KOMPONEN: TOMBOL AKSI (PRINT & DOWNLOAD)
// ==========================================

"use client";

import { ArrowLeft, Download, Printer } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Permit } from "../_lib/types";
import { WorkPermitPDF } from "../_pdf/WorkPermitPDF";

interface ActionButtonsProps {
  permit: Permit;
}

export const ActionButtons = ({ permit }: ActionButtonsProps) => (
  <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between px-8 print:hidden">
    <button
      onClick={() => window.close()}
      className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800"
    >
      <ArrowLeft size={16} /> Tutup Tab
    </button>

    <div className="flex gap-3">
      {/* Tombol download PDF */}
      <PDFDownloadLink
        document={<WorkPermitPDF permit={permit} />}
        fileName={`WP_${permit.nomorWP || "Doc"}.pdf`}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
      >
        {({ loading: pdfLoading }) => (
          <>
            <Download size={16} />
            {pdfLoading ? "Menyiapkan PDF..." : "Simpan PDF"}
          </>
        )}
      </PDFDownloadLink>
    </div>
  </div>
);
