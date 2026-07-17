"use client";

import { useEffect, useId, useState } from "react";
import { useResolvedTheme } from "@/lib/theme";

// Mermaid theming is global (initialize), so diagrams re-render whenever the
// app theme flips; the last initialize before a render wins.
let initializedTheme: "light" | "dark" | null = null;

async function getMermaid(theme: "light" | "dark") {
  const mermaid = (await import("mermaid")).default;
  if (initializedTheme !== theme) {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "neutral",
      securityLevel: "strict",
      fontFamily: "var(--font-sans), ui-sans-serif, system-ui",
      themeVariables:
        theme === "dark"
          ? {
              primaryColor: "#1d2b45",
              primaryTextColor: "#e6e8ee",
              primaryBorderColor: "#3b82f6",
              lineColor: "#4b5563",
              secondaryColor: "#16161d",
              tertiaryColor: "#111117",
              background: "#0a0a0f",
              mainBkg: "#16161d",
              nodeBorder: "#3b82f6",
              clusterBkg: "#111117",
              clusterBorder: "#23232b",
              edgeLabelBackground: "#111117",
              fontSize: "14px",
            }
          : {
              primaryColor: "#dbeafe",
              primaryTextColor: "#0a0a0f",
              primaryBorderColor: "#2563eb",
              lineColor: "#9ca3af",
              secondaryColor: "#f4f4f5",
              tertiaryColor: "#fafafa",
              background: "#ffffff",
              mainBkg: "#eff4ff",
              nodeBorder: "#2563eb",
              clusterBkg: "#fafafa",
              clusterBorder: "#e4e4e7",
              edgeLabelBackground: "#ffffff",
              fontSize: "14px",
            },
    });
    initializedTheme = theme;
  }
  return mermaid;
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const theme = useResolvedTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mermaid = await getMermaid(theme);
        const { svg } = await mermaid.render(`mmd${theme}${id}`, chart.trim());
        if (alive) setSvg(svg);
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [chart, id, theme]);

  if (failed) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-code p-4 text-sm leading-relaxed">
        <code className="font-mono">{chart.trim()}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="my-5 h-48 animate-pulse rounded-lg border border-border bg-card/40" />
    );
  }

  return (
    <div
      className="my-5 overflow-x-auto rounded-lg border border-border bg-code p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
