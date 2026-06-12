import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import WorkPermit from "@/models/WorkPermit";
import Personnel from "@/models/Personnel";
import JobTemplate from "@/models/JobTemplate";

// ========================================================
// GET: MENGAMBIL DETAIL SATU WORK PERMIT
// ========================================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // 1. Ubah tipe menjadi Promise
) {
  try {
    await connectDB();

    // 2. Lakukan await pada params sebelum digunakan
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 3. Gunakan id yang sudah di-resolve
    const workPermit = await WorkPermit.findById(id)
      .populate("pekerjaan", "kodePekerjaan namaPekerjaan")
      .populate("pjTeknik", "nama jabatan")
      .populate("tenagaAhliK3", "nama jabatan")
      .populate("jsaData.pelaksana", "nama jabatan");

    if (!workPermit) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

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
  { params }: { params: Promise<{ id: string }> }, // 1. Ubah tipe menjadi Promise
) {
  try {
    await connectDB();

    // 2. Lakukan await pada params sebelum digunakan
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

    // 3. Gunakan id yang sudah di-resolve
    const updatedWorkPermit = await WorkPermit.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: "after", runValidators: true }, // <--- Ganti menjadi ini
    );

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
