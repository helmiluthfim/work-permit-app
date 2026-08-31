import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import WorkPermit from "@/models/WorkPermit";
import { createNotification } from "@/lib/createNotification";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

// Inisialisasi S3Client Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});
const BUCKET_NAME = process.env.R2_BUCKET_NAME as string;

// ========================================================
// GET: MENGAMBIL DAFTAR WORK PERMIT (LISTING / DASHBOARD)
// ========================================================
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOption);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = session.user as any;
    let filter = {};

    // Filter data berdasarkan role login
    if (user.role === "PJ_TEKNIK") {
      filter = { createdBy: user.id };
    } else if (user.role === "DIREKTUR") {
      filter = { status: { $in: ["approved_k3", "approved_director"] } };
    }

    const workPermits = await WorkPermit.find(filter)
      .populate("pekerjaan", "kodePekerjaan namaPekerjaan")
      .populate("pjTeknik", "nama")
      .populate("tenagaAhliK3", "nama")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, data: workPermits },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error GET Work Permits:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data Work Permit" },
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

    const rawFormData = await req.formData();
    const payloadDataString = rawFormData.get("payloadData") as string;
    if (!payloadDataString) {
      return NextResponse.json(
        { success: false, message: "Payload data tidak ditemukan" },
        { status: 400 },
      );
    }

    const body = JSON.parse(payloadDataString);
    const fileKtp = rawFormData.get("fileKtp") as File | null;

    if (!fileKtp) {
      return NextResponse.json(
        { success: false, message: "File KTP wajib diunggah" },
        { status: 400 },
      );
    }

    // ✅ 1. BUAT ID MONGODB & NOMOR WP DI AWAL
    // Kita buat ID-nya secara manual agar bisa dipakai sebagai nama file gambar KTP
    const newWorkPermitId = new mongoose.Types.ObjectId();
    const nomorWP = `WP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // ✅ 2. UPLOAD KTP MENGGUNAKAN ID WORK PERMIT BARU (PENYAMAAN ID)
    let fileKtpUrl = "";
    try {
      let ext = "jpg";
      if (fileKtp.type === "image/png") ext = "png";
      else if (fileKtp.type === "application/pdf") ext = "pdf";
      else if (fileKtp.type === "image/webp") ext = "webp";

      // Nama file menjadi: ktp/64f1b2c3d...e4f5.jpg (Sesuai ID Dokumen Data)
      const pathname = `ktp/${newWorkPermitId.toString()}.${ext}`;
      const arrayBuffer = await fileKtp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: pathname,
          Body: buffer,
          ContentType: fileKtp.type,
        }),
      );
      fileKtpUrl = pathname;
    } catch (uploadError) {
      console.error("Gagal mengunggah file KTP:", uploadError);
      return NextResponse.json(
        { success: false, message: "Gagal mengunggah dokumen KTP ke server." },
        { status: 500 },
      );
    }

    // --- Helper Formatting Text ---
    const toStringArray = (val: any): string[] =>
      Array.isArray(val)
        ? val.map((s: any) => String(s).trim()).filter(Boolean)
        : typeof val === "string"
          ? [val.trim()].filter(Boolean)
          : [];

    const firstString = (val: any): string =>
      Array.isArray(val) ? (val[0] ?? "") : typeof val === "string" ? val : "";

    const sanitizedHirarcData = body.hirarcData
      ? {
          potensiBahaya: toStringArray(body.hirarcData.potensiBahaya),
          resiko: toStringArray(body.hirarcData.resiko),
          pengendalian: toStringArray(body.hirarcData.pengendalian),
          penanggungJawab: toStringArray(body.hirarcData.penanggungJawab),
          konsekuensiKeparahan: toStringArray(
            body.hirarcData.konsekuensiKeparahan,
          ),
          kemungkinanTerjadi: toStringArray(body.hirarcData.kemungkinanTerjadi),
          tingkatResiko: toStringArray(body.hirarcData.tingkatResiko),
          konsekuensiSetelahPengendalian: toStringArray(
            body.hirarcData.konsekuensiSetelahPengendalian,
          ),
          kemungkinanTerjadiSetelahPengendalian: toStringArray(
            body.hirarcData.kemungkinanTerjadiSetelahPengendalian,
          ),
          tingkatResikoSetelahPengendalian: toStringArray(
            body.hirarcData.tingkatResikoSetelahPengendalian,
          ),
          statusPengendalian: firstString(body.hirarcData.statusPengendalian),
        }
      : {};

    const userId = (session.user as any).id;

    // ✅ 3. SIMPAN KE DATABASE MENGGUNAKAN ID YANG SAMA DENGAN NAMA FILE
    const workPermit = await WorkPermit.create({
      _id: newWorkPermitId,
      nomorWP,
      pekerjaan: body.pekerjaan,
      lokasi: body.lokasi,
      tanggalMulai: body.tanggalMulai,
      waktuMulai: body.waktuMulai,
      tanggalSelesai: body.tanggalSelesai,
      waktuSelesai: body.waktuSelesai,
      pjTeknik: body.pjTeknik,
      noTelpPjTeknik: body.noTelpPjTeknik,
      tenagaAhliK3: body.tenagaAhliK3,
      noTelpTenagaAhliK3: body.noTelpTenagaAhliK3,
      fileKtp: fileKtpUrl, // Menyimpan path name (ex: ktp/64f1b...jpg)
      status: "submitted",
      createdBy: userId,
      workPermitData: body.workPermitData,
      pelaksana: body.pelaksana,
      jsaData: body.jsaData,
      hirarcData: sanitizedHirarcData,
      sopData: body.sopData,
      ikData: body.ikData,
    });

    await createNotification({
      recipientRole: "TENAGA_AHLI_K3",
      title: "Work Permit Baru Diajukan",
      message: `Work Permit ${nomorWP} telah diajukan dan menunggu review Anda`,
      type: "SUBMIT",
      documentId: workPermit._id.toString(),
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
        message: error.message || "Gagal membuat pengajuan Izin Kerja",
      },
      { status: 500 },
    );
  }
}
