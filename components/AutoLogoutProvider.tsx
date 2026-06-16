"use client";
import { useAutoLogout } from "@/app/hook/UseAutoLogout";

export default function AutoLogoutProvider() {
  useAutoLogout();
  return null;
}
