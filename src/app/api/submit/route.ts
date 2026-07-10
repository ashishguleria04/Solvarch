import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEntitlements, canUseLanguage, canAccessProblem } from "@/lib/entitlements";
import { submitSchema } from "@/lib/validations/dsa";
import { submitSolution } from "@/server/judge";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = submitSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { slug, language, code } = parsed.data;

  const { isPro } = await getEntitlements();
  if (!canUseLanguage(language, isPro)) {
    return NextResponse.json(
      { error: "Upgrade to Pro to use this language.", upgrade: true },
      { status: 403 }
    );
  }

  const problem = await prisma.problem.findUnique({
    where: { slug },
    select: { id: true, isPremium: true },
  });
  if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  if (!canAccessProblem(problem, isPro)) {
    return NextResponse.json(
      { error: "This is a Pro problem.", upgrade: true },
      { status: 403 }
    );
  }

  const result = await submitSolution({
    userId: session.user.id,
    problemId: problem.id,
    slug,
    language,
    code,
  });
  return NextResponse.json(result);
}
