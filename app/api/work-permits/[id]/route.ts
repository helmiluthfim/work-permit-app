import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import WorkPermit from "@/models/WorkPermit";
import User from "@/models/User";
import { createNotification } from "@/lib/createNotification";

// ✅ Import AWS SDK (Get, Put, dan Delete untuk R2)
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

// ========================================================
// INISIALISASI CLOUDFLARE R2 SECARA AMAN
// ========================================================
let s3Client: S3Client | null = null;
let r2BucketName = "";

try {
  const endpointRaw = process.env.R2_ENDPOINT?.trim() || "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() || "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() || "";
  r2BucketName = process.env.R2_BUCKET_NAME?.trim() || "";

  if (endpointRaw && accessKeyId && secretAccessKey) {
    const formattedEndpoint = endpointRaw.startsWith("http")
      ? endpointRaw
      : `https://${endpointRaw}`;

    s3Client = new S3Client({
      region: "auto",
      endpoint: formattedEndpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  } else {
    console.warn("⚠️ Peringatan: Kredensial R2 belum lengkap di .env");
  }
} catch (err) {
  console.error("Gagal menginisialisasi S3Client:", err);
}

// ========================================================
// GET: MENGAMBIL DETAIL SATU WORK PERMIT
// ========================================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const workPermit = (await WorkPermit.findById(id)
      .populate({ path: "pekerjaan", select: "kodePekerjaan namaPekerjaan" })
      .populate({ path: "pelaksana", select: "nama jabatan" })
      .populate({ path: "pjTeknik", select: "nama" })
      .populate({ path: "tenagaAhliK3", select: "nama" })
      .lean()) as any;

    if (!workPermit) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    // ✅ FETCH KTP DARI R2 MENGGUNAKAN PRIVATE ROUTE
    if (workPermit.fileKtp) {
      try {
        if (workPermit.fileKtp.startsWith("http")) {
          // Jika data KTP lama masih berupa URL langsung
          const response = await fetch(workPermit.fileKtp);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString("base64");
            const mimeType = workPermit.fileKtp.toLowerCase().endsWith(".pdf")
              ? "application/pdf"
              : "image/jpeg";
            workPermit.fileKtpBase64 = `data:${mimeType};base64,${base64}`;
          }
        } else if (s3Client && r2BucketName) {
          // Jika menggunakan S3Client (Key dari DB)
          const getCommand = new GetObjectCommand({
            Bucket: r2BucketName,
            Key: workPermit.fileKtp.replace(/^\//, ""),
          });
          const response = await s3Client.send(getCommand);

          if (response.Body) {
            const byteArray = await response.Body.transformToByteArray();
            const buffer = Buffer.from(byteArray);
            const base64 = buffer.toString("base64");
            const mimeType =
              response.ContentType ||
              (workPermit.fileKtp.toLowerCase().endsWith(".pdf")
                ? "application/pdf"
                : "image/jpeg");
            workPermit.fileKtpBase64 = `data:${mimeType};base64,${base64}`;
          }
        }
      } catch (err) {
        console.error("Gagal mengambil gambar dari R2:", err);
      }
    }

    // Resolve tanda tangan digital...
    const [pjTeknikUser, k3User, direkturUser] = await Promise.all([
      User.findOne({ role: "PJ_TEKNIK" })
        .select("username role signatures")
        .lean(),
      User.findOne({ role: "TENAGA_AHLI_K3" })
        .select("username role signatures")
        .lean(),
      User.findOne({ role: "DIREKTUR" }).select("username signatures").lean(),
    ]);

    if (workPermit.pjTeknik) {
      workPermit.pjTeknik = {
        ...(workPermit.pjTeknik as any),
        signatures: pjTeknikUser?.signatures ?? null,
        resolvedSignature: pjTeknikUser?.signatures?.PJ_TEKNIK ?? null,
      };
    }
    if (workPermit.tenagaAhliK3) {
      workPermit.tenagaAhliK3 = {
        ...(workPermit.tenagaAhliK3 as any),
        signatures: k3User?.signatures ?? null,
        resolvedSignature: k3User?.signatures?.TENAGA_AHLI_K3 ?? null,
      };
    }
    if (direkturUser) {
      workPermit.direktur = {
        resolvedSignature: (direkturUser as any).signatures?.DIREKTUR ?? null,
      };
    }

    return NextResponse.json(
      { success: true, data: workPermit },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// ========================================================
// PATCH: MENGUPDATE STATUS WORK PERMIT (APPROVE/REJECT)
// ========================================================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const session = await getServerSession(authOption);
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const body = await req.json();
    const { status, catatanPenolakan } = body;

    const allowedStatuses = [
      "submitted",
      "approved_k3",
      "approved_director",
      "rejected",
    ];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid" },
        { status: 400 },
      );
    }

    const userSession = session.user as any;
    const actionByName =
      userSession?.nama ||
      userSession?.name ||
      userSession?.username ||
      "Sistem";
    const actionByRole = userSession?.role || "UNKNOWN";

    const newHistoryRecord = {
      status: status,
      actionBy: { nama: actionByName, role: actionByRole },
      catatan: status === "rejected" ? catatanPenolakan || "" : "",
      createdAt: new Date(),
    };

    const updateQuery: any = {
      $set: { status },
      $push: { history: newHistoryRecord },
    };

    if (status === "rejected" && catatanPenolakan)
      updateQuery.$set.catatanPenolakan = catatanPenolakan;
    else if (status.includes("approved"))
      updateQuery.$set.catatanPenolakan = "";

    const updatedWorkPermit = await WorkPermit.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true },
    );
    if (!updatedWorkPermit)
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );

    const pjTeknikUser = await User.findById(updatedWorkPermit.createdBy);

    if (status === "approved_k3") {
      await createNotification({
        recipientRole: "DIREKTUR",
        title: "Work Permit Menunggu Pengesahan",
        message: `Work Permit ${updatedWorkPermit.nomorWP} disetujui K3, menunggu pengesahan Anda`,
        type: "APPROVE",
        documentId: updatedWorkPermit._id.toString(),
      });
    } else if (status === "approved_director") {
      await createNotification({
        recipientRole: "TENAGA_AHLI_K3",
        title: "Work Permit Telah Disahkan",
        message: `Work Permit ${updatedWorkPermit.nomorWP} telah disahkan oleh Direktur`,
        type: "RATIFY",
        documentId: updatedWorkPermit._id.toString(),
      });
      if (pjTeknikUser) {
        await createNotification({
          recipientRole: "PJ_TEKNIK",
          recipientId: pjTeknikUser._id.toString(),
          title: "Work Permit Anda Telah Disahkan",
          message: `Work Permit ${updatedWorkPermit.nomorWP} telah disahkan dan siap digunakan`,
          type: "RATIFY",
          documentId: updatedWorkPermit._id.toString(),
        });
      }
    } else if (status === "rejected") {
      if (pjTeknikUser) {
        await createNotification({
          recipientRole: "PJ_TEKNIK",
          recipientId: pjTeknikUser._id.toString(),
          title: "Work Permit Anda Ditolak",
          message: `Work Permit ${updatedWorkPermit.nomorWP} ditolak${catatanPenolakan ? `: ${catatanPenolakan}` : ""}`,
          type: "REJECT",
          documentId: updatedWorkPermit._id.toString(),
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Status berhasil diperbarui",
        data: updatedWorkPermit,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// ========================================================
// PUT: MENGEDIT WORK PERMIT YANG DITOLAK (REVISI) & HAPUS KTP LAMA
// ========================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const session = await getServerSession(authOption);
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const formData = await req.formData();
    const payloadData = formData.get("payloadData") as string;
    const fileKtp = formData.get("fileKtp") as File | null; // Tangkap file KTP revisi

    if (!payloadData)
      return NextResponse.json(
        { success: false, message: "Payload kosong" },
        { status: 400 },
      );

    const payload = JSON.parse(payloadData);
    const userSession = session.user as any;
    const actionByName =
      userSession?.nama ||
      userSession?.name ||
      userSession?.username ||
      "Sistem";

    const newHistoryRecord = {
      status: "submitted",
      actionBy: { nama: actionByName, role: userSession?.role || "UNKNOWN" },
      catatan: "Dokumen direvisi dan diajukan ulang oleh PJ Teknik",
      createdAt: new Date(),
    };

    const updateQuery: any = {
      $set: {
        ...payload,
        status: "submitted",
        catatanPenolakan: "",
      },
      $push: { history: newHistoryRecord },
    };

    // ✅ PROSES GANTI KTP (UPLOAD BARU & HAPUS YANG LAMA)
    if (fileKtp && fileKtp.size > 0 && s3Client && r2BucketName) {
      try {
        // 1. Ambil data dokumen yang lama dari Database
        const existingWP = await WorkPermit.findById(id)
          .select("fileKtp")
          .lean();

        // 2. Upload file baru ke R2
        const buffer = Buffer.from(await fileKtp.arrayBuffer());
        const ext =
          fileKtp.name
            .split(".")
            .pop()
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "") || "jpg";
        const fileName = `ktp/${id}/ktp-${Date.now()}.${ext}`;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: r2BucketName,
            Key: fileName,
            Body: buffer,
            ContentType: fileKtp.type || "application/octet-stream",
          }),
        );

        // Simpan path baru ke database
        updateQuery.$set.fileKtp = fileName;

        // 3. Hapus file lama di R2
        if (existingWP?.fileKtp && !existingWP.fileKtp.startsWith("http")) {
          await s3Client
            .send(
              new DeleteObjectCommand({
                Bucket: r2BucketName,
                Key: existingWP.fileKtp.replace(/^\//, ""),
              }),
            )
            .catch(() =>
              console.log("File lama KTP tidak ditemukan di R2, diabaikan."),
            );
        }
      } catch (uploadError: any) {
        return NextResponse.json(
          {
            success: false,
            message: "Gagal mengganti file KTP: " + uploadError.message,
          },
          { status: 500 },
        );
      }
    }

    // Eksekusi pembaruan data
    const updatedWorkPermit = await WorkPermit.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true },
    );
    if (!updatedWorkPermit)
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );

    // Notifikasi kembali ke K3
    await createNotification({
      recipientRole: "TENAGA_AHLI_K3",
      title: "Work Permit Direvisi",
      message: `Work Permit ${updatedWorkPermit.nomorWP} telah diperbaiki oleh PJ Teknik dan menunggu tinjauan Anda.`,
      type: "APPROVE",
      documentId: updatedWorkPermit._id.toString(),
    });

    return NextResponse.json(
      { success: true, message: "Berhasil direvisi", data: updatedWorkPermit },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
