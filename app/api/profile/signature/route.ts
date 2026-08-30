import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// TODO: sesuaikan tiga import di bawah ini dengan lokasi authOptions,
// helper koneksi MongoDB, dan model User pada proyek Anda.
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { authOption } from "../../auth/[...nextauth]/route";

// Konfigurasi Cloudflare R2 S3 Client
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME as string;
const PUBLIC_URL = process.env.R2_PUBLIC_URL as string;

// Helper untuk mengekstrak object key (path) dari URL publik R2
function getKeyFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    // Menghapus slash '/' di awal pathname agar menjadi key yang valid di R2
    return urlObj.pathname.startsWith("/")
      ? urlObj.pathname.slice(1)
      : urlObj.pathname;
  } catch (error) {
    return null;
  }
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

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

  const signatureKey = user?.signatures?.[role] ?? null;

  const signatureUrl = signatureKey ? `/api/files/${signatureKey}` : null;

  return NextResponse.json({
    signatureUrl,
    role,
  });
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

    // Hapus tanda tangan lama milik role ini jika ada
    const existing = await User.findById(session.user.id)
      .select("signatures")
      .lean<{ signatures?: Record<Role, string | null> }>();

    const oldUrl = existing?.signatures?.[role];
    if (oldUrl) {
      const oldKey = getKeyFromUrl(oldUrl);
      if (oldKey) {
        await s3Client
          .send(
            new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: oldKey,
            }),
          )
          .catch(() => null); // Abaikan error jika file tidak ada di R2
      }
    }

    // Ambil ekstensi yang sesuai
    let ext = "jpg";
    if (file.type === "image/png") ext = "png";
    if (file.type === "image/webp") ext = "webp";

    const pathname = `signatures/${role}/${session.user.id}-${Date.now()}.${ext}`;

    // Ubah File menjadi Buffer untuk diunggah ke R2
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Unggah ke Cloudflare R2
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: pathname,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    // Buat public URL berdasarkan domain R2 Anda
    const signatureKey = pathname;

    await User.findByIdAndUpdate(session.user.id, {
      $set: {
        [`signatures.${role}`]: signatureKey,
      },
    });

    return NextResponse.json({ signatureUrl: signatureKey, role });
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
      const oldKey = getKeyFromUrl(oldUrl);
      if (oldKey) {
        // Hapus dari R2
        await s3Client
          .send(
            new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: oldKey,
            }),
          )
          .catch(() => null);
      }
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
