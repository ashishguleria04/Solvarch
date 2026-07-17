"use client";

// Rule-based spaced repetition over problems the learner marked as failed.
// No AI, no ease factors — a fixed interval ladder: each successful review
// advances one rung, a failed review drops back to the first rung, and
// clearing the last rung graduates the problem out of the queue. Mirrors the
// storage pattern in ./progress: localStorage + a change event +
// useSyncExternalStore.

import { useSyncExternalStore } from "react";
import { z } from "zod";
import { REVIEW_INTERVALS_DAYS } from "@/lib/review-schedule";

export { REVIEW_INTERVALS_DAYS };

const STORAGE_KEY = "solvarch.review.v1";
const CHANGE_EVENT = "solvarch:review-change";

const reviewEntrySchema = z.object({
  /** When the problem was first marked as failed. */
  addedAt: z.string(),
  /** Next scheduled review (ISO). */
  dueAt: z.string(),
  /** Current rung on the interval ladder (0-based). */
  stage: z.number().int().nonnegative(),
  /** Completed reviews (either outcome). */
  reviews: z.number().int().nonnegative(),
  /** Failed reviews (dropped back to rung 0). */
  lapses: z.number().int().nonnegative(),
  lastReviewedAt: z.string().optional(),
});

const reviewStateSchema = z.object({
  version: z.literal(1),
  /** Problem slug → scheduling entry. */
  queue: z.record(z.string(), reviewEntrySchema),
});

export type ReviewEntry = z.infer<typeof reviewEntrySchema>;
export type ReviewState = z.infer<typeof reviewStateSchema>;

const EMPTY_STATE: ReviewState = { version: 1, queue: {} };

// Snapshot cache so useSyncExternalStore gets a stable reference between
// writes. Mutators always produce new objects; EMPTY_STATE is never mutated.
let cache: ReviewState | null = null;

function readStorage(): ReviewState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = reviewStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function getSnapshot(): ReviewState {
  if (typeof window === "undefined") return EMPTY_STATE;
  cache ??= readStorage();
  return cache;
}

function write(next: ReviewState) {
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

/** Subscribe a client component to the review queue. Server-renders empty. */
export function useReview(): ReviewState {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_STATE);
}

// ------------------------------------------------------------------ queries

export function isQueued(state: ReviewState, slug: string): boolean {
  return !!state.queue[slug];
}

export function isDue(entry: ReviewEntry, now: Date): boolean {
  return new Date(entry.dueAt).getTime() <= now.getTime();
}

export function dueCount(state: ReviewState, now: Date): number {
  return Object.values(state.queue).filter((e) => isDue(e, now)).length;
}

export type QueuedReview = { slug: string; entry: ReviewEntry };

/** Queue split into due-now and upcoming, each sorted by dueAt ascending. */
export function splitQueue(
  state: ReviewState,
  now: Date
): { due: QueuedReview[]; upcoming: QueuedReview[] } {
  const all = Object.entries(state.queue)
    .map(([slug, entry]) => ({ slug, entry }))
    .sort(
      (a, b) =>
        new Date(a.entry.dueAt).getTime() - new Date(b.entry.dueAt).getTime()
    );
  return {
    due: all.filter((q) => isDue(q.entry, now)),
    upcoming: all.filter((q) => !isDue(q.entry, now)),
  };
}

// ----------------------------------------------------------------- mutators

function inDays(from: Date, days: number): string {
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Mark a problem as failed. New problems start on rung 0 (due tomorrow);
 * re-marking an already-queued problem counts as a lapse and resets it.
 */
export function markForReview(slug: string) {
  const state = getSnapshot();
  const prev = state.queue[slug];
  const now = new Date();
  const entry: ReviewEntry = {
    addedAt: prev?.addedAt ?? now.toISOString(),
    dueAt: inDays(now, REVIEW_INTERVALS_DAYS[0]),
    stage: 0,
    reviews: prev?.reviews ?? 0,
    lapses: prev ? prev.lapses + 1 : 0,
    lastReviewedAt: prev?.lastReviewedAt,
  };
  write({ ...state, queue: { ...state.queue, [slug]: entry } });
}

export function removeFromReview(slug: string) {
  const state = getSnapshot();
  if (!state.queue[slug]) return;
  const queue = { ...state.queue };
  delete queue[slug];
  write({ ...state, queue });
}

export type GradeResult =
  | { outcome: "graduated" }
  | { outcome: "scheduled"; nextInDays: number };

/**
 * Record a review outcome. Success climbs one rung (graduating past the
 * last); failure drops back to rung 0.
 */
export function gradeReview(slug: string, remembered: boolean): GradeResult | null {
  const state = getSnapshot();
  const prev = state.queue[slug];
  if (!prev) return null;
  const now = new Date();

  if (remembered && prev.stage + 1 >= REVIEW_INTERVALS_DAYS.length) {
    const queue = { ...state.queue };
    delete queue[slug];
    write({ ...state, queue });
    return { outcome: "graduated" };
  }

  const stage = remembered ? prev.stage + 1 : 0;
  const days = REVIEW_INTERVALS_DAYS[stage];
  const entry: ReviewEntry = {
    ...prev,
    stage,
    dueAt: inDays(now, days),
    reviews: prev.reviews + 1,
    lapses: remembered ? prev.lapses : prev.lapses + 1,
    lastReviewedAt: now.toISOString(),
  };
  write({ ...state, queue: { ...state.queue, [slug]: entry } });
  return { outcome: "scheduled", nextInDays: days };
}

/**
 * Called after an accepted submission: if the problem was queued and due,
 * count the solve as a successful review. Returns null when nothing was due.
 */
export function completeDueReview(slug: string): GradeResult | null {
  const state = getSnapshot();
  const entry = state.queue[slug];
  if (!entry || !isDue(entry, new Date())) return null;
  return gradeReview(slug, true);
}

// ------------------------------------------------------------------ helpers

/** Whole days from `now` until `iso`, floored at 0 ("due today"). */
export function daysUntil(iso: string, now: Date): number {
  const ms = new Date(iso).getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function formatDueIn(iso: string, now: Date): string {
  const days = daysUntil(iso, now);
  if (days === 0) return "due now";
  if (days === 1) return "due tomorrow";
  return `due in ${days} days`;
}
