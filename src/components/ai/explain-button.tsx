"use client";

import { useState } from "react";
import { Sparkles, Loader2, Baseline, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Markdown } from "@/components/design-system/markdown";
import { cn } from "@/lib/utils";

export function ExplainButton({
  text,
  context,
  className,
}: {
  text: string;
  context?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function explain(mode: "simpler" | "analogy") {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode, context }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not generate an explanation.");
        return;
      }
      setResult(data.explanation);
    } catch {
      toast.error("Could not reach the AI tutor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-1.5", className)}>
          <Sparkles className="size-3.5 text-primary" />
          Explain differently
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            disabled={loading}
            onClick={() => explain("simpler")}
          >
            <Baseline className="size-3.5" />
            Simpler
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            disabled={loading}
            onClick={() => explain("analogy")}
          >
            <Lightbulb className="size-3.5" />
            Analogy
          </Button>
        </div>

        <div className="mt-3 min-h-16 rounded-lg bg-muted/50 p-3 text-sm">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Thinking…
            </div>
          ) : result ? (
            <Markdown>{result}</Markdown>
          ) : (
            <p className="text-muted-foreground">
              Pick a style and Claude will re-explain this for you.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
