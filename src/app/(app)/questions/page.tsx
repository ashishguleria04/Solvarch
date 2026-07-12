import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";
import { getQuestionBank } from "@/server/questions";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { QuestionBank } from "@/components/questions/question-bank";

export const metadata: Metadata = { title: "Question Bank" };

export default async function QuestionsPage() {
  const items = await getQuestionBank();

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="Question Bank"
        description="Behavioral, HR, and technical trivia questions with model answers and delivery tips."
      />
      {items.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="The question bank is being stocked"
          description="Run the database seed to load the interview questions."
        />
      ) : (
        <QuestionBank
          items={items.map((q) => ({
            id: q.id,
            category: q.category,
            question: q.question,
            modelAnswer: q.modelAnswer,
            tips: q.tips,
          }))}
        />
      )}
    </div>
  );
}
