"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react"; // Printer saya biarkan jika nanti Anda pakai
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Permit } from "../_lib/types";
import { WorkPermitPDF } from "../_pdf/WorkPermitPDF";
import { generateSignatureQrCodes, SignatureQrCodes } from "../_lib/qrcode";

interface ActionButtonsProps {
  permit: Permit;
}

export const ActionButtons = ({ permit }: ActionButtonsProps) => {
  const [qrCodes, setQrCodes] = useState<SignatureQrCodes | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsError(false);

    // Prioritas: key spesifik role, fallback ke resolvedSignature dari backend
    const urlPjTeknik =
      (permit as any).pjTeknik?.signatures?.PJ_TEKNIK ??
      (permit as any).pjTeknik?.resolvedSignature;

    const urlAhliK3 =
      (permit as any).tenagaAhliK3?.signatures?.TENAGA_AHLI_K3 ??
      (permit as any).tenagaAhliK3?.resolvedSignature;

    const urlDirektur =
      (permit as any).direktur?.signatures?.DIREKTUR ??
      (permit as any).direktur?.resolvedSignature;

    console.log("=== BONGKAR ISI PERMIT ===");
    console.log("Wujud Asli pjTeknik:", (permit as any).pjTeknik);
    console.log("Wujud Asli tenagaAhliK3:", (permit as any).tenagaAhliK3);

    generateSignatureQrCodes({
      pjTeknik: urlPjTeknik,
      tenagaAhliK3: urlAhliK3,
      direktur: urlDirektur,
    })
      .then((hasilQr) => {
        setQrCodes(hasilQr ?? ({} as SignatureQrCodes));
      })
      .catch((error) => {
        console.error("Gagal melakukan generate QR:", error);
        setIsError(true);
        setQrCodes({} as SignatureQrCodes);
      });
  }, [permit]);

  return (
    <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between px-8 print:hidden">
      <button
        onClick={() => window.close()}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} /> Tutup Tab
      </button>

      <div className="flex gap-3">
        {qrCodes ? (
          <PDFDownloadLink
            // WorkPermitPDF's props typing may not include qrCodes in some contexts;
            // cast the element to any to avoid TS prop mismatch here.
            document={
              (<WorkPermitPDF permit={permit} qrCodes={qrCodes} />) as any
            }
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
        ) : (
          <button
            disabled
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold text-white ${
              isError ? "bg-red-400" : "bg-slate-300"
            }`}
          >
            <Download size={16} />{" "}
            {isError ? "Gagal Muat QR" : "Menyiapkan QR..."}
          </button>
        )}
      </div>
    </div>
  );
};
