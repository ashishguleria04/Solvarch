import { getLanguage } from "@/lib/constants";
import type { ExecInput, ExecResult, ExecutionProvider } from "./types";

const PISTON_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston";

type PistonStage = {
  stdout: string;
  stderr: string;
  output: string;
  code: number | null;
  signal: string | null;
};

type PistonResponse = {
  language: string;
  version: string;
  run: PistonStage;
  compile?: PistonStage;
  message?: string;
};

function fileNameFor(languageId: string, ext: string): string {
  // Java requires the public class to be named Main.
  if (languageId === "java") return "Main.java";
  return `main.${ext}`;
}

export class PistonProvider implements ExecutionProvider {
  async run(input: ExecInput): Promise<ExecResult> {
    const lang = getLanguage(input.languageId);
    if (!lang) {
      return {
        stdout: "",
        stderr: "",
        exitCode: null,
        timeMs: null,
        status: "error",
        message: `Unsupported language: ${input.languageId}`,
      };
    }

    const body = {
      language: lang.piston.language,
      version: lang.piston.version,
      files: [
        {
          name: fileNameFor(lang.id, lang.ext),
          content: input.source,
        },
      ],
      stdin: input.stdin ?? "",
      compile_timeout: 10000,
      run_timeout: 8000,
    };

    const started = Date.now();
    let res: Response;
    try {
      res = await fetch(`${PISTON_URL}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        // Do not cache execution requests.
        cache: "no-store",
      });
    } catch (err) {
      return {
        stdout: "",
        stderr: "",
        exitCode: null,
        timeMs: null,
        status: "error",
        message:
          err instanceof Error ? err.message : "Failed to reach the code runner.",
      };
    }
    const timeMs = Date.now() - started;

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        stdout: "",
        stderr: "",
        exitCode: null,
        timeMs,
        status: "error",
        message:
          res.status === 429
            ? "The code runner is rate-limited right now. Please try again in a moment."
            : `Runner error (${res.status}). ${text.slice(0, 200)}`,
      };
    }

    const data = (await res.json()) as PistonResponse;

    // Compilation failure (compiled languages).
    if (data.compile && data.compile.code !== 0) {
      return {
        stdout: data.compile.stdout ?? "",
        stderr: data.compile.stderr ?? "",
        compileOutput: data.compile.output ?? "",
        exitCode: data.compile.code,
        timeMs,
        status: "compile_error",
      };
    }

    const run = data.run;
    const timedOut = run.signal === "SIGKILL" || run.signal === "SIGXCPU";
    let status: ExecResult["status"] = "success";
    if (timedOut) status = "timeout";
    else if (run.code !== 0) status = "runtime_error";

    return {
      stdout: run.stdout ?? "",
      stderr: run.stderr ?? "",
      exitCode: run.code,
      timeMs,
      status,
    };
  }
}
