import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitSchema } from "@/lib/validations/dsa";
import { submitSolution } from "@/server/judge";

export async function POST(req: Request) {
  const parsed = submitSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { slug, language, code } = parsed.data;

  const problem = await prisma.problem.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });

  const result = await submitSolution({ slug, language, code });
  return NextResponse.json(result);
}
