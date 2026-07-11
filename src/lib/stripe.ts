import Stripe from "stripe";
import type { SubscriptionStatus } from "@prisma/client";

let client: Stripe | null = null;

export function isBillingConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PRICE_PRO_MONTHLY &&
    process.env.STRIPE_PRICE_PRO_ANNUAL
  );
}

/** Returns the Stripe client, or null if billing isn't configured. */
export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

export type BillingInterval = "monthly" | "annual";

export function priceIdFor(interval: BillingInterval): string {
  return interval === "annual"
    ? process.env.STRIPE_PRICE_PRO_ANNUAL!
    : process.env.STRIPE_PRICE_PRO_MONTHLY!;
}

export function appUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${base}${path}`;
}

/** Map a Stripe subscription status onto our enum (unknowns → CANCELED-safe). */
export function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "incomplete":
      return "INCOMPLETE";
    case "incomplete_expired":
      return "INCOMPLETE_EXPIRED";
    case "unpaid":
      return "UNPAID";
    default:
      return "CANCELED";
  }
}
