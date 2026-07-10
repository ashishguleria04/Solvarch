"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  problemId,
  initial,
  className,
}: {
  problemId: string;
  initial: boolean;
  className?: string;
}) {
  const [bookmarked, setBookmarked] = useState(initial);
  const [pending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !bookmarked;
    setBookmarked(next); // optimistic
    startTransition(async () => {
      try {
        const res = await fetch("/api/bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemId }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBookmarked(data.bookmarked);
      } catch {
        setBookmarked(!next); // revert
        toast.error("Could not update bookmark.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      className={cn(
        "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50",
        bookmarked && "text-primary hover:text-primary",
        className
      )}
    >
      <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
    </button>
  );
}
