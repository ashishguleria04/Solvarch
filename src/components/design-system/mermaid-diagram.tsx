"use client";

import { useEffect, useId, useState } from "react";

let initialized = false;

async function getMermaid() {
  const mermaid = (await import("mermaid")).default;
  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "strict",
      fontFamily: "var(--font-sans), ui-sans-serif, system-ui",
      themeVariables: {
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
      },
    });
    initialized = true;
  }
  return mermaid;
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mermaid = await getMermaid();
        const { svg } = await mermaid.render(`mmd${id}`, chart.trim());
        if (alive) setSvg(svg);
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [chart, id]);

  if (failed) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-[#0b0b11] p-4 text-sm leading-relaxed">
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
      className="my-5 overflow-x-auto rounded-lg border border-border bg-[#0b0b11] p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
