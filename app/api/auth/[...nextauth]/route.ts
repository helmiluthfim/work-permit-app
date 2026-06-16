import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
// import bcrypt from "bcryptjs";

export const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Tanpa maxAge → cookie session tidak punya expiry
    // sehingga browser akan otomatis menghapusnya saat ditutup
    maxAge: 60 * 60 * 8, // 8 jam maksimal jika browser tetap terbuka
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // ⬇ Tidak set "expires" / "maxAge" di sini
        // sehingga jadi session cookie (hilang saat browser ditutup)
      },
    },
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
          await connectDB();

          const dbUser = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, "i") },
          });

          if (!dbUser) {
            return null;
          }

          // OPSI A: plain-text password
          const isPasswordMatch = password === dbUser.password;

          // OPSI B: bcrypt (rekomendasi production)
          // const isPasswordMatch = await bcrypt.compare(password, dbUser.password);

          if (!isPasswordMatch) {
            return null;
          }

          return {
            id: dbUser._id.toString(),
            name: dbUser.username,
            username: dbUser.username,
            role: dbUser.role,
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
