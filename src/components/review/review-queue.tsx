"use client";

// The spaced-repetition queue: due problems with pass/fail grading, plus the
// upcoming schedule. Purely rule-based — see REVIEW_INTERVALS_DAYS.

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Difficulty } from "@/data/dsa";
import {
  REVIEW_INTERVALS_DAYS,
  formatDueIn,
  gradeReview,
  removeFromReview,
  splitQueue,
  useReview,
  type QueuedReview,
} from "@/lib/review";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { EmptyState } from "@/components/design-system/empty-state";
import { Button } from "@/components/ui/button";

export type ReviewCatalogProblem = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  topicName: string;
};

function handleGrade(slug: string, remembered: boolean) {
  const result = gradeReview(slug, remembered);
  if (!result) return;
  if (result.outcome === "graduated") {
    toast.success("Graduated! 🎓 This problem left the review queue.");
  } else if (remembered) {
    toast.success(`Nice — next review in ${result.nextInDays} days.`);
  } else {
    toast.info(`Back to the start — review again in ${result.nextInDays} day.`);
  }
}

function ReviewRow({
  queued,
  problem,
  now,
  due,
}: {
  queued: QueuedReview;
  problem: ReviewCatalogProblem;
  now: Date;
  due: boolean;
}) {
  const { slug, entry } = queued;
  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Link
          href={`/dsa/${slug}`}
          className="group inline-flex min-w-0 items-center gap-2 font-medium tracking-tight hover:text-primary"
        >
          <span className="truncate">{problem.title}</span>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </Link>
        <DifficultyBadge difficulty={problem.difficulty} />
        <span className="text-sm text-muted-foreground">{problem.topicName}</span>
        <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">
            step {Math.min(entry.stage + 1, REVIEW_INTERVALS_DAYS.length)}/
            {REVIEW_INTERVALS_DAYS.length}
          </span>
          <span className={due ? "font-medium text-amber-400" : ""}>
            {formatDueIn(entry.dueAt, now)}
          </span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-0">
        {due && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-500/40 text-emerald-400 hover:text-emerald-300"
              onClick={() => handleGrade(slug, true)}
            >
              <CheckCircle2 className="size-4" />
              Solved it from scratch
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-rose-500/40 text-rose-400 hover:text-rose-300"
              onClick={() => handleGrade(slug, false)}
            >
              <XCircle className="size-4" />
              Failed again
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className="ml-auto text-muted-foreground"
          title="Remove from queue"
          onClick={() => {
            removeFromReview(slug);
            toast.success("Removed from the review queue.");
          }}
        >
          <Trash2 className="size-4" />
        </Button>
        {entry.lapses > 0 && (
          <span className="text-xs text-muted-foreground">
            {entry.lapses} lapse{entry.lapses === 1 ? "" : "s"}
          </span>
        )}
      </div>
    </div>
  );
}

export function ReviewQueue({ catalog }: { catalog: ReviewCatalogProblem[] }) {
  const review = useReview();

  // Captured once per store change: keeps render pure while staying fresh
  // enough for day-granularity scheduling.
  const now = useMemo(() => new Date(), [review]); // eslint-disable-line react-hooks/exhaustive-deps

  const bySlug = useMemo(
    () => new Map(catalog.map((p) => [p.slug, p])),
    [catalog]
  );

  const { due, upcoming } = splitQueue(review, now);
  // Drop entries whose problem no longer exists in the catalog.
  const dueRows = due.filter((q) => bySlug.has(q.slug));
  const upcomingRows = upcoming.filter((q) => bySlug.has(q.slug));

  if (dueRows.length === 0 && upcomingRows.length === 0) {
    return (
      <EmptyState
        icon={RotateCcw}
        title="Nothing in your review queue"
        description='Open any problem you struggled with and hit "Mark as failed" — it comes back here on a spaced schedule (1, 3, 7, 14, then 30 days).'
      />
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex items-center gap-2">
          <RotateCcw className="size-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Due now
            {dueRows.length > 0 && (
              <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium normal-case tracking-normal text-amber-400">
                {dueRows.length}
              </span>
            )}
          </h2>
        </div>
        {dueRows.length === 0 ? (
          <p className="rounded-xl border border-border bg-card/40 px-4 py-6 text-center text-sm text-muted-foreground">
            All caught up — nothing due today.
          </p>
        ) : (
          <div className="divide-y divide-border/70 rounded-xl border border-border bg-card/40">
            {dueRows.map((q) => (
              <ReviewRow
                key={q.slug}
                queued={q}
                problem={bySlug.get(q.slug)!}
                now={now}
                due
              />
            ))}
          </div>
        )}
      </section>

      {upcomingRows.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Coming up
            </h2>
          </div>
          <div className="divide-y divide-border/70 rounded-xl border border-border bg-card/40">
            {upcomingRows.map((q) => (
              <ReviewRow
                key={q.slug}
                queued={q}
                problem={bySlug.get(q.slug)!}
                now={now}
                due={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
