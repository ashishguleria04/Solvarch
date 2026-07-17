"use client";

// Global command palette — Ctrl/Cmd+K anywhere, or the search buttons in the
// headers (they dispatch OPEN_PALETTE_EVENT). Fuzzy-searches the server-built
// index of every problem, roadmap, company, and content page, plus a few
// quick actions (random problem, theme switching).

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Building2,
  Code2,
  Cpu,
  FileText,
  Map,
  Monitor,
  Moon,
  Network,
  Search,
  Shuffle,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { scoreItem } from "@/lib/fuzzy";
import { setTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { SearchGroup, SearchItem } from "@/lib/search-index";

export const OPEN_PALETTE_EVENT = "solvarch:open-command-palette";

/** Open the palette from anywhere (used by the header search buttons). */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}

const GROUP_ICON: Record<SearchGroup, LucideIcon> = {
  Pages: FileText,
  Problems: Code2,
  Topics: Code2,
  Roadmaps: Map,
  Companies: Building2,
  "System Design": Network,
  "Cheat Sheets": BookOpen,
  "CS Fundamentals": Cpu,
};

type Action = {
  title: string;
  hint?: string;
  icon: LucideIcon;
  keywords: string;
  perform: () => void;
};

type Row =
  | { kind: "item"; item: SearchItem }
  | { kind: "action"; action: Action };

const MAX_RESULTS = 12;

export function CommandPalette({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Open/close always goes through here so a close also clears the query.
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
      setActive(0);
    }
  }
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleOpenChange(!openRef.current);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  const actions = useMemo<Action[]>(() => {
    const problemPaths = items
      .filter((i) => i.group === "Problems")
      .map((i) => i.path);
    return [
      {
        title: "Random problem",
        hint: "Action",
        icon: Shuffle,
        keywords: "shuffle surprise pick random dsa",
        perform: () => {
          const path =
            problemPaths[Math.floor(Math.random() * problemPaths.length)];
          if (path) router.push(path);
        },
      },
      {
        title: "Theme: Light",
        hint: "Action",
        icon: Sun,
        keywords: "light mode theme appearance",
        perform: () => setTheme("light"),
      },
      {
        title: "Theme: Dark",
        hint: "Action",
        icon: Moon,
        keywords: "dark mode theme appearance",
        perform: () => setTheme("dark"),
      },
      {
        title: "Theme: System",
        hint: "Action",
        icon: Monitor,
        keywords: "system auto theme appearance",
        perform: () => setTheme("system"),
      },
    ];
  }, [items, router]);

  const rows = useMemo<Row[]>(() => {
    const q = query.trim();
    if (!q) {
      // Empty query: quick nav + actions, like a start screen.
      const pages = items.filter((i) => i.group === "Pages" && i.path !== "/");
      return [
        ...pages.map((item) => ({ kind: "item" as const, item })),
        ...actions.map((action) => ({ kind: "action" as const, action })),
      ];
    }
    const scoredItems = items
      .map((item) => ({
        item,
        score: scoreItem(q, item.title, item.keywords),
      }))
      .filter((r): r is { item: SearchItem; score: number } => r.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map(({ item }) => ({ kind: "item" as const, item }));
    const scoredActions = actions
      .map((action) => ({
        action,
        score: scoreItem(q, action.title, action.keywords),
      }))
      .filter((r): r is { action: Action; score: number } => r.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ action }) => ({ kind: "action" as const, action }));
    return [...scoredItems, ...scoredActions];
  }, [query, items, actions]);

  // Selection can outlive a shrinking result set — clamp instead of effect.
  const activeIndex = Math.min(active, Math.max(rows.length - 1, 0));

  function onQueryChange(value: string) {
    setQuery(value);
    setActive(0);
  }

  function select(row: Row) {
    handleOpenChange(false);
    if (row.kind === "item") router.push(row.item.path);
    else row.action.perform();
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[activeIndex];
      if (row) select(row);
    }
  }

  // Keep the active row scrolled into view during keyboard navigation.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[15%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Search Solvarch</DialogTitle>
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search problems, roadmaps, guides…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search"
          />
          <kbd className="hidden rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            esc
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[min(24rem,60vh)] overflow-y-auto p-2 scrollbar-thin"
        >
          {rows.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results for “{query.trim()}”.
            </p>
          ) : (
            rows.map((row, i) => {
              const title =
                row.kind === "item" ? row.item.title : row.action.title;
              const hint =
                row.kind === "item" ? row.item.hint ?? row.item.group : row.action.hint;
              const Icon =
                row.kind === "item"
                  ? GROUP_ICON[row.item.group]
                  : row.action.icon;
              return (
                <button
                  key={`${row.kind}-${title}-${i}`}
                  data-active={i === activeIndex}
                  onClick={() => select(row)}
                  onMouseMove={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    i === activeIndex
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/90"
                  )}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{title}</span>
                  {hint && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {hint}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          <span>
            <kbd className="font-mono">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="font-mono">↵</kbd> open
          </span>
          <span>
            <kbd className="font-mono">esc</kbd> close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Header search button — looks like an input, opens the palette. */
export function SearchButton({ className }: { className?: string }) {
  return (
    <button
      onClick={openCommandPalette}
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
        className
      )}
      aria-label="Search (Ctrl+K)"
    >
      <Search className="size-4" />
      <span className="flex-1 text-left">Search…</span>
      <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
        Ctrl K
      </kbd>
    </button>
  );
}
