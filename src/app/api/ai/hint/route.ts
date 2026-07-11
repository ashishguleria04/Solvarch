import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAnthropic, isAiConfigured, MODELS, textFromMessage } from "@/lib/anthropic";
import { getEntitlements, canAccessProblem } from "@/lib/entitlements";

export const maxDuration = 30;

const schema = z.object({
  slug: z.string().min(1),
  /** How many hints (static + AI) the user has already seen. */
  level: z.number().int().min(0).max(10),
  /** Optional: the user's current code, so hints can be targeted. */
  code: z.string().max(6000).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
  const { slug, level, code } = parsed.data;

  const problem = await prisma.problem.findUnique({
    where: { slug },
    select: {
      title: true,
      statement: true,
      hints: true,
      editorial: true,
      isPremium: true,
      complexityTime: true,
    },
  });
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }
  const { isPro } = await getEntitlements();
  if (!canAccessProblem(problem, isPro)) {
    return NextResponse.json({ error: "This problem requires Pro." }, { status: 403 });
  }

  const priorHints = (problem.hints as string[]) ?? [];
  const anthropic = getAnthropic()!;

  try {
    const message = await anthropic.messages.create({
      model: MODELS.assist,
      max_tokens: 500,
      system: `You are an interview coach helping someone solve a coding problem THEMSELVES. You give one progressive hint at a time. Rules:
- Never reveal the full solution or write solution code.
- Each hint should be one step more revealing than the last, but still leave real work to do.
- If the user shows code, point at the flaw or the next step in THEIR approach.
- 1-3 sentences. No preamble.`,
      messages: [
        {
          role: "user",
          content: `Problem: ${problem.title}

${problem.statement.slice(0, 3000)}

Hints already shown to the user (do not repeat these):
${priorHints.map((h, i) => `${i + 1}. ${h}`).join("\n") || "(none)"}

The user has now asked for hint number ${level + 1} — go one step further than what they've seen.${
            code ? `\n\nTheir current code attempt:\n\`\`\`\n${code}\n\`\`\`` : ""
          }

Target complexity (for your own calibration, don't state it unless the hint warrants it): ${problem.complexityTime ?? "unknown"}.`,
        },
      ],
    });

    return NextResponse.json({ hint: textFromMessage(message) });
  } catch (err) {
    console.error("[ai/hint]", err);
    return NextResponse.json(
      { error: "The hint generator is unavailable right now." },
      { status: 502 }
    );
  }
}
