import { NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

const s3Client = new S3Client({
  region: "auto",

  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME as string;

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      key: string[];
    }>;
  },
) {
  try {
    const { key } = await params;

    const objectKey = key.join("/");

    // Pastikan hanya folder signatures yang bisa diakses
    if (!objectKey.startsWith("signatures/")) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
      }),
    );

    if (!response.Body) {
      return NextResponse.json(
        {
          error: "File tidak ditemukan",
        },
        {
          status: 404,
        },
      );
    }

    const body = await response.Body.transformToByteArray();

    return new NextResponse(body, {
      status: 200,

      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",

        // Cache di browser/CDN
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Gagal mengambil file dari R2:", error);

    return NextResponse.json(
      {
        error: "File tidak ditemukan",
      },
      {
        status: 404,
      },
    );
  }
}
