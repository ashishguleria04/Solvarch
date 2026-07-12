import type { Metadata } from "next";
import Link from "next/link";
import { Network, Layers3, Component, Clock } from "lucide-react";
import { getSystemDesignEntries, type ContentEntry } from "@/lib/content";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "System Design" };

function CaseStudyCard({ entry }: { entry: ContentEntry }) {
  return (
    <Link href={`/system-design/${entry.slug}`} className="group">
      <Card className="h-full gap-0 p-5 transition-colors hover:border-primary/40">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
            {entry.title}
          </h3>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {entry.description}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {entry.readingMinutes} min read
          </span>
          {entry.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md bg-secondary px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </Card>
    </Link>
  );
}

function TopicRow({ entry }: { entry: ContentEntry }) {
  return (
    <Link
      href={`/system-design/${entry.slug}`}
      className="group flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-card"
    >
      <div className="min-w-0">
        <span className="text-sm font-medium transition-colors group-hover:text-primary">
          {entry.title}
        </span>
        <p className="truncate text-xs text-muted-foreground">{entry.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        <span>{entry.readingMinutes} min</span>
      </div>
    </Link>
  );
}

export default async function SystemDesignPage() {
  const entries = await getSystemDesignEntries();

  const caseStudies = entries.filter((e) => e.category === "case-study");
  const hld = entries.filter((e) => e.category === "hld");
  const lld = entries.filter((e) => e.category === "lld");

  if (entries.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={Network}
          title="System design content is on its way"
          description="Case studies and concept guides are being authored."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <PageHeader
        title="System Design"
        description="Case studies with real architectures, plus the HLD and LLD concepts interviewers probe."
      />

      {caseStudies.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Network className="size-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Case Studies
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {caseStudies.map((e) => (
              <CaseStudyCard key={e.slug} entry={e} />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {hld.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Layers3 className="size-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                High-Level Design
              </h2>
            </div>
            <div className="rounded-xl border border-border bg-card/40 p-2">
              {hld.map((e) => (
                <TopicRow key={e.slug} entry={e} />
              ))}
            </div>
          </section>
        )}
        {lld.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Component className="size-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Low-Level Design
              </h2>
            </div>
            <div className="rounded-xl border border-border bg-card/40 p-2">
              {lld.map((e) => (
                <TopicRow key={e.slug} entry={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
