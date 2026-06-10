import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // <-- Tambahkan baris ini
      username?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string; // <-- Tambahkan baris ini
    username?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // <-- Tambahkan baris ini
    username?: string;
    role?: string;
  }
}
