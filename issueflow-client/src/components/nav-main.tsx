"use client";

import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavMainItem = {
  title: string;
  url: string;
  icon?: ReactNode;
};

export function NavMain({ items }: { items: NavMainItem[] }) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={
                    isActive
                      ? "bg-[#9D5FD4]/15 text-[#9D5FD4] hover:bg-[#9D5FD4]/20 hover:text-[#8B4FC3] mb-2"
                      : "hover:bg-[#9D5FD4]/10 hover:text-[#9D5FD4]"
                  }
                >
                  <Link to={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
