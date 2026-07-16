import type { Metadata } from "next";
import { companies } from "@/data/companies";
import { getProblem } from "@/data/dsa";
import { PageHeader } from "@/components/design-system/page-header";
import {
  CompanyGrid,
  type CompanySummary,
} from "@/components/companies/company-grid";

export const metadata: Metadata = { title: "Company Question Banks" };

function topTopics(dsaSlugs: string[]): string[] {
  const counts = new Map<string, number>();
  for (const slug of dsaSlugs) {
    const topic = getProblem(slug)?.topic.name;
    if (topic) counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);
}

const summaries: CompanySummary[] = companies.map((company) => {
  const dsaSlugs = company.questions
    .filter((q) => q.kind === "dsa" && getProblem(q.slug))
    .map((q) => q.slug);
  return {
    slug: company.slug,
    name: company.name,
    blurb: company.blurb,
    dsaCount: dsaSlugs.length,
    designCount: company.questions.filter((q) => q.kind === "system-design")
      .length,
    dsaSlugs,
    topTopics: topTopics(dsaSlugs),
  };
});

export default function CompaniesPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="Company Question Banks"
        description="What each company actually asks — compiled from publicly shared interview experiences."
      />

      <p className="max-w-3xl text-xs text-muted-foreground">
        Sourced from public interview reports (discussion forums, blogs, prep
        communities). Exact questions vary between loops — treat these as the
        recurring patterns to master, not a leaked paper.
      </p>

      <CompanyGrid companies={summaries} />
    </div>
  );
}
