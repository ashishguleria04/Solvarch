export type ExecStatus =
  | "success"
  | "compile_error"
  | "runtime_error"
  | "timeout"
  | "error";

export type ExecResult = {
  stdout: string;
  stderr: string;
  compileOutput?: string;
  exitCode: number | null;
  timeMs: number | null;
  status: ExecStatus;
  /** Human-readable message when status === "error" (infra/network). */
  message?: string;
};

export type ExecInput = {
  languageId: string; // our internal id: python | javascript | java | cpp
  source: string;
  stdin?: string;
};

export interface ExecutionProvider {
  run(input: ExecInput): Promise<ExecResult>;
}
