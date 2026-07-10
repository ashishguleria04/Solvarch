import { cn } from "@/lib/utils";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

const styles: Record<Difficulty, string> = {
  EASY: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
  MEDIUM: "text-amber-400 bg-amber-500/10 ring-amber-500/20",
  HARD: "text-rose-400 bg-rose-500/10 ring-rose-500/20",
};

const labels: Record<Difficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[difficulty],
        className
      )}
    >
      {labels[difficulty]}
    </span>
  );
}
