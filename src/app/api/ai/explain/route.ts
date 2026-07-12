import { NextResponse } from "next/server";
import { z } from "zod";
import { getAnthropic, isAiConfigured, MODELS, textFromMessage } from "@/lib/anthropic";

export const maxDuration = 30;

const schema = z.object({
  text: z.string().min(1).max(8000),
  mode: z.enum(["simpler", "analogy"]).default("simpler"),
  context: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "AI features aren't configured yet. Add an Anthropic API key." },
      { status: 503 }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { text, mode, context } = parsed.data;

  const anthropic = getAnthropic()!;
  const instruction =
    mode === "analogy"
      ? "Re-explain the following using a concrete, memorable real-world analogy. Keep it under 150 words."
      : "Re-explain the following in simpler terms, as if to a beginner. Use plain language and short sentences. Keep it under 150 words.";

  try {
    const message = await anthropic.messages.create({
      model: MODELS.assist,
      max_tokens: 700,
      system:
        "You are a friendly, expert computer-science tutor helping a candidate prepare for technical interviews. You make hard concepts click.",
      messages: [
        {
          role: "user",
          content: `${instruction}${context ? `\n\nThis is ${context}.` : ""}\n\nContent:\n"""\n${text}\n"""`,
        },
      ],
    });

    return NextResponse.json({ explanation: textFromMessage(message) });
  } catch (err) {
    console.error("[ai/explain]", err);
    return NextResponse.json(
      { error: "The AI tutor is unavailable right now. Please try again." },
      { status: 502 }
    );
  }
}
