"use client";

// One company's question bank: kind filter, frequency labels, and per-row
// solved status from local progress.

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Network } from "lucide-react";
import type { Difficulty } from "@/data/dsa";
import type { CompanyQuestionKind, Frequency } from "@/data/companies";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { ProblemStatusIcon } from "@/components/dsa/problem-status";
import { cn } from "@/lib/utils";

export type ResolvedCompanyQuestion = {
  kind: CompanyQuestionKind;
  title: string;
  href: string;
  frequency: Frequency;
  note?: string;
  /** dsa entries only */
  problemSlug?: string;
  difficulty?: Difficulty;
  topicName?: string;
  tags?: string[];
};

const FREQUENCY_LABEL: Record<Frequency, string> = {
  high: "Very common",
  medium: "Common",
  low: "Occasional",
};

const FREQUENCY_STYLE: Record<Frequency, string> = {
  high: "text-primary bg-primary/10 ring-primary/25",
  medium: "text-foreground/80 bg-secondary ring-border",
  low: "text-muted-foreground bg-secondary/60 ring-border",
};

type Filter = "all" | CompanyQuestionKind;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dsa", label: "DSA problems" },
  { id: "system-design", label: "System design" },
];

export function CompanyQuestionList({
  questions,
}: {
  questions: ResolvedCompanyQuestion[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible =
    filter === "all" ? questions : questions.filter((q) => q.kind === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.id
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-border/70 rounded-xl border border-border bg-card/40">
        {visible.map((q) => (
          <Link
            key={`${q.kind}:${q.href}`}
            href={q.href}
            className="group flex flex-col gap-1.5 px-4 py-3.5 transition-colors hover:bg-accent/40 sm:px-5"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {q.kind === "dsa" && q.problemSlug ? (
                <ProblemStatusIcon slug={q.problemSlug} />
              ) : (
                <Network className="size-4 shrink-0 text-sky-400/80" aria-label="System design" />
              )}
              <span className="font-medium tracking-tight group-hover:text-primary">
                {q.title}
              </span>
              {q.difficulty && <DifficultyBadge difficulty={q.difficulty} />}
              {q.topicName && (
                <span className="text-sm text-muted-foreground">{q.topicName}</span>
              )}
              <span className="ml-auto flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                    FREQUENCY_STYLE[q.frequency]
                  )}
                >
                  {FREQUENCY_LABEL[q.frequency]}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </span>
            </div>
            {(q.note || (q.tags && q.tags.length > 0)) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-7 text-xs text-muted-foreground">
                {q.note && <span>{q.note}</span>}
                {q.tags && q.tags.length > 0 && (
                  <span className="flex flex-wrap gap-1.5">
                    {q.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-secondary px-2 py-0.5 text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
