import { Logo } from "@/components/design-system/logo";
import { SidebarNav } from "@/components/app/app-nav";
import { SearchButton } from "@/components/app/command-palette";
import { ThemeToggle } from "@/components/app/theme-toggle";

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo href="/dsa" />
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3 scrollbar-thin">
        <SearchButton className="w-full" />
        <SidebarNav />
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
