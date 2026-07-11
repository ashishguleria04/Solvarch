import type { Metadata } from "next";
import Link from "next/link";
import { Bot, CheckCircle2, CircleDot, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@/lib/auth";
import { getEntitlements, remainingInterviews } from "@/lib/entitlements";
import { listInterviews, INTERVIEW_TYPE_LABELS } from "@/server/interviews";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { NewInterview } from "@/components/interviews/new-interview";

export const metadata: Metadata = { title: "AI Mock Interviews" };

export default async function InterviewsPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const { isPro } = await getEntitlements();
  const remaining = userId ? await remainingInterviews(userId, isPro) : 0;
  const interviews = userId ? await listInterviews(userId) : [];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <PageHeader
        title="AI Mock Interviews"
        description="Practice with an AI interviewer that probes, follows up, and scores you like the real thing."
      />

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Start a new interview
          </h2>
          {!isPro && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {remaining > 0
                ? `${remaining} free interview${remaining === 1 ? "" : "s"} left this month`
                : "Free interview used — Pro is unlimited"}
            </span>
          )}
        </div>
        <NewInterview quotaExhausted={!isPro && remaining <= 0} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          History
        </h2>
        {interviews.length === 0 ? (
          <EmptyState
            icon={Bot}
            title="No interviews yet"
            description="Your past interviews and feedback reports will appear here."
          />
        ) : (
          <div className="rounded-xl border border-border bg-card/40 p-2">
            {interviews.map((iv) => (
              <Link
                key={iv.id}
                href={`/interviews/${iv.id}`}
                className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card"
              >
                {iv.status === "COMPLETED" ? (
                  <CheckCircle2 className="size-4.5 shrink-0 text-primary" />
                ) : (
                  <CircleDot className="size-4.5 shrink-0 animate-pulse text-amber-400" />
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium transition-colors group-hover:text-primary">
                    {iv.title}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {INTERVIEW_TYPE_LABELS[iv.type]} ·{" "}
                    {formatDistanceToNow(iv.createdAt, { addSuffix: true })}
                    {iv.status === "ACTIVE" && " · in progress"}
                  </p>
                </div>
                {iv.score !== null && (
                  <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-sm font-semibold text-primary">
                    {iv.score}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
