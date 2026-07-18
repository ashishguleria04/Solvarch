import Link from "next/link";
import { topics } from "@/data/dsa";

/** Infinite horizontal strip of DSA topics; pauses on hover. */
export function TopicMarquee() {
  const loop = [...topics, ...topics];
  return (
    <div className="marquee-paused relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marquee flex w-max gap-3 pr-3">
        {loop.map((t, i) => (
          <Link
            key={`${t.slug}-${i}`}
            href={`/dsa?topic=${t.slug}`}
            aria-hidden={i >= topics.length || undefined}
            tabIndex={i >= topics.length ? -1 : undefined}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {t.name}
            <span className="font-mono text-xs text-muted-foreground/60">
              {t.problemCount}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
