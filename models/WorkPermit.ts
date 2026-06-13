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

  status:
    | "draft"
    | "submitted"
    | "approved_k3"
    | "approved_director"
    | "rejected";
  catatanPenolakan?: string;

  workPermitData: {
    klasifikasiPekerjaan: string[];
    prosedurPekerjaan: string[];
    lampiran: string[];
  };

  // 2. Dokumen JSA (DIPERBARUI)
  jsaData: {
    // Tambahkan pelaksana di sini! Merujuk ke banyak Personnel (Array)
    pelaksana: mongoose.Types.ObjectId[];
    judulJsa: string;
    langkahKerja: string[];
    bahayaResiko: string[];
    pengendalian: string[];
  };

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
    perlengkapanKerja: string[];
    peralatanUkur: string[];
    peralatanKerja: string[];
    judulUraianKegiatan: string[];
    uraianKegiatan: string[];
  };

  ikData: {
    perlengkapanKerja: string[];
    peralatanUkur: string[];
    peralatanKerja: string[];
    judulUraianKegiatan: string[];
    uraianKegiatan: string[];
  };
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

    status: { type: String, default: "submitted" },
    catatanPenolakan: { type: String, default: "" },

    workPermitData: {
      klasifikasiPekerjaan: [String],
      prosedurPekerjaan: [String],
      lampiran: [String],
    },

    // DOKUMEN JSA (DIPERBARUI)
    jsaData: {
      // Definisi array of ObjectId di Mongoose
      pelaksana: [{ type: Schema.Types.ObjectId, ref: "Personnel" }],
      judulJsa: String,
      langkahKerja: [String],
      bahayaResiko: [String],
      pengendalian: [String],
    },

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

    sopData: {
      perlengkapanKerja: [String],
      peralatanUkur: [String],
      peralatanKerja: [String],
      judulUraianKegiatan: [String],
      uraianKegiatan: [String],
    },

    ikData: {
      perlengkapanKerja: [String],
      peralatanUkur: [String],
      peralatanKerja: [String],
      judulUraianKegiatan: [String],
      uraianKegiatan: [String],
    },
  },
  {
    timestamps: true,
  },
);

const WorkPermit: Model<IWorkPermit> =
  mongoose.models.WorkPermit ||
  mongoose.model<IWorkPermit>("WorkPermit", WorkPermitSchema);

export default WorkPermit;
