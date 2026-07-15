"use client";

// Per-problem editor drafts, persisted to localStorage so a reload or
// accidental navigation doesn't wipe in-progress code. One key per problem;
// only code that differs from the starter is stored, so untouched problems
// leave no residue and "reset to starter" naturally clears the draft.

import { z } from "zod";

const KEY_PREFIX = "solvarch.code.v1:";

const draftSchema = z.object({
  /** language id → edited source (only where it differs from starter). */
  languages: z.record(z.string(), z.string()),
  lastLanguage: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CodeDraft = z.infer<typeof draftSchema>;

export function loadCodeDraft(slug: string): CodeDraft | null {
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + slug);
    if (!raw) return null;
    const parsed = draftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
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
      window.localStorage.removeItem(KEY_PREFIX + slug);
      return;
    }
    const draft: CodeDraft = {
      languages,
      lastLanguage,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(KEY_PREFIX + slug, JSON.stringify(draft));
  } catch {
    // Storage full or unavailable — the in-memory editor state still works.
  }
}
