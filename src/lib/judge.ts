import { getProblem, type TestCase } from "@/data/dsa";
import { runCode, runTestCase, type TestOutcome } from "@/lib/execution";

/** Cap on how many test cases we execute per submit (rate-limit friendly). */
const MAX_SUBMIT_TESTS = 20;

export type SubmissionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "COMPILE_ERROR";

export type RunResult =
  | { kind: "custom"; stdout: string; stderr: string; status: string; timeMs: number | null; message?: string }
  | { kind: "samples"; results: TestOutcome[]; passed: number; total: number };

export type SubmitResult = {
  status: SubmissionStatus;
  passed: number;
  total: number;
  runtimeMs: number | null;
  firstFailure?: {
    input: string;
    expected: string;
    got: string;
    stderr: string;
  };
  message?: string;
};

/** Run sample tests (or a custom stdin) — no persistence. */
export async function runSamples(params: {
  slug: string;
  language: string;
  code: string;
  customInput?: string;
}): Promise<RunResult> {
  const { slug, language, code, customInput } = params;

  if (typeof customInput === "string" && customInput.length > 0) {
    const r = await runCode({ languageId: language, source: code, stdin: customInput });
    return {
      kind: "custom",
      stdout: r.stdout,
      stderr: r.compileOutput ? `${r.compileOutput}\n${r.stderr}`.trim() : r.stderr,
      status: r.status,
      timeMs: r.timeMs,
      message: r.message,
    };
  }

  const samples = getProblem(slug)?.testCases.filter((tc) => tc.isSample) ?? [];

  const results: TestOutcome[] = [];
  for (const tc of samples) {
    results.push(
      await runTestCase(language, code, {
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })
    );
  }
  return {
    kind: "samples",
    results,
    passed: results.filter((r) => r.passed).length,
    total: results.length,
  };
}

/** Run the full (capped) test suite and return a verdict. No persistence. */
export async function submitSolution(params: {
  slug: string;
  language: string;
  code: string;
}): Promise<SubmitResult> {
  const { slug, language, code } = params;

  // Samples first so failures surface on the cases the learner can see.
  const all = getProblem(slug)?.testCases ?? [];
  const testCases: TestCase[] = [
    ...all.filter((tc) => tc.isSample),
    ...all.filter((tc) => !tc.isSample),
  ].slice(0, MAX_SUBMIT_TESTS);

  const outcomes: TestOutcome[] = [];
  let totalTime = 0;
  let firstFailure: SubmitResult["firstFailure"];
  let status: SubmissionStatus = "ACCEPTED";
  let message: string | undefined;

  for (const tc of testCases) {
    const outcome = await runTestCase(language, code, {
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    });
    outcomes.push(outcome);
    if (outcome.timeMs) totalTime += outcome.timeMs;

    if (!outcome.passed && !firstFailure) {
      // Map first failure to a verdict.
      if (outcome.status === "compile_error") status = "COMPILE_ERROR";
      else if (outcome.status === "timeout") status = "TIME_LIMIT_EXCEEDED";
      else if (outcome.status === "runtime_error") status = "RUNTIME_ERROR";
      else if (outcome.status === "error") {
        status = "PENDING";
        message = outcome.message ?? "The code runner is unavailable.";
      } else status = "WRONG_ANSWER";

      firstFailure = {
        input: tc.input,
        expected: outcome.expected,
        got: outcome.stdout,
        stderr: outcome.stderr,
      };
    }
  }

  const passed = outcomes.filter((o) => o.passed).length;
  const total = outcomes.length;
  const runtimeMs = outcomes.length ? Math.round(totalTime / outcomes.length) : null;

  return { status, passed, total, runtimeMs, firstFailure, message };
}
