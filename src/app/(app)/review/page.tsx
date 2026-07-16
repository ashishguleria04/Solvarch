import type { Metadata } from "next";
import { problems } from "@/data/dsa";
import { REVIEW_INTERVALS_DAYS } from "@/lib/review";
import { PageHeader } from "@/components/design-system/page-header";
import {
  ReviewQueue,
  type ReviewCatalogProblem,
} from "@/components/review/review-queue";

export const metadata: Metadata = { title: "Review Queue" };

const catalog: ReviewCatalogProblem[] = problems.map((p) => ({
  slug: p.slug,
  title: p.title,
  difficulty: p.difficulty,
  topicName: p.topic.name,
}));

export default function ReviewPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="Review Queue"
        description={`Spaced repetition on problems you marked as failed. Each pass pushes the next review out (${REVIEW_INTERVALS_DAYS.join(
          ", "
        )} days); a fail sends it back to day 1; clear the last step and it graduates.`}
      />
      <ReviewQueue catalog={catalog} />
    </div>
  );
}
