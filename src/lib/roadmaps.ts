// Server-side resolution of roadmap items against the real catalog/content.
// Mirrors the company-page pattern: entries whose slug no longer exists are
// silently dropped so a stale reference can't break a page.

import { getProblem, type Difficulty } from "@/data/dsa";
import { getSystemDesignEntries } from "@/lib/content";
import type { Roadmap, RoadmapItemKind, RoadmapSection } from "@/data/roadmaps";

export type ResolvedRoadmapItem = {
  kind: RoadmapItemKind;
  title: string;
  href: string;
  note?: string;
  /** dsa entries only */
  problemSlug?: string;
  difficulty?: Difficulty;
  topicName?: string;
  /** system-design entries only */
  contentKey?: string;
  readingMinutes?: number;
};

export type ResolvedRoadmapSection = Omit<RoadmapSection, "items"> & {
  items: ResolvedRoadmapItem[];
};

export type ResolvedRoadmap = {
  roadmap: Roadmap;
  sections: ResolvedRoadmapSection[];
  /** Progress inputs for client components. */
  dsaSlugs: string[];
  contentKeys: string[];
};

export async function resolveRoadmap(roadmap: Roadmap): Promise<ResolvedRoadmap> {
  const designEntries = await getSystemDesignEntries();
  const designBySlug = new Map(designEntries.map((e) => [e.slug, e]));

  const dsaSlugs: string[] = [];
  const contentKeys: string[] = [];

  const sections: ResolvedRoadmapSection[] = roadmap.sections.map((section) => {
    const items: ResolvedRoadmapItem[] = [];
    for (const item of section.items) {
      if (item.kind === "dsa") {
        const problem = getProblem(item.slug);
        if (!problem) continue;
        dsaSlugs.push(problem.slug);
        items.push({
          kind: "dsa",
          title: problem.title,
          href: `/dsa/${problem.slug}`,
          note: item.note,
          problemSlug: problem.slug,
          difficulty: problem.difficulty,
          topicName: problem.topic.name,
        });
      } else {
        const entry = designBySlug.get(item.slug);
        if (!entry) continue;
        const contentKey = `system-design/${entry.slug}`;
        contentKeys.push(contentKey);
        items.push({
          kind: "system-design",
          title: entry.title,
          href: `/system-design/${entry.slug}`,
          note: item.note,
          contentKey,
          readingMinutes: entry.readingMinutes,
        });
      }
    }
    return { title: section.title, description: section.description, items };
  });

  return {
    roadmap,
    sections: sections.filter((s) => s.items.length > 0),
    dsaSlugs,
    contentKeys,
  };
}
