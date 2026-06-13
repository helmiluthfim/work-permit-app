// ==========================================
// DOKUMEN PDF GABUNGAN (WP + JSA)
// ==========================================

import { Document } from "@react-pdf/renderer";
import { Permit } from "../_lib/types";
import { WorkPermitPage } from "./WorkPermitPage";
import { JsaPage } from "./JsaPage";

export const WorkPermitAndJsaPDF = ({ permit }: { permit: Permit }) => (
  <Document>
    <WorkPermitPage permit={permit} />
    <JsaPage permit={permit} />
  </Document>
);
