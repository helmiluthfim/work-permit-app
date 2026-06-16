import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Notification from "@/models/Notification";
import { connectDB } from "@/lib/mongodb";
import { authOption } from "../auth/[...nextauth]/route";

// GET → ambil semua notifikasi milik user yang sedang login
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;

    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST → buat notifikasi baru (dipanggil internal dari API work-permit)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { recipientId, recipientRole, title, message, type, documentId } =
      body;

    const notification = await Notification.create({
      recipientId,
      recipientRole,
      title,
      message,
      type,
      documentType: "WORK_PERMIT",
      documentId,
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
