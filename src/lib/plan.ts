"use client";

// The interview countdown plan — one active plan at a time: an interview
// date, the roadmap to finish before it, and a daily item cap. All the
// derived numbers (pace, feasibility, today's queue) live in
// ./plan-schedule; this module only persists the plan itself. Mirrors the
// storage pattern in ./progress: localStorage + a change event +
// useSyncExternalStore.

import { useSyncExternalStore } from "react";
import { z } from "zod";

const STORAGE_KEY = "solvarch.plan.v1";
const CHANGE_EVENT = "solvarch:plan-change";

const planSchema = z.object({
  /** Roadmap the plan works through (src/data/roadmaps slug). */
  roadmapSlug: z.string(),
  /** Local day key ("YYYY-MM-DD") of the interview. */
  interviewDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Max new items per day the learner signed up for. */
  dailyCap: z.number().int().positive(),
  /** Optional free-text tag, e.g. a company or role. */
  label: z.string().optional(),
  createdAt: z.string(),
});

const planStateSchema = z.object({
  version: z.literal(1),
  plan: planSchema.nullable(),
});

export type InterviewPlan = z.infer<typeof planSchema>;
export type PlanState = z.infer<typeof planStateSchema>;

const EMPTY_STATE: PlanState = { version: 1, plan: null };

// Snapshot cache so useSyncExternalStore gets a stable reference between
// writes. Mutators always produce new objects; EMPTY_STATE is never mutated.
let cache: PlanState | null = null;

function readStorage(): PlanState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = planStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function getSnapshot(): PlanState {
  if (typeof window === "undefined") return EMPTY_STATE;
  cache ??= readStorage();
  return cache;
}

function write(next: PlanState) {
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

/** Subscribe a client component to the plan. Server-renders as no plan. */
export function usePlan(): PlanState {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_STATE);
}

/** Create or replace the active plan. */
export function savePlan(plan: Omit<InterviewPlan, "createdAt">) {
  const existing = getSnapshot().plan;
  write({
    version: 1,
    plan: { ...plan, createdAt: existing?.createdAt ?? new Date().toISOString() },
  });
}

export function clearPlan() {
  write(EMPTY_STATE);
}
