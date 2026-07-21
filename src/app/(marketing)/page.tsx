import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Code2,
  Command,
  Cpu,
  LayoutDashboard,
  Map,
  MessagesSquare,
  Network,
  RefreshCcw,
  Star,
  Timer,
} from "lucide-react";
import { dailyCatalog } from "@/data/daily";
import { problems, topics } from "@/data/dsa";
import { companies } from "@/data/companies";
import { getCheatsheetEntries, getSystemDesignEntries } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/design-system/container";
import { FadeIn } from "@/components/design-system/fade-in";
import { DailyProblemCard } from "@/components/marketing/daily-problem";
import { HeroBadge } from "@/components/marketing/hero-badge";
import { HeroCodeWindow } from "@/components/marketing/hero-code-window";
import { TopicMarquee } from "@/components/marketing/topic-marquee";
import { GlowCard } from "@/components/marketing/glow-card";
import { StatCounter } from "@/components/marketing/stat-counter";
import { AppShowcase } from "@/components/marketing/app-showcase";
import { ConnectorLine } from "@/components/marketing/connector-line";

/* Deterministic mini-heatmap for the progress tile (levels 0–4). */
// prettier-ignore
const HEAT = [
  0,1,0,2,3,1,0,0,2,4,3,1,0,1,
  1,0,2,3,1,0,0,3,4,2,1,0,2,3,
  0,2,1,0,4,2,1,1,0,3,2,4,1,0,
  2,0,3,1,2,0,4,2,1,0,3,1,0,2,
];

const heatClass = [
  "bg-primary/10",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/65",
  "bg-primary/90",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
      {children}
    </div>
  );
}

// Per-feature accent tints for the bento icon chips, so the grid reads as a set
// of distinct tools instead of a wall of blue. Full literal class strings keep
// them detectable by Tailwind's scanner.
type Accent = keyof typeof ACCENTS;
const ACCENTS = {
  blue: "bg-primary/10 text-primary ring-primary/20",
  cyan: "bg-cyan-500/10 text-cyan-600 ring-cyan-500/20 dark:text-cyan-400",
  violet: "bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400",
  emerald:
    "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",
  indigo: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/20 dark:text-indigo-400",
  fuchsia:
    "bg-fuchsia-500/10 text-fuchsia-600 ring-fuchsia-500/20 dark:text-fuchsia-400",
  rose: "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400",
} as const;

const DOTS: Record<Accent, string> = {
  blue: "bg-primary/70",
  cyan: "bg-cyan-500/70",
  violet: "bg-violet-500/70",
  amber: "bg-amber-500/70",
  emerald: "bg-emerald-500/70",
  indigo: "bg-indigo-500/70",
  fuchsia: "bg-fuchsia-500/70",
  rose: "bg-rose-500/70",
};

function TileHeading({
  icon: Icon,
  title,
  description,
  accent = "blue",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent?: Accent;
}) {
  return (
    <div>
      <div
        className={`flex size-10 items-center justify-center rounded-lg ring-1 ring-inset ${ACCENTS[accent]}`}
      >
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

const steps = [
  {
    n: "01",
    icon: Map,
    title: "Pick your track",
    description:
      "Follow Blind 75 or Grind 169 week by week, or free-roam 15 DSA topics, system design, and CS theory.",
  },
  {
    n: "02",
    icon: Code2,
    title: "Solve like it's real",
    description:
      "Code in a Monaco editor, run against real test cases, or switch to timed mode — a clock, zero feedback, honest self-scoring.",
  },
  {
    n: "03",
    icon: RefreshCcw,
    title: "Retain it forever",
    description:
      "Misses come back on a 1·3·7·14·30-day ladder until they stick. Your streak, heatmap, and topic coverage live on one dashboard.",
  },
];

export default async function LandingPage() {
  const [systemDesign, cheatsheets] = await Promise.all([
    getSystemDesignEntries(),
    getCheatsheetEntries(),
  ]);

  const trustRow = [
    "No sign-up required",
    `${problems.length} curated problems`,
    "100% free, forever",
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-aurora-a absolute -top-48 -left-40 size-[36rem] rounded-full bg-primary/15 blur-[110px]" />
          <div className="animate-aurora-b absolute top-16 -right-32 size-[30rem] rounded-full bg-cyan-500/10 blur-[110px]" />
        </div>
        <Container className="relative py-24 sm:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <FadeIn>
              <HeroBadge />
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                <span className="text-gradient">Master the</span>{" "}
                <span className="text-gradient-brand">tech interview</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
                {problems.length} DSA problems, {systemDesign.length} system
                design guides, and all of CS theory in one focused workspace —
                with a real editor, a real judge, and spaced review that makes
                it stick.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="glow" size="lg">
                  <Link href="/dsa">
                    Start solving
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/roadmaps">Browse roadmaps</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {trustRow.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-primary" />
                    {t}
                  </span>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <HeroCodeWindow />
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Topic marquee */}
      <section className="border-t border-border/60 py-10">
        <Container>
          <FadeIn>
            <TopicMarquee />
          </FadeIn>
        </Container>
      </section>

      {/* Daily problem */}
      <section className="pb-4">
        <Container>
          <FadeIn>
            <DailyProblemCard problems={dailyCatalog} />
          </FadeIn>
        </Container>
      </section>

      {/* Bento features */}
      <section className="py-24">
        <Container>
          <FadeIn className="mx-auto max-w-2xl text-center">
            <Eyebrow>The toolkit</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to get the offer
            </h2>
            <p className="mt-4 text-muted-foreground">
              Stop juggling ten tabs. Problems, theory, practice, and review —
              one focused environment.
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {/* Editor + judge — anchor tile, distinct surface */}
            <FadeIn className="sm:col-span-2 lg:col-span-4">
              <GlowCard className="h-full rounded-xl border border-border bg-gradient-to-br from-card via-card to-primary/[0.05] p-6 transition-colors hover:border-primary/40">
                <div className="grid h-full gap-6 md:grid-cols-2">
                  <TileHeading
                    icon={Code2}
                    accent="blue"
                    title="A real editor, a real judge"
                    description={`Solve ${problems.length} problems across ${topics.length} topics in Python, JavaScript, Java, or C++ — progressive hints, editorials, instant verdicts. Or start the timer and grade yourself like an interviewer would.`}
                  />
                  <div className="flex flex-col justify-center rounded-lg border border-border bg-code p-4 font-mono text-xs leading-6">
                    <div className="text-muted-foreground">
                      $ run two_sum.py
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ✓ case 1 · [0, 1] · 12 ms
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ✓ case 2 · [1, 2] · 9 ms
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ✓ 37 hidden cases
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-600 ring-1 ring-emerald-500/20 ring-inset dark:text-emerald-400">
                        Accepted
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Timer className="size-3" /> 18:24 elapsed
                      </span>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </FadeIn>

            {/* System design */}
            <FadeIn delay={0.05} className="lg:col-span-2">
              <GlowCard className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <TileHeading
                  icon={Network}
                  accent="cyan"
                  title={`System design, ${systemDesign.length} guides deep`}
                  description="HLD and LLD fundamentals plus full case studies — Twitter, Uber, Netflix — with diagrams, estimation, and trade-offs."
                />
                <svg
                  viewBox="0 0 220 84"
                  aria-hidden
                  className="mt-5 w-full text-border"
                >
                  <g stroke="currentColor" fill="none">
                    <path d="M44 42h28M100 30l24-12M100 54l24 12M158 18h18M158 66h18" />
                  </g>
                  <g className="text-muted-foreground" fontSize="8">
                    <rect x="8" y="30" width="36" height="24" rx="5" fill="var(--secondary)" stroke="var(--border)" />
                    <text x="26" y="45" textAnchor="middle" fill="currentColor">LB</text>
                    <rect x="72" y="30" width="36" height="24" rx="5" fill="var(--secondary)" stroke="var(--primary)" />
                    <text x="90" y="45" textAnchor="middle" fill="var(--primary)">API</text>
                    <rect x="124" y="6" width="36" height="24" rx="5" fill="var(--secondary)" stroke="var(--border)" />
                    <text x="142" y="21" textAnchor="middle" fill="currentColor">Cache</text>
                    <rect x="124" y="54" width="36" height="24" rx="5" fill="var(--secondary)" stroke="var(--border)" />
                    <text x="142" y="69" textAnchor="middle" fill="currentColor">Queue</text>
                    <rect x="176" y="6" width="36" height="24" rx="5" fill="var(--secondary)" stroke="var(--border)" />
                    <text x="194" y="21" textAnchor="middle" fill="currentColor">DB</text>
                    <rect x="176" y="54" width="36" height="24" rx="5" fill="var(--secondary)" stroke="var(--border)" />
                    <text x="194" y="69" textAnchor="middle" fill="currentColor">Worker</text>
                  </g>
                </svg>
              </GlowCard>
            </FadeIn>

            {/* Progress — wide anchor tile */}
            <FadeIn delay={0.1} className="sm:col-span-2 lg:col-span-4">
              <GlowCard className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="grid h-full items-center gap-6 md:grid-cols-2">
                  <TileHeading
                    icon={LayoutDashboard}
                    accent="emerald"
                    title="Progress that stays yours"
                    description="Streaks, a rolling heatmap, and per-topic coverage — stored locally, exportable as JSON, no account anywhere."
                  />
                  <div>
                    <div className="grid w-max grid-cols-14 gap-1">
                      {HEAT.map((level, i) => (
                        <span
                          key={i}
                          className={`size-3 rounded-[3px] ${heatClass[level]}`}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                      <span>
                        <span className="font-mono text-foreground">142</span> solved
                      </span>
                      <span>
                        <span className="font-mono text-foreground">12</span>-day streak
                      </span>
                      <span>
                        <span className="font-mono text-foreground">9</span>/
                        {topics.length} topics
                      </span>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </FadeIn>

            {/* Spaced repetition */}
            <FadeIn delay={0.15} className="lg:col-span-2">
              <GlowCard className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <TileHeading
                  icon={RefreshCcw}
                  accent="amber"
                  title="Spaced repetition"
                  description="Miss a problem and it comes back on a proven ladder until you clear every rung. Passing climbs, failing resets."
                />
                <div className="mt-5 flex items-center gap-2">
                  {["1d", "3d", "7d", "14d", "30d"].map((d, i) => (
                    <span
                      key={d}
                      className={
                        i === 2
                          ? "relative rounded-md bg-warning/15 px-2.5 py-1 font-mono text-xs text-warning ring-1 ring-warning/30 ring-inset"
                          : "rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-muted-foreground"
                      }
                    >
                      {d}
                      {i === 2 && (
                        <span className="absolute -top-1 -right-1 size-2 rounded-full bg-warning" />
                      )}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  3 reviews due today
                </p>
              </GlowCard>
            </FadeIn>

            {/* Roadmaps */}
            <FadeIn delay={0.2} className="lg:col-span-2">
              <GlowCard className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <TileHeading
                  icon={Map}
                  accent="violet"
                  title="Guided roadmaps"
                  description="Blind 75 and Grind 169, resolved against the catalog with week-by-week sections and one progress ring."
                />
                <div className="mt-5 space-y-3">
                  {[
                    { name: "Blind 75", pct: 64 },
                    { name: "Grind 169", pct: 31 },
                  ].map((r) => (
                    <div key={r.name}>
                      <div className="flex justify-between text-xs">
                        <span>{r.name}</span>
                        <span className="font-mono text-muted-foreground">
                          {r.pct}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-primary"
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </FadeIn>

            {/* CS fundamentals */}
            <FadeIn delay={0.25} className="lg:col-span-2">
              <GlowCard className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <TileHeading
                  icon={Cpu}
                  accent="indigo"
                  title="CS fundamentals"
                  description="The theory rounds, structured — diagram-rich topic pages with the questions interviewers actually ask."
                />
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Operating Systems", "DBMS", "Networks", "OOP"].map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
                    >
                      <span className={`size-1.5 rounded-full ${DOTS.indigo}`} />
                      {s}
                    </span>
                  ))}
                </div>
              </GlowCard>
            </FadeIn>

            {/* Companies */}
            <FadeIn delay={0.3} className="lg:col-span-2">
              <GlowCard className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <TileHeading
                  icon={Building2}
                  accent="fuchsia"
                  title="Company question banks"
                  description="Problem lists compiled from publicly shared interview experiences — see what each company actually asks."
                />
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Google", "Amazon", "Microsoft", "Meta"].map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
                    >
                      <span className={`size-1.5 rounded-full ${DOTS.fuchsia}`} />
                      {c}
                    </span>
                  ))}
                  <span className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground/70">
                    +{companies.length - 4} more
                  </span>
                </div>
              </GlowCard>
            </FadeIn>

            {/* Behavioral — full-width tile */}
            <FadeIn delay={0.35} className="sm:col-span-2 lg:col-span-6">
              <GlowCard className="h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="grid h-full items-center gap-6 md:grid-cols-2">
                  <TileHeading
                    icon={MessagesSquare}
                    accent="rose"
                    title="Behavioral & HR answers"
                    description="Model answers and delivery tips for the rounds that reject strong engineers — not just the coding ones. Learn the STAR structure and the beats interviewers listen for."
                  />
                  <div className="space-y-2 text-xs">
                    <div className="w-fit max-w-full rounded-lg rounded-bl-sm border border-border bg-secondary/60 px-3 py-1.5 text-muted-foreground">
                      “Tell me about a conflict on your team.”
                    </div>
                    <div className="ml-auto w-fit max-w-full rounded-lg rounded-br-sm bg-primary/10 px-3 py-1.5 text-foreground/80 ring-1 ring-primary/20 ring-inset">
                      Situation → action → result, 90 seconds.
                    </div>
                    <div className="w-fit max-w-full rounded-lg rounded-bl-sm border border-border bg-secondary/60 px-3 py-1.5 text-muted-foreground">
                      “Why are you leaving your current role?”
                    </div>
                    <div className="ml-auto w-fit max-w-full rounded-lg rounded-br-sm bg-primary/10 px-3 py-1.5 text-foreground/80 ring-1 ring-primary/20 ring-inset">
                      Growth-framed, never a complaint about the last team.
                    </div>
                  </div>
                </div>
              </GlowCard>
            </FadeIn>
          </div>

          {/* Command palette strip */}
          <FadeIn delay={0.1}>
            <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-6 py-4 sm:flex-row">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Command className="size-4 text-primary" />
                Fuzzy-jump to any problem, guide, or cheat sheet — {cheatsheets.length}{" "}
                sheets included — from anywhere.
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <kbd className="rounded-md border border-border bg-secondary px-2 py-1">
                  Ctrl
                </kbd>
                <kbd className="rounded-md border border-border bg-secondary px-2 py-1">
                  K
                </kbd>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Product showcase */}
      <section className="border-t border-border/60 py-24">
        <Container>
          <FadeIn className="mx-auto max-w-2xl text-center">
            <Eyebrow>The dashboard</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Every rep, on one screen
            </h2>
            <p className="mt-4 text-muted-foreground">
              Solve, review, and read — then watch your streak, coverage, and
              activity build in a dashboard that&apos;s yours alone.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="mt-12">
            <AppShowcase />
          </FadeIn>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 py-24">
        <Container>
          <FadeIn className="mx-auto max-w-2xl text-center">
            <Eyebrow>The loop</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick. Solve. Retain.
            </h2>
          </FadeIn>
          <div className="relative mt-14 grid gap-10 md:grid-cols-3">
            <ConnectorLine />
            {steps.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.12} className="relative text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-primary/30 bg-background font-mono text-sm text-primary shadow-[0_0_20px_-6px_rgba(59,130,246,0.5)]">
                  {s.n}
                </div>
                <h3 className="mt-5 flex items-center justify-center gap-2 text-base font-semibold">
                  <s.icon className="size-4 text-primary" />
                  {s.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                  {s.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats band */}
      <section className="border-t border-border/60 bg-card/30 py-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { v: problems.length, k: "Curated problems" },
              { v: topics.length, k: "DSA topics" },
              { v: systemDesign.length, k: "System design guides" },
              { v: cheatsheets.length, k: "Cheat sheets" },
            ].map((s) => (
              <FadeIn key={s.k}>
                <div className="text-gradient-brand text-4xl font-semibold">
                  <StatCounter value={s.v} />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.k}</div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Open-source / credibility band */}
      <section className="border-t border-border/60 py-16">
        <Container>
          <FadeIn className="flex flex-col items-center gap-6 text-center">
            <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
              Solvarch is free, <span className="text-foreground">MIT-licensed</span>,
              and runs entirely in your browser — your progress never leaves your
              device, and there&apos;s nothing to sign up for.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                "100% free",
                "MIT licensed",
                "No accounts",
                "No tracking",
                "Next.js",
                "TypeScript",
                "Monaco editor",
              ].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
                >
                  <CheckCircle2 className="size-3.5 text-primary" />
                  {b}
                </span>
              ))}
            </div>
            <Button asChild variant="outline" size="sm">
              <a
                href="https://github.com/ashishguleria04/Solvarch"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="size-4" />
                Star on GitHub
              </a>
            </Button>
          </FadeIn>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <Container>
          <FadeIn>
            <div className="border-beam relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-background px-6 py-20 text-center">
              <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
              <div className="bg-radial-glow absolute inset-0" />
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="animate-aurora-b absolute -bottom-40 left-1/4 size-[26rem] rounded-full bg-primary/10 blur-[100px]" />
              </div>
              <div className="relative">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your next offer starts here
                </h2>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                  No account, no checkout — open a problem and start solving in
                  the next ten seconds.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button asChild variant="glow" size="lg">
                    <Link href="/dsa">
                      Start solving
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a
                      href="https://github.com/ashishguleria04/Solvarch"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Star className="size-4" />
                      Star on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
