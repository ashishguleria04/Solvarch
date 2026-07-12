import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProblemBySlug } from "@/server/dsa";
import { ProblemDetailLayout } from "@/components/dsa/problem-detail-layout";
import { ProblemInfoTabs } from "@/components/dsa/problem-info-tabs";
import {
  ProblemDescription,
  ProblemEditorial,
  type Example,
  type Approach,
} from "@/components/dsa/problem-info";
import { ProblemHints } from "@/components/dsa/problem-hints";
import { EditorWorkspace } from "@/components/editor/editor-workspace";

// DB-backed (problem lookup by slug); render per request, never prerender at build.
export const dynamic = "force-dynamic";

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
  const problem = await getProblemBySlug(slug);

  if (!problem) notFound();

  const examples = (problem.examples as unknown as Example[]) ?? [];
  const hints = (problem.hints as unknown as string[]) ?? [];
  const approaches = (problem.approaches as unknown as Approach[] | null) ?? null;
  const starterCode = (problem.starterCode as unknown as Record<string, string>) ?? {};

  const info = (
    <ProblemInfoTabs
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

  const workspace = <EditorWorkspace slug={problem.slug} starterCode={starterCode} />;

  return <ProblemDetailLayout info={info} workspace={workspace} />;
}
