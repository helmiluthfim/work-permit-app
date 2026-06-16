import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole } from "./User";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId; // _id user penerima
  recipientRole: UserRole; // role penerima (untuk filter mudah)
  title: string; // judul singkat notif
  message: string; // isi pesan notif
  type: "SUBMIT" | "APPROVE" | "REJECT" | "RATIFY"; // jenis aksi
  documentType: "WORK_PERMIT"; // jenis dokumen
  documentId: mongoose.Types.ObjectId; // referensi ke dokumen terkait
  isRead: boolean; // sudah dibaca atau belum
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["PJ_TEKNIK", "TENAGA_AHLI_K3", "DIREKTUR"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["SUBMIT", "APPROVE", "REJECT", "RATIFY"],
      required: true,
    },
    documentType: {
      type: String,
      enum: ["WORK_PERMIT"],
      required: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
