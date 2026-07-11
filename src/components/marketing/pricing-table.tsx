"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "First problems of every DSA topic",
  "All CS fundamentals (OS, DBMS, Networks, OOP)",
  "HLD & LLD concept guides",
  "1 AI mock interview / month",
  "Python in the code editor",
  "Progress tracking & bookmarks",
];

const PRO_FEATURES = [
  "All 150 DSA problems with full editorials",
  "Every system design case study",
  "Unlimited AI mock interviews",
  "AI hints & explanations everywhere",
  "Python, JavaScript, Java & C++ in the editor",
  "Full question bank with model answers",
  "Progress analytics",
];

const PRICES = {
  monthly: { amount: 15, per: "/month", note: "billed monthly" },
  annual: { amount: 9, per: "/month", note: "billed $108 yearly — save 40%" },
} as const;

export function PricingTable({
  isAuthenticated,
  isPro,
}: {
  isAuthenticated: boolean;
  isPro: boolean;
}) {
  const router = useRouter();
  const [interval, setInterval] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    if (!isAuthenticated) {
      router.push("/register?next=/pricing");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't start checkout.");
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Couldn't reach billing. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const price = PRICES[interval];

  return (
    <>
      <div className="mt-10 flex justify-center">
        <div className="inline-flex rounded-full border border-border bg-card p-1">
          {(["monthly", "annual"] as const).map((iv) => (
            <button
              key={iv}
              onClick={() => setInterval(iv)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                interval === iv
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {iv === "monthly" ? "Monthly" : "Annual · save 40%"}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-card/40 p-7">
          <h2 className="font-semibold">Free</h2>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">$0</span>
            <span className="text-sm text-muted-foreground">forever</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything you need to start preparing seriously.
          </p>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Go to dashboard" : "Start free"}
            </Link>
          </Button>
          <ul className="mt-6 space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/[0.08] to-card p-7 shadow-[0_0_40px_-12px] shadow-primary/30">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Pro</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
              <Sparkles className="size-3" />
              Most popular
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">
              ${price.amount}
            </span>
            <span className="text-sm text-muted-foreground">{price.per}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{price.note}</p>
          <Button
            variant="glow"
            className="mt-6 w-full"
            onClick={upgrade}
            disabled={loading || isPro}
          >
            {isPro ? (
              "You're on Pro"
            ) : loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Upgrade to Pro"
            )}
          </Button>
          <ul className="mt-6 space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
