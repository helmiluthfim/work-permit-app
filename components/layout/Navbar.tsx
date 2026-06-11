"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, ChevronRight } from "lucide-react";

/* ── Peta path → label halaman ── */
const pageTitles: Record<string, { title: string; parent?: string }> = {
  "/dashboard": { title: "Dashboard" },
  "/work-permits": { title: "Work Permit", parent: "Dokumen" },
  "/work-permits/review": { title: "Review Work Permit", parent: "Dokumen" },
  "/jsa": { title: "JSA", parent: "Dokumen" },
  "/jsa/review": { title: "Review JSA", parent: "Dokumen" },
  "/hirarc": { title: "HIRARC", parent: "Dokumen" },
  "/hirarc/review": { title: "Review HIRARC", parent: "Dokumen" },
  "/master/jobs": { title: "Master Pekerjaan", parent: "Master Data" },
  "/master/personnel": { title: "Master Personel", parent: "Master Data" },
  "/approval": { title: "Approval Dokumen", parent: "Persetujuan" },
};

const roleLabel: Record<string, string> = {
  PJ_TEKNIK: "PJ Teknik",
  TENAGA_AHLI_K3: "Tenaga Ahli K3",
  DIREKTUR: "Direktur",
};

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const page = pageTitles[pathname] ?? { title: "Halaman" };
  const username =
    session?.user?.name || (session?.user as any)?.username || "Pengguna";
  const role = (session?.user as any)?.role as string | undefined;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6">
      {/* ── Kiri: breadcrumb + judul ── */}
      <div className="flex flex-col justify-center gap-0.5">
        {/* Breadcrumb */}
        {page.parent && (
          <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-slate-400">
            <span>{page.parent}</span>
            <ChevronRight size={10} />
            <span className="text-[#0F1F3D]">{page.title}</span>
          </div>
        )}
        {/* Judul halaman */}
        <h1
          className={[
            "font-black tracking-tight text-[#0F1F3D]",
            page.parent ? "text-base" : "text-lg",
          ].join(" ")}
        >
          {page.title}
        </h1>
      </div>

      {/* ── Kanan: notif + user chip ── */}
      <div className="flex items-center gap-3">
        {/* Notifikasi bell */}
        <button
          aria-label="Notifikasi"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition hover:border-slate-300 hover:bg-slate-100 hover:text-[#0F1F3D]"
        >
          <Bell size={16} />
          {/* dot indikator */}
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F5A623]" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User chip */}
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F1F3D] text-[11px] font-black uppercase text-[#F5A623]">
            {username.charAt(0)}
          </div>
          {/* Info — hidden di layar sangat kecil */}
          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-bold leading-tight text-[#0F1F3D]">
              {username}
            </span>
            {role && (
              <span className="text-[10px] leading-tight text-slate-400">
                {roleLabel[role] ?? role}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
