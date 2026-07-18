"use client";

import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

const codeLines = [
  { t: "def two_sum(nums, target):", c: "text-sky-700 dark:text-sky-300" },
  { t: "    seen = {}", c: "text-foreground/80" },
  { t: "    for i, n in enumerate(nums):", c: "text-foreground/80" },
  { t: "        if target - n in seen:", c: "text-foreground/80" },
  {
    t: "            return [seen[target - n], i]",
    c: "text-emerald-700 dark:text-emerald-300",
  },
  { t: "        seen[n] = i", c: "text-foreground/80" },
];

const LINE_STAGGER = 0.22;
const LINES_DONE = 0.4 + codeLines.length * LINE_STAGGER;

const stats = [
  { k: "Runtime", v: "48 ms" },
  { k: "Tests", v: "37 / 37" },
  { k: "Memory", v: "16.2 MB" },
];

export function HeroCodeWindow() {
  return (
    <div className="relative">
      {/* Floating context pills */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: LINES_DONE + 0.5, duration: 0.4 }}
        className="absolute -top-5 -right-3 z-10 hidden sm:block"
      >
        <div className="animate-float flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur">
          <Zap className="size-3.5 text-primary" />
          O(n) · one pass
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: LINES_DONE + 0.8, duration: 0.4 }}
        className="absolute -bottom-5 -left-3 z-10 hidden sm:block"
      >
        <div className="animate-float-delayed flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur">
          <Flame className="size-3.5 text-warning" />
          Streak +1
        </div>
      </motion.div>

      <div className="border-beam glow-soft overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
          <span className="size-3 rounded-full bg-rose-500/70" />
          <span className="size-3 rounded-full bg-amber-500/70" />
          <span className="size-3 rounded-full bg-emerald-500/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            two_sum.py
          </span>
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: LINES_DONE + 0.15,
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}
            className="ml-auto rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-600 ring-1 ring-emerald-500/20 ring-inset dark:text-emerald-400"
          >
            Accepted
          </motion.span>
        </div>

        <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
          {codeLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * LINE_STAGGER, duration: 0.25 }}
              className="flex"
            >
              <span className="mr-4 w-4 text-right text-muted-foreground/40 select-none">
                {i + 1}
              </span>
              <span className={line.c}>{line.t}</span>
              {i === codeLines.length - 1 && (
                <span className="animate-caret ml-0.5 inline-block w-1.75 bg-primary/80" />
              )}
            </motion.div>
          ))}
        </pre>

        <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: LINES_DONE + 0.25 + i * 0.1, duration: 0.3 }}
              className="bg-card px-4 py-3"
            >
              <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
                {s.k}
              </div>
              <div className="mt-0.5 font-mono text-sm text-foreground">
                {s.v}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
