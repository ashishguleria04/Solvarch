import Link from "next/link";
import { Logo } from "@/components/design-system/logo";

const groups = [
  {
    title: "Learn",
    links: [
      { label: "DSA Problems", href: "/dsa" },
      { label: "System Design", href: "/system-design" },
      { label: "CS Fundamentals", href: "/cs" },
      { label: "Question Bank", href: "/questions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Free, open interview prep — DSA, system design, and CS fundamentals in
            one focused workspace.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h4 className="text-sm font-semibold text-foreground">{group.title}</h4>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Solvarch. Built for engineers, by engineers.
        </div>
      </div>
    </footer>
  );
}
