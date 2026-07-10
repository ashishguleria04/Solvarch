import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UpgradeCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-b from-primary/10 to-card p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <span className="text-sm font-semibold">Go Pro</span>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Unlock all problems, full case studies, and unlimited AI interviews.
      </p>
      <Button asChild variant="glow" size="sm" className="mt-3 w-full">
        <Link href="/pricing">Upgrade</Link>
      </Button>
    </div>
  );
}
