"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, GraduationCap, TrendingDown, Bot, User } from "lucide-react";
import { Markdown } from "@/components/design-system/markdown";
import { cn } from "@/lib/utils";
import type { InterviewFeedback } from "@/server/interviews";

type Msg = { role: "user" | "assistant"; content: string; createdAt: string };

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export function FeedbackReport({
  feedback,
  messages,
}: {
  feedback: InterviewFeedback;
  messages: Msg[];
}) {
  const [showTranscript, setShowTranscript] = useState(false);
  const r = 44;
  const c = 2 * Math.PI * r;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
      <section className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card/40 p-8 sm:flex-row">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label={`Score ${feedback.score} out of 100`}>
            <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-secondary" />
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - (c * feedback.score) / 100}
              className={cn("transition-all duration-700", scoreColor(feedback.score))}
              stroke="currentColor"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("font-mono text-3xl font-bold", scoreColor(feedback.score))}>
              {feedback.score}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              / 100
            </span>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-semibold tracking-tight">Interview Report</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{feedback.summary}</p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <CheckCircle2 className="size-4" />
            Strengths
          </h3>
          <ul className="mt-3 space-y-2.5">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm leading-6 text-foreground/90">
                {s}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <TrendingDown className="size-4" />
            Gaps to close
          </h3>
          <ul className="mt-3 space-y-2.5">
            {feedback.gaps.map((g, i) => (
              <li key={i} className="text-sm leading-6 text-foreground/90">
                {g}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {feedback.suggestedTopics.length > 0 && (
        <section className="rounded-xl border border-border bg-card/40 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <GraduationCap className="size-4 text-primary" />
            Study next
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {feedback.suggestedTopics.map((t, i) => (
              <span
                key={i}
                className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <button
          onClick={() => setShowTranscript((s) => !s)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card/40 px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-card"
        >
          Full transcript ({messages.length} messages)
          <ChevronDown
            className={cn("size-4 transition-transform", showTranscript && "rotate-180")}
          />
        </button>
        {showTranscript && (
          <div className="mt-4 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                    m.role === "user"
                      ? "bg-secondary ring-border"
                      : "bg-primary/10 text-primary ring-primary/20"
                  )}
                >
                  {m.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-4 py-2.5",
                    m.role === "user"
                      ? "bg-primary/15"
                      : "border border-border bg-card"
                  )}
                >
                  <Markdown className="text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {m.content}
                  </Markdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
