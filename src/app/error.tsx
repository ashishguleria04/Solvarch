"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20">
        <AlertTriangle className="size-5" />
      </div>
      <h1 className="text-lg font-semibold tracking-tight">Something broke</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. It&apos;s been logged — try again, and if it
        keeps happening, refresh the page.
      </p>
      {error.digest && (
        <code className="rounded bg-card px-2 py-1 font-mono text-xs text-muted-foreground">
          {error.digest}
        </code>
      )}
      <Button onClick={reset} variant="outline" size="sm">
        <RotateCcw className="size-3.5" />
        Try again
      </Button>
    </div>
  );
}
