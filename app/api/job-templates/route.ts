import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import JobTemplate from "@/models/JobTemplate";
import { authOption } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. CEK AUTENTIKASI & OTORISASI
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

    // 2. PARSE BODY & VALIDASI UTAMA
    const body = await req.json();
    const {
      kodePekerjaan,
      namaPekerjaan,
      workPermitTemplate,
      jsaTemplate,
      hirarcTemplate,
      sopTemplate,
      ikTemplate,
      status,
    } = body;

    if (!kodePekerjaan?.trim()) {
      return NextResponse.json(
        { success: false, message: "Kode pekerjaan wajib diisi" },
        { status: 400 },
      );
    }

    if (!namaPekerjaan?.trim()) {
      return NextResponse.json(
        { success: false, message: "Nama pekerjaan wajib diisi" },
        { status: 400 },
      );
    }

    // 3. KONEKSI DATABASE & CEK DUPLIKAT
    await connectDB();

    const existingJob = await JobTemplate.findOne({
      kodePekerjaan: kodePekerjaan.trim().toUpperCase(),
    });

    if (existingJob) {
      return NextResponse.json(
        { success: false, message: "Kode pekerjaan sudah digunakan" },
        { status: 400 },
      );
    }

    // Helper: pastikan nilai adalah array string
    const toStringArray = (val: any): string[] =>
      Array.isArray(val)
        ? val.map((s: any) => String(s).trim()).filter(Boolean)
        : [];

    // 4. SANITISASI WORK PERMIT
    const formattedWorkPermit = {
      klasifikasiPekerjaan: toStringArray(
        workPermitTemplate?.klasifikasiPekerjaan,
      ),
      prosedurPekerjaan: toStringArray(workPermitTemplate?.prosedurPekerjaan),
      lampiran: toStringArray(workPermitTemplate?.lampiran),
    };

    // 5. SANITISASI JSA (ARRAY OF OBJECTS)
    const formattedJsaTemplate = Array.isArray(jsaTemplate)
      ? jsaTemplate.map((jsa: any) => ({
          judulJsa: jsa.judulJsa?.trim() || "Tanpa Judul JSA",
          langkahKerja: toStringArray(jsa.langkahKerja),
          bahayaResiko: toStringArray(jsa.bahayaResiko),
          pengendalian: toStringArray(jsa.pengendalian),
        }))
      : [];

    // 6. SANITISASI HIRARC (SINGLE OBJECT WITH PARALLEL ARRAYS)
    const formattedHirarcTemplate = {
      potensiBahaya: toStringArray(hirarcTemplate?.potensiBahaya),
      resiko: toStringArray(hirarcTemplate?.resiko),
      pengendalian: toStringArray(hirarcTemplate?.pengendalian),
      penanggungJawab: toStringArray(hirarcTemplate?.penanggungJawab),
      konsekuensiKeparahan: toStringArray(hirarcTemplate?.konsekuensiKeparahan),
      kemungkinanTerjadi: toStringArray(hirarcTemplate?.kemungkinanTerjadi),
      tingkatResiko: toStringArray(hirarcTemplate?.tingkatResiko),
      konsekuensiSetelahPengendalian: toStringArray(
        hirarcTemplate?.konsekuensiSetelahPengendalian,
      ),
      kemungkinanTerjadiSetelahPengendalian: toStringArray(
        hirarcTemplate?.kemungkinanTerjadiSetelahPengendalian,
      ),
      tingkatResikoSetelahPengendalian: toStringArray(
        hirarcTemplate?.tingkatResikoSetelahPengendalian,
      ),
      statusPengendalian: toStringArray(hirarcTemplate?.statusPengendalian),
    };

    // 7. SANITISASI SOP (ARRAY OF OBJECTS)
    const formattedSopTemplate = Array.isArray(sopTemplate)
      ? sopTemplate.map((sop: any) => ({
          perlengkapanKerja: toStringArray(sop.perlengkapanKerja),
          peralatanUkur: toStringArray(sop.peralatanUkur),
          peralatanKerja: toStringArray(sop.peralatanKerja),
          judulUraianKegiatan: toStringArray(sop.judulUraianKegiatan), // ← [String], bukan .trim()
          uraianKegiatan: toStringArray(sop.uraianKegiatan),
        }))
      : [];

    // 8. SANITISASI INSTRUKSI KERJA (ARRAY OF OBJECTS)
    const formattedIkTemplate = Array.isArray(ikTemplate)
      ? ikTemplate.map((ik: any) => ({
          perlengkapanKerja: toStringArray(ik.perlengkapanKerja),
          peralatanUkur: toStringArray(ik.peralatanUkur),
          peralatanKerja: toStringArray(ik.peralatanKerja),
          judulUraianKegiatan: toStringArray(ik.judulUraianKegiatan), // ← [String], bukan .trim()
          uraianKegiatan: toStringArray(ik.uraianKegiatan),
        }))
      : [];

    // 9. SIMPAN KE DATABASE
    const newJobTemplate = await JobTemplate.create({
      kodePekerjaan: kodePekerjaan.trim().toUpperCase(),
      namaPekerjaan: namaPekerjaan.trim(),
      status: status || "active",
      workPermitTemplate: formattedWorkPermit,
      jsaTemplate: formattedJsaTemplate,
      hirarcTemplate: formattedHirarcTemplate,
      sopTemplate: formattedSopTemplate,
      ikTemplate: formattedIkTemplate,
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
  } catch (error: any) {
    console.error("POST JobTemplate Error: ", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      return NextResponse.json(
        {
          success: false,
          message: `Validasi Database Gagal: ${messages.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Kode pekerjaan sudah digunakan" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const jobs = await JobTemplate.find()
      .populate("createdBy", "name username role")
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
