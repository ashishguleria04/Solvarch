import Link from "next/link";
import { topics } from "@/data/dsa";
import { companies } from "@/data/companies";

type Chip = { key: string; href: string; label: string; meta?: string };

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Chip[];
  reverse?: boolean;
}) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex w-max gap-3 pr-3 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {loop.map((c, i) => {
          const dup = i >= items.length;
          return (
            <Link
              key={`${c.key}-${i}`}
              href={c.href}
              aria-hidden={dup || undefined}
              tabIndex={dup ? -1 : undefined}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {c.label}
              {c.meta && (
                <span className="font-mono text-xs text-muted-foreground/60">
                  {c.meta}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Two counter-drifting strips — DSA topics above, companies below. Pauses on hover. */
export function TopicMarquee() {
  const topicChips: Chip[] = topics.map((t) => ({
    key: t.slug,
    href: `/dsa?topic=${t.slug}`,
    label: t.name,
    meta: String(t.problemCount),
  }));
  const companyChips: Chip[] = companies.map((c) => ({
    key: c.slug,
    href: `/companies/${c.slug}`,
    label: c.name,
    meta: String(c.questions.length),
  }));

  return (
    <div className="marquee-paused space-y-3">
      <MarqueeRow items={topicChips} />
      <MarqueeRow items={companyChips} reverse />
    </div>
  );
}
