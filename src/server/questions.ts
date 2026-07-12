import { prisma } from "@/lib/prisma";

/** Question bank grouped by category, ordered. */
export async function getQuestionBank() {
  return prisma.questionBankItem.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
}
