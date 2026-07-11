import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, isBillingConfigured, priceIdFor, appUrl } from "@/lib/stripe";

const schema = z.object({
  interval: z.enum(["monthly", "annual"]).default("monthly"),
});

/** Create a Stripe Checkout session for the Pro subscription. */
export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to upgrade." }, { status: 401 });
  }
  if (!isBillingConfigured()) {
    return NextResponse.json(
      { error: "Billing isn't configured yet. Add the Stripe keys to enable upgrades." },
      { status: 503 }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const stripe = getStripe()!;
  const existing = await prisma.subscription.findUnique({ where: { userId } });

  // Already Pro? Send them to the portal instead of double-subscribing.
  if (existing?.plan === "PRO" && existing.status === "ACTIVE") {
    return NextResponse.json(
      { error: "You're already on Pro. Manage your plan from Settings." },
      { status: 409 }
    );
  }

  try {
    // Reuse the Stripe customer if we have one; otherwise create it now so
    // the webhook can match the subscription back to this user.
    let customerId = existing?.stripeCustomerId ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, stripeCustomerId: customerId },
        update: { stripeCustomerId: customerId },
      });
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceIdFor(parsed.data.interval), quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: { metadata: { userId } },
      metadata: { userId },
      success_url: appUrl("/dashboard?upgraded=1"),
      cancel_url: appUrl("/pricing"),
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json(
      { error: "Couldn't start checkout. Please try again." },
      { status: 502 }
    );
  }
}
