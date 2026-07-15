"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Check,
  Loader2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeEditor } from "@/components/editor/code-editor";
import { OutputDiff } from "@/components/editor/output-diff";
import { LANGUAGES, DEFAULT_LANGUAGE, getLanguage } from "@/lib/constants";
import { loadCodeDraft, saveCodeDraft } from "@/lib/code-storage";
import { recordAttempt, recordSolved } from "@/lib/progress";
import { cn } from "@/lib/utils";

type StarterCode = Record<string, string>;

type RunOutcome = {
  passed: boolean;
  status: string;
  stdout: string;
  stderr: string;
  expected: string;
  input: string;
  timeMs: number | null;
  message?: string;
};

type RunResult =
  | { kind: "custom"; stdout: string; stderr: string; status: string; message?: string }
  | { kind: "samples"; results: RunOutcome[]; passed: number; total: number };

type SubmitResult = {
  status: string;
  passed: number;
  total: number;
  runtimeMs: number | null;
  message?: string;
  firstFailure?: { input: string; expected: string; got: string; stderr: string };
};

const VERDICT_LABEL: Record<string, string> = {
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  RUNTIME_ERROR: "Runtime Error",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  COMPILE_ERROR: "Compile Error",
  PENDING: "Runner Unavailable",
};

export function EditorWorkspace({
  slug,
  starterCode,
  onSolved,
}: {
  slug: string;
  starterCode: StarterCode;
  onSolved?: () => void;
}) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [codeByLang, setCodeByLang] = useState<StarterCode>({ ...starterCode });
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [run, setRun] = useState<RunResult | null>(null);
  const [submit, setSubmit] = useState<SubmitResult | null>(null);

  const code = codeByLang[language] ?? starterCode[language] ?? "";
  const busy = running || submitting;

  // Restore any saved draft after mount (localStorage is client-only).
  useEffect(() => {
    const draft = loadCodeDraft(slug);
    if (!draft) return;
    setCodeByLang((prev) => ({ ...prev, ...draft.languages }));
    if (draft.lastLanguage && getLanguage(draft.lastLanguage)) {
      setLanguage(draft.lastLanguage);
    }
  }, [slug]);

  // Debounced autosave so a reload or accidental navigation keeps the code.
  useEffect(() => {
    const t = setTimeout(
      () => saveCodeDraft(slug, codeByLang, language, starterCode),
      400
    );
    return () => clearTimeout(t);
  }, [slug, codeByLang, language, starterCode]);

  // Flush the latest draft on unmount so edits inside the debounce window
  // survive in-app navigation.
  const latest = useRef({ codeByLang, language });
  latest.current = { codeByLang, language };
  useEffect(() => {
    return () => {
      saveCodeDraft(
        slug,
        latest.current.codeByLang,
        latest.current.language,
        starterCode
      );
    };
  }, [slug, starterCode]);

  function setCode(value: string) {
    setCodeByLang((prev) => ({ ...prev, [language]: value }));
  }

  function reset() {
    setCodeByLang((prev) => ({ ...prev, [language]: starterCode[language] ?? "" }));
    toast.success("Reset to starter code.");
  }

  async function handleRun() {
    setRunning(true);
    setSubmit(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, language, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Run failed.");
        return;
      }
      setRun(data as RunResult);
    } catch {
      toast.error("Could not reach the code runner.");
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setRun(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, language, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Submit failed.");
        return;
      }
      const result = data as SubmitResult;
      setSubmit(result);
      if (result.status === "ACCEPTED") {
        recordSolved(slug, language);
        toast.success("Accepted! 🎉");
        onSolved?.();
      } else if (result.status === "PENDING") {
        toast.error(result.message ?? "The runner is unavailable.");
      } else {
        recordAttempt(slug, language);
        toast.error(VERDICT_LABEL[result.status] ?? "Not quite — keep trying.");
      }
    } catch {
      toast.error("Could not reach the code runner.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border bg-card/50 px-3 py-2">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={reset} title="Reset code">
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRun} disabled={busy}>
            {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            Run
          </Button>
          <Button variant="glow" size="sm" onClick={handleSubmit} disabled={busy}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Submit
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="min-h-0 flex-1">
        <CodeEditor languageId={language} value={code} onChange={setCode} />
      </div>

      {/* Results */}
      <div className="h-56 overflow-y-auto border-t border-border bg-card/30 p-3 scrollbar-thin">
        <ResultsPanel run={run} submit={submit} busy={busy} />
      </div>
    </div>
  );
}

function Verdict({ result }: { result: SubmitResult }) {
  const accepted = result.status === "ACCEPTED";
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 text-lg font-semibold",
          accepted ? "text-emerald-400" : "text-rose-400"
        )}
      >
        {accepted ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
        {VERDICT_LABEL[result.status] ?? result.status}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {result.passed} / {result.total} test cases passed
        {result.runtimeMs != null && accepted ? ` · ~${result.runtimeMs} ms avg` : ""}
      </p>
      {result.firstFailure && !accepted && (
        <div className="mt-3 space-y-2 font-mono text-xs">
          <FailRow label="Input" value={result.firstFailure.input} />
          <div>
            <div className="text-muted-foreground">Output:</div>
            <OutputDiff
              expected={result.firstFailure.expected}
              actual={result.firstFailure.got}
              className="mt-0.5"
            />
          </div>
          {result.firstFailure.stderr && (
            <FailRow label="Stderr" value={result.firstFailure.stderr} tone="bad" />
          )}
        </div>
      )}
    </div>
  );
}

function FailRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "bad";
}) {
  return (
    <div>
      <div className="text-muted-foreground">{label}:</div>
      <pre
        className={cn(
          "mt-0.5 overflow-x-auto whitespace-pre-wrap rounded bg-[#0b0b11] p-2 scrollbar-thin",
          tone === "ok" && "text-emerald-300",
          tone === "bad" && "text-rose-300"
        )}
      >
        {value}
      </pre>
    </div>
  );
}

function ResultsPanel({
  run,
  submit,
  busy,
}: {
  run: RunResult | null;
  submit: SubmitResult | null;
  busy: boolean;
}) {
  if (busy) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Running against the judge…
      </div>
    );
  }

  if (submit) return <Verdict result={submit} />;

  if (run) {
    if (run.kind === "custom") {
      return (
        <div className="font-mono text-xs">
          <div className="text-muted-foreground">Output:</div>
          <pre className="mt-1 whitespace-pre-wrap text-foreground/90">
            {run.stdout || "(no output)"}
          </pre>
          {run.stderr && <pre className="mt-2 whitespace-pre-wrap text-rose-300">{run.stderr}</pre>}
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">
          Sample tests: {run.passed} / {run.total} passed
        </div>
        {run.results.map((r, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/50 p-2.5 font-mono text-xs">
            <div className="mb-1 flex items-center gap-1.5">
              {r.passed ? (
                <CheckCircle2 className="size-3.5 text-emerald-400" />
              ) : r.status === "error" ? (
                <AlertTriangle className="size-3.5 text-amber-400" />
              ) : (
                <XCircle className="size-3.5 text-rose-400" />
              )}
              <span className="font-sans font-medium">Case {i + 1}</span>
            </div>
            <div className="text-muted-foreground">Input: {r.input.replace(/\n/g, " ⏎ ")}</div>
            {r.passed || r.message ? (
              <>
                <div className="text-muted-foreground">
                  Expected: <span className="text-emerald-300">{r.expected}</span>
                </div>
                <div className="text-muted-foreground">
                  Got:{" "}
                  <span className={r.passed ? "text-emerald-300" : "text-rose-300"}>
                    {r.message ? r.message : r.stdout.trim() || "(no output)"}
                  </span>
                </div>
              </>
            ) : (
              <OutputDiff expected={r.expected} actual={r.stdout} className="mt-1.5" />
            )}
            {!r.passed && r.stderr && (
              <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap text-rose-300 scrollbar-thin">
                {r.stderr}
              </pre>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Run your code against the sample tests, or Submit to run the full suite.
    </p>
  );
}
