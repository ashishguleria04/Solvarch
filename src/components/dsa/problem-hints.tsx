"use client";

import { useState } from "react";
import { Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/design-system/markdown";

export function ProblemHints({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState(0);

  if (hints.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hints available for this problem.
      </p>
    );
  }

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
          You&apos;ve revealed all hints.
        </p>
      )}
    </div>
  );
}
