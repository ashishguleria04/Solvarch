import { Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function PremiumBadge({
  className,
  variant = "lock",
}: {
  className?: string;
  variant?: "lock" | "pro";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20",
        className
      )}
    >
      {variant === "lock" ? (
        <Lock className="size-3" />
      ) : (
        <Sparkles className="size-3" />
      )}
      Pro
    </span>
  );
}
