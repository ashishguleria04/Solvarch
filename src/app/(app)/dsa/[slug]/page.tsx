import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProblemBySlug } from "@/server/dsa";
import {
  getEntitlements,
  canAccessProblem,
  ALL_LANGUAGES,
  FREE_LANGUAGES,
} from "@/lib/entitlements";
import { ProblemDetailLayout } from "@/components/dsa/problem-detail-layout";
import { ProblemInfoTabs } from "@/components/dsa/problem-info-tabs";
import { ProblemPaywall } from "@/components/dsa/problem-paywall";
import {
  ProblemDescription,
  ProblemEditorial,
  type Example,
  type Approach,
} from "@/components/dsa/problem-info";
import { ProblemHints } from "@/components/dsa/problem-hints";
import { EditorWorkspace } from "@/components/editor/editor-workspace";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = await getProblemBySlug(slug);
  return { title: problem?.title ?? "Problem" };
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [problem, { userId, isPro }] = await Promise.all([
    getProblemBySlug(slug),
    getEntitlements(),
  ]);

  if (!problem) notFound();

  if (!canAccessProblem(problem, isPro)) {
    return <ProblemPaywall title={problem.title} difficulty={problem.difficulty} />;
  }

  const bookmarked = userId
    ? !!(await prisma.bookmark.findUnique({
        where: { userId_problemId: { userId, problemId: problem.id } },
      }))
    : false;

  const examples = (problem.examples as unknown as Example[]) ?? [];
  const hints = (problem.hints as unknown as string[]) ?? [];
  const approaches = (problem.approaches as unknown as Approach[] | null) ?? null;
  const starterCode = (problem.starterCode as unknown as Record<string, string>) ?? {};
  const allowedLanguages = isPro ? [...ALL_LANGUAGES] : FREE_LANGUAGES;

  const info = (
    <ProblemInfoTabs
      problemId={problem.id}
      bookmarked={bookmarked}
      description={
        <ProblemDescription
          title={problem.title}
          difficulty={problem.difficulty}
          tags={problem.tags}
          statement={problem.statement}
          constraints={problem.constraints}
          examples={examples}
          youtubeUrl={problem.youtubeUrl}
        />
      }
      editorial={
        <ProblemEditorial
          title={problem.title}
          editorial={problem.editorial}
          approaches={approaches}
          complexityTime={problem.complexityTime}
          complexitySpace={problem.complexitySpace}
        />
      }
      hints={<ProblemHints hints={hints} slug={problem.slug} />}
    />
  );

  const workspace = (
    <EditorWorkspace
      slug={problem.slug}
      starterCode={starterCode}
      allowedLanguages={allowedLanguages}
      isPro={isPro}
    />
  );

  return <ProblemDetailLayout info={info} workspace={workspace} />;
}
