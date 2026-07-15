import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, yt, lines, sortedLinesOut, sortedMatOut } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const backtracking: SeedProblem[] = [
  {
    slug: "subsets",
    title: "Subsets",
    difficulty: "MEDIUM",
    statement: `Given an array of **distinct** integers, return all possible subsets (the power set).

**Input**: one line of space-separated integers.
**Output**: one subset per line, elements in ascending order (the empty subset prints as an empty line). Subsets may be produced in any order — the template prints them canonically.`,
    constraints: `- 1 ≤ nums.length ≤ 10
- Distinct values.`,
    examples: [
      { input: "1 2 3", output: "\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3" },
      { input: "0", output: "\n0" },
    ],
    hints: [
      "Every element is either in or out — 2ⁿ combinations.",
      "Backtrack: at index i, branch on include/exclude and recurse on i+1.",
      "Record the current path at every node of the recursion tree, not just leaves.",
    ],
    editorial: `Classic backtracking: walk indices left to right, and at each step either take the element or skip it, recording the running path as a subset at every call. The recursion tree has exactly 2ⁿ leaves; total work is O(n · 2ⁿ). Sorting the input first makes each subset come out in ascending order.`,
    approaches: [
      {
        name: "Iterative doubling",
        complexityTime: "O(n · 2ⁿ)",
        complexitySpace: "O(2ⁿ)",
        body: "Start with [[]]; for each element, append it to a copy of every existing subset.",
      },
      {
        name: "Backtracking DFS",
        complexityTime: "O(n · 2ⁿ)",
        complexitySpace: "O(n) recursion",
        body: "Include/exclude branching over indices; emit the path at each node.",
      },
    ],
    complexityTime: "O(n · 2ⁿ)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode subsets backtracking"),
    tags: ["backtracking", "bit-manipulation", "recursion"],
    starterCode: buildStarter("intArray", "sortedIntMatrix", "subsets"),
    reference: (input) => {
      const nums = first(input).sort((a, b) => a - b);
      const rows: number[][] = [];
      const path: number[] = [];
      const dfs = (i: number) => {
        rows.push([...path]);
        for (let j = i; j < nums.length; j++) {
          path.push(nums[j]);
          dfs(j + 1);
          path.pop();
        }
      };
      dfs(0);
      return sortedMatOut(rows);
    },
    tests: [
      { input: "1 2 3", sample: true },
      { input: "0", sample: true },
      { input: "5 7" },
      { input: "4 1 0 -3" },
    ],
  },

  {
    slug: "permutations",
    title: "Permutations",
    difficulty: "MEDIUM",
    statement: `Given an array of **distinct** integers, return all possible orderings (permutations).

**Input**: one line of space-separated integers.
**Output**: one permutation per line, space-separated. Any generation order — the template prints canonically.`,
    constraints: `- 1 ≤ nums.length ≤ 6
- Distinct values.`,
    examples: [
      { input: "1 2 3", output: "1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1" },
      { input: "1", output: "1" },
    ],
    hints: [
      "Build the permutation one position at a time.",
      "Track which elements are already used (a boolean array or in-place swapping).",
    ],
    editorial: `Backtrack over positions: at each depth, try every unused element, mark it used, recurse, then unmark. The recursion tree has n! leaves and each permutation costs O(n) to copy → O(n · n!). The in-place swap variant avoids the used-array by fixing one element per depth via swapping.`,
    complexityTime: "O(n · n!)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode permutations backtracking"),
    tags: ["backtracking", "recursion"],
    starterCode: buildStarter("intArray", "sortedIntMatrix", "permute"),
    reference: (input) => {
      const nums = first(input);
      const rows: number[][] = [];
      const used = new Array(nums.length).fill(false);
      const path: number[] = [];
      const dfs = () => {
        if (path.length === nums.length) {
          rows.push([...path]);
          return;
        }
        for (let i = 0; i < nums.length; i++) {
          if (used[i]) continue;
          used[i] = true;
          path.push(nums[i]);
          dfs();
          path.pop();
          used[i] = false;
        }
      };
      dfs();
      return sortedMatOut(rows);
    },
    tests: [
      { input: "1 2 3", sample: true },
      { input: "1", sample: true },
      { input: "0 1" },
      { input: "5 4 6 2" },
    ],
  },

  {
    slug: "combination-sum",
    title: "Combination Sum",
    difficulty: "MEDIUM",
    statement: `Given an array of **distinct** positive integers \`candidates\` and a \`target\`, return all unique combinations that sum to \`target\`. The same candidate may be used **unlimited** times.

**Input**
- Line 1: space-separated candidates
- Line 2: integer \`target\`

**Output**: one combination per line, elements in non-decreasing order. Print nothing if none exist.`,
    constraints: `- 1 ≤ candidates.length ≤ 30
- 2 ≤ candidates[i] ≤ 40, distinct
- 1 ≤ target ≤ 40`,
    examples: [
      { input: "2 3 6 7\n7", output: "2 2 3\n7" },
      { input: "2 3 5\n8", output: "2 2 2 2\n2 3 3\n3 5" },
      { input: "2\n1", output: "" },
    ],
    hints: [
      "To reuse an element, recurse with the same start index after taking it.",
      "To avoid duplicate combinations, never look backwards — only consider candidates from the current index on.",
      "Prune when the remaining target goes negative.",
    ],
    editorial: `DFS over (start index, remaining target): take \`candidates[i]\` and recurse **without advancing** \`i\` (unlimited reuse), or move on to \`i + 1\`. Restricting choices to indices ≥ start guarantees each combination is generated exactly once in non-decreasing order. Prune on negative remainders; emit on zero.`,
    complexityTime: "O(k · 2^(target/min))",
    complexitySpace: "O(target/min)",
    youtubeUrl: yt("neetcode combination sum"),
    tags: ["backtracking", "recursion", "array"],
    starterCode: buildStarter("intArrayTarget", "sortedIntMatrix", "combinationSum"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const cands = ints(l0).sort((a, b) => a - b);
      const target = int(l1);
      const rows: number[][] = [];
      const path: number[] = [];
      const dfs = (start: number, rem: number) => {
        if (rem === 0) {
          rows.push([...path]);
          return;
        }
        for (let i = start; i < cands.length; i++) {
          if (cands[i] > rem) break;
          path.push(cands[i]);
          dfs(i, rem - cands[i]);
          path.pop();
        }
      };
      dfs(0, target);
      return sortedMatOut(rows);
    },
    tests: [
      { input: "2 3 6 7\n7", sample: true },
      { input: "2 3 5\n8", sample: true },
      { input: "2\n1", sample: true },
      { input: "7 3 2\n18" },
      { input: "8 7 4 3\n11" },
    ],
  },

  {
    slug: "combination-sum-ii",
    title: "Combination Sum II",
    difficulty: "MEDIUM",
    statement: `Given a list of positive integers \`candidates\` (duplicates possible) and a \`target\`, return all **unique** combinations summing to \`target\`. Each candidate may be used **at most once**.

**Input**
- Line 1: space-separated candidates
- Line 2: integer \`target\`

**Output**: one combination per line, elements in non-decreasing order; no duplicate lines.`,
    constraints: `- 1 ≤ candidates.length ≤ 100
- 1 ≤ candidates[i] ≤ 50
- 1 ≤ target ≤ 30`,
    examples: [
      { input: "10 1 2 7 6 1 5\n8", output: "1 1 6\n1 2 5\n1 7\n2 6" },
      { input: "2 5 2 1 2\n5", output: "1 2 2\n5" },
    ],
    hints: [
      "Sort first so duplicates are adjacent.",
      "Advance to i+1 when recursing (single use).",
      "At the same recursion depth, skip a candidate equal to its predecessor — that's what kills duplicate combinations.",
    ],
    editorial: `Sort, then DFS advancing the index on every take (single use). The deduplication rule: within one loop level, if \`candidates[i] == candidates[i-1]\` and \`i > start\`, skip — using the second copy where the first was already tried can only recreate the same combination. Prune when the candidate exceeds the remainder.`,
    complexityTime: "O(2ⁿ)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode combination sum ii"),
    tags: ["backtracking", "recursion", "array"],
    starterCode: buildStarter("intArrayTarget", "sortedIntMatrix", "combinationSum2"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const cands = ints(l0).sort((a, b) => a - b);
      const target = int(l1);
      const rows: number[][] = [];
      const path: number[] = [];
      const dfs = (start: number, rem: number) => {
        if (rem === 0) {
          rows.push([...path]);
          return;
        }
        for (let i = start; i < cands.length; i++) {
          if (i > start && cands[i] === cands[i - 1]) continue;
          if (cands[i] > rem) break;
          path.push(cands[i]);
          dfs(i + 1, rem - cands[i]);
          path.pop();
        }
      };
      dfs(0, target);
      return sortedMatOut(rows);
    },
    tests: [
      { input: "10 1 2 7 6 1 5\n8", sample: true },
      { input: "2 5 2 1 2\n5", sample: true },
      { input: "1 1 1 1\n2" },
      { input: "3 1 3 5 1 1\n8" },
    ],
  },

  {
    slug: "generate-parentheses",
    title: "Generate Parentheses",
    difficulty: "MEDIUM",
    statement: `Given \`n\`, generate all combinations of \`n\` pairs of well-formed parentheses.

**Input**: one line, the integer \`n\`.
**Output**: one combination per line. Any order — the template prints canonically.`,
    constraints: `- 1 ≤ n ≤ 8`,
    examples: [
      { input: "3", output: "((()))\n(()())\n(())()\n()(())\n()()()" },
      { input: "1", output: "()" },
    ],
    hints: [
      "Track how many opens and closes you've placed.",
      "You may open while opens < n; you may close while closes < opens.",
      "Those two rules alone guarantee validity — no post-filtering needed.",
    ],
    editorial: `Backtrack on a partial string with counts \`(open, close)\`: place \`(\` while \`open < n\`, place \`)\` while \`close < open\`. Every leaf at length 2n is valid by construction. The number of results is the n-th **Catalan number**, so the work is O(4ⁿ/√n) — tiny for interview-sized n.`,
    complexityTime: "O(4ⁿ / √n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode generate parentheses"),
    tags: ["backtracking", "string", "recursion"],
    starterCode: buildStarter("int", "sortedLines", "generateParenthesis"),
    reference: (input) => {
      const n = int(lines(input)[0]);
      const res: string[] = [];
      const dfs = (cur: string, open: number, close: number) => {
        if (cur.length === 2 * n) {
          res.push(cur);
          return;
        }
        if (open < n) dfs(cur + "(", open + 1, close);
        if (close < open) dfs(cur + ")", open, close + 1);
      };
      dfs("", 0, 0);
      return sortedLinesOut(res);
    },
    tests: [
      { input: "3", sample: true },
      { input: "1", sample: true },
      { input: "2" },
      { input: "4" },
    ],
  },

  {
    slug: "letter-combinations-of-a-phone-number",
    title: "Letter Combinations of a Phone Number",
    difficulty: "MEDIUM",
    statement: `Given a string of digits 2–9, return all letter combinations the number could represent on a classic phone keypad (2=abc, 3=def, 4=ghi, 5=jkl, 6=mno, 7=pqrs, 8=tuv, 9=wxyz).

**Input**: one line, the digit string (may be empty).
**Output**: one combination per line (nothing for an empty input). Any order — printed canonically.`,
    constraints: `- 0 ≤ digits.length ≤ 4
- Digits 2–9 only.`,
    examples: [
      { input: "23", output: "ad\nae\naf\nbd\nbe\nbf\ncd\nce\ncf" },
      { input: "2", output: "a\nb\nc" },
    ],
    hints: [
      "One recursion level per digit; branch over that digit's letters.",
      "The result count is the product of the group sizes.",
    ],
    editorial: `Map each digit to its letters and do a depth-per-digit DFS, appending one letter per level and emitting at full length. Equivalent iterative view: fold each digit into the running result as a cartesian product. Output size is up to 4ⁿ, which dominates the cost.`,
    complexityTime: "O(n · 4ⁿ)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode letter combinations of a phone number"),
    tags: ["backtracking", "string", "hash-table"],
    starterCode: buildStarter("string", "sortedLines", "letterCombinations"),
    reference: (input) => {
      const digits = (lines(input)[0] ?? "").trim();
      if (!digits) return "";
      const map: Record<string, string> = {
        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
      };
      let res: string[] = [""];
      for (const d of digits) {
        const next: string[] = [];
        for (const prefix of res) for (const c of map[d]) next.push(prefix + c);
        res = next;
      }
      return sortedLinesOut(res);
    },
    tests: [
      { input: "23", sample: true },
      { input: "2", sample: true },
      { input: "" },
      { input: "79" },
    ],
  },

  {
    slug: "palindrome-partitioning",
    title: "Palindrome Partitioning",
    difficulty: "MEDIUM",
    statement: `Given a string \`s\`, partition it so every piece is a palindrome. Return all such partitions.

**Input**: one line, the string \`s\`.
**Output**: one partition per line — its pieces space-separated, in order. Any partition order — printed canonically.`,
    constraints: `- 1 ≤ s.length ≤ 16
- Lowercase English letters.`,
    examples: [
      { input: "aab", output: "a a b\naa b" },
      { input: "a", output: "a" },
    ],
    hints: [
      "Choose a palindromic prefix, then recurse on the remaining suffix.",
      "Backtrack over the cut position; test each prefix for palindromicity.",
      "Precomputing a isPal[i][j] DP table avoids re-checking substrings.",
    ],
    editorial: `DFS over cut positions: at index \`i\`, try every \`j ≥ i\` where \`s[i..j]\` is a palindrome, push that piece, recurse from \`j + 1\`, pop. Every full segmentation reaching the end is emitted. An O(n²) palindrome table turns each check into O(1); the output itself can be exponential (e.g. all-equal strings), which bounds the runtime.`,
    complexityTime: "O(n · 2ⁿ)",
    complexitySpace: "O(n²)",
    youtubeUrl: yt("neetcode palindrome partitioning"),
    tags: ["backtracking", "string", "dynamic-programming"],
    starterCode: buildStarter("string", "sortedLines", "partition"),
    reference: (input) => {
      const s = (lines(input)[0] ?? "").trim();
      const res: string[] = [];
      const path: string[] = [];
      const isPal = (a: number, b: number): boolean => {
        while (a < b) {
          if (s[a] !== s[b]) return false;
          a++;
          b--;
        }
        return true;
      };
      const dfs = (i: number) => {
        if (i === s.length) {
          res.push(path.join(" "));
          return;
        }
        for (let j = i; j < s.length; j++) {
          if (isPal(i, j)) {
            path.push(s.slice(i, j + 1));
            dfs(j + 1);
            path.pop();
          }
        }
      };
      dfs(0);
      return sortedLinesOut(res);
    },
    tests: [
      { input: "aab", sample: true },
      { input: "a", sample: true },
      { input: "abba" },
      { input: "aaa" },
    ],
  },

  {
    slug: "n-queens-ii",
    title: "N-Queens II",
    difficulty: "HARD",
    statement: `Count the number of distinct ways to place \`n\` queens on an \`n × n\` chessboard so that no two attack each other (no shared row, column, or diagonal).

**Input**: one line, the integer \`n\`.
**Output**: the number of solutions.`,
    constraints: `- 1 ≤ n ≤ 9`,
    examples: [
      { input: "4", output: "2" },
      { input: "1", output: "1" },
    ],
    hints: [
      "Place one queen per row; only columns and diagonals need checking.",
      "Index diagonals by (row − col) and (row + col) for O(1) conflict checks.",
      "Sets (or bitmasks) for columns and both diagonal families make the check constant-time.",
    ],
    editorial: `Backtrack row by row, choosing a column for each queen. Conflicts are captured by three sets: used columns, used ↘ diagonals (row − col), and used ↙ diagonals (row + col) — membership tests are O(1). On a dead row, backtrack. Bitmask variants pack the three sets into integers for the fastest known simple solver. Roughly O(n!) worst case.`,
    complexityTime: "O(n!)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode n queens"),
    tags: ["backtracking", "recursion"],
    starterCode: buildStarter("int", "int", "totalNQueens"),
    reference: (input) => {
      const n = int(lines(input)[0]);
      const cols = new Set<number>();
      const d1 = new Set<number>();
      const d2 = new Set<number>();
      let count = 0;
      const dfs = (row: number) => {
        if (row === n) {
          count++;
          return;
        }
        for (let c = 0; c < n; c++) {
          if (cols.has(c) || d1.has(row - c) || d2.has(row + c)) continue;
          cols.add(c);
          d1.add(row - c);
          d2.add(row + c);
          dfs(row + 1);
          cols.delete(c);
          d1.delete(row - c);
          d2.delete(row + c);
        }
      };
      dfs(0);
      return String(count);
    },
    tests: [
      { input: "4", sample: true },
      { input: "1", sample: true },
      { input: "2" },
      { input: "5" },
      { input: "8" },
    ],
  },

  {
    slug: "subsets-ii",
    title: "Subsets II",
    difficulty: "MEDIUM",
    statement: `Given an array of integers **that may contain duplicates**, return all possible subsets — without any duplicate subsets in the output.

**Input**: one line of space-separated integers.
**Output**: one subset per line, elements in ascending order (the empty subset prints as an empty line). Subsets may be produced in any order — the template prints them canonically.`,
    constraints: `- 1 ≤ nums.length ≤ 10
- -10 ≤ values ≤ 10 (duplicates allowed)`,
    examples: [
      { input: "1 2 2", output: "\n1\n1 2\n1 2 2\n2\n2 2" },
      { input: "0", output: "\n0" },
    ],
    hints: [
      "Sort first so duplicates sit together.",
      "Generating all subsets then deduping with a set works — but the elegant fix prunes duplicates before they're born.",
      "At each recursion level, skip a value equal to the one just tried at the same level: if j > i and nums[j] == nums[j−1], continue.",
    ],
    editorial: `Sort, then run the standard subsets DFS with one added guard: within a single level of the recursion (the for-loop over candidate positions), never *start* a branch with a value you already started one with — \`j > i && nums[j] === nums[j−1] → skip\`. Choosing the second '2' at a level where the first '2' was already explored would rebuild the identical subtree of subsets. Note the condition is about *the same level*, not adjacent picks — taking consecutive equal values deeper in one branch (to form [2 2]) remains legal. O(n · 2ⁿ) worst case, and the same skip-guard powers Combination Sum II and Permutations II — it's the canonical dedup idiom for backtracking.`,
    approaches: [
      {
        name: "Sort + same-level skip",
        complexityTime: "O(n · 2ⁿ)",
        complexitySpace: "O(n) recursion",
        body: "The standard include/exclude walk; equal values may only start one branch per level.",
      },
      {
        name: "Generate + set dedup",
        complexityTime: "O(n · 2ⁿ)",
        complexitySpace: "O(2ⁿ)",
        body: "Serialize each subset into a set — correct but wasteful; mention, don't submit.",
      },
    ],
    complexityTime: "O(n · 2ⁿ)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode subsets ii backtracking"),
    tags: ["backtracking", "recursion", "sorting"],
    starterCode: buildStarter("intArray", "sortedIntMatrix", "subsetsWithDup"),
    reference: (input) => {
      const nums = first(input).sort((a, b) => a - b);
      const rows: number[][] = [];
      const path: number[] = [];
      const dfs = (i: number) => {
        rows.push([...path]);
        for (let j = i; j < nums.length; j++) {
          if (j > i && nums[j] === nums[j - 1]) continue;
          path.push(nums[j]);
          dfs(j + 1);
          path.pop();
        }
      };
      dfs(0);
      return sortedMatOut(rows);
    },
    tests: [
      { input: "1 2 2", sample: true },
      { input: "0", sample: true },
      { input: "4 4 4 1 4" },
      { input: "-1 -1 0" },
      { input: "5 5" },
    ],
  },
];
