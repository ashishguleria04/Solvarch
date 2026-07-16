"use client";

// "Mark as failed" toggle on the problem page — adds the problem to the
// spaced-repetition queue (or removes it). The queue itself lives at /review.

import { RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import {
  isQueued,
  markForReview,
  removeFromReview,
  useReview,
} from "@/lib/review";

export function ReviewToggle({ slug }: { slug: string }) {
  const review = useReview();
  const queued = isQueued(review, slug);

  if (queued) {
    return (
      <button
        type="button"
        onClick={() => {
          removeFromReview(slug);
          toast.success("Removed from the review queue.");
        }}
        title="Remove from review queue"
        className="group inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-400 ring-1 ring-inset ring-sky-500/20 transition-colors hover:bg-sky-500/15"
      >
        <RotateCcw className="size-3.5 group-hover:hidden" />
        <X className="hidden size-3.5 group-hover:block" />
        In review queue
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        markForReview(slug);
        toast.success("Marked as failed — first review is due tomorrow.");
      }}
      title="Add to the spaced-repetition review queue"
      className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border transition-colors hover:text-foreground"
    >
      <RotateCcw className="size-3.5" />
      Mark as failed
    </button>
  );
}
