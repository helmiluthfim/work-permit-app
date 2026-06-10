import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Personnel from "@/models/Personnel";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Ambil nilai 'jabatan' dari URL query parameter
    const jabatanQuery = req.nextUrl.searchParams.get("jabatan");

    // 2. Buat objek filter dinamis
    const filter: any = {};

    // Jika ada query jabatan, masukkan ke dalam filter pencarian
    if (jabatanQuery) {
      filter.jabatan = jabatanQuery;
    }

    // 3. Cari di database berdasarkan filter (jika kosong, akan mengambil semua data)
    const personnels = await Personnel.find(filter).sort({
      nama: 1,
    });

    return NextResponse.json({
      success: true,
      data: personnels,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data personel",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { nama, jabatan } = body;

    const existing = await Personnel.findOne({
      nama,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Personel sudah ada",
        },
        {
          status: 400,
        },
      );
    }

    const personnel = await Personnel.create({
      nama,
      jabatan,
    });

    return NextResponse.json(
      {
        success: true,
        data: personnel,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
