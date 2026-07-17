"use client";

// Post-attempt self-scoring: the learner grades their timed attempt against a
// fixed rubric (no auto-judging — the honesty is the point) and the score is
// kept in the local practice log. Fully store-driven: it opens whenever a
// finished session is awaiting its score, including after a reload.

import { useMemo, useState } from "react";
import { Check, History } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  RUBRIC,
  dismissPendingAttempt,
  formatClock,
  logAttempt,
  usePendingAttempt,
  usePracticeLog,
} from "@/lib/practice";
import { cn } from "@/lib/utils";

export function SelfScoreDialog() {
  const pending = usePendingAttempt();
  const log = usePracticeLog();
  const [checks, setChecks] = useState<Set<string>>(new Set());

  const previous = useMemo(
    () =>
      pending ? log.filter((a) => a.slug === pending.slug).slice(0, 3) : [],
    [log, pending]
  );

  function toggle(id: string) {
    setChecks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function close() {
    setChecks(new Set());
    dismissPendingAttempt();
  }

  function save() {
    if (!pending) return;
    logAttempt({
      slug: pending.slug,
      endedAt: new Date().toISOString(),
      durationMin: pending.durationMin,
      usedSec: pending.usedSec,
      checks: [...checks],
    });
    toast.success(
      `Attempt logged — ${checks.size}/${RUBRIC.length} on the rubric.`
    );
    setChecks(new Set());
    dismissPendingAttempt();
  }

  return (
    <Dialog open={pending !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Self-score this attempt</DialogTitle>
          <DialogDescription>
            {pending && (
              <>
                {pending.title} ·{" "}
                {pending.expired
                  ? `time ran out at ${formatClock(pending.durationMin * 60)}`
                  : `${formatClock(pending.usedSec)} of ${formatClock(
                      pending.durationMin * 60
                    )} used`}
                . Be honest — this log is only for you.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          {RUBRIC.map((c) => {
            const checked = checks.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  checked
                    ? "border-primary/40 bg-primary/[0.06]"
                    : "border-border bg-card/50 hover:border-primary/25"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40"
                  )}
                >
                  {checked && <Check className="size-3" />}
                </span>
                <span className={checked ? "" : "text-muted-foreground"}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-sm font-medium">
          Score:{" "}
          <span
            className={checks.size >= 5 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}
          >
            {checks.size}/{RUBRIC.length}
          </span>
        </div>

        {previous.length > 0 && (
          <div className="rounded-lg border border-border/70 bg-card/40 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <History className="size-3.5" />
              Previous attempts
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {previous.map((a) => (
                <li key={a.endedAt} className="flex items-center gap-2">
                  <span>
                    {new Date(a.endedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-mono">
                    {a.checks.length}/{RUBRIC.length}
                  </span>
                  <span className="font-mono">{formatClock(a.usedSec)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={close}>
            Discard
          </Button>
          <Button variant="glow" onClick={save}>
            Save score
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
