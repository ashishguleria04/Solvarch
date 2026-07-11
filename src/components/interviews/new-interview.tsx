"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code2, Network, Users, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TYPES = [
  {
    type: "DSA",
    label: "DSA Coding",
    description: "A classic algorithm problem — clarify, code, and defend complexity.",
    icon: Code2,
  },
  {
    type: "SYSTEM_DESIGN",
    label: "System Design",
    description: "Design a real system — requirements, architecture, trade-offs.",
    icon: Network,
  },
  {
    type: "BEHAVIORAL",
    label: "Behavioral",
    description: "STAR stories under pressure — conflict, failure, leadership.",
    icon: Users,
  },
] as const;

export function NewInterview({ quotaExhausted }: { quotaExhausted: boolean }) {
  const router = useRouter();
  const [starting, setStarting] = useState<string | null>(null);

  async function start(type: string) {
    setStarting(type);
    try {
      const res = await fetch("/api/ai/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't start the interview.");
        return;
      }
      router.push(`/interviews/${data.id}`);
    } catch {
      toast.error("Couldn't reach the interviewer. Check your connection.");
    } finally {
      setStarting(null);
    }
  }

  if (quotaExhausted) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <Sparkles className="size-6 text-primary" />
        <p className="max-w-md text-sm text-muted-foreground">
          You&apos;ve used your free interview this month. Pro members get
          unlimited AI mock interviews across all three formats.
        </p>
        <Button asChild variant="glow">
          <Link href="/pricing">Upgrade to Pro</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TYPES.map(({ type, label, description, icon: Icon }) => (
        <button
          key={type}
          onClick={() => start(type)}
          disabled={starting !== null}
          className="group text-left disabled:opacity-60"
        >
          <Card className="h-full gap-0 p-5 transition-colors group-hover:border-primary/40">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
              {starting === type ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Icon className="size-5" />
              )}
            </div>
            <h3 className="mt-3 font-semibold tracking-tight transition-colors group-hover:text-primary">
              {label}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </Card>
        </button>
      ))}
    </div>
  );
}
