import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, mapStripeStatus } from "@/lib/stripe";

/**
 * Stripe webhook: keeps the local Subscription table in sync.
 * Handled events:
 *  - checkout.session.completed  → link customer/subscription, flip to PRO
 *  - customer.subscription.updated → status/period/cancel-at-period-end sync
 *  - customer.subscription.deleted → downgrade to FREE
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[stripe/webhook] bad signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode !== "subscription") break;
        const userId = session.metadata?.userId;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (!userId || !subscriptionId) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await syncSubscription(userId, sub);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId =
          sub.metadata?.userId ??
          (await findUserIdByCustomer(
            typeof sub.customer === "string" ? sub.customer : sub.customer.id
          ));
        if (!userId) break;
        await syncSubscription(userId, sub);
        break;
      }
    }
  } catch (err) {
    // Non-2xx makes Stripe retry — desirable for transient DB errors.
    console.error(`[stripe/webhook] ${event.type} failed`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function findUserIdByCustomer(customerId: string): Promise<string | null> {
  const row = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
    select: { userId: true },
  });
  return row?.userId ?? null;
}

async function syncSubscription(userId: string, sub: Stripe.Subscription) {
  const status = mapStripeStatus(sub.status);
  const isActive = status === "ACTIVE" || status === "TRIALING";
  const item = sub.items.data[0];
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000)
    : null;

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: isActive ? "PRO" : "FREE",
      status,
      stripeCustomerId:
        typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      stripeSubscriptionId: sub.id,
      stripePriceId: item?.price.id ?? null,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
    update: {
      plan: isActive ? "PRO" : "FREE",
      status,
      stripeSubscriptionId: sub.id,
      stripePriceId: item?.price.id ?? null,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });
}
