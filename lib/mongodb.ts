// lib/mongodb.ts
import mongoose from "mongoose";

// Daftarkan semua model di sini sekali selamanya
import "@/models/Personnel";
import "@/models/JobTemplate";
import "@/models/WorkPermit";
// tambahkan model lain di sini seiring berkembangnya project

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI belum diset di .env");
}

// Cache koneksi agar tidak membuat koneksi baru di setiap request
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  (global as any).mongoose = cached;

  return cached.conn;
}
