"use client";

// Combined roadmap completion: solved DSA problems + completed readings over
// one item list, rendered as a mini ring like ContentProgressSummary.

import { contentDoneCount, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function RoadmapCompletion({
  dsaSlugs,
  contentKeys,
  className,
}: {
  dsaSlugs: string[];
  contentKeys: string[];
  className?: string;
}) {
  const progress = useProgress();
  const solved = dsaSlugs.reduce(
    (n, slug) => n + (progress.problems[slug]?.status === "solved" ? 1 : 0),
    0
  );
  const done = solved + contentDoneCount(progress, contentKeys);
  const total = dsaSlugs.length + contentKeys.length;
  const pct = total > 0 ? done / total : 0;
  const complete = total > 0 && done === total;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        complete && "text-emerald-600 dark:text-emerald-400",
        className
      )}
    >
      <svg viewBox="0 0 20 20" className="size-4 -rotate-90" aria-hidden>
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          strokeWidth="3"
          className="stroke-muted-foreground/20"
        />
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${circumference * pct} ${circumference}`}
          className={cn(
            "transition-[stroke-dasharray] duration-500",
            complete ? "stroke-emerald-500 dark:stroke-emerald-400" : "stroke-primary"
          )}
        />
      </svg>
      {done}/{total} completed
    </span>
  );
}
