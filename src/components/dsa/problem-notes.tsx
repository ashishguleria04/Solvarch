"use client";

// Notes tab on the problem page — a plain textarea that autosaves to
// localStorage (debounced) with a markdown preview. Your own scratchpad for
// patterns, mistakes, and the approach you want to remember next time.

import { useEffect, useRef, useState } from "react";
import { Eye, NotebookPen, PencilLine } from "lucide-react";
import { Markdown } from "@/components/design-system/markdown";
import { Textarea } from "@/components/ui/textarea";
import { getNote, saveNote, useNotes } from "@/lib/notes";
import { cn } from "@/lib/utils";

const SAVE_DELAY_MS = 500;

export function ProblemNotes({ slug }: { slug: string }) {
  const notes = useNotes();
  const stored = getNote(notes, slug);

  // Draft is seeded from the store once the client snapshot arrives (the
  // server snapshot is empty), then the textarea owns it; debounced saves
  // flow back to the store.
  const [draft, setDraft] = useState<string | null>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [saved, setSaved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const text = draft ?? stored?.text ?? "";

  function onChange(value: string) {
    setDraft(value);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveNote(slug, value);
      setSaved(true);
    }, SAVE_DELAY_MS);
  }

  // Flush a pending save on unmount so navigating away never loses edits.
  // The ref tracks the latest values (updated post-render, per lint rules).
  const flushRef = useRef({ draft, saved, slug });
  useEffect(() => {
    flushRef.current = { draft, saved, slug };
  });
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      const f = flushRef.current;
      if (f.draft !== null && !f.saved) saveNote(f.slug, f.draft);
    };
  }, []);

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded-lg border border-border p-0.5">
          {(
            [
              { key: "write", label: "Write", icon: PencilLine },
              { key: "preview", label: "Preview", icon: Eye },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                mode === key
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
        <span
          className={cn(
            "text-[11px]",
            saved ? "text-muted-foreground" : "text-amber-600 dark:text-amber-400"
          )}
        >
          {saved ? (text ? "Saved locally" : "") : "Saving…"}
        </span>
      </div>

      {mode === "write" ? (
        <Textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            "Jot down the pattern, the trap you fell into, the invariant that made it click…\n\nMarkdown works: **bold**, `code`, - lists."
          }
          className="min-h-64 flex-1 resize-none bg-code font-mono text-[13px] leading-relaxed scrollbar-thin"
          aria-label="Problem notes"
        />
      ) : text.trim() ? (
        <div className="min-h-64 flex-1 overflow-y-auto rounded-lg border border-border bg-card/40 p-4 scrollbar-thin">
          <Markdown>{text}</Markdown>
        </div>
      ) : (
        <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center">
          <NotebookPen className="size-6 text-muted-foreground/50" />
          <p className="max-w-56 text-sm text-muted-foreground">
            Nothing here yet — switch to Write and capture your approach.
          </p>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        {words > 0 && `${words} word${words === 1 ? "" : "s"} · `}
        Stored in this browser only — included in progress exports.
      </p>
    </div>
  );
}
