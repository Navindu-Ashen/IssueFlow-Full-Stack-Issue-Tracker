import * as React from "react";
import { Link } from "react-router-dom";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { useAuthStore } from "@/stores/authStore";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Issues",
      url: "/issues",
      icon: <ListTodoIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Privacy Policies",
      url: "/privacy-policies",
      icon: <ShieldCheckIcon />,
    },
    {
      title: "Terms & Conditions",
      url: "/terms-and-conditions",
      icon: <FileTextIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.user);
  const { isMobile, setOpenMobile } = useSidebar();

  const sidebarUser = {
    name: user?.name ?? "User",
    email: user?.email ?? "",
    avatar: user?.profilePictureUrl ?? "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-8!"
            >
              <Link 
                to="/dashboard"
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
              >
                <img src="./logo-primary.png" alt="Avatar" className="h-14" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
