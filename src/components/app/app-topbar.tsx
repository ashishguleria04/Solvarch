"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/design-system/logo";
import { SidebarNav } from "@/components/app/app-nav";
import { UpgradeCard } from "@/components/app/upgrade-card";
import { UserMenu } from "@/components/app/user-menu";

export function AppTopbar({
  user,
  isPro,
  streak,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
  isPro: boolean;
  streak: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="h-16 justify-center border-b border-border px-5">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Logo href="/dashboard" />
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
            <SidebarNav onNavigate={() => setOpen(false)} />
            {!isPro && <UpgradeCard />}
          </div>
        </SheetContent>
      </Sheet>

      <div className="lg:hidden">
        <Logo href="/dashboard" showText={false} />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {streak > 0 && (
          <div
            className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm sm:flex"
            title={`${streak}-day streak`}
          >
            <Flame className="size-4 text-amber-400" />
            <span className="font-medium">{streak}</span>
          </div>
        )}

        {isPro ? (
          <span className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 sm:inline-flex">
            <Sparkles className="size-3.5" />
            Pro
          </span>
        ) : (
          <Button asChild variant="glow" size="sm" className="hidden sm:inline-flex">
            <Link href="/pricing">
              <Sparkles className="size-4" />
              Upgrade
            </Link>
          </Button>
        )}

        <UserMenu name={user.name} email={user.email} image={user.image} />
      </div>
    </header>
  );
}
