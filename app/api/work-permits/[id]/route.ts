import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import WorkPermit from "@/models/WorkPermit";
import User from "@/models/User";
import { createNotification } from "@/lib/createNotification";

export const dynamic = "force-dynamic";

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

    // ✅ FETCH KTP DI SERVER (VERCEL) UNTUK MENGHINDARI BLOKIR ISP
    if (workPermit.fileKtp) {
      try {
        // Ganti dengan URL R2 Public Anda (bisa pakai process.env.R2_PUBLIC_URL)
        const R2_BASE_URL =
          process.env.R2_PUBLIC_URL || "https://pub-xxxx.r2.dev";
        const fileUrl = workPermit.fileKtp.startsWith("http")
          ? workPermit.fileKtp
          : `${R2_BASE_URL.replace(/\/$/, "")}/${workPermit.fileKtp.replace(/^\//, "")}`;

        // Vercel server mengambil file dari R2
        const response = await fetch(fileUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString("base64");
          const mimeType = fileUrl.toLowerCase().endsWith(".pdf")
            ? "application/pdf"
            : "image/jpeg";

          // Sisipkan base64 langsung ke dalam object data
          workPermit.fileKtpBase64 = `data:${mimeType};base64,${base64}`;
        }
      } catch (err) {
        console.error("Gagal convert KTP ke Base64 di server:", err);
      }
    }

    // Resolve tanda tangan digital...
    const [pjTeknikUser, k3User] = await Promise.all([
      User.findOne({ role: "PJ_TEKNIK" })
        .select("username role signatures")
        .lean(),
      User.findOne({ role: "TENAGA_AHLI_K3" })
        .select("username role signatures")
        .lean(),
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

    const direktur = await User.findOne({ role: "DIREKTUR" })
      .select("username signatures")
      .lean();
    if (direktur) {
      (direktur as any).resolvedSignature =
        (direktur as any).signatures?.DIREKTUR ?? null;
    }
    workPermit.direktur = direktur;

    return NextResponse.json(
      { success: true, data: workPermit },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error GET Detail WP:", error);
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
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

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

    // ✅ 1. Ekstrak informasi user dari session untuk dicatat dalam History
    const userSession = session.user as any;
    const actionByName =
      userSession?.nama ||
      userSession?.name ||
      userSession?.username ||
      "Sistem";
    const actionByRole = userSession?.role || "UNKNOWN";

    // ✅ 2. Siapkan Data History Baru
    const newHistoryRecord = {
      status: status,
      actionBy: {
        nama: actionByName,
        role: actionByRole,
      },
      catatan: status === "rejected" ? catatanPenolakan || "" : "",
      createdAt: new Date(),
    };

    // ✅ 3. Gunakan $set untuk field biasa, dan $push untuk array history
    const updateQuery: any = {
      $set: { status },
      $push: { history: newHistoryRecord },
    };

    if (status === "rejected" && catatanPenolakan) {
      updateQuery.$set.catatanPenolakan = catatanPenolakan;
    } else if (status.includes("approved")) {
      updateQuery.$set.catatanPenolakan = "";
    }

    // ✅ 4. Update Database
    const updatedWorkPermit = await WorkPermit.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true },
    );

    if (!updatedWorkPermit) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    // ── Cari user PJ Teknik pemilik dokumen untuk notif balik ──
    const pjTeknikUser = await User.findById(updatedWorkPermit.createdBy);

    // ── Kirim notifikasi berdasarkan status baru ──
    if (status === "approved_k3") {
      await createNotification({
        recipientRole: "DIREKTUR",
        title: "Work Permit Menunggu Pengesahan",
        message: `Work Permit ${updatedWorkPermit.nomorWP} telah disetujui K3 dan menunggu pengesahan Anda`,
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
          message: `Work Permit ${updatedWorkPermit.nomorWP} telah disahkan oleh Direktur dan siap digunakan`,
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
    console.error("Error PATCH Status WP:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memperbarui status" },
      { status: 500 },
    );
  }
}
