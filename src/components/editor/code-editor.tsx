"use client";

import { useRef } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { getLanguage } from "@/lib/constants";
import { useResolvedTheme } from "@/lib/theme";

// Both themes are registered up front (beforeMount) so the reactive `theme`
// prop can switch between them when the user flips light/dark mode.
const defineThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("solvarch-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6b7280", fontStyle: "italic" },
      { token: "keyword", foreground: "60a5fa" },
      { token: "string", foreground: "86efac" },
      { token: "number", foreground: "fbbf24" },
    ],
    colors: {
      "editor.background": "#0b0b11",
      "editor.foreground": "#e7e7ea",
      "editorLineNumber.foreground": "#3a3a45",
      "editorLineNumber.activeForeground": "#8a8a97",
      "editor.selectionBackground": "#1d4ed855",
      "editor.lineHighlightBackground": "#16161d",
      "editorCursor.foreground": "#3b82f6",
      "editorIndentGuide.background1": "#1c1c25",
      "editorGutter.background": "#0b0b11",
    },
  });
  monaco.editor.defineTheme("solvarch-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6b7280", fontStyle: "italic" },
      { token: "keyword", foreground: "2563eb" },
      { token: "string", foreground: "059669" },
      { token: "number", foreground: "b45309" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#0a0a0f",
      "editorLineNumber.foreground": "#c2c2cb",
      "editorLineNumber.activeForeground": "#52525b",
      "editor.selectionBackground": "#bfdbfe88",
      "editor.lineHighlightBackground": "#f6f7f9",
      "editorCursor.foreground": "#2563eb",
      "editorIndentGuide.background1": "#e8e8ec",
      "editorGutter.background": "#ffffff",
    },
  });
};

export function CodeEditor({
  languageId,
  value,
  onChange,
  readOnly = false,
  height = "100%",
}: {
  languageId: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string | number;
}) {
  const monacoLang = getLanguage(languageId)?.monaco ?? "plaintext";
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const resolvedTheme = useResolvedTheme();

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height={height}
      language={monacoLang}
      value={value}
      onChange={(v) => onChange?.(v ?? "")}
      beforeMount={defineThemes}
      onMount={handleMount}
      theme={resolvedTheme === "dark" ? "solvarch-dark" : "solvarch-light"}
      loading={
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      }
      options={{
        readOnly,
        fontSize: 13.5,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        padding: { top: 16, bottom: 16 },
        lineNumbersMinChars: 3,
        renderLineHighlight: "line",
        tabSize: 4,
        automaticLayout: true,
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
      }}
    />
  );
}
