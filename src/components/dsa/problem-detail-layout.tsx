"use client";

import { useState } from "react";
import { FileText, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProblemDetailLayout({
  info,
  workspace,
}: {
  info: React.ReactNode;
  workspace: React.ReactNode;
}) {
  const [tab, setTab] = useState<"problem" | "code">("problem");

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Mobile toggle */}
      <div className="grid shrink-0 grid-cols-2 border-b border-border lg:hidden">
        <button
          onClick={() => setTab("problem")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors",
            tab === "problem"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          )}
        >
          <FileText className="size-4" />
          Problem
        </button>
        <button
          onClick={() => setTab("code")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors",
            tab === "code"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          )}
        >
          <Code2 className="size-4" />
          Code
        </button>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        <div
          className={cn(
            "min-h-0 lg:border-r lg:border-border",
            tab !== "problem" && "hidden lg:block"
          )}
        >
          {info}
        </div>
        <div className={cn("min-h-0", tab !== "code" && "hidden lg:block")}>
          {workspace}
        </div>
      </div>
    </div>
  );
}
