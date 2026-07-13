import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProblem, problems } from "@/data/dsa";
import { ProblemDetailLayout } from "@/components/dsa/problem-detail-layout";
import { ProblemInfoTabs } from "@/components/dsa/problem-info-tabs";
import {
  ProblemDescription,
  ProblemEditorial,
} from "@/components/dsa/problem-info";
import { ProblemHints } from "@/components/dsa/problem-hints";
import { EditorWorkspace } from "@/components/editor/editor-workspace";

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProblem(slug)?.title ?? "Problem" };
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getProblem(slug);

  if (!problem) notFound();

  const info = (
    <ProblemInfoTabs
      description={
        <ProblemDescription
          title={problem.title}
          difficulty={problem.difficulty}
          tags={problem.tags}
          statement={problem.statement}
          constraints={problem.constraints}
          examples={problem.examples}
          youtubeUrl={problem.youtubeUrl}
        />
      }
      editorial={
        <ProblemEditorial
          editorial={problem.editorial}
          approaches={problem.approaches}
          complexityTime={problem.complexityTime}
          complexitySpace={problem.complexitySpace}
        />
      }
      hints={<ProblemHints hints={problem.hints} />}
    />
  );

  const workspace = <EditorWorkspace slug={problem.slug} starterCode={problem.starterCode} />;

  return <ProblemDetailLayout info={info} workspace={workspace} />;
}
