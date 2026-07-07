import { Document } from "@react-pdf/renderer";
import { Permit } from "../_lib/types";
import { WorkPermitPage } from "./WorkPermitPage";
import { JsaPage } from "./JsaPage";
import { HirarcPage } from "./HirarcPage";
import { SopPage } from "./SopPage";
import { IkPage } from "./IkPage";
import type { SignatureQrCodes } from "../_lib/qrcode"; // ← tambah import

interface Props {
  permit: Permit;
  qrCodes?: SignatureQrCodes; // ← tambah ini
}

export const WorkPermitPDF = ({ permit, qrCodes }: Props) => (
  <Document>
    {/* Halaman 1: Work Permit — Portrait */}
    <WorkPermitPage permit={permit} qrCodes={qrCodes} />{" "}
    {/* Halaman 2: JSA — Portrait */}
    <JsaPage permit={permit} qrCodes={qrCodes} />
    {/* Halaman 3: HIRARC — Landscape */}
    <HirarcPage permit={permit} qrCodes={qrCodes} />
    {/* Halaman 4: SOP — Portrait */}
    <SopPage permit={permit} qrCodes={qrCodes} />
    {/* Halaman 5: IK — Portrait */}
    <IkPage permit={permit} qrCodes={qrCodes} />
  </Document>
);
