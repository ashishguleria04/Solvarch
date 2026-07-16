"use client";

// Per-problem editor drafts, persisted to localStorage so a reload or
// accidental navigation doesn't wipe in-progress code. One key per problem;
// only code that differs from the starter is stored, so untouched problems
// leave no residue and "reset to starter" naturally clears the draft.

import { useSyncExternalStore } from "react";
import { z } from "zod";

// v2: starters became solution-function-only (the stdin/stdout driver is
// hidden and re-attached at run time), so v1 full-program drafts no longer
// compose with the judge and are intentionally orphaned.
const KEY_PREFIX = "solvarch.code.v2:";

const draftSchema = z.object({
  /** language id → edited source (only where it differs from starter). */
  languages: z.record(z.string(), z.string()),
  lastLanguage: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CodeDraft = z.infer<typeof draftSchema>;

// Snapshot cache: useSyncExternalStore needs a stable reference per slug,
// and saves keep it coherent so a remount restores the latest draft.
const draftCache = new Map<string, CodeDraft | null>();

function readDraft(slug: string): CodeDraft | null {
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + slug);
    if (!raw) return null;
    const parsed = draftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function getDraftSnapshot(slug: string): CodeDraft | null {
  if (!draftCache.has(slug)) draftCache.set(slug, readDraft(slug));
  return draftCache.get(slug) ?? null;
}

const emptySubscribe = () => () => {};

/** The saved draft for a problem, if any. Server-renders as null. */
export function useCodeDraft(slug: string): CodeDraft | null {
  return useSyncExternalStore(
    emptySubscribe,
    () => getDraftSnapshot(slug),
    () => null
  );
}

export function saveCodeDraft(
  slug: string,
  codeByLang: Record<string, string>,
  lastLanguage: string,
  starterCode: Record<string, string>
) {
  const languages: Record<string, string> = {};
  for (const [lang, code] of Object.entries(codeByLang)) {
    if (code !== (starterCode[lang] ?? "")) languages[lang] = code;
  }
  try {
    if (Object.keys(languages).length === 0) {
      draftCache.set(slug, null);
      window.localStorage.removeItem(KEY_PREFIX + slug);
      return;
    }
    const draft: CodeDraft = {
      languages,
      lastLanguage,
      updatedAt: new Date().toISOString(),
    };
    draftCache.set(slug, draft);
    window.localStorage.setItem(KEY_PREFIX + slug, JSON.stringify(draft));
  } catch {
    // Storage full or unavailable — the in-memory editor state still works.
  }
}
