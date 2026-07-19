// Pure countdown math for the interview planner: given an interview date, a
// daily cap, the roadmap items (with done flags), and the review queue's due
// dates, derive today's queue, the required pace, feasibility, and a short
// day-by-day forecast. No storage and no window access — lives outside the
// "use client" store module (./plan) so server code and tests can use it,
// mirroring the review-schedule/review split.

const DAY_MS = 24 * 60 * 60 * 1000;

/** One roadmap item as the engine sees it. `key` is the problem slug or content key. */
export type PlanInputItem = {
  key: string;
  done: boolean;
  /** Done today specifically — counts toward today's target. */
  completedToday: boolean;
};

export type PlanForecastDay = {
  /** Local day key ("YYYY-MM-DD"). */
  dayKey: string;
  isToday: boolean;
  /** New roadmap items planned for this day. */
  newItems: number;
  /** Spaced-repetition reviews due this day (overdue ones count as today). */
  reviews: number;
};

export type PlanStatus =
  | "past" // interview date is behind you
  | "done" // every roadmap item finished
  | "today" // interview is today — no more prep days
  | "on-track"
  | "tight" // fits, but needs more than 70% of the daily cap
  | "overloaded"; // does not fit under the cap before the date

export type PlanOutlook = {
  /** Whole calendar days until the interview; 0 = today, negative = past. */
  daysLeft: number;
  /** Full prep days before the interview day (interview day excluded). */
  prepDays: number;
  total: number;
  done: number;
  remaining: number;
  doneToday: number;
  /** Pace needed as of the start of today (items/day). */
  requiredPerDay: number;
  /** Today's goal: required pace clamped to the cap. */
  todayTarget: number;
  /** Items still to do today to hit the target. */
  todayLeft: number;
  /** Keys of the next `todayLeft` unfinished items, in roadmap order. */
  todayQueue: string[];
  reviewsDueToday: number;
  /** Today plus up to six more prep days. */
  forecast: PlanForecastDay[];
  /** Items that cannot fit under the cap before the interview. */
  overflow: number;
  /** Prep days a full-cap pace would need — buffer/shortfall comes from this. */
  daysNeededAtCap: number;
  status: PlanStatus;
};

/** Local-date day key ("YYYY-MM-DD") — same shape the progress store uses. */
export function planDayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Day key → local midnight. */
export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

/** Whole calendar days from `now`'s date to `dayKey` (DST-safe via rounding). */
export function daysUntil(dayKey: string, now: Date): number {
  const from = parseDayKey(planDayKey(now)).getTime();
  const to = parseDayKey(dayKey).getTime();
  return Math.round((to - from) / DAY_MS);
}

export function buildPlanOutlook({
  items,
  interviewDate,
  dailyCap,
  reviewDueAts,
  now,
}: {
  items: PlanInputItem[];
  /** Local day key of the interview. */
  interviewDate: string;
  dailyCap: number;
  /** dueAt ISO timestamps of every queued review. */
  reviewDueAts: string[];
  now: Date;
}): PlanOutlook {
  const todayKey = planDayKey(now);
  const daysLeft = daysUntil(interviewDate, now);
  const prepDays = Math.max(daysLeft, 0);

  const total = items.length;
  const done = items.reduce((n, i) => n + (i.done ? 1 : 0), 0);
  const remaining = total - done;
  const doneToday = items.reduce((n, i) => n + (i.completedToday ? 1 : 0), 0);

  // Pace is fixed at the start of the day: solving items moves you toward
  // today's target instead of shrinking the target under you.
  const remainingAtDayStart = remaining + doneToday;
  const requiredPerDay =
    prepDays > 0 ? Math.ceil(remainingAtDayStart / prepDays) : remainingAtDayStart;
  const todayTarget = Math.min(requiredPerDay, dailyCap);
  const todayLeft = daysLeft > 0 ? Math.max(todayTarget - doneToday, 0) : 0;

  const todayQueue = items
    .filter((i) => !i.done)
    .slice(0, todayLeft)
    .map((i) => i.key);

  // Remaining capacity under the cap: what's left of today plus full future days.
  const capacity =
    prepDays > 0
      ? Math.max(dailyCap - doneToday, 0) + dailyCap * (prepDays - 1)
      : 0;
  const overflow = Math.max(remaining - capacity, 0);
  const daysNeededAtCap = dailyCap > 0 ? Math.ceil(remainingAtDayStart / dailyCap) : 0;

  // Reviews bucketed by local due day; anything overdue lands on today.
  const reviewsByDay = new Map<string, number>();
  for (const iso of reviewDueAts) {
    const dueKey = planDayKey(new Date(iso));
    const bucket = dueKey <= todayKey ? todayKey : dueKey;
    reviewsByDay.set(bucket, (reviewsByDay.get(bucket) ?? 0) + 1);
  }
  const reviewsDueToday = reviewsByDay.get(todayKey) ?? 0;

  // Forecast: today gets todayLeft, the rest spreads evenly under the cap.
  const forecast: PlanForecastDay[] = [];
  const forecastDays = Math.min(prepDays, 7);
  const futureDays = prepDays - 1;
  let futureLeft = remaining - todayLeft;
  const perFutureDay =
    futureDays > 0 ? Math.min(dailyCap, Math.ceil(futureLeft / futureDays)) : 0;
  const todayMidnight = parseDayKey(todayKey);
  for (let i = 0; i < forecastDays; i++) {
    const dayKey = planDayKey(addDays(todayMidnight, i));
    let newItems = todayLeft;
    if (i > 0) {
      newItems = Math.min(perFutureDay, futureLeft);
      futureLeft -= newItems;
    }
    forecast.push({
      dayKey,
      isToday: i === 0,
      newItems,
      reviews: reviewsByDay.get(dayKey) ?? 0,
    });
  }

  let status: PlanStatus;
  if (daysLeft < 0) status = "past";
  else if (remaining === 0) status = "done";
  else if (daysLeft === 0) status = "today";
  else if (overflow > 0) status = "overloaded";
  else if (requiredPerDay > dailyCap * 0.7) status = "tight";
  else status = "on-track";

  return {
    daysLeft,
    prepDays,
    total,
    done,
    remaining,
    doneToday,
    requiredPerDay,
    todayTarget,
    todayLeft,
    todayQueue,
    reviewsDueToday,
    forecast,
    overflow,
    daysNeededAtCap,
    status,
  };
}
