"use client";

import Navbar from "./Navbar";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex-1">
          <Navbar />

          <main className="p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
