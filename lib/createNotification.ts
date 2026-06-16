import Notification from "@/models/Notification";
import User from "@/models/User";
import { UserRole } from "@/models/User";
import { connectDB } from "./mongodb";

interface CreateNotificationParams {
  recipientRole: UserRole; // role penerima
  recipientId?: string; // opsional: jika sudah tahu ID-nya (misal PJ Teknik)
  title: string;
  message: string;
  type: "SUBMIT" | "APPROVE" | "REJECT" | "RATIFY";
  documentId: string;
}

export async function createNotification({
  recipientRole,
  recipientId,
  title,
  message,
  type,
  documentId,
}: CreateNotificationParams) {
  await connectDB();

  let targetUserId = recipientId;

  // Jika recipientId tidak diberikan, cari user berdasarkan role
  // (untuk K3 dan Direktur yang hanya 1 user)
  if (!targetUserId) {
    const user = await User.findOne({ role: recipientRole });
    if (!user)
      throw new Error(`User dengan role ${recipientRole} tidak ditemukan`);
    targetUserId = user._id.toString();
  }

  const notification = await Notification.create({
    recipientId: targetUserId,
    recipientRole,
    title,
    message,
    type,
    documentType: "WORK_PERMIT",
    documentId,
  });

  return notification;
}
