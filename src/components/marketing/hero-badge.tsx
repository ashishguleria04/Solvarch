"use client";

// Personalizes the hero's top badge for returning learners. The server (and
// the first client paint) renders the generic "free & open source" pill; once
// mounted we read local progress and, if there's any, swap in a welcome-back
// strip with streak, solved count, and reviews due. Mirrors the hydrate-empty
// pattern used by the daily-problem card.

import Link from "next/link";
import { ArrowRight, Flame, RefreshCcw, Sparkles } from "lucide-react";
import { computeStreak, useProgress } from "@/lib/progress";
import { dueCount, useReview } from "@/lib/review";

export function HeroBadge() {
  const progress = useProgress();
  const review = useReview();

  const solved = Object.values(progress.problems).filter(
    (p) => p.status === "solved"
  ).length;
  const streak = computeStreak(progress);
  const due = dueCount(review, new Date());
  const returning = solved > 0 || streak.current > 0 || due > 0;

  if (!returning) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
        <Sparkles className="size-3.5 text-primary" />
        Free &amp; open source — no login, no paywall
      </div>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs backdrop-blur">
      <span className="font-medium text-foreground">Welcome back</span>
      {streak.current > 0 && (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Flame className="size-3.5 text-amber-500 dark:text-amber-400" />
          {streak.current}-day streak
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <span className="font-mono text-foreground">{solved}</span> solved
      </span>
      {due > 0 && (
        <Link
          href="/review"
          className="group inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
        >
          <RefreshCcw className="size-3.5" />
          {due} {due === 1 ? "review" : "reviews"} due
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
