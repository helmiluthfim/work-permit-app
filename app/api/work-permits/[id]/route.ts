import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import WorkPermit from "@/models/WorkPermit";
import User from "@/models/User";
import { createNotification } from "@/lib/createNotification"; // ← tambah ini

// ========================================================
// GET: MENGAMBIL DETAIL SATU WORK PERMIT (tidak ada perubahan)
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

    const workPermit = await WorkPermit.findById(id)
      .populate("pekerjaan", "kodePekerjaan namaPekerjaan")
      .populate("pjTeknik", "nama jabatan")
      .populate("tenagaAhliK3", "nama jabatan")
      .populate("pelaksana", "nama jabatan");

    if (!workPermit) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: workPermit.toObject() },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error GET Detail WP:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal mengambil detail data",
      },
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

    const updateData: any = { status };
    if (status === "rejected" && catatanPenolakan) {
      updateData.catatanPenolakan = catatanPenolakan;
    } else if (status.includes("approved")) {
      updateData.catatanPenolakan = "";
    }

    const updatedWorkPermit = await WorkPermit.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedWorkPermit) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    console.log("=== DEBUG PATCH ===");
    console.log("createdBy:", updatedWorkPermit?.createdBy);
    console.log("status baru:", status);

    // ── Cari user PJ Teknik pemilik dokumen untuk notif balik ──
    const pjTeknikUser = await User.findById(updatedWorkPermit.createdBy);

    // ── Kirim notifikasi berdasarkan status baru ──
    if (status === "approved_k3") {
      // K3 approve → notif ke Direktur
      await createNotification({
        recipientRole: "DIREKTUR",
        title: "Work Permit Menunggu Pengesahan",
        message: `Work Permit ${updatedWorkPermit.nomorWP} telah disetujui K3 dan menunggu pengesahan Anda`,
        type: "APPROVE",
        documentId: updatedWorkPermit._id.toString(),
      });
    } else if (status === "approved_director") {
      // Direktur approve → notif ke K3 dan PJ Teknik
      await createNotification({
        recipientRole: "TENAGA_AHLI_K3",
        title: "Work Permit Telah Disahkan",
        message: `Work Permit ${updatedWorkPermit.nomorWP} telah disahkan oleh Direktur`,
        type: "RATIFY",
        documentId: updatedWorkPermit._id.toString(),
      });

      // Notif ke PJ Teknik jika ditemukan
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
      // K3 atau Direktur tolak → notif ke PJ Teknik
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
