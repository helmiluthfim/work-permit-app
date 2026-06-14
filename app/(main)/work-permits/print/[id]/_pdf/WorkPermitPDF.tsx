// ==========================================
// PDF WRAPPER — SEMUA HALAMAN
// Urutan: Work Permit → JSA → HIRARC → SOP → IK
// ==========================================

import { Document } from "@react-pdf/renderer";
import { Permit } from "../_lib/types";
import { WorkPermitPage } from "./WorkPermitPage";
import { JsaPage } from "./JsaPage";

import { HirarcPage } from "./HirarcPage";
import { SopPage } from "./SopPage";
import { IkPage } from "./IkPage";

interface Props {
  permit: Permit;
}

export const WorkPermitPDF = ({ permit }: Props) => (
  <Document>
    {/* Halaman 1: Work Permit — Portrait */}
    <WorkPermitPage permit={permit} />
    {/* Halaman 2: JSA — Portrait */}
    <JsaPage permit={permit} />
    {/* Halaman 3: HIRARC — Landscape */}
    <HirarcPage permit={permit} />
    {/* Halaman 4: SOP — Portrait */}
    <SopPage permit={permit} />
    {/* Halaman 5: IK — Portrait */}
    <IkPage permit={permit} />
  </Document>
);
