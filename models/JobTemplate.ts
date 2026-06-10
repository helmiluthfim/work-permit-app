import mongoose, { Document, Model, Schema } from "mongoose";

export interface IJobTemplate extends Document {
  kodePekerjaan: string;
  namaPekerjaan: string;

  workPermitTemplate: {
    klasifikasiPekerjaan: string[];
    prosedurPekerjaan: string[];
    lampiran: string[];
  };

  jsaTemplate: {
    langkahKerja: string[];
    bahayaResiko: string[];
    pengendalian: string[];
  };

  hirarcTemplate: {
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

  sopTemplate: {
    perlengkapanKerja: string[];
    peralatanUkur: string[];
    peralatanKerja: string[];
    uraianKegiatan: string[];
  };

  ikTemplate: {
    perlengkapanKerja: string[];
    peralatanUkur: string[];
    peralatanKerja: string[];
    uraianKegiatan: string[];
  };

  status: "active" | "inactive";

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const WorkPermitTemplateSchema = new Schema(
  {
    klasifikasiPekerjaan: [String],
    prosedurPekerjaan: [String],
    lampiran: [String],
  },
  { _id: false },
);

const JSATemplateSchema = new Schema(
  {
    langkahKerja: [String],
    bahayaResiko: [String],
    pengendalian: [String],
  },
  { _id: false },
);

const HIRARCTemplateSchema = new Schema(
  {
    potensiBahaya: [String],
    resiko: [String],
    konsekuensiKeparahan: [String],
    kemungkinanTerjadi: [String],
    tingkatResiko: [String],
    pengendalian: [String],
    konsekuensiSetelahPengendalian: [String],
    kemungkinanTerjadiSetelahPengendalian: [String],
    tingkatResikoSetelahPengendalian: [String],
    statusPengendalian: String,
    penanggungJawab: [String],
  },
  { _id: false },
);

const SOPTemplateSchema = new Schema(
  {
    perlengkapanKerja: [String],
    peralatanUkur: [String],
    peralatanKerja: [String],
    uraianKegiatan: [String],
  },
  { _id: false },
);

const IKTemplateSchema = new Schema(
  {
    perlengkapanKerja: [String],
    peralatanUkur: [String],
    peralatanKerja: [String],
    uraianKegiatan: [String],
  },
  { _id: false },
);

const JobTemplateSchema = new Schema<IJobTemplate>(
  {
    kodePekerjaan: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    namaPekerjaan: {
      type: String,
      required: true,
      trim: true,
    },

    workPermitTemplate: {
      type: WorkPermitTemplateSchema,
      default: {},
    },

    jsaTemplate: {
      type: JSATemplateSchema,
      default: {},
    },

    hirarcTemplate: {
      type: HIRARCTemplateSchema,
      default: {},
    },

    sopTemplate: {
      type: SOPTemplateSchema,
      default: {},
    },

    ikTemplate: {
      type: IKTemplateSchema,
      default: {},
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const JobTemplate: Model<IJobTemplate> =
  mongoose.models.JobTemplate ||
  mongoose.model<IJobTemplate>("JobTemplate", JobTemplateSchema);

export default JobTemplate;
