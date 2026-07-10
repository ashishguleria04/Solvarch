import { prisma } from "@/lib/prisma";

function utcDayString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Current consecutive-day activity streak (anchored to today or yesterday). */
export async function getStreak(userId: string): Promise<number> {
  const rows = await prisma.dailyActivity.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    select: { date: true },
    take: 400,
  });
  if (rows.length === 0) return 0;

  const days = new Set(rows.map((r) => utcDayString(r.date)));
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  // Anchor: if nothing today, allow the streak to end yesterday.
  if (!days.has(utcDayString(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!days.has(utcDayString(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(utcDayString(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

/** Record activity for today (used when a user solves/submits). */
export async function recordActivity(userId: string): Promise<void> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  await prisma.dailyActivity.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, count: 1 },
    update: { count: { increment: 1 } },
  });
}
