import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb"; // Sesuaikan dengan folder letak connectDB Anda
import User from "@/models/User"; // Sesuaikan dengan folder letak model User Anda
// import bcrypt from "bcryptjs"; // Buka komentar ini jika Anda menggunakan enkripsi password (sangat direkomendasikan)

export const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const { username, password } = credentials;

        try {
          // 1. Koneksikan ke Database MongoDB
          await connectDB();

          // 2. Cari user di database berdasarkan username
          // Menggunakan Regex "i" agar pencarian bersifat Case-Insensitive (tidak sensitif huruf besar/kecil)
          const dbUser = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, "i") },
          });

          // Jika user tidak ditemukan
          if (!dbUser) {
            return null;
          }

          // 3. Validasi Password
          // OPSI A: Jika password di database disimpan menggunakan plain-text (teks biasa):
          const isPasswordMatch = password === dbUser.password;

          // OPSI B: Jika password di database di-hash menggunakan bcrypt (Rekomendasi Production):
          // const isPasswordMatch = await bcrypt.compare(password, dbUser.password);

          if (!isPasswordMatch) {
            return null;
          }

          // 4. Kembalikan data user yang berhasil ditemukan ke NextAuth
          // Penting: Mongoose id (_id) harus diubah menjadi string .toString()
          return {
            id: dbUser._id.toString(),
            name: dbUser.username,
            username: dbUser.username,
            role: dbUser.role, // Akan otomatis berisi "pj teknik", "tenaga kerja k3", atau "direktur" sesuai DB
          };
        } catch (error) {
          console.error("Terjadi kesalahan saat proses login:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
