import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Difficulty } from "@prisma/client";

export type ProblemFilters = {
  topicSlug?: string;
  difficulty?: Difficulty;
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
