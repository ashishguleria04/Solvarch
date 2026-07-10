export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SeedExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type SeedApproach = {
  name: string;
  complexityTime: string;
  complexitySpace: string;
  body: string;
};

export type SeedTest = {
  input: string;
  sample?: boolean;
};

export type SeedProblem = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  /** Markdown problem statement (includes the stdin/stdout I/O format). */
  statement: string;
  constraints?: string;
  examples: SeedExample[];
  hints: string[];
  editorial?: string;
  approaches?: SeedApproach[];
  complexityTime?: string;
  complexitySpace?: string;
  youtubeUrl?: string;
  tags: string[];
  starterCode: { python: string; javascript: string; java: string; cpp: string };
  /** Correct solution over raw stdin -> exact expected stdout. Runs at seed time. */
  reference: (input: string) => string;
  tests: SeedTest[];
};

export type SeedTopic = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  problems: SeedProblem[];
};
