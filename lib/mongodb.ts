import mongoose from "mongoose";

// Menambahkan tipe kembalian Promise<void> karena fungsi ini asinkron dan tidak mengembalikan nilai
export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;

    // Memastikan URI tersedia sebelum digunakan
    if (!uri) {
      throw new Error(
        "MONGODB_URI belum didefinisikan di dalam file environment (.env)",
      );
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    // Menggunakan console.error untuk membedakan log error
    console.error("Error connecting to MongoDB:", error);
  }
};
