"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Lightbulb, Lock, Sparkles } from "lucide-react";
import { Markdown } from "@/components/design-system/markdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  category: "BEHAVIORAL" | "HR" | "TECHNICAL_TRIVIA";
  question: string;
  modelAnswer: string | null;
  tips: string | null;
  locked: boolean;
};

const CATEGORY_LABELS: Record<Item["category"], string> = {
  BEHAVIORAL: "Behavioral",
  HR: "HR & Culture",
  TECHNICAL_TRIVIA: "Technical Trivia",
};

export function QuestionBank({ items, isPro }: { items: Item[]; isPro: boolean }) {
  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category))],
    [items]
  );
  const [active, setActive] = useState<Item["category"]>(categories[0] ?? "BEHAVIORAL");
  const [open, setOpen] = useState<string | null>(null);

  const visible = items.filter((i) => i.category === active);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === c
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((q) => {
          const isOpen = open === q.id;
          return (
            <div
              key={q.id}
              className="overflow-hidden rounded-xl border border-border bg-card/40"
            >
              <button
                onClick={() => setOpen(isOpen ? null : q.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium">{q.question}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {q.locked && <Lock className="size-3.5 text-muted-foreground" />}
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-border px-5 py-4">
                  {q.locked ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                      <p className="max-w-md text-sm text-muted-foreground">
                        The model answer and delivery tips for this question are
                        part of Pro.
                      </p>
                      <Button asChild variant="glow" size="sm">
                        <Link href="/pricing">
                          <Sparkles className="size-3.5" />
                          Unlock with Pro
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Model answer
                      </h4>
                      <Markdown className="mt-2">{q.modelAnswer ?? ""}</Markdown>
                      {q.tips && (
                        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/[0.04] p-4">
                          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-primary">
                            <Lightbulb className="size-3.5" />
                            Delivery tips
                          </div>
                          <Markdown>{q.tips}</Markdown>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isPro && (
        <p className="text-center text-xs text-muted-foreground">
          Free accounts see the first answers in each category — Pro unlocks all
          of them.
        </p>
      )}
    </div>
  );
}
