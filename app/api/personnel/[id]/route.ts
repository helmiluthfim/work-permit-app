import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Personnel from "@/models/Personnel";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  await connectDB();

  const { id } = await params;

  const personnel = await Personnel.findById(id);

  return NextResponse.json({
    success: true,
    data: personnel,
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  await connectDB();

  const { id } = await params;

  const body = await req.json();

  const updated = await Personnel.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json({
    success: true,
    data: updated,
  });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await connectDB();

  const { id } = await params;

  await Personnel.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
  });
}
