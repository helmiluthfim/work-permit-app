// app/(main)/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";
import DashboardPjTeknik from "@/components/dashboard/DashboardPjTeknik";
import DashboardK3 from "@/components/dashboard/DashboardK3";
import DashboardDirektur from "@/components/dashboard/DashboardDirektur";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <LoadingScreen />;

  // Render komponen sesuai role secara dinamis dan bersih!
  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {session?.user?.role === "PJ_TEKNIK" && <DashboardPjTeknik />}
      {session?.user?.role === "TENAGA_AHLI_K3" && <DashboardK3 />}
      {session?.user?.role === "DIREKTUR" && <DashboardDirektur />}
    </div>
  );
}
