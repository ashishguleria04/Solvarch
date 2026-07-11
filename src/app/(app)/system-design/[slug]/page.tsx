import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, PlayCircle } from "lucide-react";
import {
  getSystemDesignEntries,
  getSystemDesignEntry,
  splitPreview,
} from "@/lib/content";
import { getEntitlements } from "@/lib/entitlements";
import { Markdown } from "@/components/design-system/markdown";
import { PremiumBadge } from "@/components/design-system/premium-badge";
import { ContentPaywall } from "@/components/paywall/content-paywall";
import { ExplainButton } from "@/components/ai/explain-button";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const entries = await getSystemDesignEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getSystemDesignEntry(slug);
  return {
    title: entry ? entry.title : "Not found",
    description: entry?.description,
  };
}

const CATEGORY_LABEL: Record<string, string> = {
  "case-study": "Case Study",
  hld: "High-Level Design",
  lld: "Low-Level Design",
};

export default async function SystemDesignEntryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [{ isPro }, entry] = await Promise.all([
    getEntitlements(),
    getSystemDesignEntry(slug),
  ]);
  if (!entry) notFound();

  const gated = entry.premium && !isPro;
  const { preview, hasMore } = gated
    ? splitPreview(entry.body)
    : { preview: entry.body, hasMore: false };
  const bodyToRender = gated ? preview : entry.body.replace("<!--more-->", "");

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
      <Link
        href="/system-design"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        System Design
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {CATEGORY_LABEL[entry.category ?? ""] ?? "Guide"}
          </span>
          {entry.premium && !isPro && <PremiumBadge />}
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
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
            context={`System design topic: ${entry.title}. ${entry.description}`}
            text={preview.slice(0, 4000)}
          />
        </div>
      </header>

      <article className="mt-6">
        <Markdown className="text-[0.95rem]">{bodyToRender}</Markdown>
      </article>

      {gated && hasMore && <ContentPaywall title={entry.title} />}

      {!gated && entry.videos.length > 0 && (
        <section className="mt-10 rounded-xl border border-border bg-card/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Watch next
          </h2>
          <ul className="mt-3 space-y-2">
            {entry.videos.map((v) => (
              <li key={v.url}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  <PlayCircle className="size-4" />
                  {v.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
