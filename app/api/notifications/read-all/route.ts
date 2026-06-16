import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Notification from "@/models/Notification";
import { authOption } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";

// PATCH → tandai semua notifikasi milik user sebagai sudah dibaca
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;

    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
