"use client";

// The /progress dashboard — everything the local store knows about your prep
// in one place: streaks, a six-month activity heatmap, difficulty and topic
// breakdowns, recent activity, and your notes. All client-derived from
// localStorage; server-renders as the empty state.

import Link from "next/link";
import {
  CheckCircle2,
  CircleDashed,
  Flame,
  NotebookPen,
  Trophy,
} from "lucide-react";
import type { Difficulty } from "@/data/dsa";
import { computeStreak, localDayKey, useProgress } from "@/lib/progress";
import { useNotes } from "@/lib/notes";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { EmptyState } from "@/components/design-system/empty-state";
import { ProgressMenu } from "@/components/dsa/progress-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type DashboardProblem = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  topicSlug: string;
};

export type DashboardTopic = {
  slug: string;
  name: string;
  problemCount: number;
};

const DIFFICULTIES: { key: Difficulty; label: string; bar: string }[] = [
  { key: "EASY", label: "Easy", bar: "[&>[data-slot=progress-indicator]]:bg-emerald-400" },
  { key: "MEDIUM", label: "Medium", bar: "[&>[data-slot=progress-indicator]]:bg-amber-400" },
  { key: "HARD", label: "Hard", bar: "[&>[data-slot=progress-indicator]]:bg-rose-400" },
];

export function ProgressDashboard({
  problems,
  topics,
}: {
  problems: DashboardProblem[];
  topics: DashboardTopic[];
}) {
  const progress = useProgress();
  const notes = useNotes();
  const streak = computeStreak(progress);
  const bySlug = new Map(problems.map((p) => [p.slug, p]));

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

  const totalSolves = Object.values(progress.activity).reduce((a, b) => a + b, 0);
  const activeDays = Object.values(progress.activity).filter((n) => n > 0).length;

  const recent = Object.entries(progress.problems)
    .filter(([, p]) => p.lastActivityAt)
    .sort(([, a], [, b]) => (b.lastActivityAt! < a.lastActivityAt! ? -1 : 1))
    .slice(0, 8);

  const notedProblems = Object.entries(notes)
    .filter(([slug]) => bySlug.has(slug))
    .sort(([, a], [, b]) => (b.updatedAt < a.updatedAt ? -1 : 1))
    .slice(0, 6);

  const hasAnything =
    Object.keys(progress.problems).length > 0 ||
    Object.keys(progress.content).length > 0 ||
    Object.keys(notes).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Problems solved"
            value={`${solvedTotal}`}
            sub={`of ${problems.length} · ${
              problems.length ? Math.round((solvedTotal / problems.length) * 100) : 0
            }%`}
            icon={<CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />}
          />
          <StatTile
            label="Current streak"
            value={`${streak.current}d`}
            sub={
              streak.current > 0 && !streak.solvedToday
                ? "solve today to keep it"
                : streak.solvedToday
                  ? "solved today"
                  : "start one today"
            }
            icon={
              <Flame
                className={cn(
                  "size-4",
                  streak.solvedToday
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground/50"
                )}
              />
            }
          />
          <StatTile
            label="Best streak"
            value={`${streak.best}d`}
            sub="longest run"
            icon={<Trophy className="size-4 text-primary" />}
          />
          <StatTile
            label="Accepted solves"
            value={`${totalSolves}`}
            sub={`across ${activeDays} active day${activeDays === 1 ? "" : "s"}`}
            icon={<CircleDashed className="size-4 text-muted-foreground" />}
          />
        </div>
        <ProgressMenu hasProgress={hasAnything} />
      </div>

      <section className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
        <h2 className="text-sm font-semibold">Activity</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Accepted submissions per day, last 26 weeks.
        </p>
        <div className="mt-4 overflow-x-auto pb-1 scrollbar-thin">
          <ActivityHeatmap activity={progress.activity} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
          <h2 className="text-sm font-semibold">By difficulty</h2>
          <div className="mt-4 grid gap-3">
            {DIFFICULTIES.map(({ key, label, bar }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-16 text-xs font-medium text-muted-foreground">
                  {label}
                </span>
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

          <h2 className="mt-6 text-sm font-semibold">By topic</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
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

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing yet — solve your first problem and it shows up here.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-border/60">
                {recent.map(([slug, p]) => {
                  const meta = bySlug.get(slug);
                  return (
                    <li key={slug}>
                      <Link
                        href={`/dsa/${slug}`}
                        className="group flex items-center gap-3 py-2"
                      >
                        {p.status === "solved" ? (
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <CircleDashed className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-sm group-hover:text-primary">
                          {meta?.title ?? slug}
                        </span>
                        {meta && (
                          <DifficultyBadge
                            difficulty={meta.difficulty}
                            className="hidden sm:inline-flex"
                          />
                        )}
                        <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                          {relativeTime(p.lastActivityAt!)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <NotebookPen className="size-4 text-muted-foreground" />
              Your notes
            </h2>
            {notedProblems.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Notes you write on problem pages collect here.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-border/60">
                {notedProblems.map(([slug, note]) => (
                  <li key={slug}>
                    <Link href={`/dsa/${slug}`} className="group block py-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium group-hover:text-primary">
                          {bySlug.get(slug)?.title ?? slug}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {relativeTime(note.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {note.text.split("\n")[0]}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {!hasAnything && (
        <EmptyState
          icon={Flame}
          title="Your dashboard is waiting"
          description="Progress lives in this browser — no account needed. Solve a problem and watch the heatmap light up."
        />
      )}
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</div>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

// ---------------------------------------------------------------- heatmap

const WEEKS = 26;
const DAY_MS = 86_400_000;

// Single-hue sequential ramp: primary at stepped alpha over the surface, so
// lightness is monotonic in both light and dark mode. Zero sits outside the
// ramp on a neutral surface.
function cellClass(count: number): string {
  if (count === 0) return "bg-secondary";
  if (count === 1) return "bg-primary/25";
  if (count <= 3) return "bg-primary/45";
  if (count <= 5) return "bg-primary/70";
  return "bg-primary";
}

const LEGEND_STEPS = ["bg-secondary", "bg-primary/25", "bg-primary/45", "bg-primary/70", "bg-primary"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ActivityHeatmap({ activity }: { activity: Record<string, number> }) {
  // Columns are Sunday-started weeks, ending with the current week.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - (WEEKS * 7 - 1 + today.getDay()) * DAY_MS);

  const weeks: { day: Date; key: string; count: number }[][] = [];
  for (let d = new Date(start); d <= today; d = new Date(d.getTime() + DAY_MS)) {
    if (d.getDay() === 0 || weeks.length === 0) weeks.push([]);
    const key = localDayKey(d);
    weeks[weeks.length - 1].push({ day: new Date(d), key, count: activity[key] ?? 0 });
  }

  return (
    <div className="min-w-fit">
      {/* Month labels: shown where a column starts a new month. */}
      <div className="mb-1 ml-8 flex gap-[3px] text-[10px] text-muted-foreground">
        {weeks.map((week, i) => {
          const m = week[0].day.getMonth();
          const isNew = i === 0 || m !== weeks[i - 1][0].day.getMonth();
          return (
            <span key={i} className="w-[11px] shrink-0 overflow-visible whitespace-nowrap">
              {isNew ? MONTHS[m] : ""}
            </span>
          );
        })}
      </div>
      <div className="flex gap-[3px]">
        <div className="mr-1 flex w-6 flex-col gap-[3px] text-[10px] leading-[11px] text-muted-foreground">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <span key={i} className="h-[11px]">
              {d}
            </span>
          ))}
        </div>
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }, (_, dow) => {
              const cell = week.find((c) => c.day.getDay() === dow);
              if (!cell) return <span key={dow} className="size-[11px]" />;
              const label = `${cell.count} solve${cell.count === 1 ? "" : "s"} on ${cell.day.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
              return (
                <span
                  key={dow}
                  title={label}
                  aria-label={label}
                  className={cn("size-[11px] rounded-[3px]", cellClass(cell.count))}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        Less
        {LEGEND_STEPS.map((c) => (
          <span key={c} className={cn("size-[11px] rounded-[3px]", c)} />
        ))}
        More
      </div>
    </div>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
