// ==========================================
// TYPES
// ==========================================

export interface Personil {
  _id?: string;
  nama: string;
}

export interface Pekerjaan {
  _id?: string;
  namaPekerjaan: string;
}

export interface WorkPermitData {
  klasifikasiPekerjaan?: string[];
  prosedurPekerjaan?: string[];
  lampiran?: string[];
}

export interface JsaData {
  judulJsa?: string;
  langkahKerja?: string[];
  bahayaResiko?: string[];
  pengendalian?: string[];
  pelaksana?: (Personil | string)[];
}

export interface Permit {
  _id: string;
  nomorWP: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  status: string;
  noTelpPjTeknik?: string;
  noTelpTenagaAhliK3?: string;
  pekerjaan?: Pekerjaan;
  pjTeknik?: Personil;
  tenagaAhliK3?: Personil;
  workPermitData?: WorkPermitData;
  pelaksana?: (Personil | string)[];
  jsaData?: JsaData[];
}
