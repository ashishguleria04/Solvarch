import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import {
  filterProblems,
  problems as allProblems,
  topics,
  type Difficulty,
} from "@/data/dsa";
import { dailyCatalog } from "@/data/daily";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { DailyProblemCard } from "@/components/marketing/daily-problem";
import { DsaProgress } from "@/components/dsa/dsa-progress";
import { ProblemFilters } from "@/components/dsa/problem-filters";
import { ProblemList } from "@/components/dsa/problem-list";

const catalog = allProblems.map((p) => ({
  slug: p.slug,
  difficulty: p.difficulty,
  topicSlug: p.topic.slug,
}));

const topicMeta = topics.map((t) => ({
  slug: t.slug,
  name: t.name,
  problemCount: t.problemCount,
}));

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

      <DailyProblemCard problems={dailyCatalog} />

      <DsaProgress problems={catalog} topics={topicMeta} />

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
