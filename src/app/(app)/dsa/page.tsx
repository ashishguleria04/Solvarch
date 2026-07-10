import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import type { Difficulty } from "@prisma/client";
import { getEntitlements } from "@/lib/entitlements";
import {
  getProblems,
  getDsaTopics,
  getUserProgressMap,
  getUserBookmarkSet,
} from "@/server/dsa";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { ProblemFilters } from "@/components/dsa/problem-filters";
import { ProblemList } from "@/components/dsa/problem-list";

export const metadata: Metadata = { title: "DSA Problems" };

type SearchParams = {
  topic?: string;
  difficulty?: string;
  status?: string;
  q?: string;
};

export default async function DsaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { userId, isPro } = await getEntitlements();

  const difficulty = ["EASY", "MEDIUM", "HARD"].includes(sp.difficulty ?? "")
    ? (sp.difficulty as Difficulty)
    : undefined;

  const [topics, allProblems, progress, bookmarks] = await Promise.all([
    getDsaTopics(),
    getProblems({ topicSlug: sp.topic, difficulty, search: sp.q }),
    getUserProgressMap(userId),
    getUserBookmarkSet(userId),
  ]);

  // Status filter depends on per-user progress.
  const problems = allProblems.filter((p) => {
    if (sp.status === "solved") return progress.get(p.id) === "SOLVED";
    if (sp.status === "attempted") return progress.get(p.id) === "ATTEMPTED";
    if (sp.status === "todo") return !progress.has(p.id);
    return true;
  });

  const solvedCount = [...progress.values()].filter((s) => s === "SOLVED").length;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="DSA Problems"
        description={`${solvedCount} solved · ${allProblems.length} shown · master the patterns that show up in every interview.`}
      />

      <ProblemFilters topics={topics.map((t) => ({ slug: t.slug, name: t.name }))} />

      {problems.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No problems match your filters"
          description="Try clearing a filter or searching for something else."
        />
      ) : (
        <ProblemList
          problems={problems}
          progress={progress}
          bookmarks={bookmarks}
          isPro={isPro}
        />
      )}
    </div>
  );
}
