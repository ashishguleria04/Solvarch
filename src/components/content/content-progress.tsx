"use client";

// Completion UI for reading content (CS Fundamentals + System Design).
// Keys follow "cs/{subject}/{topic}" and "system-design/{slug}" and live in
// the same localStorage progress store as DSA solves, so export/import and
// reset cover reading marks too.

import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import {
  contentDoneCount,
  isContentDone,
  toggleContentDone,
  useProgress,
} from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Fixed-size check for list rows and cards: completed or untouched. */
export function ContentCheckIcon({
  contentKey,
  className,
}: {
  contentKey: string;
  className?: string;
}) {
  const progress = useProgress();
  if (isContentDone(progress, contentKey)) {
    return (
      <CheckCircle2
        aria-label="Completed"
        className={cn("size-4 shrink-0 text-emerald-400", className)}
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

/** Toggle button for the bottom of an article: mark read / unread. */
export function MarkCompleteButton({ contentKey }: { contentKey: string }) {
  const progress = useProgress();
  const done = isContentDone(progress, contentKey);

  return (
    <Button
      variant={done ? "outline" : "glow"}
      size="sm"
      onClick={() => {
        const nowDone = toggleContentDone(contentKey);
        toast.success(
          nowDone ? "Marked as completed." : "Marked as not completed."
        );
      }}
      className={cn(done && "border-emerald-500/40 text-emerald-400")}
    >
      <CheckCircle2 className="size-4" />
      {done ? "Completed" : "Mark as complete"}
    </Button>
  );
}

/** "n/total" count with a mini completion ring, for cards and headers. */
export function ContentProgressSummary({
  keys,
  className,
}: {
  keys: string[];
  className?: string;
}) {
  const progress = useProgress();
  const done = contentDoneCount(progress, keys);
  const pct = keys.length > 0 ? done / keys.length : 0;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        done === keys.length && keys.length > 0 && "text-emerald-400",
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
            done === keys.length && keys.length > 0
              ? "stroke-emerald-400"
              : "stroke-primary"
          )}
        />
      </svg>
      {done}/{keys.length} completed
    </span>
  );
}
