"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Briefcase,
  Home,
  Users,
  ChevronUp,
  LogOut,
  User2,
  Menu,
  X,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  Plus,
} from "lucide-react";

const LOGO =
  "data:image/png;base64,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";

const menuByRole = {
  PJ_TEKNIK: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Buat Work Permit Baru", url: "/work-permits/create", icon: Plus },
    { title: "Riwayat Pengajuan", url: "/work-permits", icon: FileText },
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
    {
      title: "Persetujuan Akhir",
      url: "/work-permits/approval",
      icon: ShieldCheck,
    },
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

  const SidebarInner = () => (
    <div className="flex h-full flex-col bg-[#0F1F3D]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <img src={LOGO} alt="EKSTRAMA" className="h-7 w-auto" />
        <button
          onClick={() => setOpen(false)}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white md:hidden"
        >
          <X size={16} />
        </button>
      </div>

      {/* Role badge */}
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
          Menu
        </p>
        <ul className="flex flex-col gap-0.5">
          {menus.map((item) => {
            const isActive =
              item.url === "/work-permits"
                ? pathname === "/work-permits"
                : pathname === item.url || pathname.startsWith(`${item.url}/`);
            return (
              <li key={item.title}>
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#F5A623] text-[#0F1F3D]"
                      : "text-white/60 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <item.icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="truncate">{item.title}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#0F1F3D]/40" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User menu */}
      <div className="border-t border-white/10 px-3 pb-4 pt-3">
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/8"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70">
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
              className={`text-white/30 transition-transform ${userMenuOpen ? "" : "rotate-180"}`}
            />
          </button>
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 overflow-hidden rounded-lg border border-white/10 bg-[#162b50] shadow-xl">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={14} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden h-screen w-60 shrink-0 md:flex md:flex-col">
        <SidebarInner />
      </aside>

      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F1F3D] text-white shadow-lg md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarInner />
      </aside>
    </>
  );
}
