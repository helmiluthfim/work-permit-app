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

    const users = [
      {
        username: "pjteknik",
        password: "123",
        role: "PJ_TEKNIK",
      },
      {
        username: "k3",
        password: "1234",
        role: "TENAGA_AHLI_K3",
      },
      {
        username: "direktur",
        password: "12345",
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
      {
        success: false,
        message: "Seed gagal",
      },
      {
        status: 500,
      },
    );
  }
}
