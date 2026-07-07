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

// ✅ JsaData adalah single subdocument (tanpa pelaksana — dipindah ke root Permit)
export interface JsaData {
  judulJsa?: string;
  langkahKerja?: string[];
  bahayaResiko?: string[];
  pengendalian?: string[];
}

// ✅ HirarcData — perbaikan syntax (hapus '?' setelah nama interface)
export interface HirarcData {
  potensiBahaya?: string[];
  resiko?: string[];
  konsekuensiKeparahan?: string[];
  kemungkinanTerjadi?: string[];
  tingkatResiko?: string[];
  pengendalian?: string[];
  konsekuensiSetelahPengendalian?: string[];
  kemungkinanTerjadiSetelahPengendalian?: string[];
  tingkatResikoSetelahPengendalian?: string[];
  statusPengendalian?: string;
  penanggungJawab?: string[];
}

// ✅ SopData & IkData
export interface SopData {
  judulSop?: string;
  perlengkapanKerja?: string[];
  peralatanUkur?: string[];
  peralatanKerja?: string[];
  judulUraianKegiatan?: string[];
  uraianKegiatan?: string[];
}

export interface IkData {
  judulIk?: string;
  perlengkapanKerja?: string[];
  peralatanUkur?: string[];
  peralatanKerja?: string[];
  judulUraianKegiatan?: string[];
  uraianKegiatan?: string[];
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
  catatanPenolakan?: string;
  pekerjaan?: Pekerjaan;
  pjTeknik?: Personil;
  tenagaAhliK3?: Personil;
  direktur?: Personil;
  workPermitData?: WorkPermitData;

  // ✅ Pelaksana di root level
  pelaksana?: (Personil | string)[];

  // ✅ jsaData, sopData, ikData sekarang array of subdocuments
  jsaData?: JsaData[];
  hirarcData?: HirarcData;
  sopData?: SopData[];
  ikData?: IkData[];
}
