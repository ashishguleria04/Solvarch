import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAnthropic, isAiConfigured, MODELS, textFromMessage } from "@/lib/anthropic";
import { FEEDBACK_PROMPT, INTERVIEWER_PROMPTS } from "@/lib/interview-prompts";
import {
  completeInterview,
  getInterview,
  parseMessages,
  type InterviewFeedback,
} from "@/server/interviews";

export const maxDuration = 120;

/** End an interview: generate the structured feedback report and mark it complete. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAiConfigured()) {
    return NextResponse.json({ error: "AI isn't configured." }, { status: 503 });
  }

  const interview = await getInterview(userId, id);
  if (!interview) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }
  if (interview.status !== "ACTIVE") {
    return NextResponse.json({ ok: true }); // idempotent
  }

  const history = parseMessages(interview.messages);
  const anthropic = getAnthropic()!;

  try {
    // Adaptive thinking (default) for a higher-quality evaluation.
    const result = await anthropic.messages.create({
      model: MODELS.interview,
      max_tokens: 4096,
      system: INTERVIEWER_PROMPTS[interview.type],
      messages: [
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: FEEDBACK_PROMPT },
      ],
    });

    const raw = textFromMessage(result);
    const feedback = parseFeedbackJson(raw);
    if (!feedback) {
      console.error("[ai/interview/end] unparseable feedback:", raw.slice(0, 400));
      return NextResponse.json(
        { error: "Couldn't generate the feedback report. Try ending again." },
        { status: 502 }
      );
    }

    await completeInterview(id, feedback);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ai/interview/end]", err);
    return NextResponse.json(
      { error: "Couldn't generate the feedback report. Try again." },
      { status: 502 }
    );
  }
}

function parseFeedbackJson(raw: string): InterviewFeedback | null {
  // The model is instructed to output bare JSON, but be tolerant of fences.
  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const obj = JSON.parse(text.slice(start, end + 1));
    if (typeof obj.score !== "number" || typeof obj.summary !== "string") return null;
    return {
      score: Math.max(0, Math.min(100, Math.round(obj.score))),
      summary: obj.summary,
      strengths: Array.isArray(obj.strengths) ? obj.strengths.map(String) : [],
      gaps: Array.isArray(obj.gaps) ? obj.gaps.map(String) : [],
      suggestedTopics: Array.isArray(obj.suggestedTopics)
        ? obj.suggestedTopics.map(String)
        : [],
    };
  } catch {
    return null;
  }
}
