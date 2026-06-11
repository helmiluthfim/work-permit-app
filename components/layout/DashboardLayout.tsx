// app/dashboard/layout.tsx  (atau layout wrapper di root app)
// Letakkan ini sebagai layout yang membungkus semua halaman dengan sidebar + navbar

import Navbar from "./Navbar";
import AppSidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar: fixed height, tidak ikut scroll */}
      <AppSidebar />

      {/* Kolom kanan: navbar + konten yang bisa scroll */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
