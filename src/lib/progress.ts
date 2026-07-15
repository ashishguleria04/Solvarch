"use client";

// Local progress tracking — solved/attempted status per problem, completed
// marks for CS/system-design reading, plus a per-day solve log for streaks,
// persisted to localStorage. There are no accounts, so this is the only
// record of progress; export/import moves it between browsers.

import { useSyncExternalStore } from "react";
import { z } from "zod";

const STORAGE_KEY = "solvarch.progress.v1";
const CHANGE_EVENT = "solvarch:progress-change";

const problemProgressSchema = z.object({
  status: z.enum(["solved", "attempted"]),
  attempts: z.number().int().nonnegative(),
  lastLanguage: z.string().optional(),
  firstSolvedAt: z.string().optional(),
  lastActivityAt: z.string().optional(),
});

const contentProgressSchema = z.object({
  completedAt: z.string(),
});

const progressStateSchema = z.object({
  version: z.literal(1),
  problems: z.record(z.string(), problemProgressSchema),
  /**
   * Reading-content completion, keyed "cs/{subject}/{topic}" or
   * "system-design/{slug}". Defaulted so pre-content exports still parse.
   */
  content: z.record(z.string(), contentProgressSchema).default({}),
  /** Local-date day key ("YYYY-MM-DD") → accepted submissions that day. */
  activity: z.record(z.string(), z.number().int().nonnegative()),
});

export type ProblemProgress = z.infer<typeof problemProgressSchema>;
export type ContentProgress = z.infer<typeof contentProgressSchema>;
export type ProgressState = z.infer<typeof progressStateSchema>;
export type ProblemStatus = ProblemProgress["status"];

const EMPTY_STATE: ProgressState = {
  version: 1,
  problems: {},
  content: {},
  activity: {},
};

// Snapshot cache so useSyncExternalStore gets a stable reference between
// writes. Mutators always produce new objects; EMPTY_STATE is never mutated.
let cache: ProgressState | null = null;

function readStorage(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = progressStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function getSnapshot(): ProgressState {
  if (typeof window === "undefined") return EMPTY_STATE;
  cache ??= readStorage();
  return cache;
}

function getServerSnapshot(): ProgressState {
  return EMPTY_STATE;
}

function write(next: ProgressState) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — keep the in-memory state for this session.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  // `storage` fires only in other tabs; a null key means localStorage.clear().
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === STORAGE_KEY) {
      cache = null;
      onChange();
    }
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Subscribe a client component to progress state. Server-renders as empty. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function problemStatus(
  state: ProgressState,
  slug: string
): ProblemStatus | null {
  return state.problems[slug]?.status ?? null;
}

export function isContentDone(state: ProgressState, key: string): boolean {
  return !!state.content[key];
}

export function contentDoneCount(state: ProgressState, keys: string[]): number {
  return keys.reduce((n, key) => n + (state.content[key] ? 1 : 0), 0);
}

/** Toggle a reading item's completed mark; returns the new done state. */
export function toggleContentDone(key: string): boolean {
  const state = getSnapshot();
  const content = { ...state.content };
  const done = !content[key];
  if (done) {
    content[key] = { completedAt: new Date().toISOString() };
  } else {
    delete content[key];
  }
  write({ ...state, content });
  return done;
}

function dayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Today's local-date key ("YYYY-MM-DD") — the same key streaks count by. */
export function localDayKey(now = new Date()): string {
  return dayKey(now);
}

function previousDay(d: Date): Date {
  const prev = new Date(d);
  prev.setDate(prev.getDate() - 1);
  return prev;
}

function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Record a failed submission. A solved problem stays solved. */
export function recordAttempt(slug: string, language: string) {
  const state = getSnapshot();
  const prev = state.problems[slug];
  if (prev?.status === "solved") return;
  write({
    ...state,
    problems: {
      ...state.problems,
      [slug]: {
        status: "attempted",
        attempts: (prev?.attempts ?? 0) + 1,
        lastLanguage: language,
        lastActivityAt: new Date().toISOString(),
      },
    },
  });
}

/** Record an accepted submission and count today toward the streak. */
export function recordSolved(slug: string, language: string) {
  const state = getSnapshot();
  const prev = state.problems[slug];
  const now = new Date();
  const today = dayKey(now);
  write({
    ...state,
    problems: {
      ...state.problems,
      [slug]: {
        status: "solved",
        attempts: (prev?.attempts ?? 0) + 1,
        lastLanguage: language,
        firstSolvedAt: prev?.firstSolvedAt ?? now.toISOString(),
        lastActivityAt: now.toISOString(),
      },
    },
    activity: { ...state.activity, [today]: (state.activity[today] ?? 0) + 1 },
  });
}

export function resetProgress() {
  write(EMPTY_STATE);
}

export type Streak = { current: number; best: number; solvedToday: boolean };

export function computeStreak(state: ProgressState, now = new Date()): Streak {
  const days = new Set(
    Object.entries(state.activity)
      .filter(([, count]) => count > 0)
      .map(([day]) => day)
  );

  // A streak survives until a full day passes with no solve: if today has no
  // activity yet, count back from yesterday instead of reporting zero.
  const solvedToday = days.has(dayKey(now));
  let current = 0;
  let cursor = solvedToday ? new Date(now) : previousDay(now);
  while (days.has(dayKey(cursor))) {
    current += 1;
    cursor = previousDay(cursor);
  }

  let best = current;
  let run = 0;
  let prev: string | null = null;
  for (const day of [...days].sort()) {
    run = prev !== null && dayKey(previousDay(parseDayKey(day))) === prev ? run + 1 : 1;
    if (run > best) best = run;
    prev = day;
  }

  return { current, best, solvedToday };
}

/** Pretty JSON for download; extra top-level keys are ignored on import. */
export function serializeProgress(): string {
  const state = getSnapshot();
  return JSON.stringify(
    { app: "solvarch-progress", exportedAt: new Date().toISOString(), ...state },
    null,
    2
  );
}

export function exportFileName(now = new Date()): string {
  return `solvarch-progress-${dayKey(now)}.json`;
}

type ImportResult =
  | { ok: true; solved: number }
  | { ok: false; error: string };

/** Merge an exported file into current progress (never loses local data). */
export function importProgress(json: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }
  const parsed = progressStateSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "That file doesn't look like a Solvarch progress export." };
  }
  const merged = mergeProgress(getSnapshot(), parsed.data);
  write(merged);
  const solved = Object.values(merged.problems).filter(
    (p) => p.status === "solved"
  ).length;
  return { ok: true, solved };
}

function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const problems = { ...a.problems };
  for (const [slug, incoming] of Object.entries(b.problems)) {
    const existing = problems[slug];
    problems[slug] = existing ? mergeProblem(existing, incoming) : incoming;
  }
  const content = { ...a.content };
  for (const [key, incoming] of Object.entries(b.content)) {
    const existing = content[key];
    // ISO timestamps compare correctly as strings; keep the earliest mark.
    content[key] =
      existing && existing.completedAt <= incoming.completedAt
        ? existing
        : incoming;
  }
  const activity = { ...a.activity };
  for (const [day, count] of Object.entries(b.activity)) {
    activity[day] = Math.max(activity[day] ?? 0, count);
  }
  return { version: 1, problems, content, activity };
}

function mergeProblem(a: ProblemProgress, b: ProblemProgress): ProblemProgress {
  // ISO timestamps compare correctly as strings.
  const newer = (b.lastActivityAt ?? "") >= (a.lastActivityAt ?? "") ? b : a;
  const firstSolved = [a.firstSolvedAt, b.firstSolvedAt]
    .filter((t): t is string => !!t)
    .sort();
  const lastActivity = [a.lastActivityAt, b.lastActivityAt]
    .filter((t): t is string => !!t)
    .sort();
  return {
    status: a.status === "solved" || b.status === "solved" ? "solved" : "attempted",
    attempts: Math.max(a.attempts, b.attempts),
    lastLanguage: newer.lastLanguage ?? a.lastLanguage ?? b.lastLanguage,
    firstSolvedAt: firstSolved[0],
    lastActivityAt: lastActivity[lastActivity.length - 1],
  };
}
