import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put, del } from "@vercel/blob";

// TODO: sesuaikan tiga import di bawah ini dengan lokasi authOptions,
// helper koneksi MongoDB, dan model User pada proyek Anda.
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { authOption } from "../../auth/[...nextauth]/route";

// PENYESUAIAN: Tambah image/webp karena beberapa HP modern menggunakan format ini
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

// PENYESUAIAN: Naikkan batas maksimal menjadi 5MB (5 * 1024 * 1024)
// Karena foto langsung dari kamera HP biasanya berukuran di atas 2MB.
const MAX_SIZE = 5 * 1024 * 1024;

// Role yang valid — harus sama persis dengan yang dipakai di AppSidebar / session.user.role
const VALID_ROLES = ["PJ_TEKNIK", "TENAGA_AHLI_K3", "DIREKTUR"] as const;
type Role = (typeof VALID_ROLES)[number];

function getRoleOrNull(role: unknown): Role | null {
  return typeof role === "string" &&
    (VALID_ROLES as readonly string[]).includes(role)
    ? (role as Role)
    : null;
}

// Ambil tanda tangan milik role user yang sedang login
export async function GET() {
  const session = await getServerSession(authOption);
  const role = getRoleOrNull((session?.user as any)?.role);

  if (!session?.user?.id || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id)
    .select("signatures")
    .lean<{ signatures?: Record<Role, string | null> }>();

  const signatureUrl = user?.signatures?.[role] ?? null;
  return NextResponse.json({ signatureUrl, role });
}

// Unggah / ganti tanda tangan untuk role yang sedang login
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOption);
  const role = getRoleOrNull((session?.user as any)?.role);

  if (!session?.user?.id || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file harus PNG, JPG, atau WEBP" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 },
      );
    }

    await connectDB();

    // Hapus tanda tangan lama milik role ini saja (role lain tidak disentuh)
    const existing = await User.findById(session.user.id)
      .select("signatures")
      .lean<{ signatures?: Record<Role, string | null> }>();

    const oldUrl = existing?.signatures?.[role];
    if (oldUrl) {
      // PENAMBAHAN TOKEN DI SINI
      await del(oldUrl, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(
        () => null,
      );
    }

    // Ambil ekstensi yang sesuai
    let ext = "jpg";
    if (file.type === "image/png") ext = "png";
    if (file.type === "image/webp") ext = "webp";

    // Path menyertakan nama role supaya jelas TTD ini milik role apa
    const pathname = `signatures/${role}/${session.user.id}-${Date.now()}.${ext}`;

    // PENAMBAHAN TOKEN DI SINI
    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // TODO: pastikan schema Mongoose User punya field bertipe object per role, contoh:
    // signatures: { PJ_TEKNIK: String, TENAGA_AHLI_K3: String, DIREKTUR: String }
    await User.findByIdAndUpdate(session.user.id, {
      $set: { [`signatures.${role}`]: blob.url },
    });

    return NextResponse.json({ signatureUrl: blob.url, role });
  } catch (err) {
    console.error("Gagal mengunggah tanda tangan:", err);
    return NextResponse.json(
      { error: "Gagal mengunggah tanda tangan" },
      { status: 500 },
    );
  }
}

// Hapus tanda tangan milik role yang sedang login
export async function DELETE() {
  const session = await getServerSession(authOption);
  const role = getRoleOrNull((session?.user as any)?.role);

  if (!session?.user?.id || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const existing = await User.findById(session.user.id)
      .select("signatures")
      .lean<{ signatures?: Record<Role, string | null> }>();

    const oldUrl = existing?.signatures?.[role];
    if (oldUrl) {
      // PENAMBAHAN TOKEN DI SINI
      await del(oldUrl, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(
        () => null,
      );
    }

    await User.findByIdAndUpdate(session.user.id, {
      $set: { [`signatures.${role}`]: null },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Gagal menghapus tanda tangan:", err);
    return NextResponse.json(
      { error: "Gagal menghapus tanda tangan" },
      { status: 500 },
    );
  }
}
