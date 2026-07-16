import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, Network } from "lucide-react";
import { getRoadmap, roadmaps } from "@/data/roadmaps";
import { resolveRoadmap, type ResolvedRoadmapItem } from "@/lib/roadmaps";
import { PageHeader } from "@/components/design-system/page-header";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { ProblemStatusIcon } from "@/components/dsa/problem-status";
import { ContentCheckIcon } from "@/components/content/content-progress";
import { RoadmapCompletion } from "@/components/roadmaps/roadmap-completion";

export function generateStaticParams() {
  return roadmaps.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = getRoadmap(slug)?.name;
  return { title: name ? `${name} Roadmap` : "Roadmap" };
}

function ItemRow({ item }: { item: ResolvedRoadmapItem }) {
  return (
    <Link
      href={item.href}
      className="group flex flex-col gap-1.5 px-4 py-3.5 transition-colors hover:bg-accent/40 sm:px-5"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {item.kind === "dsa" && item.problemSlug ? (
          <ProblemStatusIcon slug={item.problemSlug} />
        ) : (
          <ContentCheckIcon contentKey={item.contentKey ?? ""} />
        )}
        <span className="font-medium tracking-tight group-hover:text-primary">
          {item.title}
        </span>
        {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
        {item.topicName && (
          <span className="text-sm text-muted-foreground">{item.topicName}</span>
        )}
        {item.kind === "system-design" && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Network className="size-3.5 text-sky-400/80" aria-label="System design" />
            {item.readingMinutes != null && (
              <>
                <Clock className="size-3.5" />
                {item.readingMinutes} min read
              </>
            )}
          </span>
        )}
        <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      {item.note && (
        <p className="pl-7 text-xs text-muted-foreground">{item.note}</p>
      )}
    </Link>
  );
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);

  if (!roadmap) notFound();

  const { sections, dsaSlugs, contentKeys } = await resolveRoadmap(roadmap);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Link
        href="/roadmaps"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All roadmaps
      </Link>

      <PageHeader
        title={roadmap.name}
        description={roadmap.description}
        action={
          <RoadmapCompletion dsaSlugs={dsaSlugs} contentKeys={contentKeys} />
        }
      />

      <div className="space-y-8">
        {sections.map((section, i) => (
          <section key={section.title}>
            <div className="mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="mr-2 text-primary">{String(i + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              {section.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}
            </div>
            <div className="divide-y divide-border/70 rounded-xl border border-border bg-card/40">
              {section.items.map((item) => (
                <ItemRow key={item.href} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
