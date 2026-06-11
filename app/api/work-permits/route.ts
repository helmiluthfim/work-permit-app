import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import JobTemplate from "@/models/JobTemplate";
import WorkPermit from "@/models/WorkPermit";

// 👇 TAMBAHAN WAJIB: Import model Personnel agar Mongoose mengenali skemanya
// saat melakukan .populate() di metode GET.
import Personnel from "@/models/Personnel";

// ========================================================
// GET: MENAMPILKAN DAFTAR WORK PERMIT
// ========================================================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Validasi Sesi Login
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Ambil data Work Permit dan hubungkan (populate) dengan koleksi terkait
    // Urutkan berdasarkan data terbaru (createdAt: -1)
    const workPermits = await WorkPermit.find({})
      .populate("pekerjaan", "kodePekerjaan namaPekerjaan")
      .populate("pjTeknik", "nama") // Membutuhkan model Personnel
      .populate("tenagaAhliK3", "nama") // Membutuhkan model Personnel
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: workPermits,
    });
  } catch (error: any) {
    console.error("Error pada GET /api/work-permits:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Gagal mengambil data izin kerja (Work Permit)",
      },
      { status: 500 },
    );
  }
}

// ========================================================
// POST: MEMBUAT PENGAJUAN WORK PERMIT BARU
// ========================================================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const {
      pekerjaan,
      lokasi,
      tanggalMulai,
      waktuMulai,
      tanggalSelesai,
      waktuSelesai,
      pjTeknik,
      noTelpPjTeknik,
      tenagaAhliK3,
      noTelpTenagaAhliK3,

      workPermitData,
      jsaData,
      hirarcData,
      sopData,
      ikData,
    } = body;

    if (
      !pekerjaan ||
      !lokasi ||
      !tanggalMulai ||
      !waktuMulai ||
      !tanggalSelesai ||
      !waktuSelesai ||
      !pjTeknik ||
      !noTelpPjTeknik ||
      !tenagaAhliK3 ||
      !noTelpTenagaAhliK3 ||
      !jsaData ||
      !jsaData.pelaksana ||
      jsaData.pelaksana.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua data wajib dan pelaksana harus diisi",
        },
        { status: 400 },
      );
    }

    const cekPekerjaan = await JobTemplate.findById(pekerjaan);
    if (!cekPekerjaan) {
      return NextResponse.json(
        {
          success: false,
          message: "Template pekerjaan tidak ditemukan di database",
        },
        { status: 404 },
      );
    }

    const nomorWP = `WP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const workPermit = await WorkPermit.create({
      nomorWP,
      pekerjaan,
      lokasi,
      tanggalMulai,
      waktuMulai,
      tanggalSelesai,
      waktuSelesai,
      pjTeknik,
      noTelpPjTeknik,
      tenagaAhliK3,
      noTelpTenagaAhliK3,
      status: "submitted",

      workPermitData,
      jsaData,
      hirarcData,
      sopData,
      ikData,
    });

    return NextResponse.json(
      { success: true, data: workPermit },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error pada POST /api/work-permits:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Gagal membuat pengajuan Izin Kerja (Work Permit)",
      },
      { status: 500 },
    );
  }
}
