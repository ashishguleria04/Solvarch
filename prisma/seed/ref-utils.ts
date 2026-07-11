// Helpers for reference solutions (run at seed time with local Node to
// generate exact expected outputs).

export const lines = (s: string): string[] => s.split("\n");

export const ints = (line: string | undefined): number[] =>
  (line ?? "")
    .trim()
    .split(/\s+/)
    .filter((x) => x.length > 0)
    .map(Number);

export const int = (line: string | undefined): number => parseInt((line ?? "0").trim(), 10);

export const boolOut = (b: boolean): string => (b ? "true" : "false");

export const arrOut = (a: number[]): string => a.join(" ");

/** Space-separated words from a line. */
export const words = (line: string | undefined): string[] =>
  (line ?? "")
    .trim()
    .split(/\s+/)
    .filter((x) => x.length > 0);

/** string[] -> one per line, in order. */
export const linesOut = (a: string[]): string => a.join("\n");

/** string[] -> sorted lexicographically, one per line (matches sortedLines printers). */
export const sortedLinesOut = (a: string[]): string => [...a].sort().join("\n");

/** int[][] -> rows space-joined, one per line, in order. */
export const matOut = (rows: number[][]): string =>
  rows.map((r) => r.join(" ")).join("\n");

/** int[][] -> rows space-joined then sorted lexicographically (matches sortedIntMatrix). */
export const sortedMatOut = (rows: number[][]): string =>
  rows
    .map((r) => r.join(" "))
    .sort()
    .join("\n");

/** Minimal binary tree node for reference solutions. */
export class TNode {
  val: number;
  left: TNode | null = null;
  right: TNode | null = null;
  constructor(v: number) {
    this.val = v;
  }
}

/** Parse a level-order token line ("3 9 20 null null 15 7") into a tree. */
export const parseTree = (line: string | undefined): TNode | null => {
  const toks = (line ?? "").trim().split(/\s+/).filter(Boolean);
  if (toks.length === 0 || toks[0] === "null") return null;
  const root = new TNode(parseInt(toks[0], 10));
  const q: TNode[] = [root];
  let i = 1;
  while (q.length && i < toks.length) {
    const node = q.shift()!;
    if (i < toks.length && toks[i] !== "null") {
      node.left = new TNode(parseInt(toks[i], 10));
      q.push(node.left);
    }
    i++;
    if (i < toks.length && toks[i] !== "null") {
      node.right = new TNode(parseInt(toks[i], 10));
      q.push(node.right);
    }
    i++;
  }
  return root;
};

/** Serialize a tree to level-order tokens, trailing nulls trimmed ("null" if empty). */
export const treeOut = (root: TNode | null): string => {
  if (!root) return "null";
  const out: string[] = [];
  const q: (TNode | null)[] = [root];
  while (q.length) {
    const node = q.shift()!;
    if (node) {
      out.push(String(node.val));
      q.push(node.left);
      q.push(node.right);
    } else {
      out.push("null");
    }
  }
  while (out.length && out[out.length - 1] === "null") out.pop();
  return out.join(" ");
};

/**
 * A real, always-valid YouTube search URL for a curated channel + topic.
 * Avoids fabricating specific video IDs while pointing learners at the right
 * creators (NeetCode, Abdul Bari, Tushar Roy, etc.). Upgradeable to exact
 * video links later.
 */
export const yt = (query: string): string =>
  "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
