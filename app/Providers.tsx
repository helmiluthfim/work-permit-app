"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

// Mendefinisikan tipe data untuk props
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
