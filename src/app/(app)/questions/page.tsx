import type { Metadata } from "next";
import { questions } from "@/data/questions";
import { PageHeader } from "@/components/design-system/page-header";
import { QuestionBank } from "@/components/questions/question-bank";

export const metadata: Metadata = { title: "Question Bank" };

export default function QuestionsPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="Question Bank"
        description="Behavioral, HR, and technical trivia questions with model answers and delivery tips."
      />
      <QuestionBank
        items={questions.map((q, i) => ({
          id: `q-${i}`,
          category: q.category,
          question: q.question,
          modelAnswer: q.modelAnswer,
          tips: q.tips ?? null,
        }))}
      />
    </div>
  );
}
