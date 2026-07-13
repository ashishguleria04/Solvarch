import Link from "next/link";
import type { Difficulty } from "@/data/dsa";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";

type ProblemRow = {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topic: { name: string; slug: string };
};

export function ProblemList({ problems }: { problems: ProblemRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="hidden grid-cols-[auto_1fr_auto] gap-4 border-b border-border bg-card/50 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
        <span className="w-28">Topic</span>
        <span>Problem</span>
        <span className="w-20">Difficulty</span>
      </div>
      <ul className="divide-y divide-border">
        {problems.map((p) => (
          <li
            key={p.id}
            className="group grid grid-cols-1 items-center gap-1 px-4 py-3 transition-colors hover:bg-accent/40 md:grid-cols-[auto_1fr_auto] md:gap-4"
          >
            <span className="order-2 hidden w-28 truncate text-sm text-muted-foreground md:order-1 md:block">
              {p.topic.name}
            </span>

            <Link
              href={`/dsa/${p.slug}`}
              className="order-1 truncate font-medium hover:text-primary md:order-2"
            >
              {p.title}
            </Link>

            <div className="order-3 flex items-center gap-2 md:hidden">
              <span className="text-xs text-muted-foreground">{p.topic.name}</span>
              <DifficultyBadge difficulty={p.difficulty} />
            </div>

            <span className="order-3 hidden w-20 md:block">
              <DifficultyBadge difficulty={p.difficulty} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
