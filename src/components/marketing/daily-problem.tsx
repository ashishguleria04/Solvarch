"use client";

// Daily problem — a date-seeded pick from the catalog, chosen on the client
// so "today" matches the user's local date (the same day key streaks count
// by). Renders a placeholder until mounted since the server can't know the
// visitor's date.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Flame } from "lucide-react";
import type { Difficulty } from "@/data/dsa";
import {
  computeStreak,
  localDayKey,
  problemStatus,
  useProgress,
} from "@/lib/progress";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DailyCatalogEntry = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  topicName: string;
};

/** Deterministic index for a day key (djb2 hash) — same pick for everyone. */
export function dailyIndex(day: string, count: number): number {
  let h = 5381;
  for (let i = 0; i < day.length; i++) {
    h = (h * 33) ^ day.charCodeAt(i);
  }
  return (h >>> 0) % count;
}

export function DailyProblemCard({
  problems,
}: {
  problems: DailyCatalogEntry[];
}) {
  const progress = useProgress();
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(localDayKey()), []);

  if (problems.length === 0) return null;

  const pick = today
    ? problems[dailyIndex(today, problems.length)]
    : null;
  const solved = pick
    ? problemStatus(progress, pick.slug) === "solved"
    : false;
  const streak = computeStreak(progress);
  const dateLabel = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="glow-soft flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <CalendarDays className="size-3.5 text-primary" />
          Daily challenge
          {pick && <span className="normal-case tracking-normal">· {dateLabel}</span>}
        </div>
        {pick ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-lg font-semibold tracking-tight">
              {pick.title}
            </span>
            <DifficultyBadge difficulty={pick.difficulty} />
            <span className="text-sm text-muted-foreground">{pick.topicName}</span>
            {solved && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
                <CheckCircle2 className="size-4" />
                Solved
              </span>
            )}
          </div>
        ) : (
          <div className="mt-2 h-7 w-56 animate-pulse rounded-md bg-secondary" />
        )}
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <div className="flex items-center gap-2" title="Solve streak">
          <Flame
            className={cn(
              "size-6",
              streak.solvedToday ? "text-amber-400" : "text-muted-foreground/40"
            )}
          />
          <div className="leading-tight">
            <div className="text-lg font-semibold">{streak.current}</div>
            <div className="text-[11px] text-muted-foreground">day streak</div>
          </div>
        </div>
        <Button asChild variant={solved ? "outline" : "glow"} size="sm">
          <Link href={pick ? `/dsa/${pick.slug}` : "/dsa"}>
            {solved ? "Solve again" : "Solve it"}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
