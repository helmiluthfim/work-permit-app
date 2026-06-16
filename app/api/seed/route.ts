import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const totalUser = await User.countDocuments();

    if (totalUser > 0) {
      return NextResponse.json({
        success: false,
        message: "Data user sudah ada",
      });
    }

    // ← Hash password sebelum disimpan
    const users = [
      {
        username: "pjteknik",
        password: await bcrypt.hash("123", 10),
        role: "PJ_TEKNIK",
      },
      {
        username: "k3",
        password: await bcrypt.hash("1234", 10),
        role: "TENAGA_AHLI_K3",
      },
      {
        username: "direktur",
        password: await bcrypt.hash("12345", 10),
        role: "DIREKTUR",
      },
    ];

    await User.insertMany(users);

    return NextResponse.json({
      success: true,
      message: "Seed berhasil",
      total: users.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Seed gagal" },
      { status: 500 },
    );
  }
}
