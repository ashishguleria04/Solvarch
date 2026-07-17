"use client";

// Per-problem markdown notes, persisted to localStorage in a single record
// keyed by problem slug. Mirrors the store pattern in src/lib/progress.ts:
// useSyncExternalStore + a same-tab change event + cross-tab storage events.
// Notes ride along in progress exports (see progress-menu.tsx) so a backup
// captures them too.

import { useSyncExternalStore } from "react";
import { z } from "zod";

const STORAGE_KEY = "solvarch.notes.v1";
const CHANGE_EVENT = "solvarch:notes-change";

const noteSchema = z.object({
  text: z.string(),
  updatedAt: z.string(),
});

const notesStateSchema = z.record(z.string(), noteSchema);

export type Note = z.infer<typeof noteSchema>;
export type NotesState = z.infer<typeof notesStateSchema>;

const EMPTY_STATE: NotesState = {};

let cache: NotesState | null = null;

function readStorage(): NotesState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = notesStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function getSnapshot(): NotesState {
  if (typeof window === "undefined") return EMPTY_STATE;
  cache ??= readStorage();
  return cache;
}

function write(next: NotesState) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — keep the in-memory state for this session.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
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

/** Subscribe a client component to all notes. Server-renders as empty. */
export function useNotes(): NotesState {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_STATE);
}

export function getNote(state: NotesState, slug: string): Note | null {
  return state[slug] ?? null;
}

/** Save a note; empty/whitespace-only text deletes it. */
export function saveNote(slug: string, text: string) {
  const state = getSnapshot();
  const next = { ...state };
  if (text.trim() === "") {
    if (!(slug in next)) return;
    delete next[slug];
  } else {
    next[slug] = { text, updatedAt: new Date().toISOString() };
  }
  write(next);
}

/** Current notes for embedding in a progress export. */
export function notesForExport(): NotesState {
  return getSnapshot();
}

/**
 * Merge the `notes` key of an imported backup, if present and valid.
 * Per slug, the newer `updatedAt` wins. Returns how many notes were merged.
 */
export function importNotes(data: unknown): number {
  if (typeof data !== "object" || data === null || !("notes" in data)) return 0;
  const parsed = notesStateSchema.safeParse(
    (data as { notes: unknown }).notes
  );
  if (!parsed.success) return 0;
  const current = getSnapshot();
  const merged = { ...current };
  for (const [slug, incoming] of Object.entries(parsed.data)) {
    const existing = merged[slug];
    // ISO timestamps compare correctly as strings.
    if (!existing || existing.updatedAt < incoming.updatedAt) {
      merged[slug] = incoming;
    }
  }
  write(merged);
  return Object.keys(parsed.data).length;
}
