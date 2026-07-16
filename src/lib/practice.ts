"use client";

// Timed self-practice — a discipline tool, not a judge. One active session at
// a time (persisted so reloads can't dodge the clock), a pending self-score
// prompt once a session ends, and a local log of rubric-scored attempts.
// Mirrors the storage pattern in ./progress: localStorage + a change event +
// useSyncExternalStore. A shared 1s ticker drives clocks and session expiry
// so components never read Date.now() during render.

import { useSyncExternalStore } from "react";
import { z } from "zod";

const SESSION_KEY = "solvarch.practice.session.v1";
const PENDING_KEY = "solvarch.practice.pending.v1";
const LOG_KEY = "solvarch.practice.log.v1";
const CHANGE_EVENT = "solvarch:practice-change";
const LOG_CAP = 200;

// ------------------------------------------------------------------ rubric

export type RubricCriterion = { id: string; label: string };

/** The self-scoring checklist — what a strong interview performance covers. */
export const RUBRIC: RubricCriterion[] = [
  { id: "restate", label: "Restated the problem, its inputs/outputs, and edge cases before coding" },
  { id: "pattern", label: "Named the underlying pattern and said why it applies" },
  { id: "brute-force", label: "Stated a brute-force baseline and its complexity" },
  { id: "plan", label: "Outlined the chosen approach out loud before writing code" },
  { id: "code", label: "Wrote clean, working code without peeking at hints or the editorial" },
  { id: "test", label: "Dry-ran an example and at least one edge case" },
  { id: "complexity", label: "Stated the final time and space complexity" },
];

// ------------------------------------------------------------------ schemas

const sessionSchema = z.object({
  slug: z.string(),
  title: z.string(),
  startedAt: z.string(),
  durationMin: z.number().int().positive(),
  endsAt: z.string(),
});

const pendingSchema = z.object({
  slug: z.string(),
  title: z.string(),
  durationMin: z.number().int().positive(),
  usedSec: z.number().int().nonnegative(),
  /** True when the clock ran out (vs. the learner ending early). */
  expired: z.boolean(),
});

const attemptSchema = z.object({
  slug: z.string(),
  endedAt: z.string(),
  durationMin: z.number().int().positive(),
  usedSec: z.number().int().nonnegative(),
  /** Rubric criterion ids the learner checked off. */
  checks: z.array(z.string()),
});

const logSchema = z.array(attemptSchema);

export type PracticeSession = z.infer<typeof sessionSchema>;
export type PendingAttempt = z.infer<typeof pendingSchema>;
export type PracticeAttempt = z.infer<typeof attemptSchema>;

// -------------------------------------------------------------------- store

// Snapshot caches so useSyncExternalStore gets stable references between
// writes. Mutators always produce new objects. `undefined` = not read yet.
let sessionCache: PracticeSession | null | undefined;
let pendingCache: PendingAttempt | null | undefined;
let logCache: PracticeAttempt[] | undefined;

const EMPTY_LOG: PracticeAttempt[] = [];

function readStorage<T>(key: string, schema: z.ZodType<T>): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — in-memory state still works for this tab.
  }
}

function getSessionSnapshot(): PracticeSession | null {
  if (typeof window === "undefined") return null;
  if (sessionCache === undefined) sessionCache = readStorage(SESSION_KEY, sessionSchema);
  return sessionCache;
}

function getPendingSnapshot(): PendingAttempt | null {
  if (typeof window === "undefined") return null;
  if (pendingCache === undefined) pendingCache = readStorage(PENDING_KEY, pendingSchema);
  return pendingCache;
}

function getLogSnapshot(): PracticeAttempt[] {
  if (typeof window === "undefined") return EMPTY_LOG;
  logCache ??= readStorage(LOG_KEY, logSchema) ?? EMPTY_LOG;
  return logCache;
}

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  // `storage` fires only in other tabs; a null key means localStorage.clear().
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === null ||
      e.key === SESSION_KEY ||
      e.key === PENDING_KEY ||
      e.key === LOG_KEY
    ) {
      sessionCache = undefined;
      pendingCache = undefined;
      logCache = undefined;
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

/** The active timed session (any problem), or null. Server-renders as null. */
export function useActivePractice(): PracticeSession | null {
  return useSyncExternalStore(subscribe, getSessionSnapshot, () => null);
}

/** A finished-but-unscored attempt awaiting the rubric dialog, or null. */
export function usePendingAttempt(): PendingAttempt | null {
  return useSyncExternalStore(subscribe, getPendingSnapshot, () => null);
}

/** All self-scored attempts, newest first. Filter per slug with useMemo. */
export function usePracticeLog(): PracticeAttempt[] {
  return useSyncExternalStore(subscribe, getLogSnapshot, () => EMPTY_LOG);
}

// ----------------------------------------------------------------- mutators

export function startPractice(
  slug: string,
  title: string,
  durationMin: number
): void {
  const startedAt = new Date();
  const session: PracticeSession = {
    slug,
    title,
    startedAt: startedAt.toISOString(),
    durationMin,
    endsAt: new Date(startedAt.getTime() + durationMin * 60_000).toISOString(),
  };
  sessionCache = session;
  writeStorage(SESSION_KEY, session);
  notify();
}

function finishSession(expired: boolean): void {
  const session = getSessionSnapshot();
  if (!session) return;
  const cap = session.durationMin * 60;
  const elapsed = Math.round(
    (Date.now() - new Date(session.startedAt).getTime()) / 1000
  );
  const pending: PendingAttempt = {
    slug: session.slug,
    title: session.title,
    durationMin: session.durationMin,
    usedSec: expired ? cap : Math.min(Math.max(0, elapsed), cap),
    expired,
  };
  sessionCache = null;
  writeStorage(SESSION_KEY, null);
  pendingCache = pending;
  writeStorage(PENDING_KEY, pending);
  notify();
}

/** End the active session early; queues the self-score prompt. */
export function endPractice(): void {
  finishSession(false);
}

/** Close the self-score prompt without (or after) logging. */
export function dismissPendingAttempt(): void {
  pendingCache = null;
  writeStorage(PENDING_KEY, null);
  notify();
}

export function logAttempt(attempt: PracticeAttempt): void {
  const next = [attempt, ...getLogSnapshot()].slice(0, LOG_CAP);
  logCache = next;
  writeStorage(LOG_KEY, next);
  notify();
}

// ------------------------------------------------------------------- ticker

// Shared 1s ticker: components read the cached second via useNowSec (pure
// during render); the interval callback also expires overdue sessions —
// including ones that ran out while the tab was closed.
let nowSec = 0;
const tickListeners = new Set<() => void>();
let tickTimer: ReturnType<typeof setInterval> | null = null;

function handleTick() {
  nowSec = Math.floor(Date.now() / 1000);
  const session = getSessionSnapshot();
  if (session && new Date(session.endsAt).getTime() <= Date.now()) {
    finishSession(true);
  }
  for (const listener of [...tickListeners]) listener();
}

function subscribeTick(onChange: () => void): () => void {
  tickListeners.add(onChange);
  if (!tickTimer) {
    nowSec = Math.floor(Date.now() / 1000);
    tickTimer = setInterval(handleTick, 1000);
  }
  return () => {
    tickListeners.delete(onChange);
    if (tickListeners.size === 0 && tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  };
}

/** Current time at 1s granularity, safe to use in render. Server-renders 0. */
export function useNowSec(): number {
  return useSyncExternalStore(subscribeTick, () => nowSec, () => 0);
}

// ------------------------------------------------------------------ helpers

/** Recommended session length by difficulty (minutes). */
export function recommendedMinutes(
  difficulty: "EASY" | "MEDIUM" | "HARD"
): number {
  return difficulty === "EASY" ? 20 : difficulty === "MEDIUM" ? 35 : 50;
}

/** "MM:SS" for a second count. */
export function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
