import mongoose, { Document, Schema, Model } from "mongoose";

export interface IWorkPermit extends Document {
  nomorWP: string;
  pekerjaan: mongoose.Types.ObjectId;

  lokasi: string;
  tanggalMulai: string;
  waktuMulai: string;
  tanggalSelesai: string;
  waktuSelesai: string;

  pjTeknik: mongoose.Types.ObjectId;
  noTelpPjTeknik: string;
  tenagaAhliK3: mongoose.Types.ObjectId;
  noTelpTenagaAhliK3: string;

  createdBy: mongoose.Types.ObjectId;

  status:
    | "draft"
    | "submitted"
    | "approved_k3"
    | "approved_director"
    | "rejected";
  catatanPenolakan?: string;

  history: {
    status: string;
    actionBy: {
      nama: string;
      role: string;
    };
    catatan?: string;
    createdAt: Date;
  }[];

  workPermitData: {
    klasifikasiPekerjaan: string[];
    prosedurPekerjaan: string[];
    lampiran: string[];
  };

  // Pelaksana dipindah ke root — berlaku untuk semua dokumen JSA
  pelaksana: mongoose.Types.ObjectId[];

  // jsaData sekarang array of subdocuments
  jsaData: {
    judulJsa: string;
    langkahKerja: string[];
    bahayaResiko: string[];
    pengendalian: string[];
  }[];

  hirarcData: {
    potensiBahaya: string[];
    resiko: string[];
    konsekuensiKeparahan: string[];
    kemungkinanTerjadi: string[];
    tingkatResiko: string[];
    pengendalian: string[];
    konsekuensiSetelahPengendalian: string[];
    kemungkinanTerjadiSetelahPengendalian: string[];
    tingkatResikoSetelahPengendalian: string[];
    statusPengendalian: string;
    penanggungJawab: string[];
  };

  sopData: {
    judulSop: string;
    perlengkapanKerja: string[];
    peralatanUkur: string[];
    peralatanKerja: string[];
    judulUraianKegiatan: string[];
    uraianKegiatan: string[];
  }[];

  ikData: {
    judulIk: string;
    perlengkapanKerja: string[];
    peralatanUkur: string[];
    peralatanKerja: string[];
    judulUraianKegiatan: string[];
    uraianKegiatan: string[];
  }[];
}

const WorkPermitSchema = new Schema<IWorkPermit>(
  {
    nomorWP: { type: String, required: true, unique: true },
    pekerjaan: {
      type: Schema.Types.ObjectId,
      ref: "JobTemplate",
      required: true,
    },

    lokasi: { type: String, required: true },
    tanggalMulai: { type: String, required: true },
    waktuMulai: { type: String, required: true },
    tanggalSelesai: { type: String, required: true },
    waktuSelesai: { type: String, required: true },

    pjTeknik: { type: Schema.Types.ObjectId, ref: "Personnel", required: true },
    noTelpPjTeknik: { type: String, required: true },
    tenagaAhliK3: {
      type: Schema.Types.ObjectId,
      ref: "Personnel",
      required: true,
    },
    noTelpTenagaAhliK3: { type: String, required: true },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: { type: String, default: "submitted" },
    catatanPenolakan: { type: String, default: "" },
    history: [
      {
        status: { type: String, required: true },
        actionBy: {
          nama: { type: String, required: true },
          role: { type: String, required: true },
        },
        catatan: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    workPermitData: {
      klasifikasiPekerjaan: [String],
      prosedurPekerjaan: [String],
      lampiran: [String],
    },

    // ✅ Pelaksana di root level
    pelaksana: [{ type: Schema.Types.ObjectId, ref: "Personnel" }],

    // ✅ jsaData sekarang array of subdocuments
    jsaData: [
      {
        judulJsa: String,
        langkahKerja: [String],
        bahayaResiko: [String],
        pengendalian: [String],
      },
    ],

    hirarcData: {
      potensiBahaya: [String],
      resiko: [String],
      konsekuensiKeparahan: [String],
      kemungkinanTerjadi: [String],
      tingkatResiko: [String],
      pengendalian: [String],
      konsekuensiSetelahPengendalian: [String],
      kemungkinanTerjadiSetelahPengendalian: [String],
      tingkatResikoSetelahPengendalian: [String],
      statusPengendalian: { type: String, default: "" },
      penanggungJawab: [String],
    },

    // ✅ sopData & ikData juga array (konsisten dengan template)
    sopData: [
      {
        judulSop: String,
        perlengkapanKerja: [String],
        peralatanUkur: [String],
        peralatanKerja: [String],
        judulUraianKegiatan: [String],
        uraianKegiatan: [String],
      },
    ],

    ikData: [
      {
        judulIk: String,
        perlengkapanKerja: [String],
        peralatanUkur: [String],
        peralatanKerja: [String],
        judulUraianKegiatan: [String],
        uraianKegiatan: [String],
      },
    ],
  },
  { timestamps: true },
);

const WorkPermit: Model<IWorkPermit> =
  mongoose.models.WorkPermit ||
  mongoose.model<IWorkPermit>("WorkPermit", WorkPermitSchema);

export default WorkPermit;
