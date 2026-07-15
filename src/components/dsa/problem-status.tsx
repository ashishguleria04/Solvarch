"use client";

import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { problemStatus, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

/** Fixed-size status dot for problem rows: solved, attempted, or untouched. */
export function ProblemStatusIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const progress = useProgress();
  const status = problemStatus(progress, slug);

  if (status === "solved") {
    return (
      <CheckCircle2
        aria-label="Solved"
        className={cn("size-4 shrink-0 text-emerald-400", className)}
      />
    );
  }
  if (status === "attempted") {
    return (
      <CircleDot
        aria-label="Attempted"
        className={cn("size-4 shrink-0 text-amber-400", className)}
      />
    );
  }
  return (
    <Circle
      aria-hidden
      className={cn("size-4 shrink-0 text-muted-foreground/25", className)}
    />
  );
}

/** "Solved" pill for the problem header; renders nothing until solved. */
export function SolvedBadge({ slug }: { slug: string }) {
  const progress = useProgress();
  if (problemStatus(progress, slug) !== "solved") return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
      <CheckCircle2 className="size-3.5" />
      Solved
    </span>
  );
}
