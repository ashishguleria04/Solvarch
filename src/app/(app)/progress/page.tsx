import type { Metadata } from "next";
import { problems, topics } from "@/data/dsa";
import { PageHeader } from "@/components/design-system/page-header";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";

const catalog = problems.map((p) => ({
  slug: p.slug,
  title: p.title,
  difficulty: p.difficulty,
  topicSlug: p.topic.slug,
}));

const topicMeta = topics.map((t) => ({
  slug: t.slug,
  name: t.name,
  problemCount: t.problemCount,
}));

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="Progress"
        description="Your streaks, activity, and notes — all stored in this browser, exportable anytime."
      />
      <ProgressDashboard problems={catalog} topics={topicMeta} />
    </div>
  );
}
