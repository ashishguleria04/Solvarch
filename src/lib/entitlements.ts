import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const ALL_LANGUAGES = ["python", "javascript", "java", "cpp"] as const;
export type LanguageId = (typeof ALL_LANGUAGES)[number];

/** Free tier can only use Python in the editor. */
export const FREE_LANGUAGES: LanguageId[] = ["python"];

/** Free tier gets this many AI mock interviews per calendar month. */
export const FREE_MONTHLY_INTERVIEWS = 1;

export type Entitlements = {
  isAuthenticated: boolean;
  userId: string | null;
  plan: "FREE" | "PRO";
  isPro: boolean;
};

/**
 * Resolve the current viewer's plan + entitlements.
 * Cached per-request so repeated calls in a render tree hit the DB once.
 */
export const getEntitlements = cache(async (): Promise<Entitlements> => {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (!userId) {
    return { isAuthenticated: false, userId: null, plan: "FREE", isPro: false };
  }

  const sub = await prisma.subscription.findUnique({ where: { userId } });
  const active =
    sub?.status === "ACTIVE" || sub?.status === "TRIALING";
  const notExpired =
    !sub?.currentPeriodEnd || sub.currentPeriodEnd.getTime() > Date.now();
  const isPro = !!sub && sub.plan === "PRO" && active && notExpired;

  return {
    isAuthenticated: true,
    userId,
    plan: isPro ? "PRO" : "FREE",
    isPro,
  };
});

/** Whether a given problem is unlocked for a viewer. */
export function canAccessProblem(
  problem: { isPremium: boolean },
  isPro: boolean
): boolean {
  return !problem.isPremium || isPro;
}

/** Whether a language is available in the editor for a viewer. */
export function canUseLanguage(language: string, isPro: boolean): boolean {
  return isPro || FREE_LANGUAGES.includes(language as LanguageId);
}

/** How many AI interviews the viewer has left this calendar month. */
export async function remainingInterviews(
  userId: string,
  isPro: boolean
): Promise<number> {
  if (isPro) return Infinity;
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const used = await prisma.interviewSession.count({
    where: { userId, createdAt: { gte: start } },
  });
  return Math.max(0, FREE_MONTHLY_INTERVIEWS - used);
}
