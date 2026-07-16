"use client";

// Company bank index cards. Solved counts come from local progress, so the
// grid is a client component fed slim, server-built summaries.

import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { problemStatus, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export type CompanySummary = {
  slug: string;
  name: string;
  blurb: string;
  dsaCount: number;
  designCount: number;
  /** Catalog slugs of the bank's DSA questions, for the solved counter. */
  dsaSlugs: string[];
  /** Most frequent problem topics in the bank, e.g. ["Graphs", "Heaps"]. */
  topTopics: string[];
};

export function CompanyGrid({ companies }: { companies: CompanySummary[] }) {
  const progress = useProgress();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => {
        const solved = company.dsaSlugs.filter(
          (slug) => problemStatus(progress, slug) === "solved"
        ).length;
        const done = solved === company.dsaCount && company.dsaCount > 0;

        return (
          <Link
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <Building2 className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold tracking-tight group-hover:text-primary">
                  {company.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {company.dsaCount} problems · {company.designCount} design prompts
                </p>
              </div>
            </div>

            <p className="mt-3 flex-1 text-sm text-muted-foreground">
              {company.blurb}
            </p>

            {company.topTopics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {company.topTopics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-sm">
              <span
                className={cn(
                  "font-medium",
                  done ? "text-emerald-400" : "text-muted-foreground"
                )}
              >
                {solved}/{company.dsaCount} solved
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-primary">
                Open bank
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
