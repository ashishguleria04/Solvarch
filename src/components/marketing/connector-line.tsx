"use client";

// The hairline that links the three "how it works" steps. Draws itself in
// (scaleX 0 → 1) when scrolled into view; static under reduced-motion.

import { motion, useReducedMotion } from "framer-motion";

export function ConnectorLine() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ originX: 0 }}
      className="absolute top-5 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
    />
  );
}
