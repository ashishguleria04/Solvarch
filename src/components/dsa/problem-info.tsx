import { Youtube, Clock, Database } from "lucide-react";
import type { Difficulty } from "@prisma/client";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { Markdown } from "@/components/design-system/markdown";
import { ExplainButton } from "@/components/ai/explain-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type Example = { input: string; output: string; explanation?: string };
export type Approach = {
  name: string;
  complexityTime: string;
  complexitySpace: string;
  body: string;
};

export function ProblemDescription({
  title,
  difficulty,
  tags,
  statement,
  constraints,
  examples,
  youtubeUrl,
}: {
  title: string;
  difficulty: Difficulty;
  tags: string[];
  statement: string;
  constraints?: string | null;
  examples: Example[];
  youtubeUrl?: string | null;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-1 text-xl font-semibold tracking-tight">{title}</h1>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <Markdown className="mt-4">{statement}</Markdown>

      {examples.length > 0 && (
        <div className="mt-5 space-y-3">
          {examples.map((ex, i) => (
            <div key={i} className="rounded-lg border border-border bg-card/50 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Example {i + 1}
              </div>
              <div className="space-y-2 font-mono text-sm">
                <div>
                  <span className="text-muted-foreground">Input:</span>
                  <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded bg-[#0b0b11] p-2 text-foreground/90 scrollbar-thin">
                    {ex.input}
                  </pre>
                </div>
                <div>
                  <span className="text-muted-foreground">Output:</span>
                  <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded bg-[#0b0b11] p-2 text-emerald-300 scrollbar-thin">
                    {ex.output}
                  </pre>
                </div>
                {ex.explanation && (
                  <p className="font-sans text-sm text-muted-foreground">
                    {ex.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {constraints && (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold">Constraints</h3>
          <Markdown>{constraints}</Markdown>
        </div>
      )}

      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Youtube className="size-4 text-rose-400" />
          Watch a video walkthrough
        </a>
      )}
    </div>
  );
}

export function ProblemEditorial({
  editorial,
  approaches,
  complexityTime,
  complexitySpace,
  title,
}: {
  editorial?: string | null;
  approaches?: Approach[] | null;
  complexityTime?: string | null;
  complexitySpace?: string | null;
  title: string;
}) {
  if (!editorial && (!approaches || approaches.length === 0)) {
    return (
      <p className="text-sm text-muted-foreground">
        The editorial for this problem is coming soon.
      </p>
    );
  }

  return (
    <div>
      {(complexityTime || complexitySpace) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {complexityTime && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
              <Clock className="size-3.5 text-primary" />
              Time {complexityTime}
            </span>
          )}
          {complexitySpace && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
              <Database className="size-3.5 text-primary" />
              Space {complexitySpace}
            </span>
          )}
        </div>
      )}

      {editorial && (
        <div>
          <Markdown>{editorial}</Markdown>
          <ExplainButton
            text={editorial}
            context={`the editorial for "${title}"`}
            className="mt-3"
          />
        </div>
      )}

      {approaches && approaches.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold">Approaches</h3>
          <Accordion type="single" collapsible className="w-full">
            {approaches.map((a, i) => (
              <AccordionItem key={i} value={`a-${i}`}>
                <AccordionTrigger className="text-sm">
                  <span className="flex items-center gap-2">
                    {a.name}
                    <span className="font-mono text-xs text-muted-foreground">
                      {a.complexityTime} · {a.complexitySpace}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <Markdown>{a.body}</Markdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
