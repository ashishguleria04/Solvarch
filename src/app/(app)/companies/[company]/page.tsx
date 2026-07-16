import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { companies, getCompany, type Frequency } from "@/data/companies";
import { getProblem } from "@/data/dsa";
import { getSystemDesignEntry } from "@/lib/content";
import { PageHeader } from "@/components/design-system/page-header";
import {
  CompanyQuestionList,
  type ResolvedCompanyQuestion,
} from "@/components/companies/company-question-list";

export function generateStaticParams() {
  return companies.map((c) => ({ company: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const name = getCompany(company)?.name;
  return { title: name ? `${name} Question Bank` : "Company Question Bank" };
}

const FREQUENCY_RANK: Record<Frequency, number> = { high: 0, medium: 1, low: 2 };

/** Prettify a content slug when the markdown entry is missing. */
function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company: companySlug } = await params;
  const company = getCompany(companySlug);

  if (!company) notFound();

  const resolved: ResolvedCompanyQuestion[] = [];
  for (const q of company.questions) {
    if (q.kind === "dsa") {
      const problem = getProblem(q.slug);
      if (!problem) continue;
      resolved.push({
        kind: "dsa",
        title: problem.title,
        href: `/dsa/${problem.slug}`,
        frequency: q.frequency,
        note: q.note,
        problemSlug: problem.slug,
        difficulty: problem.difficulty,
        topicName: problem.topic.name,
        tags: problem.tags,
      });
    } else {
      const entry = await getSystemDesignEntry(q.slug);
      resolved.push({
        kind: "system-design",
        title: entry?.title ?? titleFromSlug(q.slug),
        href: `/system-design/${q.slug}`,
        frequency: q.frequency,
        note: q.note,
      });
    }
  }

  resolved.sort(
    (a, b) => FREQUENCY_RANK[a.frequency] - FREQUENCY_RANK[b.frequency]
  );

  const dsaCount = resolved.filter((q) => q.kind === "dsa").length;
  const designCount = resolved.length - dsaCount;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Link
        href="/companies"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All companies
      </Link>

      <PageHeader
        title={`${company.name} question bank`}
        description={company.blurb}
      />

      <p className="text-xs text-muted-foreground">
        {dsaCount} DSA problems · {designCount} system-design prompts ·
        compiled from publicly shared interview experiences; exact questions
        vary between loops.
      </p>

      <CompanyQuestionList questions={resolved} />
    </div>
  );
}
