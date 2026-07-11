import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getEntitlements } from "@/lib/entitlements";
import { PricingTable } from "@/components/marketing/pricing-table";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free forever for the fundamentals. Pro unlocks the full problem bank, case studies, and unlimited AI interviews.",
};

export default async function PricingPage() {
  const session = await auth();
  const { isPro } = await getEntitlements();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          Invest in your next offer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          The fundamentals are free forever. Pro unlocks everything you need to
          walk into interviews over-prepared.
        </p>
      </div>

      <PricingTable isAuthenticated={!!session?.user} isPro={isPro} />

      <div className="mx-auto mt-14 grid max-w-3xl gap-6 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          <h3 className="font-medium text-foreground">Cancel anytime</h3>
          <p className="mt-1">
            Manage or cancel from Settings. You keep Pro until the end of the
            period you paid for — no partial lockouts.
          </p>
        </div>
        <div>
          <h3 className="font-medium text-foreground">What's free, exactly?</h3>
          <p className="mt-1">
            All CS fundamentals, the first problems of every DSA topic, HLD/LLD
            concept guides, and one AI mock interview each month.
          </p>
        </div>
      </div>
    </div>
  );
}
