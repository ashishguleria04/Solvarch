import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Difficulty, ProgressStatus } from "@prisma/client";

export type ProblemFilters = {
  topicSlug?: string;
  difficulty?: Difficulty;
  status?: "solved" | "attempted" | "todo";
  search?: string;
};

/** All DSA topics with problem counts, ordered. */
export const getDsaTopics = cache(async () => {
  return prisma.topic.findMany({
    where: { category: "DSA" },
    orderBy: { order: "asc" },
    include: { _count: { select: { problems: true } } },
  });
});

/** A user's progress map: problemId -> status. */
export async function getUserProgressMap(
  userId: string | null
): Promise<Map<string, ProgressStatus>> {
  if (!userId) return new Map();
  const rows = await prisma.progress.findMany({
    where: { userId },
    select: { problemId: true, status: true },
  });
  return new Map(rows.map((r) => [r.problemId, r.status]));
}

/** A user's bookmarked problem ids. */
export async function getUserBookmarkSet(
  userId: string | null
): Promise<Set<string>> {
  if (!userId) return new Set();
  const rows = await prisma.bookmark.findMany({
    where: { userId },
    select: { problemId: true },
  });
  return new Set(rows.map((r) => r.problemId));
}

/** Problem list with filters, ordered by topic then order. */
export async function getProblems(filters: ProblemFilters = {}) {
  const { topicSlug, difficulty, search } = filters;
  return prisma.problem.findMany({
    where: {
      ...(topicSlug ? { topic: { slug: topicSlug } } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(search
        ? { title: { contains: search, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: [{ topic: { order: "asc" } }, { order: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      difficulty: true,
      isPremium: true,
      tags: true,
      topic: { select: { name: true, slug: true } },
    },
  });
}

/** Full problem detail by slug (with sample test cases only). */
export const getProblemBySlug = cache(async (slug: string) => {
  return prisma.problem.findUnique({
    where: { slug },
    include: {
      topic: true,
      testCases: {
        where: { isSample: true },
        orderBy: { order: "asc" },
      },
    },
  });
});

/** Aggregate solved/attempted counts for a user. */
export async function getUserDsaStats(userId: string | null) {
  if (!userId) return { solved: 0, attempted: 0, total: 0 };
  const [total, solved, attempted] = await Promise.all([
    prisma.problem.count(),
    prisma.progress.count({ where: { userId, status: "SOLVED" } }),
    prisma.progress.count({ where: { userId, status: "ATTEMPTED" } }),
  ]);
  return { solved, attempted, total };
}
