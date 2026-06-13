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

    // Tangkap parameter status dari URL (jika ada)
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    // Siapkan object filter
    const filter: any = {};
    if (statusFilter) {
      filter.status = statusFilter;
    }

    // Ambil data Work Permit beserta filternya
    const workPermits = await WorkPermit.find(filter)
      .populate("pekerjaan", "kodePekerjaan namaPekerjaan")
      .populate("pjTeknik", "nama")
      .populate("tenagaAhliK3", "nama")
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
        message: error.message || "Gagal mengambil data izin kerja",
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
      pelaksana,
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
      !pelaksana ||
      pelaksana.length === 0
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

    const toStringArray = (val: any): string[] =>
      Array.isArray(val)
        ? val.map((s: any) => String(s).trim()).filter(Boolean)
        : typeof val === "string"
          ? [val.trim()].filter(Boolean)
          : [];

    const firstString = (val: any): string =>
      Array.isArray(val) ? (val[0] ?? "") : typeof val === "string" ? val : "";

    const sanitizedHirarcData = hirarcData
      ? {
          potensiBahaya: toStringArray(hirarcData.potensiBahaya),
          resiko: toStringArray(hirarcData.resiko),
          pengendalian: toStringArray(hirarcData.pengendalian),
          penanggungJawab: toStringArray(hirarcData.penanggungJawab),
          konsekuensiKeparahan: toStringArray(hirarcData.konsekuensiKeparahan),
          kemungkinanTerjadi: toStringArray(hirarcData.kemungkinanTerjadi),
          tingkatResiko: toStringArray(hirarcData.tingkatResiko),
          konsekuensiSetelahPengendalian: toStringArray(
            hirarcData.konsekuensiSetelahPengendalian,
          ),
          kemungkinanTerjadiSetelahPengendalian: toStringArray(
            hirarcData.kemungkinanTerjadiSetelahPengendalian,
          ),
          tingkatResikoSetelahPengendalian: toStringArray(
            hirarcData.tingkatResikoSetelahPengendalian,
          ),
          statusPengendalian: firstString(hirarcData.statusPengendalian), // ← String, bukan array
        }
      : {};

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
      pelaksana,
      jsaData,
      hirarcData: sanitizedHirarcData, // Gunakan data yang sudah disanitasi
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
