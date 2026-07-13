import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import { filterProblems, topics, type Difficulty } from "@/data/dsa";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { ProblemFilters } from "@/components/dsa/problem-filters";
import { ProblemList } from "@/components/dsa/problem-list";

export const metadata: Metadata = { title: "DSA Problems" };

type SearchParams = {
  topic?: string;
  difficulty?: string;
  q?: string;
};

export default async function DsaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const difficulty = ["EASY", "MEDIUM", "HARD"].includes(sp.difficulty ?? "")
    ? (sp.difficulty as Difficulty)
    : undefined;

  const problems = filterProblems({
    topicSlug: sp.topic,
    difficulty,
    search: sp.q,
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="DSA Problems"
        description={`${problems.length} problems · master the patterns that show up in every interview.`}
      />

      <ProblemFilters topics={topics.map((t) => ({ slug: t.slug, name: t.name }))} />

      {problems.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No problems match your filters"
          description="Try clearing a filter or searching for something else."
        />
      ) : (
        <ProblemList problems={problems} />
      )}
    </div>
  );
}
