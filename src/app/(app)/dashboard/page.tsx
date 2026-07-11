import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  Flame,
  Network,
  Target,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@/lib/auth";
import { getUserDsaStats } from "@/server/dsa";
import { getStreak } from "@/server/stats";
import {
  getInterviewCount,
  getRecentSubmissions,
  getTopicProgress,
} from "@/server/dashboard";
import { PageHeader } from "@/components/design-system/page-header";
import { Card } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const quickLinks = [
  { icon: Code2, title: "DSA Problems", href: "/dsa" },
  { icon: Network, title: "System Design", href: "/system-design" },
  { icon: Cpu, title: "CS Fundamentals", href: "/cs" },
  { icon: Bot, title: "Mock Interview", href: "/interviews" },
];

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const [stats, streak, interviews, topicProgress, recent] = userId
    ? await Promise.all([
        getUserDsaStats(userId),
        getStreak(userId),
        getInterviewCount(userId),
        getTopicProgress(userId),
        getRecentSubmissions(userId),
      ])
    : [{ solved: 0, attempted: 0, total: 0 }, 0, 0, [], []];

  const started = topicProgress.filter((t) => t.solved > 0);
  const weakest = [...started]
    .sort((a, b) => a.solved / a.total - b.solved / b.total)
    .slice(0, 3);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Pick up where you left off, or start something new."
      />

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-0 p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-primary" />
            Problems solved
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold">{stats.solved}</span>
            <span className="text-sm text-muted-foreground">/ {stats.total}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${stats.total ? Math.round((stats.solved / stats.total) * 100) : 0}%`,
              }}
            />
          </div>
        </Card>
        <Card className="gap-0 p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className={cn("size-4", streak > 0 ? "text-amber-400" : "")} />
            Day streak
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold">{streak}</span>
            <span className="text-sm text-muted-foreground">
              {streak === 1 ? "day" : "days"}
            </span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {streak > 0
              ? "Keep it alive — one submission a day."
              : "Solve one problem today to start a streak."}
          </p>
        </Card>
        <Card className="gap-0 p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="size-4 text-primary" />
            Interviews completed
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold">{interviews}</span>
          </div>
          <Link
            href="/interviews"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Start a mock interview
            <ArrowRight className="size-3" />
          </Link>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Topic mastery */}
        <section className="lg:col-span-3">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Topic mastery
          </h2>
          <Card className="gap-0 p-5">
            {topicProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Solve your first problem to see per-topic progress.
              </p>
            ) : (
              <div className="space-y-3">
                {topicProgress.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/dsa?topic=${t.slug}`}
                    className="group block"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium transition-colors group-hover:text-primary">
                        {t.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {t.solved}/{t.total}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary/80"
                        style={{ width: `${Math.round((t.solved / t.total) * 100)}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {weakest.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Target className="size-4" />
                Focus next:
              </span>
              {weakest.map((t) => (
                <Link
                  key={t.slug}
                  href={`/dsa?topic=${t.slug}`}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium transition-colors hover:bg-primary/15 hover:text-primary"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Recent submissions
          </h2>
          <Card className="gap-0 p-2">
            {recent.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                Your submissions will show up here.
              </p>
            ) : (
              recent.map((s) => (
                <Link
                  key={s.id}
                  href={`/dsa/${s.problem.slug}`}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-card"
                >
                  {s.status === "ACCEPTED" ? (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="size-4 shrink-0 text-red-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium transition-colors group-hover:text-primary">
                      {s.problem.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(s.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <DifficultyBadge difficulty={s.problem.difficulty} />
                </Link>
              ))
            )}
          </Card>
        </section>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="group h-full gap-0 p-4 transition-colors hover:border-primary/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <link.icon className="size-4.5 text-primary" />
                  <h3 className="text-sm font-semibold">{link.title}</h3>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
