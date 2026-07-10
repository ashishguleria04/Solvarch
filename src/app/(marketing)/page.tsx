import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Code2,
  Network,
  Cpu,
  Trophy,
  Sparkles,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/design-system/container";
import { FadeIn } from "@/components/design-system/fade-in";

const features = [
  {
    icon: Code2,
    title: "150+ DSA Problems",
    description:
      "Classic interview problems across 12 topics with progressive hints, editorials, complexity analysis, and an integrated Monaco editor.",
  },
  {
    icon: Network,
    title: "System Design",
    description:
      "HLD & LLD fundamentals plus full case studies — Design Twitter, Uber, Netflix — with diagrams, estimation, and trade-offs.",
  },
  {
    icon: Cpu,
    title: "CS Fundamentals",
    description:
      "OS, DBMS, Computer Networks, and OOP — structured, diagram-rich topic pages with the questions interviewers actually ask.",
  },
  {
    icon: Bot,
    title: "AI Mock Interviews",
    description:
      "Practice DSA, system design, and behavioral rounds with a Claude-powered interviewer that probes, follows up, and scores you.",
  },
  {
    icon: Terminal,
    title: "Run & Submit Code",
    description:
      "Write in Python, JavaScript, Java, or C++ and run against real test cases — instant verdicts, no setup.",
  },
  {
    icon: Trophy,
    title: "Progress & Analytics",
    description:
      "Track streaks, mastered topics, and weak areas. Bookmark problems and pick up exactly where you left off.",
  },
];

const codeLines = [
  { t: "def two_sum(nums, target):", c: "text-sky-300" },
  { t: "    seen = {}", c: "text-foreground/80" },
  { t: "    for i, n in enumerate(nums):", c: "text-foreground/80" },
  { t: "        if target - n in seen:", c: "text-foreground/80" },
  { t: "            return [seen[target - n], i]", c: "text-emerald-300" },
  { t: "        seen[n] = i", c: "text-foreground/80" },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute inset-0 bg-radial-glow" />
        <Container className="relative py-24 sm:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <Sparkles className="size-3.5 text-primary" />
                AI-powered interview prep, end to end
              </div>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-gradient">Master the</span>{" "}
                <span className="text-gradient-brand">tech interview</span>
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
                DSA, System Design, and CS fundamentals in one sleek workspace —
                with an integrated code editor and AI mock interviews that feel
                like the real thing.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="glow" size="lg">
                  <Link href="/register">
                    Start practicing free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dsa">Browse problems</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["No credit card required", "150+ problems", "Free CS fundamentals"].map(
                  (t) => (
                    <span key={t} className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-primary" />
                      {t}
                    </span>
                  )
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="relative">
              <div className="glow-soft overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
                  <span className="size-3 rounded-full bg-rose-500/70" />
                  <span className="size-3 rounded-full bg-amber-500/70" />
                  <span className="size-3 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    two_sum.py
                  </span>
                  <span className="ml-auto rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                    Accepted
                  </span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
                  {codeLines.map((line, i) => (
                    <div key={i} className="flex">
                      <span className="mr-4 w-4 select-none text-right text-muted-foreground/40">
                        {i + 1}
                      </span>
                      <span className={line.c}>{line.t || " "}</span>
                    </div>
                  ))}
                </pre>
                <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
                  {[
                    { k: "Runtime", v: "48 ms" },
                    { k: "Tests", v: "37 / 37" },
                    { k: "Memory", v: "16.2 MB" },
                  ].map((s) => (
                    <div key={s.k} className="bg-card px-4 py-3">
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {s.k}
                      </div>
                      <div className="mt-0.5 font-mono text-sm text-foreground">
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 py-24">
        <Container>
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to get the offer
            </h2>
            <p className="mt-4 text-muted-foreground">
              Stop juggling ten tabs. Solvarch brings problems, theory, and
              practice into one focused environment.
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.05}>
                <div className="group h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 transition-transform group-hover:scale-105">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
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
              { v: "150+", k: "Curated problems" },
              { v: "12", k: "DSA topics" },
              { v: "6+", k: "Design case studies" },
              { v: "4", k: "Languages" },
            ].map((s) => (
              <FadeIn key={s.k}>
                <div className="text-4xl font-semibold text-gradient-brand">
                  {s.v}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.k}</div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <Container>
          <FadeIn className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-background px-6 py-16 text-center">
            <div className="absolute inset-0 bg-radial-glow" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Your next offer starts here
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                Join and start solving in under a minute. CS fundamentals and your
                first mock interview are on us.
              </p>
              <Button asChild variant="glow" size="lg" className="mt-8">
                <Link href="/register">
                  Create your free account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
