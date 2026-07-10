import Link from "next/link";
import { CheckCircle2, Circle, CircleDot, Lock } from "lucide-react";
import type { Difficulty, ProgressStatus } from "@prisma/client";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { BookmarkButton } from "@/components/dsa/bookmark-button";
import { cn } from "@/lib/utils";

type ProblemRow = {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  isPremium: boolean;
  topic: { name: string; slug: string };
};

function StatusIcon({ status }: { status?: ProgressStatus }) {
  if (status === "SOLVED")
    return <CheckCircle2 className="size-5 text-emerald-400" />;
  if (status === "ATTEMPTED")
    return <CircleDot className="size-5 text-amber-400" />;
  return <Circle className="size-5 text-muted-foreground/40" />;
}

export function ProblemList({
  problems,
  progress,
  bookmarks,
  isPro,
}: {
  problems: ProblemRow[];
  progress: Map<string, ProgressStatus>;
  bookmarks: Set<string>;
  isPro: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="hidden grid-cols-[auto_1fr_auto_auto_auto] gap-4 border-b border-border bg-card/50 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
        <span className="w-5" />
        <span>Problem</span>
        <span className="w-28">Topic</span>
        <span className="w-20">Difficulty</span>
        <span className="w-8" />
      </div>
      <ul className="divide-y divide-border">
        {problems.map((p) => {
          const locked = p.isPremium && !isPro;
          return (
            <li
              key={p.id}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 md:grid-cols-[auto_1fr_auto_auto_auto] md:gap-4"
            >
              <StatusIcon status={progress.get(p.id)} />

              <div className="min-w-0">
                <Link
                  href={`/dsa/${p.slug}`}
                  className="flex items-center gap-2 truncate font-medium hover:text-primary"
                >
                  <span className="truncate">{p.title}</span>
                  {locked && <Lock className="size-3.5 shrink-0 text-primary" />}
                </Link>
                <div className="mt-1 flex items-center gap-2 md:hidden">
                  <span className="text-xs text-muted-foreground">{p.topic.name}</span>
                  <DifficultyBadge difficulty={p.difficulty} />
                </div>
              </div>

              <span className="hidden w-28 truncate text-sm text-muted-foreground md:block">
                {p.topic.name}
              </span>
              <span className="hidden w-20 md:block">
                <DifficultyBadge difficulty={p.difficulty} />
              </span>

              <BookmarkButton problemId={p.id} initial={bookmarks.has(p.id)} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
