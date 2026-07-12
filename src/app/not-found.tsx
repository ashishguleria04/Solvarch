import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
        <Compass className="size-5" />
      </div>
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-lg font-semibold tracking-tight">
        This page doesn't exist
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you're looking for was moved, renamed, or never existed.
      </p>
      <div className="flex gap-2">
        <Button asChild variant="glow" size="sm">
          <Link href="/dsa">Browse problems</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
