import type { Metadata } from "next";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEntitlements } from "@/lib/entitlements";
import { PageHeader } from "@/components/design-system/page-header";
import { Card } from "@/components/ui/card";
import { ManageBillingButton, SignOutButton } from "@/components/settings/settings-actions";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const { isPro, plan } = await getEntitlements();
  const sub = userId
    ? await prisma.subscription.findUnique({ where: { userId } })
    : null;

  return (
    <div className="max-w-2xl space-y-6 p-6 lg:p-8">
      <PageHeader title="Settings" description="Your account and subscription." />

      <Card className="gap-0 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Profile
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{session?.user?.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{session?.user?.email ?? "—"}</dd>
          </div>
        </dl>
      </Card>

      <Card className="gap-0 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Subscription
        </h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm">
              You're on the{" "}
              <span className={isPro ? "font-semibold text-primary" : "font-semibold"}>
                {plan}
              </span>{" "}
              plan.
            </p>
            {isPro && sub?.currentPeriodEnd && (
              <p className="mt-1 text-xs text-muted-foreground">
                {sub.cancelAtPeriodEnd ? "Ends" : "Renews"} on{" "}
                {format(sub.currentPeriodEnd, "MMMM d, yyyy")}
              </p>
            )}
            {!isPro && (
              <p className="mt-1 text-xs text-muted-foreground">
                Pro unlocks all problems, case studies, and unlimited AI interviews.
              </p>
            )}
          </div>
          <ManageBillingButton isPro={isPro} hasBilling={!!sub?.stripeCustomerId} />
        </div>
      </Card>

      <Card className="gap-0 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Session
        </h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Sign out of Solvarch on this device.
          </p>
          <SignOutButton />
        </div>
      </Card>
    </div>
  );
}
