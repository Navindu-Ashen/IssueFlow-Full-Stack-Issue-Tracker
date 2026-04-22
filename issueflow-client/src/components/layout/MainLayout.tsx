import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout() {
  return (
    <div
      className="relative min-h-svh overflow-x-hidden"
      style={{
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div 
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #f7f2fc 0%, #f3edf9 45%, #efe6f8 100%)",
        }}
      />
      <div 
        className="pointer-events-none absolute inset-0 -z-10 hidden md:block"
        style={{
          background: "radial-gradient(circle at 10% 10%, rgba(157,95,212,0.18), transparent 35%), radial-gradient(circle at 90% 15%, rgba(157,95,212,0.14), transparent 30%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10 hidden md:block">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#9D5FD4]/15 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#9D5FD4]/15 blur-3xl" />
      </div>

      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
            zIndex: 10,
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="bg-transparent">
          <SiteHeader />
          <div className="flex flex-1 flex-col relative z-20">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
