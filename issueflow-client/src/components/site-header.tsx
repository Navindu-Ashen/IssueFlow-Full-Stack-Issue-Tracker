import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header className="flex h-20 shrink-0 items-center gap-2 border-b border-[#9D5FD4]/20 bg-[#9D5FD4]/5 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 hover:bg-[#9D5FD4]/10 hover:text-[#9D5FD4]" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-8"
        />

        <div className="flex items-center gap-2">
          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-[#5F2C8A] md:text-base">
              Issue Flow Dashboard
            </h1>
            <p className="text-md text-muted-foreground">
              Latest issue activity
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
