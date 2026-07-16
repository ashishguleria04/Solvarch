"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Code2,
  Network,
  Cpu,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: LucideIcon };

export const APP_NAV: NavItem[] = [
  { label: "DSA Problems", href: "/dsa", icon: Code2 },
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
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="flex flex-1 flex-col gap-1">{APP_NAV.map(renderItem)}</nav>
    </div>
  );
}
