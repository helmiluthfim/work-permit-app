"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Briefcase,
  Home,
  SquarePen,
  Users,
  ChevronUp,
  LogOut,
  User2,
  Menu,
  X,
  Shield,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  Plus,
} from "lucide-react";

const menuByRole = {
  PJ_TEKNIK: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Buat Izin Kerja Baru", url: "/work-permits/create", icon: Plus },
    { title: "Riwayat Pengajuan", url: "/work-permits", icon: FileText },
    // JSA & HIRARC dihapus karena sudah include di dalam "Riwayat Pengajuan"
  ],
  TENAGA_AHLI_K3: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    {
      title: "Antrean Review",
      url: "/work-permits/review",
      icon: ClipboardCheck,
    },
    { title: "Master Pekerjaan", url: "/master/jobs", icon: Briefcase },
    { title: "Master Personel", url: "/master/personnel", icon: Users },
  ],
  DIREKTUR: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Persetujuan Akhir", url: "/approval", icon: ShieldCheck },
  ],
};

const roleLabel: Record<string, string> = {
  PJ_TEKNIK: "PJ Teknik",
  TENAGA_AHLI_K3: "Tenaga Ahli K3",
  DIREKTUR: "Direktur",
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const role = session?.user?.role as string | undefined;
  const menus = menuByRole[role as keyof typeof menuByRole] || [];
  const username = session?.user?.name || session?.user?.username || "Pengguna";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const SidebarInner = () => (
    <div className="flex h-full flex-col bg-[#0F1F3D]">
      {/* ── Header / Brand ── */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5A623]">
          <Shield size={15} color="#0F1F3D" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-black uppercase tracking-[0.12em] text-white">
            Eksavindo
          </p>
          <p className="truncate text-[9px] uppercase tracking-widest text-[#F5A623]/70">
            K3 System
          </p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Tutup menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Role badge ── */}
      {role && (
        <div className="mx-4 mt-4 rounded-lg bg-[#F5A623]/10 px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5A623]/60">
            Hak Akses
          </p>
          <p className="text-xs font-bold text-[#F5A623]">
            {roleLabel[role] ?? role}
          </p>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
          Menu
        </p>
        <ul className="flex flex-col gap-0.5">
          {menus.map((item) => {
            let isActive = false;

            if (item.url === "/work-permits") {
              // Khusus "Riwayat Pengajuan" harus sama persis, agar tidak ikut menyala
              // saat user berada di "/work-permits/create"
              isActive = pathname === "/work-permits";
            } else {
              // Menu lain akan menyala jika URL sama persis ATAU sedang berada di sub-halamannya
              // (Misal: "/work-permits/create/jsa" akan membuat "/work-permits/create" menyala)
              isActive =
                pathname === item.url || pathname.startsWith(`${item.url}/`);
            }
            return (
              <li key={item.title}>
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={[
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-[#F5A623] text-[#0F1F3D] shadow-sm"
                      : "text-white/60 hover:bg-white/8 hover:text-white",
                  ].join(" ")}
                >
                  {/* Active indicator bar */}
                  <span
                    className={[
                      "flex h-5 w-5 shrink-0 items-center justify-center",
                    ].join(" ")}
                  >
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                  </span>
                  <span className="truncate">{item.title}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F1F3D]/40" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer / User menu ── */}
      <div className="border-t border-white/10 px-3 pb-4 pt-3">
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/8"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70">
              <User2 size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {username}
              </p>
              <p className="truncate text-[10px] text-white/40">
                {role ? (roleLabel[role] ?? role) : "—"}
              </p>
            </div>
            <ChevronUp
              size={14}
              className={[
                "shrink-0 text-white/30 transition-transform duration-200",
                userMenuOpen ? "rotate-0" : "rotate-180",
              ].join(" ")}
            />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 overflow-hidden rounded-lg border border-white/10 bg-[#162b50] shadow-xl">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={14} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden h-screen w-60 shrink-0 overflow-hidden md:flex md:flex-col">
        <SidebarInner />
      </aside>

      {/* ── MOBILE: hamburger trigger ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Buka menu"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F1F3D] text-white shadow-lg md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* ── MOBILE: backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── MOBILE: drawer ── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 overflow-hidden transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarInner />
      </aside>
    </>
  );
}
