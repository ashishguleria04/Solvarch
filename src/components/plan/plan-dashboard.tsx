"use client";

// The /plan page: one active interview countdown. Setup picks a roadmap, an
// interview date, and a daily cap; the dashboard derives everything else on
// render — required pace, feasibility, today's queue, and a 7-day forecast —
// from the local plan/progress/review stores via the pure engine in
// @/lib/plan-schedule. Server-renders as the setup form (stores are empty).

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  Gauge,
  ListChecks,
  Network,
  Pencil,
  PartyPopper,
  RotateCcw,
  Target,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { Difficulty } from "@/data/dsa";
import {
  clearPlan,
  savePlan,
  usePlan,
  type InterviewPlan,
} from "@/lib/plan";
import {
  buildPlanOutlook,
  parseDayKey,
  planDayKey,
  type PlanOutlook,
} from "@/lib/plan-schedule";
import { localDayKey, useProgress, type ProgressState } from "@/lib/progress";
import { useReview, type ReviewState } from "@/lib/review";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { EmptyState } from "@/components/design-system/empty-state";
import { ProblemStatusIcon } from "@/components/dsa/problem-status";
import { ContentCheckIcon } from "@/components/content/content-progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Server-resolved roadmap catalog, passed down from the /plan page.

export type PlannerItem = {
  /** Progress-store key: problem slug (dsa) or content key (system-design). */
  key: string;
  kind: "dsa" | "system-design";
  title: string;
  href: string;
  difficulty?: Difficulty;
  topicName?: string;
  readingMinutes?: number;
};

export type PlannerRoadmap = {
  slug: string;
  name: string;
  tagline: string;
  items: PlannerItem[];
};

const DAILY_CAP_OPTIONS = [2, 3, 4, 5, 6, 8, 10];

function isItemDone(progress: ProgressState, item: PlannerItem): boolean {
  return item.kind === "dsa"
    ? progress.problems[item.key]?.status === "solved"
    : !!progress.content[item.key];
}

/** Local day key the item was completed on, or null if not (yet) known. */
function itemDoneDay(progress: ProgressState, item: PlannerItem): string | null {
  const iso =
    item.kind === "dsa"
      ? progress.problems[item.key]?.firstSolvedAt
      : progress.content[item.key]?.completedAt;
  return iso ? planDayKey(new Date(iso)) : null;
}

export function PlanDashboard({ roadmaps }: { roadmaps: PlannerRoadmap[] }) {
  const { plan } = usePlan();
  const progress = useProgress();
  const review = useReview();
  const [editing, setEditing] = useState(false);

  const roadmap = plan
    ? roadmaps.find((r) => r.slug === plan.roadmapSlug) ?? null
    : null;

  if (!plan || !roadmap || editing) {
    return (
      <PlanSetup
        roadmaps={roadmaps}
        progress={progress}
        existing={plan}
        staleRoadmap={!!plan && !roadmap}
        onDone={() => setEditing(false)}
        onCancel={plan && roadmap ? () => setEditing(false) : undefined}
      />
    );
  }

  return (
    <PlanOverview
      plan={plan}
      roadmap={roadmap}
      progress={progress}
      review={review}
      onEdit={() => setEditing(true)}
    />
  );
}

// ------------------------------------------------------------------- setup

function PlanSetup({
  roadmaps,
  progress,
  existing,
  staleRoadmap,
  onDone,
  onCancel,
}: {
  roadmaps: PlannerRoadmap[];
  progress: ProgressState;
  existing: InterviewPlan | null;
  staleRoadmap: boolean;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const todayKey = useMemo(() => localDayKey(new Date()), []);
  const [roadmapSlug, setRoadmapSlug] = useState(
    () =>
      (existing && roadmaps.some((r) => r.slug === existing.roadmapSlug)
        ? existing.roadmapSlug
        : roadmaps[0]?.slug) ?? ""
  );
  const [date, setDate] = useState(existing?.interviewDate ?? "");
  const [cap, setCap] = useState(String(existing?.dailyCap ?? 4));
  const [label, setLabel] = useState(existing?.label ?? "");

  const selected = roadmaps.find((r) => r.slug === roadmapSlug) ?? null;
  const doneCount = selected
    ? selected.items.reduce((n, i) => n + (isItemDone(progress, i) ? 1 : 0), 0)
    : 0;

  const valid = !!selected && date >= todayKey;

  function handleSave() {
    if (!valid || !selected) return;
    savePlan({
      roadmapSlug: selected.slug,
      interviewDate: date,
      dailyCap: Number(cap),
      label: label.trim() || undefined,
    });
    toast.success(
      existing ? "Plan updated." : "Plan created — one day at a time."
    );
    onDone();
  }

  return (
    <div className="max-w-2xl space-y-4">
      {staleRoadmap && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          The roadmap from your previous plan no longer exists — pick a new one
          to continue.
        </p>
      )}

      <div className="space-y-5 rounded-xl border border-border bg-card/40 p-5 sm:p-6">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <Target className="size-4 text-primary" />
            {existing ? "Edit your plan" : "Set up your countdown"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick the roadmap to finish, the date it has to be done by, and how
            much you can realistically do per day. The planner handles the
            pacing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="plan-roadmap">Roadmap</Label>
            <Select value={roadmapSlug} onValueChange={setRoadmapSlug}>
              <SelectTrigger id="plan-roadmap" className="w-full">
                <SelectValue placeholder="Choose a roadmap" />
              </SelectTrigger>
              <SelectContent>
                {roadmaps.map((r) => (
                  <SelectItem key={r.slug} value={r.slug}>
                    {r.name} · {r.items.length} items
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selected && (
              <p className="text-xs text-muted-foreground">
                {selected.tagline}
                {doneCount > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {` · ${doneCount}/${selected.items.length} already done`}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-date">Interview date</Label>
            <Input
              id="plan-date"
              type="date"
              min={todayKey}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {date && date < todayKey && (
              <p className="text-xs text-rose-500">
                That date is in the past.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-cap">Daily cap</Label>
            <Select value={cap} onValueChange={setCap}>
              <SelectTrigger id="plan-cap" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAILY_CAP_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} items / day
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="plan-label">
              Label{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="plan-label"
              placeholder="e.g. Stripe onsite, SDE-2 loop…"
              maxLength={60}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="glow" disabled={!valid} onClick={handleSave}>
            <Target className="size-4" />
            {existing ? "Save plan" : "Start the countdown"}
          </Button>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- dashboard

function PlanOverview({
  plan,
  roadmap,
  progress,
  review,
  onEdit,
}: {
  plan: InterviewPlan;
  roadmap: PlannerRoadmap;
  progress: ProgressState;
  review: ReviewState;
  onEdit: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Captured once per store change: keeps render pure while staying fresh
  // enough for day-granularity scheduling.
  const now = useMemo(() => new Date(), [plan, progress, review]); // eslint-disable-line react-hooks/exhaustive-deps

  const outlook = useMemo(() => {
    const todayKey = planDayKey(now);
    return buildPlanOutlook({
      items: roadmap.items.map((item) => {
        const done = isItemDone(progress, item);
        return {
          key: item.key,
          done,
          completedToday: done && itemDoneDay(progress, item) === todayKey,
        };
      }),
      interviewDate: plan.interviewDate,
      dailyCap: plan.dailyCap,
      reviewDueAts: Object.values(review.queue).map((e) => e.dueAt),
      now,
    });
  }, [plan, roadmap, progress, review, now]);

  const byKey = useMemo(
    () => new Map(roadmap.items.map((i) => [i.key, i])),
    [roadmap]
  );

  const interviewLabel = parseDayKey(plan.interviewDate).toLocaleDateString(
    undefined,
    { weekday: "short", month: "short", day: "numeric" }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <Target className="size-4 text-primary" />
          {roadmap.name}
          {plan.label && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {plan.label}
            </span>
          )}
        </span>
        <span className="text-sm text-muted-foreground">
          interview on {interviewLabel}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            title="Delete plan"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Days left"
          value={
            outlook.daysLeft < 0
              ? "—"
              : outlook.daysLeft === 0
                ? "Today"
                : `${outlook.daysLeft}d`
          }
          sub={interviewLabel}
          icon={<CalendarDays className="size-4 text-primary" />}
        />
        <StatTile
          label="Items left"
          value={`${outlook.remaining}`}
          sub={`of ${outlook.total} · ${outlook.done} done`}
          icon={<ListChecks className="size-4 text-sky-600 dark:text-sky-400" />}
        />
        <StatTile
          label="Today"
          value={`${outlook.doneToday}/${outlook.todayTarget}`}
          sub={
            outlook.todayLeft === 0 && outlook.todayTarget > 0
              ? "target hit 🎯"
              : "items done today"
          }
          icon={
            <Flame
              className={cn(
                "size-4",
                outlook.doneToday > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground/50"
              )}
            />
          }
        />
        <StatTile
          label="Pace needed"
          value={`${outlook.requiredPerDay}/day`}
          sub={`your cap: ${plan.dailyCap}/day`}
          icon={<Gauge className="size-4 text-violet-600 dark:text-violet-400" />}
        />
      </div>

      <StatusBanner outlook={outlook} plan={plan} onEdit={onEdit} />

      <TodaySection outlook={outlook} byKey={byKey} />

      {outlook.forecast.length > 1 && <ForecastStrip outlook={outlook} />}

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this plan?</DialogTitle>
            <DialogDescription>
              This removes the countdown only — your solved problems, reading
              marks, and review queue are untouched. You can set up a new plan
              anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearPlan();
                setConfirmDelete(false);
                toast.success("Plan deleted.");
              }}
            >
              Delete plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function StatusBanner({
  outlook,
  plan,
  onEdit,
}: {
  outlook: PlanOutlook;
  plan: InterviewPlan;
  onEdit: () => void;
}) {
  const { status } = outlook;

  if (status === "on-track") {
    const buffer = outlook.prepDays - outlook.daysNeededAtCap;
    return (
      <Banner tone="emerald" icon={CheckCircle2}>
        {`On track — ${outlook.requiredPerDay}/day gets it done` +
          (buffer > 0
            ? `, and at your full cap you'd finish ${buffer} day${
                buffer === 1 ? "" : "s"
              } early.`
            : ".")}
      </Banner>
    );
  }
  if (status === "tight") {
    return (
      <Banner tone="amber" icon={AlertTriangle}>
        {`Doable, but tight — you need ${outlook.requiredPerDay} of your ${plan.dailyCap}/day cap. Skip days will put you behind.`}
      </Banner>
    );
  }
  if (status === "overloaded") {
    const daysShort = outlook.daysNeededAtCap - outlook.prepDays;
    return (
      <Banner tone="rose" icon={AlertTriangle}>
        {`This doesn't fit: ${outlook.overflow} item${
          outlook.overflow === 1 ? "" : "s"
        } won't make it at ${plan.dailyCap}/day. `}
        <button onClick={onEdit} className="font-medium underline underline-offset-2">
          {`Raise your cap to ${outlook.requiredPerDay}/day`}
        </button>
        {`, trim the roadmap, or push the date by ${daysShort} day${
          daysShort === 1 ? "" : "s"
        }.`}
      </Banner>
    );
  }
  if (status === "today") {
    return (
      <Banner tone="sky" icon={PartyPopper}>
        Interview day. No cramming — skim your notes, warm up with one easy
        problem, and go get it.
      </Banner>
    );
  }
  if (status === "past") {
    return (
      <Banner tone="amber" icon={CalendarDays}>
        {"Your interview date has passed. "}
        <button onClick={onEdit} className="font-medium underline underline-offset-2">
          Set up the next one
        </button>
        {" when you're ready."}
      </Banner>
    );
  }
  // done
  return (
    <Banner tone="emerald" icon={PartyPopper}>
      {outlook.daysLeft > 0
        ? `Roadmap complete with ${outlook.daysLeft} day${
            outlook.daysLeft === 1 ? "" : "s"
          } to spare — spend the rest on reviews and mock runs.`
        : "Roadmap complete — and it's interview day. Go get it."}
    </Banner>
  );
}

const BANNER_TONES = {
  emerald:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  amber:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  sky: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
} as const;

function Banner({
  tone,
  icon: Icon,
  children,
}: {
  tone: keyof typeof BANNER_TONES;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
        BANNER_TONES[tone]
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function TodaySection({
  outlook,
  byKey,
}: {
  outlook: PlanOutlook;
  byKey: Map<string, PlannerItem>;
}) {
  const queue = outlook.todayQueue
    .map((key) => byKey.get(key))
    .filter((i): i is PlannerItem => !!i);

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Flame className="size-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Today
          {queue.length > 0 && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium normal-case tracking-normal text-primary">
              {queue.length} to go
            </span>
          )}
        </h2>
      </div>

      {outlook.reviewsDueToday > 0 && (
        <Link
          href="/review"
          className="group mb-3 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 transition-colors hover:bg-amber-500/15 dark:text-amber-300"
        >
          <RotateCcw className="size-4 shrink-0" />
          <span>
            {`${outlook.reviewsDueToday} review${
              outlook.reviewsDueToday === 1 ? "" : "s"
            } due — do these first, they don't count against your cap.`}
          </span>
          <ArrowUpRight className="ml-auto size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}

      {outlook.status === "done" ? (
        <EmptyState
          icon={PartyPopper}
          title="Everything on the roadmap is done"
          description="Keep the edge with due reviews and timed practice runs until the big day."
        />
      ) : queue.length === 0 && outlook.daysLeft > 0 ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 text-center text-sm text-emerald-700 dark:text-emerald-300">
          {`Done for today — target hit. Tomorrow brings ${
            outlook.forecast[1]?.newItems ?? 0
          } more.`}
        </p>
      ) : queue.length === 0 ? null : (
        <div className="divide-y divide-border/70 rounded-xl border border-border bg-card/40">
          {queue.map((item) => (
            <PlanItemRow key={item.key} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function PlanItemRow({ item }: { item: PlannerItem }) {
  return (
    <Link
      href={item.href}
      className="group flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3.5 transition-colors hover:bg-accent/40 sm:px-5"
    >
      {item.kind === "dsa" ? (
        <ProblemStatusIcon slug={item.key} />
      ) : (
        <ContentCheckIcon contentKey={item.key} />
      )}
      <span className="font-medium tracking-tight group-hover:text-primary">
        {item.title}
      </span>
      {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
      {item.topicName && (
        <span className="text-sm text-muted-foreground">{item.topicName}</span>
      )}
      {item.kind === "system-design" && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Network className="size-3.5 text-sky-400/80" aria-label="System design" />
          {item.readingMinutes != null && (
            <>
              <Clock className="size-3.5" />
              {item.readingMinutes} min read
            </>
          )}
        </span>
      )}
      <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
    </Link>
  );
}

function ForecastStrip({ outlook }: { outlook: PlanOutlook }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          The week ahead
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {outlook.forecast.map((day) => {
          const date = parseDayKey(day.dayKey);
          return (
            <div
              key={day.dayKey}
              className={cn(
                "rounded-xl border p-3",
                day.isToday
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card/40"
              )}
            >
              <p
                className={cn(
                  "text-xs font-medium",
                  day.isToday ? "text-primary" : "text-muted-foreground"
                )}
              >
                {day.isToday
                  ? "Today"
                  : date.toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                    })}
              </p>
              <p className="mt-1.5 text-sm font-semibold tracking-tight">
                {day.newItems} new
              </p>
              <p
                className={cn(
                  "text-xs",
                  day.reviews > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground/60"
                )}
              >
                {day.reviews} review{day.reviews === 1 ? "" : "s"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
