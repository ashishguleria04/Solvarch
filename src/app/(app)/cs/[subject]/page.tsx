import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { CS_SUBJECTS, getCsSubject, getCsTopics } from "@/lib/content";
import { PageHeader } from "@/components/design-system/page-header";
import {
  ContentCheckIcon,
  ContentProgressSummary,
} from "@/components/content/content-progress";

type Params = { subject: string };

export function generateStaticParams(): Params[] {
  return CS_SUBJECTS.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { subject } = await params;
  const s = getCsSubject(subject);
  return { title: s ? s.name : "Not found" };
}

export default async function CsSubjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { subject } = await params;
  const s = getCsSubject(subject);
  if (!s) notFound();
  const topics = await getCsTopics(subject);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Link
        href="/cs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        CS Fundamentals
      </Link>

      <PageHeader
        title={s.name}
        description={s.description}
        action={
          <ContentProgressSummary
            keys={topics.map((t) => `cs/${subject}/${t.slug}`)}
          />
        }
      />

      <div className="rounded-xl border border-border bg-card/40 p-2">
        {topics.map((t, i) => (
          <Link
            key={t.slug}
            href={`/cs/${subject}/${t.slug}`}
            className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card"
          >
            <span className="w-6 shrink-0 font-mono text-sm text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium transition-colors group-hover:text-primary">
                {t.title}
              </span>
              <p className="truncate text-xs text-muted-foreground">{t.description}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {t.readingMinutes} min
            </span>
            <ContentCheckIcon contentKey={`cs/${subject}/${t.slug}`} />
          </Link>
        ))}
      </div>
    </div>
  );
}
