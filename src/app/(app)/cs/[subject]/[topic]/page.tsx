import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { CS_SUBJECTS, getCsSubject, getCsTopic, getCsTopics } from "@/lib/content";
import { Markdown } from "@/components/design-system/markdown";
import { ExplainButton } from "@/components/ai/explain-button";

type Params = { subject: string; topic: string };

export async function generateStaticParams(): Promise<Params[]> {
  const all: Params[] = [];
  for (const s of CS_SUBJECTS) {
    const topics = await getCsTopics(s.slug);
    for (const t of topics) all.push({ subject: s.slug, topic: t.slug });
  }
  return all;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { subject, topic } = await params;
  const entry = await getCsTopic(subject, topic);
  return { title: entry ? entry.title : "Not found", description: entry?.description };
}

export default async function CsTopicPage({ params }: { params: Promise<Params> }) {
  const { subject, topic } = await params;
  const s = getCsSubject(subject);
  if (!s) notFound();
  const [entry, topics] = await Promise.all([
    getCsTopic(subject, topic),
    getCsTopics(subject),
  ]);
  if (!entry) notFound();

  const idx = topics.findIndex((t) => t.slug === topic);
  const prev = idx > 0 ? topics[idx - 1] : null;
  const next = idx < topics.length - 1 ? topics[idx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
      <Link
        href={`/cs/${subject}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {s.name}
      </Link>

      <header className="mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">
            {s.shortName}
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
        <div className="mt-4">
          <ExplainButton
            context={`CS fundamentals topic (${s.name}): ${entry.title}`}
            text={entry.body.slice(0, 4000)}
          />
        </div>
      </header>

      <article className="mt-6">
        <Markdown className="text-[0.95rem]">{entry.body}</Markdown>
      </article>

      <nav className="mt-10 flex items-stretch justify-between gap-4 border-t border-border pt-6">
        {prev ? (
          <Link
            href={`/cs/${subject}/${prev.slug}`}
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
            href={`/cs/${subject}/${next.slug}`}
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
