import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-400 text-white shadow-[0_4px_16px_-4px_rgba(59,130,246,0.7)]",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-5"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* stylized arch + solve bracket monogram */}
        <path d="M8 8 L5 12 L8 16" />
        <path d="M16 8 L19 12 L16 16" />
        <path d="M13.5 6 L10.5 18" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string | null;
  showText?: boolean;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Solvarch
        </span>
      )}
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
