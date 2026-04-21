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
} from "@/components/ui/sidebar";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Separator } from "./ui/separator";

const data = {
  user: {
    name: "Navindu",
    email: "navindu@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-8!"
            >
              <Link to="/dashboard">
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
