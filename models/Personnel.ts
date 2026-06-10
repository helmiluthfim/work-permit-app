import mongoose, { Document, Schema } from "mongoose";

export interface IPersonnel extends Document {
  nama: string;

  jabatan: "PJ Teknik" | "Pelaksana" | "Tenaga Ahli K3";

  aktif: boolean;
}

const PersonnelSchema = new Schema<IPersonnel>(
  {
    nama: {
      type: String,
      required: true,
    },

    jabatan: {
      type: String,
      enum: ["PJ Teknik", "Pelaksana", "Tenaga Ahli K3"],
      required: true,
    },

    aktif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Personnel =
  mongoose.models.Personnel ||
  mongoose.model<IPersonnel>("Personnel", PersonnelSchema);

export default Personnel;
