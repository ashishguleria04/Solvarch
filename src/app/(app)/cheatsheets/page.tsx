import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Puzzle, Sparkles } from "lucide-react";
import { getCheatsheetEntries, type ContentEntry } from "@/lib/content";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import {
  ContentCheckIcon,
  ContentProgressSummary,
} from "@/components/content/content-progress";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Cheat Sheets" };

function SheetCard({ entry }: { entry: ContentEntry }) {
  return (
    <Link href={`/cheatsheets/${entry.slug}`} className="group">
      <Card className="h-full gap-0 p-5 transition-colors hover:border-primary/40">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
            {entry.title}
          </h3>
          <ContentCheckIcon
            contentKey={`cheatsheets/${entry.slug}`}
            className="mt-1"
          />
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {entry.description}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {entry.readingMinutes} min read
          </span>
          {entry.tags
            .filter((t) => t !== "pattern" && t !== "reference")
            .slice(0, 3)
            .map((t) => (
              <span key={t} className="rounded-md bg-secondary px-1.5 py-0.5">
                {t}
              </span>
            ))}
        </div>
      </Card>
    </Link>
  );
}

export default async function CheatsheetsPage() {
  const entries = await getCheatsheetEntries();

  const references = entries.filter((e) => e.category === "reference");
  const patterns = entries.filter((e) => e.category === "pattern");

  if (entries.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <EmptyState
          icon={BookOpen}
          title="Cheat sheets are on their way"
          description="Pattern references and quick guides are being authored."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <PageHeader
        title="Cheat Sheets"
        description="Topic-wise pattern references: recognition cues, the core template, key variations, and the pitfalls that cost interviews."
        action={
          <ContentProgressSummary
            keys={entries.map((e) => `cheatsheets/${e.slug}`)}
          />
        }
      />

      {references.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick References
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {references.map((e) => (
              <SheetCard key={e.slug} entry={e} />
            ))}
          </div>
        </section>
      )}

      {patterns.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Puzzle className="size-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Pattern Library
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {patterns.map((e) => (
              <SheetCard key={e.slug} entry={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
