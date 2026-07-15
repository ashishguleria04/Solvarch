"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Download, Flame, MoreVertical, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Difficulty } from "@/data/dsa";
import {
  computeStreak,
  exportFileName,
  importProgress,
  resetProgress,
  serializeProgress,
  useProgress,
} from "@/lib/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type CatalogProblem = {
  slug: string;
  difficulty: Difficulty;
  topicSlug: string;
};

export type CatalogTopic = { slug: string; name: string; problemCount: number };

const DIFFICULTIES: { key: Difficulty; label: string; bar: string }[] = [
  { key: "EASY", label: "Easy", bar: "[&>[data-slot=progress-indicator]]:bg-emerald-400" },
  { key: "MEDIUM", label: "Medium", bar: "[&>[data-slot=progress-indicator]]:bg-amber-400" },
  { key: "HARD", label: "Hard", bar: "[&>[data-slot=progress-indicator]]:bg-rose-400" },
];

export function DsaProgress({
  problems,
  topics,
}: {
  problems: CatalogProblem[];
  topics: CatalogTopic[];
}) {
  const progress = useProgress();
  const streak = computeStreak(progress);

  let solvedTotal = 0;
  const solvedByDifficulty: Record<Difficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const totalByDifficulty: Record<Difficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const solvedByTopic = new Map<string, number>();
  for (const p of problems) {
    totalByDifficulty[p.difficulty] += 1;
    if (progress.problems[p.slug]?.status === "solved") {
      solvedTotal += 1;
      solvedByDifficulty[p.difficulty] += 1;
      solvedByTopic.set(p.topicSlug, (solvedByTopic.get(p.topicSlug) ?? 0) + 1);
    }
  }

  return (
    <section
      aria-label="Your progress"
      className="relative rounded-xl border border-border bg-card/50 p-4 sm:p-5"
    >
      <div className="absolute right-3 top-3">
        <ProgressMenu hasProgress={Object.keys(progress.problems).length > 0} />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex items-center gap-4">
          <CompletionRing solved={solvedTotal} total={problems.length} />
          <div>
            <div className="text-2xl font-semibold tracking-tight">
              {solvedTotal}
              <span className="text-base font-normal text-muted-foreground">
                {" "}/ {problems.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">problems solved</p>
          </div>
        </div>

        <div className="grid flex-1 gap-2.5 lg:max-w-sm">
          {DIFFICULTIES.map(({ key, label, bar }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-16 text-xs font-medium text-muted-foreground">{label}</span>
              <Progress
                value={
                  totalByDifficulty[key]
                    ? (solvedByDifficulty[key] / totalByDifficulty[key]) * 100
                    : 0
                }
                className={cn("h-1.5 flex-1", bar)}
              />
              <span className="w-14 text-right font-mono text-xs text-muted-foreground">
                {solvedByDifficulty[key]}/{totalByDifficulty[key]}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 lg:pr-10">
          <Flame
            className={cn(
              "size-8",
              streak.solvedToday ? "text-amber-400" : "text-muted-foreground/40"
            )}
          />
          <div>
            <div className="text-2xl font-semibold tracking-tight">
              {streak.current}
              <span className="text-base font-normal text-muted-foreground"> day streak</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {streak.current > 0 && !streak.solvedToday
                ? "solve one today to keep it going"
                : `best: ${streak.best} day${streak.best === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-5">
        {topics.map((t) => {
          const solved = solvedByTopic.get(t.slug) ?? 0;
          return (
            <Link
              key={t.slug}
              href={`/dsa?topic=${t.slug}`}
              className="rounded-lg border border-border bg-card/50 p-2.5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-xs font-medium">{t.name}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {solved}/{t.problemCount}
                </span>
              </div>
              <Progress
                value={t.problemCount ? (solved / t.problemCount) * 100 : 0}
                className="mt-2 h-1"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CompletionRing({ solved, total }: { solved: number; total: number }) {
  const pct = total > 0 ? solved / total : 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative size-20 shrink-0">
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          strokeWidth="6"
          className="stroke-primary/15"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${circumference * pct} ${circumference}`}
          className="stroke-primary transition-[stroke-dasharray] duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}

function ProgressMenu({ hasProgress }: { hasProgress: boolean }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleExport() {
    const blob = new Blob([serializeProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFileName();
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress exported.");
  }

  async function handleImportFile(file: File) {
    const result = importProgress(await file.text());
    if (result.ok) {
      toast.success(
        `Progress imported — ${result.solved} problem${result.solved === 1 ? "" : "s"} solved.`
      );
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.target.value = "";
        }}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Progress options">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleExport} disabled={!hasProgress}>
            <Download className="size-4" />
            Export progress
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => fileInput.current?.click()}>
            <Upload className="size-4" />
            Import progress
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setConfirmReset(true)}
            disabled={!hasProgress}
          >
            <Trash2 className="size-4" />
            Reset progress
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all progress?</DialogTitle>
            <DialogDescription>
              This clears every solved and attempted problem plus your streak from
              this browser. Progress is stored locally only, so this can&apos;t be
              undone — export a backup first if you might want it back.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                toast.success("Progress reset.");
              }}
            >
              Reset everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
