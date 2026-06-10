import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import JobTemplate from "@/models/JobTemplate";
import { authOption } from "../auth/[...nextauth]/route"; // Catatan: biasanya penamaan standarnya adalah authOptions

// Memaksa Next.js untuk tidak melakukan caching statis pada route ini
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. CEK AUTENTIKASI & OTORISASI DULU (Best Practice Keamanan)
    const session = await getServerSession(authOption);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Silakan login terlebih dahulu",
        },
        { status: 401 },
      );
    }

    if (session.user.role !== "TENAGA_AHLI_K3") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden: Hanya Tenaga Ahli K3 yang dapat membuat template pekerjaan",
        },
        { status: 403 },
      );
    }

    // 2. PARSE BODY & VALIDASI
    const body = await req.json();
    const {
      kodePekerjaan,
      namaPekerjaan,
      workPermitTemplate,
      jsaTemplate,
      hirarcTemplate,
      sopTemplate,
      ikTemplate,
    } = body;

    if (!kodePekerjaan) {
      return NextResponse.json(
        { success: false, message: "Kode pekerjaan wajib diisi" },
        { status: 400 },
      );
    }

    if (!namaPekerjaan) {
      return NextResponse.json(
        { success: false, message: "Nama pekerjaan wajib diisi" },
        { status: 400 },
      );
    }

    // 3. KONEKSI DB & CEK DUPLIKAT
    await connectDB();

    const existingJob = await JobTemplate.findOne({ kodePekerjaan });

    if (existingJob) {
      return NextResponse.json(
        { success: false, message: "Kode pekerjaan sudah digunakan" },
        { status: 400 },
      );
    }

    // 4. SIMPAN KE DATABASE
    const newJobTemplate = await JobTemplate.create({
      kodePekerjaan,
      namaPekerjaan,
      workPermitTemplate,
      jsaTemplate,
      hirarcTemplate,
      sopTemplate,
      ikTemplate,
      createdBy: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Template pekerjaan berhasil dibuat",
        data: newJobTemplate,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST JobTemplate Error: ", error); // Tambahkan label pada error log
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Menambahkan parameter req agar Next.js mendeteksi ini sebagai request dinamis
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const jobs = await JobTemplate.find()
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: jobs }, { status: 200 });
  } catch (error) {
    console.error("GET JobTemplate Error: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
