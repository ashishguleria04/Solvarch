import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getCheatsheetEntries, getCheatsheetEntry } from "@/lib/content";
import { Markdown } from "@/components/design-system/markdown";
import { MarkCompleteButton } from "@/components/content/content-progress";

export async function generateStaticParams() {
  const entries = await getCheatsheetEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getCheatsheetEntry(slug);
  return {
    title: entry ? entry.title : "Not found",
    description: entry?.description,
  };
}

export default async function CheatsheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [entry, entries] = await Promise.all([
    getCheatsheetEntry(slug),
    getCheatsheetEntries(),
  ]);
  if (!entry) notFound();

  const idx = entries.findIndex((e) => e.slug === slug);
  const prev = idx > 0 ? entries[idx - 1] : null;
  const next = idx < entries.length - 1 ? entries[idx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
      <Link
        href="/cheatsheets"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Cheat Sheets
      </Link>

      <header className="mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">
            {entry.category === "reference" ? "Reference" : "Pattern"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {entry.readingMinutes} min read
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight lg:text-3xl">
          {entry.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{entry.description}</p>
      </header>

      <article className="mt-6">
        <Markdown className="text-[0.95rem]">{entry.body}</Markdown>
      </article>

      <div className="mt-10 flex justify-center">
        <MarkCompleteButton contentKey={`cheatsheets/${slug}`} />
      </div>

      <nav className="mt-8 flex items-stretch justify-between gap-4 border-t border-border pt-6">
        {prev ? (
          <Link
            href={`/cheatsheets/${prev.slug}`}
            className="group flex max-w-[45%] items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/cheatsheets/${next.slug}`}
            className="group flex max-w-[45%] items-center gap-2 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="truncate">{next.title}</span>
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
