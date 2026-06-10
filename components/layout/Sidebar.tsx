"use client";

import {
  Briefcase,
  ChevronUp,
  Home,
  Plus,
  SquarePen,
  User2,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

const menuByRole = {
  PJ_TEKNIK: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Work Permit",
      url: "/work-permits",
      icon: SquarePen,
    },
    {
      title: "JSA",
      url: "/jsa",
      icon: SquarePen,
    },
    {
      title: "HIRARC",
      url: "/hirarc",
      icon: SquarePen,
    },
  ],

  TENAGA_AHLI_K3: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Review Work Permit",
      url: "/work-permits/review",
      icon: SquarePen,
    },
    {
      title: "Review JSA",
      url: "/jsa/review",
      icon: SquarePen,
    },
    {
      title: "Review HIRARC",
      url: "/hirarc/review",
      icon: SquarePen,
    },
    {
      title: "Master Pekerjaan",
      url: "/master/jobs",
      icon: Briefcase,
    },
    {
      title: "Master Personel",
      url: "/master/personnel",
      icon: Users,
    },
  ],

  DIREKTUR: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Approval Dokumen",
      url: "/approval",
      icon: SquarePen,
    },
  ],
};

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
  const pathname = usePathname();
  const handleLogout = async () => {
    // callbackUrl memastikan setelah logout, user diarahkan kembali ke halaman login (/)
    await signOut({ callbackUrl: "/login" });
  };

  const { data: session } = useSession();

  const role = session?.user?.role;

  const menus = menuByRole[role as keyof typeof menuByRole] || [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Dashboard */}
            <SidebarMenu>
              {menus.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={handleLogout}>Logout</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
