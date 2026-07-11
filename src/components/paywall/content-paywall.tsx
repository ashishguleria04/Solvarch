import Link from "next/link";
import { Lock, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  "Every system design case study, end to end",
  "All 150 DSA problems with full editorials",
  "Unlimited AI mock interviews",
  "All 4 editor languages",
];

/**
 * Inline gate rendered below a free preview of premium content.
 * Fades the preview out and pitches the upgrade without dead-ending the page.
 */
export function ContentPaywall({ title }: { title: string }) {
  return (
    <div className="relative mt-[-6rem]">
      <div className="pointer-events-none h-24 bg-gradient-to-b from-transparent to-background" />
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.07] to-card p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          <Lock className="size-5" />
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight">
          Keep reading “{title}”
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
          The full write-up — capacity estimation, architecture deep dives, and
          trade-offs — is part of Solvarch Pro.
        </p>
        <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-sm">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-primary" />
              {p}
            </li>
          ))}
        </ul>
        <Button asChild variant="glow" size="lg" className="mt-6">
          <Link href="/pricing">
            <Sparkles className="size-4" />
            Upgrade to Pro
          </Link>
        </Button>
      </div>
    </div>
  );
}
