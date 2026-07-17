"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";
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
import { openCommandPalette } from "@/components/app/command-palette";
import { ThemeToggle } from "@/components/app/theme-toggle";

export function AppTopbar() {
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
            <Logo href="/dsa" />
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="lg:hidden">
        <Logo href="/dsa" showText={false} />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={openCommandPalette}
          aria-label="Search (Ctrl+K)"
          className="lg:hidden"
        >
          <Search className="size-4.5" />
        </Button>
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
