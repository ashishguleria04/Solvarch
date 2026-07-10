import { getLanguage } from "@/lib/constants";
import type { ExecInput, ExecResult, ExecutionProvider } from "./types";

const PAIZA_URL = process.env.PAIZA_API_URL || "https://api.paiza.io";
const PAIZA_KEY = process.env.PAIZA_API_KEY || "guest";

type CreateResponse = { id?: string; status?: string; error?: string };

type DetailsResponse = {
  id: string;
  status: "running" | "completed";
  build_stderr: string | null;
  build_exit_code: string | null;
  build_result: string | null; // "success" | "failure" | null
  stdout: string | null;
  stderr: string | null;
  exit_code: string | null;
  time: string | null;
  result: string | null; // "success" | "failure" | "timeout"
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Paiza.IO runner (default). Free, no key required (`guest`). Async model:
 * create a run, then poll get_details until completed.
 */
export class PaizaProvider implements ExecutionProvider {
  async run(input: ExecInput): Promise<ExecResult> {
    const lang = getLanguage(input.languageId);
    if (!lang) {
      return errResult(`Unsupported language: ${input.languageId}`);
    }

    const started = Date.now();

    let created: CreateResponse;
    try {
      const params = new URLSearchParams({
        source_code: input.source,
        language: lang.paiza,
        input: input.stdin ?? "",
        api_key: PAIZA_KEY,
      });
      const res = await fetch(`${PAIZA_URL}/runners/create`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        cache: "no-store",
      });
      if (!res.ok) {
        return errResult(
          res.status === 429
            ? "The code runner is busy right now. Please try again in a moment."
            : `Runner error (${res.status}).`
        );
      }
      created = (await res.json()) as CreateResponse;
    } catch (err) {
      return errResult(
        err instanceof Error ? err.message : "Failed to reach the code runner."
      );
    }

    if (!created.id) {
      return errResult(created.error || "Runner did not accept the job.");
    }

    // Poll for completion (~10s max).
    let details: DetailsResponse | null = null;
    for (let attempt = 0; attempt < 15; attempt++) {
      await sleep(attempt === 0 ? 400 : 600);
      try {
        const res = await fetch(
          `${PAIZA_URL}/runners/get_details?id=${created.id}&api_key=${PAIZA_KEY}`,
          { cache: "no-store" }
        );
        if (!res.ok) continue;
        const d = (await res.json()) as DetailsResponse;
        if (d.status === "completed") {
          details = d;
          break;
        }
      } catch {
        // transient — keep polling
      }
    }

    const timeMs = Date.now() - started;
    if (!details) {
      return {
        stdout: "",
        stderr: "",
        exitCode: null,
        timeMs,
        status: "timeout",
        message: "Execution timed out.",
      };
    }

    const buildFailed = details.build_result === "failure";
    if (buildFailed) {
      return {
        stdout: "",
        stderr: details.build_stderr ?? "",
        compileOutput: details.build_stderr ?? "",
        exitCode: details.build_exit_code ? Number(details.build_exit_code) : null,
        timeMs,
        status: "compile_error",
      };
    }

    const exitCode = details.exit_code ? Number(details.exit_code) : 0;
    let status: ExecResult["status"] = "success";
    if (details.result === "timeout") status = "timeout";
    else if (details.result === "failure" || exitCode !== 0) status = "runtime_error";

    return {
      stdout: details.stdout ?? "",
      stderr: details.stderr ?? "",
      exitCode,
      timeMs: details.time ? Math.round(Number(details.time) * 1000) : timeMs,
      status,
    };
  }
}

function errResult(message: string): ExecResult {
  return {
    stdout: "",
    stderr: "",
    exitCode: null,
    timeMs: null,
    status: "error",
    message,
  };
}
