import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAnthropic, isAiConfigured, MODELS } from "@/lib/anthropic";
import { INTERVIEWER_PROMPTS } from "@/lib/interview-prompts";
import {
  getInterview,
  parseMessages,
  saveMessages,
  type ChatMessage,
} from "@/server/interviews";

export const maxDuration = 120;

const schema = z.object({
  content: z.string().min(1).max(20000),
});

/**
 * Append a candidate message and stream the interviewer's reply as
 * text/event-stream. Events: {type:"delta", text} ... {type:"done"}.
 * The full reply is persisted when the stream completes.
 */
export async function POST(
  req: Request,
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
    return NextResponse.json(
      { error: "This interview is already completed." },
      { status: 409 }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const history = parseMessages(interview.messages);
  // Cap the transcript so a marathon session can't blow the request size.
  if (history.length > 200) {
    return NextResponse.json(
      { error: "This interview is very long — end it to get your feedback." },
      { status: 409 }
    );
  }

  const userMessage: ChatMessage = {
    role: "user",
    content: parsed.data.content,
    createdAt: new Date().toISOString(),
  };
  const withUser = [...history, userMessage];

  const anthropic = getAnthropic()!;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      try {
        const messageStream = anthropic.messages.stream({
          model: MODELS.interview,
          max_tokens: 2048,
          thinking: { type: "disabled" },
          system: INTERVIEWER_PROMPTS[interview.type],
          messages: withUser.map((m) => ({ role: m.role, content: m.content })),
        });

        messageStream.on("text", (delta) => send({ type: "delta", text: delta }));

        const final = await messageStream.finalMessage();
        const replyText = final.content
          .filter((b) => b.type === "text")
          .map((b) => (b.type === "text" ? b.text : ""))
          .join("\n")
          .trim();

        const reply: ChatMessage = {
          role: "assistant",
          content: replyText,
          createdAt: new Date().toISOString(),
        };
        await saveMessages(id, [...withUser, reply]);

        send({ type: "done" });
      } catch (err) {
        console.error("[ai/interview/message]", err);
        send({ type: "error", error: "The interviewer dropped the connection. Try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
