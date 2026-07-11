import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import {
  getInterview,
  parseMessages,
  parseFeedback,
  INTERVIEW_TYPE_LABELS,
} from "@/server/interviews";
import { InterviewChat } from "@/components/interviews/interview-chat";
import { FeedbackReport } from "@/components/interviews/feedback-report";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();
  const interview = session?.user?.id
    ? await getInterview(session.user.id, id)
    : null;
  return { title: interview?.title ?? "Interview" };
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();
  const interview = await getInterview(session.user.id, id);
  if (!interview) notFound();

  const messages = parseMessages(interview.messages);
  const feedback = parseFeedback(interview.feedback);

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/interviews"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">{interview.title}</h1>
            <p className="text-xs text-muted-foreground">
              {INTERVIEW_TYPE_LABELS[interview.type]}
              {interview.status === "COMPLETED" ? " · completed" : " · live"}
            </p>
          </div>
        </div>
        {interview.score !== null && (
          <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-sm font-semibold text-primary">
            {interview.score}/100
          </span>
        )}
      </div>

      {interview.status === "COMPLETED" && feedback ? (
        <div className="flex-1 overflow-y-auto">
          <FeedbackReport feedback={feedback} messages={messages} />
        </div>
      ) : (
        <InterviewChat
          interviewId={interview.id}
          initialMessages={messages}
          interviewType={interview.type}
        />
      )}
    </div>
  );
}
