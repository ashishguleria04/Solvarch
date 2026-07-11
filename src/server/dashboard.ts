import { prisma } from "@/lib/prisma";

/** Per-topic solved/total for mastery bars and weak-area callouts. */
export async function getTopicProgress(userId: string) {
  const [topics, solvedRows] = await Promise.all([
    prisma.topic.findMany({
      where: { category: "DSA" },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        _count: { select: { problems: true } },
      },
    }),
    prisma.progress.findMany({
      where: { userId, status: "SOLVED" },
      select: { problem: { select: { topicId: true } } },
    }),
  ]);

  const solvedByTopic = new Map<string, number>();
  for (const row of solvedRows) {
    const t = row.problem.topicId;
    solvedByTopic.set(t, (solvedByTopic.get(t) ?? 0) + 1);
  }

  return topics
    .filter((t) => t._count.problems > 0)
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      solved: solvedByTopic.get(t.id) ?? 0,
      total: t._count.problems,
    }));
}

/** Latest submissions with their problem, for the activity feed. */
export async function getRecentSubmissions(userId: string, take = 6) {
  return prisma.submission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      status: true,
      language: true,
      createdAt: true,
      problem: { select: { slug: true, title: true, difficulty: true } },
    },
  });
}

export async function getInterviewCount(userId: string) {
  return prisma.interviewSession.count({ where: { userId, status: "COMPLETED" } });
}

/** Bookmarked problems with progress status. */
export async function getBookmarkedProblems(userId: string) {
  const rows = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      problem: {
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          isPremium: true,
          topic: { select: { name: true } },
        },
      },
    },
  });
  const progress = await prisma.progress.findMany({
    where: { userId, problemId: { in: rows.map((r) => r.problem.id) } },
    select: { problemId: true, status: true },
  });
  const statusMap = new Map(progress.map((p) => [p.problemId, p.status]));
  return rows.map((r) => ({
    ...r.problem,
    bookmarkedAt: r.createdAt,
    progress: statusMap.get(r.problem.id) ?? null,
  }));
}

/** Question bank grouped by category, ordered. */
export async function getQuestionBank() {
  return prisma.questionBankItem.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
}
