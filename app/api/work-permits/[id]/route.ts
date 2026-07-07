import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import JobTemplate from "@/models/JobTemplate";
import WorkPermit from "@/models/WorkPermit";
import User from "@/models/User";
import Personnel from "@/models/Personnel";
import { createNotification } from "@/lib/createNotification";

export const dynamic = "force-dynamic";

// ========================================================
// GET: MENGAMBIL DETAIL SATU WORK PERMIT (DIPERBAIKI TOTAL)
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

    // 1. Ambil data Work Permit HANYA mem-populate pekerjaan dan pelaksana.
    // Kita sengaja TIDAK mem-populate pjTeknik & tenagaAhliK3 di sini
    // untuk menghindari error relasi schema (ref).
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

    // 2. Resolve tanda tangan digital berdasarkan role user yang relevan.
    // WorkPermit.pjTeknik & tenagaAhliK3 merujuk ke dokumen Personnel,
    // sehingga URL signature harus diambil dari User dengan role yang cocok.
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

    // 3. Cari data Direktur secara terpisah
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
