import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Notification from "@/models/Notification";
import { authOption } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";

// PATCH → tandai satu notifikasi sebagai sudah dibaca
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const userId = (session.user as any).id;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        recipientId: userId, // pastikan notif ini milik user yang login
      },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return NextResponse.json(
        { error: "Notifikasi tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ notification });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
