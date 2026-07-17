"use client";

// Toolbar control for timed self-practice: pick a duration, watch the clock,
// end (or run out) and self-score. While a session is live the workspace
// offers no Run/Submit feedback — the clock is the only companion. All timing
// flows through the shared ticker in lib/practice, so expiry works even after
// a reload, and render stays pure.

import { Square, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Difficulty } from "@/data/dsa";
import {
  endPractice,
  formatClock,
  recommendedMinutes,
  startPractice,
  useActivePractice,
  useNowSec,
} from "@/lib/practice";
import { SelfScoreDialog } from "@/components/practice/self-score-dialog";
import { cn } from "@/lib/utils";

/** Live MM:SS countdown; subscribing to the ticker also drives expiry. */
function LiveClock({ endsAt }: { endsAt: string }) {
  const nowSec = useNowSec();
  const remaining = Math.max(
    0,
    Math.floor(new Date(endsAt).getTime() / 1000) - nowSec
  );
  return (
    <span
      className={cn(
        "font-mono text-sm font-semibold tabular-nums",
        remaining <= 60 ? "text-rose-600 dark:text-rose-400" : "text-foreground"
      )}
      title="Time remaining"
    >
      {formatClock(remaining)}
    </span>
  );
}

/** Keeps the shared ticker alive so a session on another problem still
 * expires (and prompts its rubric) while this page is open. */
function TickerAnchor() {
  useNowSec();
  return null;
}

export function PracticeTimer({
  slug,
  title,
  difficulty,
  onStart,
}: {
  slug: string;
  title: string;
  difficulty: Difficulty;
  onStart?: () => void;
}) {
  const session = useActivePractice();
  const mine = session?.slug === slug ? session : null;

  const recommended = recommendedMinutes(difficulty);
  const options = [...new Set([recommended, 15, 25, 35, 45, 60])].sort(
    (a, b) => a - b
  );

  function start(minutes: number) {
    onStart?.();
    startPractice(slug, title, minutes);
    toast(`Timed practice started — ${minutes} minutes, no feedback until you end it.`);
  }

  return (
    <>
      {mine ? (
        <div className="flex items-center gap-2">
          <LiveClock endsAt={mine.endsAt} />
          <Button variant="outline" size="sm" onClick={endPractice}>
            <Square className="size-3.5" />
            End & score
          </Button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              title="Timed self-practice — clock only, no feedback"
            >
              <Timer className="size-4" />
              Timed
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Clock only — Run &amp; Submit lock until you end
            </DropdownMenuLabel>
            {options.map((m) => (
              <DropdownMenuItem key={m} onSelect={() => start(m)}>
                {m} minutes
                {m === recommended && (
                  <span className="ml-auto pl-3 text-xs text-primary">
                    suggested
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {session && !mine && <TickerAnchor />}

      <SelfScoreDialog />
    </>
  );
}
