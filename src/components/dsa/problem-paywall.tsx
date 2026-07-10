import Link from "next/link";
import { Lock, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import type { Difficulty } from "@prisma/client";

const perks = [
  "All 150+ DSA problems",
  "Every system design case study",
  "Unlimited AI mock interviews",
  "All 4 editor languages",
];

export function ProblemPaywall({
  title,
  difficulty,
}: {
  title: string;
  difficulty: Difficulty;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          <Lock className="size-6" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <DifficultyBadge difficulty={difficulty} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          This problem is part of Solvarch Pro. Upgrade to unlock it and everything
          else.
        </p>

        <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-primary" />
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col items-center gap-3">
          <Button asChild variant="glow" size="lg" className="w-full max-w-xs">
            <Link href="/pricing">
              <Sparkles className="size-4" />
              Upgrade to Pro
            </Link>
          </Button>
          <Link
            href="/dsa"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to problems
          </Link>
        </div>
      </div>
    </div>
  );
}
