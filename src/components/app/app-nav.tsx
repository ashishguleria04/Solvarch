"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
  Code2,
  Map,
  Network,
  Cpu,
  MessagesSquare,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { dueCount, useReview } from "@/lib/review";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: LucideIcon };

export const APP_NAV: NavItem[] = [
  { label: "DSA Problems", href: "/dsa", icon: Code2 },
  { label: "Roadmaps", href: "/roadmaps", icon: Map },
  { label: "Review", href: "/review", icon: RotateCcw },
  { label: "Cheat Sheets", href: "/cheatsheets", icon: BookOpen },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "System Design", href: "/system-design", icon: Network },
  { label: "CS Fundamentals", href: "/cs", icon: Cpu },
  { label: "Question Bank", href: "/questions", icon: MessagesSquare },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const review = useReview();
  // Day-granularity count; recomputed on any queue change. Server-renders 0.
  const due = useMemo(() => dueCount(review, new Date()), [review]);

  const renderItem = (item: NavItem) => {
    const active = isActive(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <item.icon
          className={cn(
            "size-4.5 shrink-0 transition-colors",
            active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        {item.label}
        {item.href === "/review" && due > 0 && (
          <span
            className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-400"
            aria-label={`${due} reviews due`}
          >
            {due}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="flex flex-1 flex-col gap-1">{APP_NAV.map(renderItem)}</nav>
    </div>
  );
}
