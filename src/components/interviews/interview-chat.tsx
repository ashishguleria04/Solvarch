"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Flag, Loader2, SendHorizonal, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/design-system/markdown";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string; createdAt: string };

export function InterviewChat({
  interviewId,
  initialMessages,
  interviewType,
}: {
  interviewId: string;
  initialMessages: Msg[];
  interviewType: string;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const busy = streamingText !== null || ending;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streamingText]);

  async function send() {
    const content = input.trim();
    if (!content || busy) return;
    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", content, createdAt: new Date().toISOString() },
    ]);
    setStreamingText("");

    try {
      const res = await fetch(`/api/ai/interview/${interviewId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "The interviewer didn't respond.");
        setStreamingText(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "delta") {
              full += data.text;
              setStreamingText(full);
            } else if (data.type === "error") {
              toast.error(data.error);
            }
          } catch {
            // partial JSON — wait for more
          }
        }
      }

      if (full) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: full, createdAt: new Date().toISOString() },
        ]);
      }
    } catch {
      toast.error("Connection lost. Your message may not have been delivered.");
    } finally {
      setStreamingText(null);
      textareaRef.current?.focus();
    }
  }

  async function endInterview() {
    if (busy) return;
    setEnding(true);
    try {
      const res = await fetch(`/api/ai/interview/${interviewId}/end`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't end the interview.");
        return;
      }
      router.refresh();
    } catch {
      toast.error("Couldn't end the interview. Try again.");
    } finally {
      setEnding(false);
    }
  }

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
          {streamingText !== null && (
            <MessageBubble
              role="assistant"
              content={streamingText || "…"}
              streaming
            />
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={Math.min(8, Math.max(2, input.split("\n").length))}
              placeholder={
                interviewType === "DSA"
                  ? "Answer, ask a clarifying question, or paste your code…"
                  : "Type your answer… (Enter to send, Shift+Enter for newline)"
              }
              className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 font-sans text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
              disabled={busy}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={send}
                disabled={busy || !input.trim()}
                size="icon"
                variant="glow"
                aria-label="Send"
              >
                {streamingText !== null ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <SendHorizonal className="size-4" />
                )}
              </Button>
              <Button
                onClick={endInterview}
                disabled={busy}
                size="icon"
                variant="outline"
                aria-label="End interview and get feedback"
                title="End interview & get feedback"
              >
                {ending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Flag className="size-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {ending
              ? "Generating your feedback report…"
              : "Finish with the flag button to get your scored feedback report."}
          </p>
        </div>
      </div>
    </>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
          isUser
            ? "bg-secondary text-foreground ring-border"
            : "bg-primary/10 text-primary ring-primary/20"
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3",
          isUser
            ? "rounded-tr-sm bg-primary/15"
            : "rounded-tl-sm border border-border bg-card",
          streaming && "opacity-90"
        )}
      >
        <Markdown className="text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {content}
        </Markdown>
      </div>
    </div>
  );
}
