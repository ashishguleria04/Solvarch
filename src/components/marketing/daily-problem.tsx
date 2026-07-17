"use client";

// Daily practice set — three date-seeded picks from the catalog (one easy,
// one medium, one hard), chosen on the client so "today" matches the user's
// local date (the same day key streaks count by). Renders a placeholder until
// mounted since the server can't know the visitor's date.

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Flame,
} from "lucide-react";
import type { Difficulty } from "@/data/dsa";
import {
  computeStreak,
  localDayKey,
  problemStatus,
  useProgress,
} from "@/lib/progress";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { cn } from "@/lib/utils";

export type DailyCatalogEntry = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  topicName: string;
  /** Pattern tags — shown so the learner knows what to recognize. */
  tags: string[];
  hasEditorial: boolean;
};

/** Deterministic index for a day key (djb2 hash) — same pick for everyone. */
export function dailyIndex(day: string, count: number): number {
  let h = 5381;
  for (let i = 0; i < day.length; i++) {
    h = (h * 33) ^ day.charCodeAt(i);
  }
  return (h >>> 0) % count;
}

const DIFFICULTY_ORDER: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

/** One curated pick per difficulty; falls back to the whole catalog if a
 * difficulty bucket is empty. Deduped so the set always has distinct problems. */
export function dailySet(
  problems: DailyCatalogEntry[],
  day: string
): DailyCatalogEntry[] {
  const picks: DailyCatalogEntry[] = [];
  for (const difficulty of DIFFICULTY_ORDER) {
    const pool = problems.filter(
      (p) => p.difficulty === difficulty && !picks.includes(p)
    );
    const fallback = problems.filter((p) => !picks.includes(p));
    const from = pool.length > 0 ? pool : fallback;
    if (from.length === 0) break;
    picks.push(from[dailyIndex(`${day}:${difficulty}`, from.length)]);
  }
  return picks;
}

// The visitor's local date is unknowable on the server, so hydrate as null
// and pick the problems on the client. Strings compare by value, so returning
// a fresh key per render is stable for useSyncExternalStore.
const emptySubscribe = () => () => {};
function useLocalToday(): string | null {
  return useSyncExternalStore(
    emptySubscribe,
    () => localDayKey(),
    () => null
  );
}

export function DailyProblemCard({
  problems,
}: {
  problems: DailyCatalogEntry[];
}) {
  const progress = useProgress();
  const today = useLocalToday();

  if (problems.length === 0) return null;

  const picks = today ? dailySet(problems, today) : null;
  const solvedCount =
    picks?.filter((p) => problemStatus(progress, p.slug) === "solved").length ?? 0;
  const streak = computeStreak(progress);
  const dateLabel = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="glow-soft rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <CalendarDays className="size-3.5 text-primary" />
          Daily set · 3 curated problems
          {picks && <span className="normal-case tracking-normal">· {dateLabel}</span>}
        </div>

        <div className="flex items-center gap-5">
          {picks && (
            <span
              className={cn(
                "text-sm font-medium",
                solvedCount === picks.length
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {solvedCount}/{picks.length} solved
            </span>
          )}
          <div className="flex items-center gap-2" title="Solve streak">
            <Flame
              className={cn(
                "size-5",
                streak.solvedToday ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground/40"
              )}
            />
            <span className="text-sm font-semibold">{streak.current}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
        </div>
      </div>

      <div className="mt-4 divide-y divide-border/70 rounded-lg border border-border/70">
        {picks
          ? picks.map((pick) => {
              const solved = problemStatus(progress, pick.slug) === "solved";
              return (
                <Link
                  key={pick.slug}
                  href={`/dsa/${pick.slug}`}
                  className="group flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3 transition-colors hover:bg-accent/40"
                >
                  <DifficultyBadge difficulty={pick.difficulty} />
                  <span className="font-medium tracking-tight group-hover:text-primary">
                    {pick.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {pick.topicName}
                  </span>
                  {solved && (
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-label="Solved" />
                  )}
                  <span className="ml-auto flex items-center gap-2">
                    <span className="hidden flex-wrap gap-1.5 sm:flex">
                      {pick.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                    {pick.hasEditorial && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary/80"
                        title="Editorial included"
                      >
                        <BookOpenCheck className="size-3.5" />
                        Editorial
                      </span>
                    )}
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </span>
                </Link>
              );
            })
          : [0, 1, 2].map((i) => (
              <div key={i} className="px-4 py-3">
                <div className="h-6 w-2/3 animate-pulse rounded-md bg-secondary" />
              </div>
            ))}
      </div>
    </div>
  );
}
