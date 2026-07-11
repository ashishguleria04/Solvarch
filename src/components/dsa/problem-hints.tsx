"use client";

import { useState } from "react";
import { Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/design-system/markdown";
import { HintButton } from "@/components/ai/hint-button";

export function ProblemHints({ hints, slug }: { hints: string[]; slug: string }) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="space-y-3">
      {hints.slice(0, revealed).map((hint, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card/50 p-4"
        >
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-primary">
            <Lightbulb className="size-3.5" />
            Hint {i + 1}
          </div>
          <Markdown>{hint}</Markdown>
        </div>
      ))}

      {revealed < hints.length ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRevealed((r) => r + 1)}
          className="w-full"
        >
          <Plus className="size-4" />
          {revealed === 0 ? "Show first hint" : `Show hint ${revealed + 1}`}
        </Button>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          {hints.length === 0
            ? "No written hints for this problem — ask the AI below."
            : "You've revealed all written hints."}
        </p>
      )}

      {/* AI hints unlock once the written ones are exhausted, so learners
          climb the ladder before reaching for generated help. */}
      {revealed >= hints.length && (
        <HintButton slug={slug} staticCount={hints.length} />
      )}
    </div>
  );
}
