"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import { Markdown } from "@/components/design-system/markdown";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  category: "BEHAVIORAL" | "HR" | "TECHNICAL_TRIVIA";
  question: string;
  modelAnswer: string | null;
  tips: string | null;
};

const CATEGORY_LABELS: Record<Item["category"], string> = {
  BEHAVIORAL: "Behavioral",
  HR: "HR & Culture",
  TECHNICAL_TRIVIA: "Technical Trivia",
};

export function QuestionBank({ items }: { items: Item[] }) {
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
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="border-t border-border px-5 py-4">
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
