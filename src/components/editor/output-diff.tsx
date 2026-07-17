"use client";

// Side-by-side expected vs. actual output for failed test cases, aligned
// line-by-line with differing lines highlighted. Purely presentational.

import { cn } from "@/lib/utils";

type DiffLine = {
  expected: string | null;
  actual: string | null;
  same: boolean;
};

function buildLines(expected: string, actual: string): DiffLine[] {
  const exp = expected.replace(/\r\n/g, "\n").split("\n");
  const act = actual.replace(/\r\n/g, "\n").split("\n");
  const rows: DiffLine[] = [];
  for (let i = 0; i < Math.max(exp.length, act.length); i++) {
    const e = i < exp.length ? exp[i] : null;
    const a = i < act.length ? act[i] : null;
    rows.push({ expected: e, actual: a, same: e !== null && e === a });
  }
  return rows;
}

function DiffColumn({
  title,
  lines,
  side,
}: {
  title: string;
  lines: DiffLine[];
  side: "expected" | "actual";
}) {
  return (
    <div className="min-w-0">
      <div
        className={cn(
          "border-b border-border px-2.5 py-1.5 font-sans text-[11px] font-medium uppercase tracking-wide",
          side === "expected" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
        )}
      >
        {title}
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        {lines.map((line, i) => {
          const text = side === "expected" ? line.expected : line.actual;
          return (
            <div
              key={i}
              className={cn(
                "flex min-h-5 whitespace-pre px-2.5 leading-5",
                !line.same &&
                  (side === "expected"
                    ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                    : "bg-rose-500/10 text-rose-800 dark:text-rose-200"),
                line.same && "text-foreground/70"
              )}
            >
              <span className="mr-2.5 w-5 shrink-0 select-none text-right text-muted-foreground/40">
                {text !== null ? i + 1 : ""}
              </span>
              {text !== null ? (
                text || " "
              ) : (
                <span className="select-none text-muted-foreground/30">∅</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Expected vs. actual, side-by-side, differing lines highlighted. */
export function OutputDiff({
  expected,
  actual,
  className,
}: {
  expected: string;
  actual: string;
  className?: string;
}) {
  const lines = buildLines(expected.trimEnd(), actual.trimEnd());

  return (
    <div
      className={cn(
        "grid grid-cols-2 divide-x divide-border overflow-hidden rounded-lg border border-border bg-code font-mono text-xs",
        className
      )}
    >
      <DiffColumn title="Expected" lines={lines} side="expected" />
      <DiffColumn title="Your output" lines={lines} side="actual" />
    </div>
  );
}
