import { getLanguage } from "@/lib/constants";
import type { ExecInput, ExecResult, ExecutionProvider } from "./types";

/**
 * Judge0 provider. Set JUDGE0_URL (self-hosted or RapidAPI host) and, for
 * RapidAPI, JUDGE0_RAPIDAPI_KEY. Used when EXECUTION_PROVIDER=judge0.
 */
export class Judge0Provider implements ExecutionProvider {
  private base = process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
  private rapidKey = process.env.JUDGE0_RAPIDAPI_KEY;

  private headers(): HeadersInit {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (this.rapidKey) {
      h["X-RapidAPI-Key"] = this.rapidKey;
      h["X-RapidAPI-Host"] = new URL(this.base).host;
    }
    return h;
  }

  async run(input: ExecInput): Promise<ExecResult> {
    const lang = getLanguage(input.languageId);
    if (!lang) {
      return base("error", { message: `Unsupported language: ${input.languageId}` });
    }
    const started = Date.now();
    try {
      const res = await fetch(
        `${this.base}/submissions?base64_encoded=false&wait=true`,
        {
          method: "POST",
          headers: this.headers(),
          body: JSON.stringify({
            language_id: lang.judge0,
            source_code: input.source,
            stdin: input.stdin ?? "",
            cpu_time_limit: 8,
          }),
          cache: "no-store",
        }
      );
      const timeMs = Date.now() - started;
      if (!res.ok) {
        return base("error", { timeMs, message: `Runner error (${res.status}).` });
      }
      const d = await res.json();
      const statusId: number = d.status?.id ?? 0;
      // Judge0 status ids: 3=Accepted, 6=Compilation error, 5=TLE, others=runtime
      let status: ExecResult["status"] = "success";
      if (statusId === 6) status = "compile_error";
      else if (statusId === 5) status = "timeout";
      else if (statusId >= 7) status = "runtime_error";
      return {
        stdout: d.stdout ?? "",
        stderr: d.stderr ?? "",
        compileOutput: d.compile_output ?? undefined,
        exitCode: d.exit_code ?? null,
        timeMs: d.time ? Math.round(Number(d.time) * 1000) : timeMs,
        status,
      };
    } catch (err) {
      return base("error", {
        message: err instanceof Error ? err.message : "Failed to reach the code runner.",
      });
    }
  }
}

function base(
  status: ExecResult["status"],
  extra: Partial<ExecResult> = {}
): ExecResult {
  return {
    stdout: "",
    stderr: "",
    exitCode: null,
    timeMs: null,
    status,
    ...extra,
  };
}
