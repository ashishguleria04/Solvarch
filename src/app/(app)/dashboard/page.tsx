import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Code2, Network, Cpu, Bot } from "lucide-react";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/design-system/page-header";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

const quickLinks = [
  {
    icon: Code2,
    title: "DSA Problems",
    description: "Solve curated interview problems",
    href: "/dsa",
  },
  {
    icon: Network,
    title: "System Design",
    description: "HLD, LLD & case studies",
    href: "/system-design",
  },
  {
    icon: Cpu,
    title: "CS Fundamentals",
    description: "OS, DBMS, Networks & OOP",
    href: "/cs",
  },
  {
    icon: Bot,
    title: "Mock Interview",
    description: "Practice with an AI interviewer",
    href: "/interviews",
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Pick up where you left off, or start something new."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="group h-full gap-0 p-5 transition-colors hover:border-primary/40">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <link.icon className="size-5" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-semibold">{link.title}</h3>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {link.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
