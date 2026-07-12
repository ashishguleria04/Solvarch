import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { dsaTopics } from "./topics";
import { questions } from "./questions";
import type { SeedProblem } from "./types";

const prisma = new PrismaClient();

/** First ~20% of a topic's problems are free; the rest are Pro. */
function premiumFlags(count: number): boolean[] {
  const freeCount = Math.max(1, Math.ceil(count * 0.2));
  return Array.from({ length: count }, (_, i) => i >= freeCount);
}

async function seedProblem(
  topicId: string,
  problem: SeedProblem,
  order: number,
  isPremium: boolean
) {
  const testCases = problem.tests.map((t, i) => ({
    input: t.input,
    expectedOutput: problem.reference(t.input),
    isSample: !!t.sample,
    order: i,
  }));

  const data = {
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty,
    topicId,
    order,
    statement: problem.statement,
    constraints: problem.constraints ?? null,
    examples: problem.examples,
    hints: problem.hints,
    editorial: problem.editorial ?? null,
    approaches: problem.approaches ?? undefined,
    complexityTime: problem.complexityTime ?? null,
    complexitySpace: problem.complexitySpace ?? null,
    youtubeUrl: problem.youtubeUrl ?? null,
    starterCode: problem.starterCode,
    tags: problem.tags,
    isPremium,
  };

  const saved = await prisma.problem.upsert({
    where: { slug: problem.slug },
    create: data,
    update: data,
  });

  // Rebuild test cases idempotently.
  await prisma.testCase.deleteMany({ where: { problemId: saved.id } });
  await prisma.testCase.createMany({
    data: testCases.map((tc) => ({ ...tc, problemId: saved.id })),
  });

  return saved;
}

async function main() {
  console.log("🌱 Seeding Solvarch…");

  let problemCount = 0;
  for (const topic of dsaTopics) {
    const savedTopic = await prisma.topic.upsert({
      where: { slug: topic.slug },
      create: {
        slug: topic.slug,
        name: topic.name,
        category: "DSA",
        description: topic.description,
        icon: topic.icon,
        order: topic.order,
      },
      update: {
        name: topic.name,
        description: topic.description,
        icon: topic.icon,
        order: topic.order,
      },
    });

    const flags = premiumFlags(topic.problems.length);
    for (let i = 0; i < topic.problems.length; i++) {
      await seedProblem(savedTopic.id, topic.problems[i], i, flags[i]);
      problemCount++;
    }
    if (topic.problems.length > 0) {
      console.log(`  ✓ ${topic.name}: ${topic.problems.length} problems`);
    }
  }

  // Question bank (idempotent by question text is awkward without a unique key,
  // so wipe and reinsert).
  await prisma.questionBankItem.deleteMany({});
  await prisma.questionBankItem.createMany({
    data: questions.map((q, i) => ({
      category: q.category,
      question: q.question,
      modelAnswer: q.modelAnswer,
      tips: q.tips ?? null,
      tags: q.tags,
      order: i,
      // First question in each category is a free preview; rest are Pro.
      isPremium: questions.filter((x) => x.category === q.category).indexOf(q) >= 2,
    })),
  });

  console.log(`  ✓ Question bank: ${questions.length} questions`);
  console.log(`✅ Done. Seeded ${problemCount} problems across ${dsaTopics.length} topics.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
