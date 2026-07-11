import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAnthropic, isAiConfigured, MODELS, textFromMessage } from "@/lib/anthropic";
import { getEntitlements, remainingInterviews } from "@/lib/entitlements";
import { INTERVIEWER_PROMPTS, OPENING_INSTRUCTION } from "@/lib/interview-prompts";
import { createInterview, INTERVIEW_TYPE_LABELS } from "@/server/interviews";

export const maxDuration = 60;

const schema = z.object({
  type: z.enum(["DSA", "SYSTEM_DESIGN", "BEHAVIORAL"]),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "AI interviews aren't configured yet. Add an Anthropic API key." },
      { status: 503 }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { type } = parsed.data;

  const { isPro } = await getEntitlements();
  const remaining = await remainingInterviews(userId, isPro);
  if (remaining <= 0) {
    return NextResponse.json(
      {
        error:
          "You've used your free interview this month. Upgrade to Pro for unlimited AI mock interviews.",
        code: "QUOTA",
      },
      { status: 402 }
    );
  }

  const anthropic = getAnthropic()!;
  try {
    const opening = await anthropic.messages.create({
      model: MODELS.interview,
      max_tokens: 1024,
      thinking: { type: "disabled" },
      system: INTERVIEWER_PROMPTS[type],
      messages: [{ role: "user", content: OPENING_INSTRUCTION }],
    });

    const first = {
      role: "assistant" as const,
      content: textFromMessage(opening),
      createdAt: new Date().toISOString(),
    };

    const created = await createInterview(
      userId,
      type,
      `${INTERVIEW_TYPE_LABELS[type]} Interview`,
      first
    );

    return NextResponse.json({ id: created.id });
  } catch (err) {
    console.error("[ai/interview/start]", err);
    return NextResponse.json(
      { error: "Couldn't start the interview. Please try again." },
      { status: 502 }
    );
  }
}
