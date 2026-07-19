import type { Metadata } from "next";
import { roadmaps } from "@/data/roadmaps";
import { resolveRoadmap } from "@/lib/roadmaps";
import { PageHeader } from "@/components/design-system/page-header";
import {
  PlanDashboard,
  type PlannerItem,
  type PlannerRoadmap,
} from "@/components/plan/plan-dashboard";

export const metadata: Metadata = { title: "Interview Plan" };

/** Flatten a roadmap into ordered, deduped planner items. */
async function toPlannerRoadmap(
  roadmap: (typeof roadmaps)[number]
): Promise<PlannerRoadmap> {
  const { sections } = await resolveRoadmap(roadmap);
  const seen = new Set<string>();
  const items: PlannerItem[] = [];
  for (const item of sections.flatMap((s) => s.items)) {
    const key = item.kind === "dsa" ? item.problemSlug : item.contentKey;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push({
      key,
      kind: item.kind,
      title: item.title,
      href: item.href,
      difficulty: item.difficulty,
      topicName: item.topicName,
      readingMinutes: item.readingMinutes,
    });
  }
  return {
    slug: roadmap.slug,
    name: roadmap.name,
    tagline: roadmap.tagline,
    items,
  };
}

export default async function PlanPage() {
  const plannerRoadmaps = await Promise.all(roadmaps.map(toPlannerRoadmap));

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="Interview Plan"
        description="Set an interview date and the planner schedules backwards — a daily queue, the pace you need, and an early warning when the plan stops fitting."
      />
      <PlanDashboard roadmaps={plannerRoadmaps} />
    </div>
  );
}
