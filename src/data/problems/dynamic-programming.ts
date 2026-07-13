import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, yt, lines } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const dynamicProgramming: SeedProblem[] = [
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "EASY",
    statement: `You climb a staircase of \`n\` steps, taking 1 or 2 steps at a time. How many distinct ways can you reach the top?

**Input**: one line, the integer \`n\`.
**Output**: the number of distinct ways.`,
    constraints: `- 1 ≤ n ≤ 45`,
    examples: [
      { input: "2", output: "2", explanation: "1+1 or 2." },
      { input: "3", output: "3", explanation: "1+1+1, 1+2, 2+1." },
    ],
    hints: [
      "The last move was a 1-step or a 2-step.",
      "ways(n) = ways(n−1) + ways(n−2) — Fibonacci in disguise.",
    ],
    editorial: `To stand on step n you arrived from n−1 or n−2, so \`ways(n) = ways(n−1) + ways(n−2)\` with \`ways(1)=1, ways(2)=2\` — the Fibonacci recurrence. Iterate with two rolling variables for O(n) time, O(1) space. This is the "hello world" of DP: define the state, find the transition, seed the base cases.`,
    approaches: [
      {
        name: "Naive recursion",
        complexityTime: "O(2ⁿ)",
        complexitySpace: "O(n)",
        body: "Branches twice per step — exponential blowup from recomputed subproblems.",
      },
      {
        name: "Bottom-up with rolling variables",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "Keep only the last two values of the recurrence.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode climbing stairs"),
    tags: ["dynamic-programming", "math", "memoization"],
    starterCode: buildStarter("int", "int", "climbStairs"),
    reference: (input) => {
      const n = int(lines(input)[0]);
      let a = 1;
      let b = 1;
      for (let i = 0; i < n - 1; i++) {
        [a, b] = [b, a + b];
      }
      return String(b);
    },
    tests: [
      { input: "2", sample: true },
      { input: "3", sample: true },
      { input: "1" },
      { input: "10" },
      { input: "45" },
    ],
  },

  {
    slug: "min-cost-climbing-stairs",
    title: "Min Cost Climbing Stairs",
    difficulty: "EASY",
    statement: `\`cost[i]\` is the toll for stepping on stair \`i\`; after paying you may climb 1 or 2 stairs. You may start at index 0 or 1. Return the minimum cost to reach the top (one past the last stair).

**Input**: one line of space-separated integers \`cost\`.
**Output**: the minimum total cost.`,
    constraints: `- 2 ≤ cost.length ≤ 1000
- 0 ≤ cost[i] ≤ 999`,
    examples: [
      { input: "10 15 20", output: "15", explanation: "Start at 15, jump to the top." },
      { input: "1 100 1 1 1 100 1 1 100 1", output: "6" },
    ],
    hints: [
      "dp[i] = min cost to *leave* stair i = cost[i] + min(dp[i+1], dp[i+2]).",
      "Or forward: minimum cost to reach position i.",
    ],
    editorial: `Let \`dp[i]\` be the cheapest way to stand on stair i: \`dp[i] = cost[i] + min(dp[i−1], dp[i−2])\` with free starts at 0 and 1. Answer is \`min(dp[n−1], dp[n−2])\` since either can jump off the top. Two rolling variables suffice → O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("min cost climbing stairs dp"),
    tags: ["dynamic-programming", "array"],
    starterCode: buildStarter("intArray", "int", "minCostClimbingStairs"),
    reference: (input) => {
      const cost = first(input);
      let a = cost[0];
      let b = cost[1];
      for (let i = 2; i < cost.length; i++) {
        [a, b] = [b, cost[i] + Math.min(a, b)];
      }
      return String(Math.min(a, b));
    },
    tests: [
      { input: "10 15 20", sample: true },
      { input: "1 100 1 1 1 100 1 1 100 1", sample: true },
      { input: "0 0" },
      { input: "5 3" },
      { input: "1 2 3 4 5" },
    ],
  },

  {
    slug: "house-robber",
    title: "House Robber",
    difficulty: "MEDIUM",
    statement: `A robber walks a street of houses with cash amounts \`nums\`, but robbing two **adjacent** houses trips the alarm. Return the maximum loot.

**Input**: one line of space-separated non-negative integers.
**Output**: the maximum amount.`,
    constraints: `- 1 ≤ nums.length ≤ 100
- 0 ≤ nums[i] ≤ 400`,
    examples: [
      { input: "1 2 3 1", output: "4", explanation: "Rob houses 0 and 2." },
      { input: "2 7 9 3 1", output: "12", explanation: "Rob 2 + 9 + 1." },
    ],
    hints: [
      "For each house: rob it (skip the previous) or skip it.",
      "dp[i] = max(dp[i−1], dp[i−2] + nums[i]).",
    ],
    editorial: `At house i the choice is binary: skip (keep \`dp[i−1]\`) or rob (gain \`nums[i] + dp[i−2]\`). Take the max. Two rolling variables replace the array → O(n) time, O(1) space. The "include/exclude with a gap" pattern recurs in many disguises (deleting elements, scheduling, etc.).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode house robber"),
    tags: ["dynamic-programming", "array"],
    starterCode: buildStarter("intArray", "int", "rob"),
    reference: (input) => {
      const nums = first(input);
      let prev = 0;
      let cur = 0;
      for (const x of nums) {
        [prev, cur] = [cur, Math.max(cur, prev + x)];
      }
      return String(cur);
    },
    tests: [
      { input: "1 2 3 1", sample: true },
      { input: "2 7 9 3 1", sample: true },
      { input: "5" },
      { input: "10 1" },
      { input: "2 1 1 2" },
    ],
  },

  {
    slug: "house-robber-ii",
    title: "House Robber II",
    difficulty: "MEDIUM",
    statement: `Same as House Robber, but the houses form a **circle** — the first and last are adjacent. Return the maximum loot.

**Input**: one line of space-separated non-negative integers.
**Output**: the maximum amount.`,
    constraints: `- 1 ≤ nums.length ≤ 100
- 0 ≤ nums[i] ≤ 1000`,
    examples: [
      { input: "2 3 2", output: "3", explanation: "Houses 0 and 2 are adjacent — can't take both 2s." },
      { input: "1 2 3 1", output: "4" },
    ],
    hints: [
      "The circle only forbids taking both endpoints.",
      "Solve the linear problem twice: once excluding the first house, once excluding the last.",
    ],
    editorial: `In a circle you can never rob both the first and last house, so the answer is the better of two **linear** House Robber runs: on \`nums[0..n−2]\` and on \`nums[1..n−1]\` (single-house case handled directly). Reduces a new constraint to a solved subproblem — a favorite interview move. O(n), O(1).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode house robber ii"),
    tags: ["dynamic-programming", "array"],
    starterCode: buildStarter("intArray", "int", "robCircular"),
    reference: (input) => {
      const nums = first(input);
      if (nums.length === 1) return String(nums[0]);
      const linear = (arr: number[]): number => {
        let prev = 0;
        let cur = 0;
        for (const x of arr) {
          [prev, cur] = [cur, Math.max(cur, prev + x)];
        }
        return cur;
      };
      return String(Math.max(linear(nums.slice(1)), linear(nums.slice(0, -1))));
    },
    tests: [
      { input: "2 3 2", sample: true },
      { input: "1 2 3 1", sample: true },
      { input: "1 2 3" },
      { input: "1" },
      { input: "200 3 140 20 10" },
    ],
  },

  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "MEDIUM",
    statement: `Given coin denominations \`coins\` (unlimited supply) and an \`amount\`, return the fewest coins needed to make the amount exactly, or \`-1\` if impossible.

**Input**
- Line 1: space-separated coin values
- Line 2: integer \`amount\`

**Output**: the fewest coins, or -1.`,
    constraints: `- 1 ≤ coins.length ≤ 12
- 1 ≤ coins[i] ≤ 2^31 − 1
- 0 ≤ amount ≤ 10^4`,
    examples: [
      { input: "1 2 5\n11", output: "3", explanation: "5 + 5 + 1." },
      { input: "2\n3", output: "-1" },
      { input: "1\n0", output: "0" },
    ],
    hints: [
      "Greedy (largest coin first) fails: coins [1,3,4], amount 6.",
      "dp[a] = fewest coins for amount a = 1 + min over coins c of dp[a − c].",
    ],
    editorial: `Unbounded knapsack over amounts: \`dp[a] = 1 + min(dp[a − c])\` across coins, seeded with \`dp[0] = 0\` and ∞ elsewhere. Fill upward to \`amount\`; unreachable stays ∞ → -1. Greedy fails on non-canonical coin systems, which is exactly why this is a DP classic. O(amount × coins) time, O(amount) space.`,
    approaches: [
      {
        name: "BFS on amounts",
        complexityTime: "O(amount · coins)",
        complexitySpace: "O(amount)",
        body: "Level = number of coins used; first time you reach `amount` is optimal.",
      },
      {
        name: "Bottom-up DP",
        complexityTime: "O(amount · coins)",
        complexitySpace: "O(amount)",
        body: "dp over every amount from 1 to target.",
      },
    ],
    complexityTime: "O(amount · coins)",
    complexitySpace: "O(amount)",
    youtubeUrl: yt("neetcode coin change"),
    tags: ["dynamic-programming", "bfs", "array"],
    starterCode: buildStarter("intArrayTarget", "int", "coinChange"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const coins = ints(l0);
      const amount = int(l1);
      const dp = new Array(amount + 1).fill(Infinity);
      dp[0] = 0;
      for (let a = 1; a <= amount; a++) {
        for (const c of coins) {
          if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
        }
      }
      return String(dp[amount] === Infinity ? -1 : dp[amount]);
    },
    tests: [
      { input: "1 2 5\n11", sample: true },
      { input: "2\n3", sample: true },
      { input: "1\n0", sample: true },
      { input: "1 3 4\n6" },
      { input: "186 419 83 408\n6249" },
    ],
  },

  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "MEDIUM",
    statement: `Return the length of the longest **strictly increasing** subsequence of \`nums\` (elements keep their order but need not be contiguous).

**Input**: one line of space-separated integers.
**Output**: the LIS length.`,
    constraints: `- 1 ≤ nums.length ≤ 2500
- -10^4 ≤ nums[i] ≤ 10^4`,
    examples: [
      { input: "10 9 2 5 3 7 101 18", output: "4", explanation: "[2,3,7,101] (or [2,5,7,18])." },
      { input: "0 1 0 3 2 3", output: "4" },
      { input: "7 7 7 7", output: "1" },
    ],
    hints: [
      "dp[i] = LIS ending exactly at i = 1 + max dp[j] over j < i with nums[j] < nums[i].",
      "The O(n log n) upgrade: maintain 'tails' — the smallest possible tail of an increasing subsequence of each length — with binary search.",
    ],
    editorial: `Quadratic DP: \`dp[i] = 1 + max(dp[j])\` over earlier smaller elements; answer is the max entry. The celebrated O(n log n) method keeps \`tails[k]\` = smallest tail of any increasing subsequence of length k+1; each element binary-searches its slot (patience sorting). Both are worth knowing — the follow-up is almost guaranteed.`,
    approaches: [
      {
        name: "Quadratic DP",
        complexityTime: "O(n²)",
        complexitySpace: "O(n)",
        body: "Best subsequence ending at each index.",
      },
      {
        name: "Patience sorting / tails + binary search",
        complexityTime: "O(n log n)",
        complexitySpace: "O(n)",
        body: "tails stays sorted; lower-bound each element into it.",
      },
    ],
    complexityTime: "O(n log n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode longest increasing subsequence"),
    tags: ["dynamic-programming", "binary-search", "array"],
    starterCode: buildStarter("intArray", "int", "lengthOfLIS"),
    reference: (input) => {
      const nums = first(input);
      const dp = new Array(nums.length).fill(1);
      let best = 1;
      for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
          if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        }
        best = Math.max(best, dp[i]);
      }
      return String(best);
    },
    tests: [
      { input: "10 9 2 5 3 7 101 18", sample: true },
      { input: "0 1 0 3 2 3", sample: true },
      { input: "7 7 7 7", sample: true },
      { input: "1" },
      { input: "5 4 3 2 1" },
    ],
  },

  {
    slug: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    difficulty: "MEDIUM",
    statement: `Given strings \`text1\` and \`text2\`, return the length of their longest common subsequence (characters in order, not necessarily contiguous); 0 if none.

**Input**
- Line 1: string \`text1\`
- Line 2: string \`text2\`

**Output**: the LCS length.`,
    constraints: `- 1 ≤ lengths ≤ 1000
- Lowercase English letters.`,
    examples: [
      { input: "abcde\nace", output: "3", explanation: "\"ace\"." },
      { input: "abc\ndef", output: "0" },
    ],
    hints: [
      "Compare last characters: equal → 1 + LCS of both prefixes; unequal → best of dropping one.",
      "Tabulate over prefix lengths (i, j) — the classic 2D grid.",
    ],
    editorial: `The textbook 2D DP: \`dp[i][j]\` = LCS of the first i chars of text1 and first j of text2. Matching characters extend the diagonal (\`1 + dp[i−1][j−1]\`); otherwise take the better of dropping a character from either string. O(m·n) time; two rows of space suffice. This grid underlies diff tools and edit distance alike.`,
    complexityTime: "O(m·n)",
    complexitySpace: "O(min(m, n))",
    youtubeUrl: yt("neetcode longest common subsequence"),
    tags: ["dynamic-programming", "string"],
    starterCode: buildStarter("twoStrings", "int", "longestCommonSubsequence"),
    reference: (input) => {
      const [a = "", b = ""] = lines(input);
      const m = a.length;
      const n = b.length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] =
            a[i - 1] === b[j - 1]
              ? dp[i - 1][j - 1] + 1
              : Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
      return String(dp[m][n]);
    },
    tests: [
      { input: "abcde\nace", sample: true },
      { input: "abc\ndef", sample: true },
      { input: "abc\nabc" },
      { input: "bsbininm\njmjkbkjkv" },
      { input: "a\na" },
    ],
  },

  {
    slug: "unique-paths",
    title: "Unique Paths",
    difficulty: "MEDIUM",
    statement: `A robot starts at the top-left of an \`m × n\` grid and moves only right or down. How many distinct paths reach the bottom-right?

**Input**: one line, two integers \`m n\`.
**Output**: the number of paths.`,
    constraints: `- 1 ≤ m, n ≤ 100
- The answer fits in a 32-bit integer for the given tests.`,
    examples: [
      { input: "3 7", output: "28" },
      { input: "3 2", output: "3" },
    ],
    hints: [
      "Each cell is reached from above or from the left.",
      "dp[i][j] = dp[i−1][j] + dp[i][j−1]; edges have exactly 1 path.",
      "Closed form: C(m+n−2, m−1) — it's a combinatorics problem too.",
    ],
    editorial: `Paths into a cell come from above or the left, so \`dp[i][j] = dp[i−1][j] + dp[i][j−1]\` with 1s along the borders. A single rolling row reduces space to O(n). The counting identity \`C(m+n−2, m−1)\` (choosing when to go down among all moves) gives an O(m+n) closed form — mention it and win points.`,
    complexityTime: "O(m·n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode unique paths"),
    tags: ["dynamic-programming", "math", "combinatorics"],
    starterCode: buildStarter("twoIntsLine", "int", "uniquePaths"),
    reference: (input) => {
      const [m, n] = ints(lines(input)[0]);
      const row = new Array(n).fill(1);
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) row[j] += row[j - 1];
      }
      return String(row[n - 1]);
    },
    tests: [
      { input: "3 7", sample: true },
      { input: "3 2", sample: true },
      { input: "1 1" },
      { input: "10 10" },
      { input: "1 25" },
    ],
  },

  {
    slug: "minimum-path-sum",
    title: "Minimum Path Sum",
    difficulty: "MEDIUM",
    statement: `Given a grid of non-negative integers, find a path from top-left to bottom-right (moving only right or down) minimizing the sum of visited values. Return that sum.

**Input**
- Line 1: \`r c\`
- Next r lines: the grid rows

**Output**: the minimum path sum.`,
    constraints: `- 1 ≤ r, c ≤ 200
- 0 ≤ values ≤ 100`,
    examples: [
      { input: "3 3\n1 3 1\n1 5 1\n4 2 1", output: "7", explanation: "1→3→1→1→1." },
      { input: "2 3\n1 2 3\n4 5 6", output: "12" },
    ],
    hints: [
      "Same shape as Unique Paths, but take a min instead of a sum of counts.",
      "dp[i][j] = grid[i][j] + min(dp[i−1][j], dp[i][j−1]).",
    ],
    editorial: `Grid DP with the same dependency structure as Unique Paths: each cell's best cost is its own value plus the cheaper of the cell above or to the left; first row/column accumulate linearly. In-place accumulation over the grid gives O(r·c) time with O(1) extra space.`,
    complexityTime: "O(r·c)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("minimum path sum dp"),
    tags: ["dynamic-programming", "matrix"],
    starterCode: buildStarter("matrix", "int", "minPathSum"),
    reference: (input) => {
      const ls = lines(input);
      const [r, c] = ints(ls[0]);
      const g: number[][] = [];
      for (let i = 0; i < r; i++) g.push(ints(ls[1 + i]));
      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          if (i === 0 && j === 0) continue;
          const up = i > 0 ? g[i - 1][j] : Infinity;
          const left = j > 0 ? g[i][j - 1] : Infinity;
          g[i][j] += Math.min(up, left);
        }
      }
      return String(g[r - 1][c - 1]);
    },
    tests: [
      { input: "3 3\n1 3 1\n1 5 1\n4 2 1", sample: true },
      { input: "2 3\n1 2 3\n4 5 6", sample: true },
      { input: "1 1\n5" },
      { input: "1 4\n1 2 3 4" },
      { input: "3 1\n2\n3\n4" },
    ],
  },

  {
    slug: "decode-ways",
    title: "Decode Ways",
    difficulty: "MEDIUM",
    statement: `Letters map to digits A=1 … Z=26. Given a digit string \`s\`, count how many ways it can be decoded (e.g. "12" → "AB" or "L"). Leading zeros in a group are invalid.

**Input**: one line, the digit string.
**Output**: the number of decodings (0 if none).`,
    constraints: `- 1 ≤ s.length ≤ 100
- Digits only; may contain zeros.`,
    examples: [
      { input: "12", output: "2" },
      { input: "226", output: "3", explanation: "2|26, 22|6, 2|2|6." },
      { input: "06", output: "0" },
    ],
    hints: [
      "Like Climbing Stairs, but a step is valid only if the 1- or 2-digit group is a real letter.",
      "A single '0' contributes nothing; '10'–'26' allows a two-digit step.",
      "dp[i] = (s[i−1] ≠ '0' ? dp[i−1] : 0) + (s[i−2..i−1] ∈ [10,26] ? dp[i−2] : 0).",
    ],
    editorial: `Climbing Stairs with legality checks: ending at position i, the last group was one digit (valid unless '0') or two digits (valid if 10–26). Sum the corresponding earlier counts. Zeros are the trap — '0' alone kills a path, and '30' has no decoding at all. O(n) time, O(1) space with rolling variables.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode decode ways"),
    tags: ["dynamic-programming", "string"],
    starterCode: buildStarter("string", "int", "numDecodings"),
    reference: (input) => {
      const s = (lines(input)[0] ?? "").trim();
      if (!s || s[0] === "0") return "0";
      let prev = 1;
      let cur = 1;
      for (let i = 1; i < s.length; i++) {
        let next = 0;
        if (s[i] !== "0") next += cur;
        const two = parseInt(s.slice(i - 1, i + 1), 10);
        if (two >= 10 && two <= 26) next += prev;
        [prev, cur] = [cur, next];
        if (cur === 0) return "0";
      }
      return String(cur);
    },
    tests: [
      { input: "12", sample: true },
      { input: "226", sample: true },
      { input: "06", sample: true },
      { input: "10" },
      { input: "2101" },
      { input: "111111" },
    ],
  },

  {
    slug: "edit-distance",
    title: "Edit Distance",
    difficulty: "MEDIUM",
    statement: `Given strings \`word1\` and \`word2\`, return the minimum number of single-character operations (insert, delete, replace) to convert \`word1\` into \`word2\`.

**Input**
- Line 1: \`word1\`
- Line 2: \`word2\`

**Output**: the minimum operation count.`,
    constraints: `- 0 ≤ lengths ≤ 500
- Lowercase English letters.`,
    examples: [
      { input: "horse\nros", output: "3" },
      { input: "intention\nexecution", output: "5" },
    ],
    hints: [
      "Compare the last characters of both prefixes.",
      "Equal → no cost, move both. Unequal → 1 + min(insert, delete, replace) on the smaller subproblems.",
      "dp[i][j] over prefix lengths; first row/column are i and j (pure inserts/deletes).",
    ],
    editorial: `**Levenshtein distance**: \`dp[i][j]\` converts the first i chars of word1 into the first j of word2. Matching last characters inherit the diagonal; otherwise \`1 + min(dp[i−1][j] /*delete*/, dp[i][j−1] /*insert*/, dp[i−1][j−1] /*replace*/)\`. Borders are trivial conversions from/to empty. O(m·n) time, one rolling row of space. Powers spell-checkers and diffs.`,
    complexityTime: "O(m·n)",
    complexitySpace: "O(min(m, n))",
    youtubeUrl: yt("neetcode edit distance"),
    tags: ["dynamic-programming", "string"],
    starterCode: buildStarter("twoStrings", "int", "minDistance"),
    reference: (input) => {
      const [a = "", b = ""] = lines(input);
      const m = a.length;
      const n = b.length;
      const dp = Array.from({ length: m + 1 }, (_, i) => {
        const row = new Array(n + 1).fill(0);
        row[0] = i;
        return row;
      });
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] =
            a[i - 1] === b[j - 1]
              ? dp[i - 1][j - 1]
              : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
      return String(dp[m][n]);
    },
    tests: [
      { input: "horse\nros", sample: true },
      { input: "intention\nexecution", sample: true },
      { input: "\nabc" },
      { input: "abc\n" },
      { input: "same\nsame" },
    ],
  },

  {
    slug: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    difficulty: "MEDIUM",
    statement: `Return \`true\` if the array \`nums\` can be split into two subsets with equal sums.

**Input**: one line of space-separated positive integers.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ nums.length ≤ 200
- 1 ≤ nums[i] ≤ 100`,
    examples: [
      { input: "1 5 11 5", output: "true", explanation: "[1,5,5] and [11]." },
      { input: "1 2 3 5", output: "false" },
    ],
    hints: [
      "An odd total is an instant no.",
      "Otherwise: does any subset sum to total/2? That's 0/1 knapsack.",
      "Boolean dp over reachable sums; iterate sums downward to avoid reusing an element.",
    ],
    editorial: `Reduce to **subset-sum**: a valid split exists iff some subset reaches \`total/2\` (odd totals fail immediately). Boolean DP over achievable sums: for each number, mark \`dp[s] |= dp[s − num]\`, sweeping \`s\` **downward** so each element is used at most once. O(n · total/2) time, O(total/2) space — the canonical 0/1 knapsack feasibility table.`,
    complexityTime: "O(n · sum)",
    complexitySpace: "O(sum)",
    youtubeUrl: yt("neetcode partition equal subset sum"),
    tags: ["dynamic-programming", "knapsack", "array"],
    starterCode: buildStarter("intArray", "bool", "canPartition"),
    reference: (input) => {
      const nums = first(input);
      const total = nums.reduce((a, b) => a + b, 0);
      if (total % 2 !== 0) return boolOut(false);
      const target = total / 2;
      const dp = new Array(target + 1).fill(false);
      dp[0] = true;
      for (const x of nums) {
        for (let s = target; s >= x; s--) {
          if (dp[s - x]) dp[s] = true;
        }
      }
      return boolOut(dp[target]);
    },
    tests: [
      { input: "1 5 11 5", sample: true },
      { input: "1 2 3 5", sample: true },
      { input: "1 1" },
      { input: "3" },
      { input: "2 2 1 1" },
    ],
  },

  {
    slug: "target-sum",
    title: "Target Sum",
    difficulty: "MEDIUM",
    statement: `Assign \`+\` or \`-\` to every element of \`nums\`; count the assignments whose total equals \`target\`.

**Input**
- Line 1: space-separated non-negative integers
- Line 2: integer \`target\`

**Output**: the number of ways.`,
    constraints: `- 1 ≤ nums.length ≤ 20
- 0 ≤ nums[i] ≤ 1000; Σnums ≤ 1000
- -1000 ≤ target ≤ 1000`,
    examples: [
      { input: "1 1 1 1 1\n3", output: "5" },
      { input: "1\n1", output: "1" },
    ],
    hints: [
      "Let P = sum of positives, N = sum of negatives. P − N = target and P + N = total.",
      "So P = (target + total) / 2 — count subsets summing to P.",
      "If target + total is odd or negative, the answer is 0.",
    ],
    editorial: `Algebra collapses this to **counting subset-sums**: positives must total \`(target + Σ)/2\`. If that's fractional or negative, zero ways. Then a counting knapsack — \`dp[s] += dp[s − num]\`, iterating sums downward per element — tallies the subsets. O(n · Σ) time. The transformation is the interview insight; the DP is routine.`,
    complexityTime: "O(n · sum)",
    complexitySpace: "O(sum)",
    youtubeUrl: yt("target sum dp leetcode"),
    tags: ["dynamic-programming", "knapsack", "backtracking"],
    starterCode: buildStarter("intArrayTarget", "int", "findTargetSumWays"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const target = int(l1);
      const total = nums.reduce((a, b) => a + b, 0);
      const doubled = target + total;
      if (doubled < 0 || doubled % 2 !== 0) return "0";
      const goal = doubled / 2;
      const dp = new Array(goal + 1).fill(0);
      dp[0] = 1;
      for (const x of nums) {
        for (let s = goal; s >= x; s--) dp[s] += dp[s - x];
      }
      return String(dp[goal]);
    },
    tests: [
      { input: "1 1 1 1 1\n3", sample: true },
      { input: "1\n1", sample: true },
      { input: "1\n2" },
      { input: "0 0 1\n1" },
      { input: "2 3 5 7\n1" },
    ],
  },

  {
    slug: "palindromic-substrings",
    title: "Palindromic Substrings",
    difficulty: "MEDIUM",
    statement: `Count the palindromic substrings of \`s\` (substrings with different positions count separately).

**Input**: one line, the string \`s\`.
**Output**: the count.`,
    constraints: `- 1 ≤ s.length ≤ 1000
- Lowercase English letters.`,
    examples: [
      { input: "abc", output: "3", explanation: "a, b, c." },
      { input: "aaa", output: "6", explanation: "a×3, aa×2, aaa." },
    ],
    hints: [
      "Every palindrome has a center — a character or a gap between two.",
      "Expand around each of the 2n−1 centers, counting while the ends match.",
    ],
    editorial: `**Expand around center**: each of the \`2n − 1\` centers (n characters + n−1 gaps) grows outward while the boundary characters match, counting one palindrome per successful expansion. O(n²) time, O(1) space, and far simpler than the DP table. (Manacher's algorithm reaches O(n) if the interviewer pushes.)`,
    complexityTime: "O(n²)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode palindromic substrings"),
    tags: ["dynamic-programming", "string", "two-pointers"],
    starterCode: buildStarter("string", "int", "countSubstrings"),
    reference: (input) => {
      const s = (lines(input)[0] ?? "").trim();
      let count = 0;
      for (let center = 0; center < 2 * s.length - 1; center++) {
        let l = Math.floor(center / 2);
        let r = l + (center % 2);
        while (l >= 0 && r < s.length && s[l] === s[r]) {
          count++;
          l--;
          r++;
        }
      }
      return String(count);
    },
    tests: [
      { input: "abc", sample: true },
      { input: "aaa", sample: true },
      { input: "a" },
      { input: "abba" },
      { input: "racecar" },
    ],
  },
];
