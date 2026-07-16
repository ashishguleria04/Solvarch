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

/**
 * Starter code for one language, split so the learner only ever sees the
 * solution function. The hidden stdin/stdout driver is stitched back around
 * their code at run/submit time: full source = prefix + visible + suffix.
 */
export type StarterSnippet = {
  /** What the learner sees and edits — just the solution function. */
  visible: string;
  /** Hidden driver above the visible code (imports, node classes, helpers). */
  prefix: string;
  /** Hidden driver below the visible code (main: parse stdin, call, print). */
  suffix: string;
};

export type StarterLanguage = "python" | "javascript" | "java" | "cpp";

export type StarterBundle = Record<StarterLanguage, StarterSnippet>;

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
  starterCode: StarterBundle;
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
