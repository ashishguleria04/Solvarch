import { Logo } from "@/components/design-system/logo";
import { SidebarNav } from "@/components/app/app-nav";
import { UpgradeCard } from "@/components/app/upgrade-card";

export function AppSidebar({ isPro }: { isPro: boolean }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo href="/dashboard" />
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3 scrollbar-thin">
        <SidebarNav />
        {!isPro && (
          <div className="mt-auto">
            <UpgradeCard />
          </div>
        )}
      </div>
    </aside>
  );
}
