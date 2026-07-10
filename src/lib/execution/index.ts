import { PaizaProvider } from "./paiza";
import { PistonProvider } from "./piston";
import { Judge0Provider } from "./judge0";
import type { ExecInput, ExecResult, ExecutionProvider } from "./types";

export type { ExecInput, ExecResult, ExecStatus } from "./types";

/**
 * Execution provider selection (env `EXECUTION_PROVIDER`):
 *   - "paiza"  (default) — free public runner, no key
 *   - "piston" — self-hosted Piston (set PISTON_API_URL)
 *   - "judge0" — Judge0 CE / RapidAPI (set JUDGE0_URL, JUDGE0_RAPIDAPI_KEY)
 */
function selectProvider(): ExecutionProvider {
  switch ((process.env.EXECUTION_PROVIDER || "paiza").toLowerCase()) {
    case "piston":
      return new PistonProvider();
    case "judge0":
      return new Judge0Provider();
    default:
      return new PaizaProvider();
  }
}

const provider = selectProvider();

export function runCode(input: ExecInput): Promise<ExecResult> {
  return provider.run(input);
}

/** Normalize program output for comparison against expected output. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/g, "")) // trailing whitespace per line
    .join("\n")
    .replace(/\n+$/g, ""); // trailing blank lines
}

export type TestOutcome = {
  passed: boolean;
  status: ExecResult["status"];
  stdout: string;
  stderr: string;
  expected: string;
  input: string;
  timeMs: number | null;
  message?: string;
};

/** Run a single test case and compare output. */
export async function runTestCase(
  languageId: string,
  source: string,
  testCase: { input: string; expectedOutput: string }
): Promise<TestOutcome> {
  const result = await runCode({
    languageId,
    source,
    stdin: testCase.input,
  });

  const passed =
    result.status === "success" &&
    normalizeOutput(result.stdout) === normalizeOutput(testCase.expectedOutput);

  return {
    passed,
    status: result.status,
    stdout: result.stdout,
    stderr: result.compileOutput
      ? `${result.compileOutput}\n${result.stderr}`.trim()
      : result.stderr,
    expected: testCase.expectedOutput,
    input: testCase.input,
    timeMs: result.timeMs,
    message: result.message,
  };
}
