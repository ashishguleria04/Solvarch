"use client";

import { useState } from "react";
import { Loader2, Sparkles, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/design-system/markdown";

/**
 * AI hint generator: produces fresh, progressive hints that pick up where
 * the static ones leave off, without giving the solution away.
 */
export function HintButton({ slug, staticCount }: { slug: string; staticCount: number }) {
  const [hints, setHints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          level: staticCount + hints.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't generate a hint.");
        return;
      }
      setHints((h) => [...h, data.hint]);
    } catch {
      toast.error("Couldn't reach the hint generator.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {hints.map((hint, i) => (
        <div
          key={i}
          className="rounded-lg border border-primary/20 bg-primary/[0.04] p-4"
        >
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            AI Hint {staticCount + i + 1}
          </div>
          <Markdown>{hint}</Markdown>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={generate}
        disabled={loading}
        className="w-full border-primary/30 text-primary hover:bg-primary/10"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <WandSparkles className="size-4" />
        )}
        {hints.length === 0 ? "Get an AI hint for where I'm stuck" : "One more nudge"}
      </Button>
    </div>
  );
}
