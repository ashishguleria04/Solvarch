import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, Database, Globe, Boxes, ArrowRight, type LucideIcon } from "lucide-react";
import { CS_SUBJECTS, getCsTopics } from "@/lib/content";
import { PageHeader } from "@/components/design-system/page-header";
import { ContentProgressSummary } from "@/components/content/content-progress";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "CS Fundamentals" };

const ICONS: Record<string, LucideIcon> = {
  Cpu,
  Database,
  Globe,
  Boxes,
};

export default async function CsIndexPage() {
  const subjects = await Promise.all(
    CS_SUBJECTS.map(async (s) => ({
      ...s,
      topicKeys: (await getCsTopics(s.slug)).map(
        (t) => `cs/${s.slug}/${t.slug}`
      ),
    }))
  );

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="CS Fundamentals"
        description="The four pillars every interviewer assumes you know — free for everyone, no paywall."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((s) => {
          const Icon = ICONS[s.icon] ?? Cpu;
          return (
            <Link key={s.slug} href={`/cs/${s.slug}`} className="group">
              <Card className="h-full gap-0 p-6 transition-colors hover:border-primary/40">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-4 font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {s.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                <span className="mt-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    {s.topicKeys.length} topics
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <ContentProgressSummary keys={s.topicKeys} />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
