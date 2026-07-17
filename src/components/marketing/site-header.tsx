"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Logo } from "@/components/design-system/logo";
import { openCommandPalette } from "@/components/app/command-palette";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PRODUCT_NAV } from "@/lib/constants";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {PRODUCT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={openCommandPalette}
            aria-label="Search (Ctrl+K)"
          >
            <Search className="size-4.5" />
          </Button>
          <ThemeToggle />
          <Button asChild variant="glow" size="sm">
            <Link href="/dsa">Start solving</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={openCommandPalette}
            aria-label="Search (Ctrl+K)"
          >
            <Search className="size-5" />
          </Button>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo href="/" />
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-2">
                {PRODUCT_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 px-4">
                <Button asChild variant="glow">
                  <Link href="/dsa">Start solving</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
