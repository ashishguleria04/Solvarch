"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Wrapper that feeds cursor position into the `.glow-card` CSS highlight
 * (radial gradient anchored at --mx/--my).
 */
export function GlowCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn("glow-card", className)}
    >
      {children}
    </div>
  );
}
