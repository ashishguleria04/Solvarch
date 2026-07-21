import {
  Building2,
  Code2,
  Cpu,
  Flame,
  LayoutDashboard,
  Map,
  Network,
  RefreshCcw,
} from "lucide-react";

/* Deterministic 12×7 activity grid for the showcase heatmap (levels 0–4). */
// prettier-ignore
const HEAT = [
  0,1,0,2,3,1,0,2,4,3,1,0,
  1,0,2,3,1,0,3,4,2,1,0,2,
  0,2,1,0,4,2,1,0,3,2,4,1,
  2,0,3,1,2,0,4,2,1,0,3,1,
  1,3,0,2,0,1,2,4,0,2,1,3,
  0,1,2,0,3,1,0,2,1,4,2,0,
  3,0,1,2,0,4,1,0,2,1,0,3,
];

const heatClass = [
  "bg-primary/10",
  "bg-primary/30",
  "bg-primary/50",
  "bg-primary/70",
  "bg-primary/90",
];

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Code2, label: "DSA" },
  { icon: Network, label: "System design" },
  { icon: Cpu, label: "CS theory" },
  { icon: Map, label: "Roadmaps" },
  { icon: Building2, label: "Companies" },
];

const RING = { r: 34, c: 2 * Math.PI * 34, pct: 68 };

/**
 * Faux product screenshot — a framed dashboard window that shows what the app
 * actually feels like (progress ring, streak, heatmap, coverage) rather than
 * an abstract illustration. Pure markup, theme-aware, no client JS.
 */
export function AppShowcase() {
  return (
    <div className="glow-soft overflow-hidden rounded-2xl border border-border bg-card">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
        <span className="size-3 rounded-full bg-rose-500/70" />
        <span className="size-3 rounded-full bg-amber-500/70" />
        <span className="size-3 rounded-full bg-emerald-500/70" />
        <div className="mx-auto hidden items-center rounded-md border border-border bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground sm:flex">
          solvarch.app/progress
        </div>
      </div>

      <div className="grid sm:grid-cols-[13rem_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-1 border-r border-border bg-sidebar/40 p-3 sm:flex">
          {nav.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                item.active
                  ? "bg-primary/10 font-medium text-primary ring-1 ring-primary/20 ring-inset"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main panel */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs tracking-wide text-muted-foreground uppercase">
                Your progress
              </div>
              <h3 className="mt-0.5 text-lg font-semibold">Dashboard</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm">
              <Flame className="size-4 text-amber-500 dark:text-amber-400" />
              <span className="font-semibold">12</span>
              <span className="text-muted-foreground">day streak</span>
            </div>
          </div>

          {/* Ring + stats */}
          <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="relative mx-auto size-[92px] sm:mx-0">
              <svg viewBox="0 0 80 80" className="size-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={RING.r}
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="8"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={RING.r}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={RING.c}
                  strokeDashoffset={RING.c * (1 - RING.pct / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold">{RING.pct}%</span>
                <span className="text-[10px] text-muted-foreground">covered</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "142", k: "Solved" },
                { v: "3", k: "Due today", accent: true },
                { v: "9", k: "Topics" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-lg border border-border bg-background/40 px-3 py-2.5"
                >
                  <div
                    className={`text-lg font-semibold ${
                      s.accent ? "text-primary" : ""
                    }`}
                  >
                    {s.v}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{s.k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Activity · last 12 weeks</span>
              <span className="inline-flex items-center gap-1">
                Less
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} className={`size-2 rounded-[2px] ${heatClass[l]}`} />
                ))}
                More
              </span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {HEAT.map((level, i) => (
                <span
                  key={i}
                  className={`size-2.5 rounded-[3px] ${heatClass[level]}`}
                />
              ))}
            </div>
          </div>

          {/* Continue strip */}
          <div className="mt-5 flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <RefreshCcw className="size-4 text-primary" />
              <div className="text-sm">
                <span className="font-medium">Next up:</span>{" "}
                <span className="text-muted-foreground">
                  Merge Intervals · review due
                </span>
              </div>
            </div>
            <span className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Resume
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
