import type { Metadata } from "next";
import Link from "next/link";
import { ListChecks, Map as MapIcon, Network, type LucideIcon } from "lucide-react";
import { roadmaps } from "@/data/roadmaps";
import { resolveRoadmap } from "@/lib/roadmaps";
import { PageHeader } from "@/components/design-system/page-header";
import { RoadmapCompletion } from "@/components/roadmaps/roadmap-completion";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Roadmaps" };

const ICONS: Record<string, LucideIcon> = {
  "blind-75": ListChecks,
  "grind-169": MapIcon,
  "system-design-fundamentals": Network,
};

export default async function RoadmapsPage() {
  const resolved = await Promise.all(roadmaps.map(resolveRoadmap));

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="Roadmaps"
        description="Fixed study plans with a defined order — pick one, follow it top to bottom, and let the progress ring keep you honest."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resolved.map(({ roadmap, sections, dsaSlugs, contentKeys }) => {
          const Icon = ICONS[roadmap.slug] ?? MapIcon;
          return (
            <Link key={roadmap.slug} href={`/roadmaps/${roadmap.slug}`} className="group">
              <Card className="h-full gap-0 p-5 transition-colors hover:border-primary/40">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-4.5 text-primary" />
                  </span>
                  <h2 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {roadmap.name}
                  </h2>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {roadmap.tagline}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                  <span>
                    {sections.length} sections
                    {dsaSlugs.length > 0 && ` · ${dsaSlugs.length} problems`}
                    {contentKeys.length > 0 && ` · ${contentKeys.length} readings`}
                  </span>
                  <RoadmapCompletion
                    dsaSlugs={dsaSlugs}
                    contentKeys={contentKeys}
                    className="ml-auto"
                  />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
