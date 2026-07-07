import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Definisikan tipe data literal untuk Role
export type UserRole = "PJ_TEKNIK" | "TENAGA_AHLI_K3" | "DIREKTUR";

// 2. Buat interface TypeScript untuk Dokumen User
export interface IUser extends Document {
  username: string;
  password?: string; // dibuat opsional (?) jika sewaktu-waktu Anda tidak ingin mengembalikan password ke frontend
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  signatures: {
    PJ_TEKNIK?: string | null;
    TENAGA_AHLI_K3?: string | null;
    DIREKTUR?: string | null;
  };
}

// 3. Buat Schema Mongoose berdasarkan interface IUser
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
    },
    role: {
      type: String,
      required: [true, "Role wajib ditentukan"],
      enum: ["PJ_TEKNIK", "TENAGA_AHLI_K3", "DIREKTUR"], // Validasi di tingkat Mongoose/Database
      default: "TENAGA_AHLI_K3",
    },
    signatures: {
      PJ_TEKNIK: { type: String, default: null },
      TENAGA_AHLI_K3: { type: String, default: null },
      DIREKTUR: { type: String, default: null },
    },
  },
  {
    timestamps: true, // Otomatis membuat kolom createdAt dan updatedAt
  },
);

// 4. Export Model (dengan trik pencegahan re-kompilasi khas Next.js)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
