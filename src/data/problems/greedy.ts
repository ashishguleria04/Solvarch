import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, arrOut, yt, lines } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const greedy: SeedProblem[] = [
  {
    slug: "assign-cookies",
    title: "Assign Cookies",
    difficulty: "EASY",
    statement: `Child \`i\` is content with a cookie of size ≥ \`g[i]\`. Each child gets at most one cookie. Given greed factors \`g\` and cookie sizes \`s\`, return the maximum number of content children.

**Input**
- Line 1: space-separated greed factors \`g\`
- Line 2: space-separated cookie sizes \`s\` (may be empty)

**Output**: the maximum number of content children.`,
    constraints: `- 1 ≤ g.length ≤ 3·10^4
- 0 ≤ s.length ≤ 3·10^4`,
    examples: [
      { input: "1 2 3\n1 1", output: "1" },
      { input: "1 2\n1 2 3", output: "2" },
    ],
    hints: [
      "Sort both arrays.",
      "Give the smallest sufficient cookie to the least greedy unmatched child.",
    ],
    editorial: `Sort children and cookies ascending, then sweep with two pointers: offer the current cookie to the least greedy unmatched child; if it satisfies them, both advance, otherwise the cookie is discarded (it satisfies no one remaining). Exchanging any assignment in an optimal solution for this greedy one never loses a match. O(n log n + m log m).`,
    complexityTime: "O(n log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("assign cookies greedy leetcode"),
    tags: ["greedy", "sorting", "two-pointers"],
    starterCode: buildStarter("twoIntArrays", "int", "findContentChildren"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const g = ints(l0).sort((a, b) => a - b);
      const s = ints(l1).sort((a, b) => a - b);
      let i = 0;
      for (const cookie of s) {
        if (i < g.length && cookie >= g[i]) i++;
      }
      return String(i);
    },
    tests: [
      { input: "1 2 3\n1 1", sample: true },
      { input: "1 2\n1 2 3", sample: true },
      { input: "10 9 8 7\n5 6 7 8" },
      { input: "1\n" },
    ],
  },

  {
    slug: "lemonade-change",
    title: "Lemonade Change",
    difficulty: "EASY",
    statement: `Customers queue to buy $5 lemonade, paying with $5, $10, or $20 bills. You start with no change. Return \`true\` if you can give every customer correct change, processing them in order.

**Input**: one line of space-separated bills (each 5, 10, or 20).
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ bills.length ≤ 10^5`,
    examples: [
      { input: "5 5 5 10 20", output: "true" },
      { input: "5 5 10 10 20", output: "false" },
    ],
    hints: [
      "Only track how many $5 and $10 bills you hold.",
      "For a $20, prefer giving $10 + $5 over three $5s — fives are more versatile.",
    ],
    editorial: `Simulate with counts of fives and tens. A $10 needs one five; a $20 needs \`10+5\` **preferring the ten** (fives also serve $10 payers, tens serve no one else) or three fives as fallback. If change is ever impossible, fail. The exchange argument justifies the preference. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("lemonade change greedy"),
    tags: ["greedy", "simulation"],
    starterCode: buildStarter("intArray", "bool", "lemonadeChange"),
    reference: (input) => {
      const bills = first(input);
      let fives = 0;
      let tens = 0;
      for (const b of bills) {
        if (b === 5) fives++;
        else if (b === 10) {
          if (fives === 0) return boolOut(false);
          fives--;
          tens++;
        } else {
          if (tens > 0 && fives > 0) {
            tens--;
            fives--;
          } else if (fives >= 3) {
            fives -= 3;
          } else return boolOut(false);
        }
      }
      return boolOut(true);
    },
    tests: [
      { input: "5 5 5 10 20", sample: true },
      { input: "5 5 10 10 20", sample: true },
      { input: "5 5 10" },
      { input: "10" },
      { input: "5 5 5 5 20 5 20 5" },
    ],
  },

  {
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "MEDIUM",
    statement: `You start at index 0 of array \`nums\`, where \`nums[i]\` is your maximum jump length from position \`i\`. Return \`true\` if you can reach the last index.

**Input**: one line of space-separated non-negative integers.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ nums.length ≤ 10^4
- 0 ≤ nums[i] ≤ 10^5`,
    examples: [
      { input: "2 3 1 1 4", output: "true", explanation: "0→1→4." },
      { input: "3 2 1 0 4", output: "false", explanation: "Index 3 is a trap." },
    ],
    hints: [
      "Track the farthest index reachable so far.",
      "If your scan position ever exceeds that reach, you're stuck.",
    ],
    editorial: `Sweep left to right maintaining \`reach\`, the farthest reachable index. At each position ≤ \`reach\`, update \`reach = max(reach, i + nums[i])\`. If \`i > reach\` at any point, the last index is unreachable. Greedy works because only the frontier matters, not how you got there. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode jump game"),
    tags: ["greedy", "array", "dynamic-programming"],
    starterCode: buildStarter("intArray", "bool", "canJump"),
    reference: (input) => {
      const nums = first(input);
      let reach = 0;
      for (let i = 0; i < nums.length; i++) {
        if (i > reach) return boolOut(false);
        reach = Math.max(reach, i + nums[i]);
      }
      return boolOut(true);
    },
    tests: [
      { input: "2 3 1 1 4", sample: true },
      { input: "3 2 1 0 4", sample: true },
      { input: "0" },
      { input: "1 0 1" },
      { input: "5 0 0 0 0 0" },
    ],
  },

  {
    slug: "jump-game-ii",
    title: "Jump Game II",
    difficulty: "MEDIUM",
    statement: `Same setup as Jump Game, but reaching the last index is guaranteed. Return the **minimum** number of jumps needed.

**Input**: one line of space-separated non-negative integers.
**Output**: the minimum jump count.`,
    constraints: `- 1 ≤ nums.length ≤ 10^4
- Reaching the end is always possible.`,
    examples: [
      { input: "2 3 1 1 4", output: "2", explanation: "0→1 then 1→4." },
      { input: "2 3 0 1 4", output: "2" },
    ],
    hints: [
      "Think in BFS layers: everything reachable in j jumps forms a window.",
      "Track the current window's end and the farthest reach within it; crossing the end starts a new jump.",
    ],
    editorial: `Implicit BFS over index windows: maintain the current jump's window \`[start, end]\` and the farthest index reachable from inside it. When the scan passes \`end\`, one more jump begins and the window extends to that farthest reach. Each index is visited once → O(n), O(1) space — no DP table needed.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode jump game ii"),
    tags: ["greedy", "array", "bfs"],
    starterCode: buildStarter("intArray", "int", "jump"),
    reference: (input) => {
      const nums = first(input);
      let jumps = 0;
      let end = 0;
      let far = 0;
      for (let i = 0; i < nums.length - 1; i++) {
        far = Math.max(far, i + nums[i]);
        if (i === end) {
          jumps++;
          end = far;
        }
      }
      return String(jumps);
    },
    tests: [
      { input: "2 3 1 1 4", sample: true },
      { input: "2 3 0 1 4", sample: true },
      { input: "1" },
      { input: "1 1 1 1" },
      { input: "10 1 1 1 1" },
    ],
  },

  {
    slug: "gas-station",
    title: "Gas Station",
    difficulty: "MEDIUM",
    statement: `There are \`n\` gas stations on a circle. \`gas[i]\` is fuel available at station \`i\`; \`cost[i]\` is fuel needed to drive to station \`i+1\`. Starting empty at some station, return the index from which you can complete one full clockwise circuit, or \`-1\`. The answer is unique when it exists.

**Input**
- Line 1: space-separated \`gas\`
- Line 2: space-separated \`cost\`

**Output**: the starting index, or -1.`,
    constraints: `- 1 ≤ n ≤ 10^5`,
    examples: [
      { input: "1 2 3 4 5\n3 4 5 1 2", output: "3" },
      { input: "2 3 4\n3 4 3", output: "-1" },
    ],
    hints: [
      "If total gas < total cost, no start works. Otherwise one must.",
      "If you run dry between start s and station i, no station in (s, i] can work either — restart from i+1.",
    ],
    editorial: `Two facts make greedy work: (1) if \`Σgas < Σcost\` no answer exists, otherwise one does; (2) if starting at \`s\` you first fail reaching \`i+1\`, then any start strictly between \`s\` and \`i\` also fails there (it enters with less fuel) — so jump the candidate straight to \`i + 1\`. One pass tracking the running tank and total balance. O(n), O(1).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode gas station"),
    tags: ["greedy", "array"],
    starterCode: buildStarter("twoIntArrays", "int", "canCompleteCircuit"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const gas = ints(l0);
      const cost = ints(l1);
      let total = 0;
      let tank = 0;
      let start = 0;
      for (let i = 0; i < gas.length; i++) {
        const d = gas[i] - cost[i];
        total += d;
        tank += d;
        if (tank < 0) {
          start = i + 1;
          tank = 0;
        }
      }
      return String(total >= 0 ? start : -1);
    },
    tests: [
      { input: "1 2 3 4 5\n3 4 5 1 2", sample: true },
      { input: "2 3 4\n3 4 3", sample: true },
      { input: "5\n4" },
      { input: "3\n3" },
      { input: "5 1 2 3 4\n4 4 1 5 1" },
    ],
  },

  {
    slug: "hand-of-straights",
    title: "Hand of Straights",
    difficulty: "MEDIUM",
    statement: `Alice has a hand of cards and wants to rearrange them into groups of exactly \`k\` **consecutive** cards. Return \`true\` if she can.

**Input**
- Line 1: space-separated card values
- Line 2: integer \`k\`

**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ hand.length ≤ 10^4
- 1 ≤ k ≤ hand.length`,
    examples: [
      { input: "1 2 3 6 2 3 4 7 8\n3", output: "true", explanation: "[1,2,3] [2,3,4] [6,7,8]." },
      { input: "1 2 3 4 5\n4", output: "false", explanation: "5 cards can't split into groups of 4." },
    ],
    hints: [
      "If the total count isn't divisible by k, fail immediately.",
      "The smallest remaining card must start a group — it has no other home.",
      "Count cards in a map; repeatedly consume runs starting at the current minimum.",
    ],
    editorial: `The smallest remaining card is forced to begin a group, so greedily consume \`k\` consecutive values starting there, decrementing counts; any missing value fails. Processing values in sorted order with a count map gives O(n log n). The forced-move argument is what makes greedy provably correct here.`,
    complexityTime: "O(n log n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode hand of straights"),
    tags: ["greedy", "hash-table", "sorting"],
    starterCode: buildStarter("intArrayK", "bool", "isNStraightHand"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const hand = ints(l0);
      const k = int(l1);
      if (hand.length % k !== 0) return boolOut(false);
      const count = new Map<number, number>();
      for (const c of hand) count.set(c, (count.get(c) ?? 0) + 1);
      const keys = [...count.keys()].sort((a, b) => a - b);
      for (const start of keys) {
        const c = count.get(start)!;
        if (c === 0) continue;
        for (let v = start; v < start + k; v++) {
          const have = count.get(v) ?? 0;
          if (have < c) return boolOut(false);
          count.set(v, have - c);
        }
      }
      return boolOut(true);
    },
    tests: [
      { input: "1 2 3 6 2 3 4 7 8\n3", sample: true },
      { input: "1 2 3 4 5\n4", sample: true },
      { input: "8 10 12\n3" },
      { input: "4\n1" },
      { input: "1 1 2 2 3 3\n3" },
    ],
  },

  {
    slug: "partition-labels",
    title: "Partition Labels",
    difficulty: "MEDIUM",
    statement: `Partition a string into as many parts as possible so that **no letter appears in more than one part**, and return the sizes of the parts (in order).

**Input**: one line, the string \`s\`.
**Output**: the part sizes, space-separated.`,
    constraints: `- 1 ≤ s.length ≤ 500
- Lowercase English letters.`,
    examples: [
      { input: "ababcbacadefegdehijhklij", output: "9 7 8", explanation: "\"ababcbaca\" \"defegde\" \"hijhklij\"." },
      { input: "eccbbbbdec", output: "10" },
    ],
    hints: [
      "Precompute each letter's last occurrence.",
      "A part can end only once you've passed the last occurrence of every letter inside it.",
    ],
    editorial: `Record each character's **last index**. Sweep with a growing window: extend the window's required end to the last occurrence of each character seen; when the scan reaches that end, the part is closed and its size emitted. Greedy is safe because a letter's full span must live in one part. O(n) time, O(26) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode partition labels"),
    tags: ["greedy", "string", "two-pointers"],
    starterCode: buildStarter("string", "intArray", "partitionLabels"),
    reference: (input) => {
      const s = (lines(input)[0] ?? "").trim();
      const last = new Map<string, number>();
      for (let i = 0; i < s.length; i++) last.set(s[i], i);
      const res: number[] = [];
      let start = 0;
      let end = 0;
      for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last.get(s[i])!);
        if (i === end) {
          res.push(end - start + 1);
          start = i + 1;
        }
      }
      return arrOut(res);
    },
    tests: [
      { input: "ababcbacadefegdehijhklij", sample: true },
      { input: "eccbbbbdec", sample: true },
      { input: "a" },
      { input: "abcdef" },
      { input: "caedbdedda" },
    ],
  },

  {
    slug: "valid-parenthesis-string",
    title: "Valid Parenthesis String",
    difficulty: "MEDIUM",
    statement: `A string contains \`(\`, \`)\`, and \`*\`, where each \`*\` can act as \`(\`, \`)\`, or an empty string. Return \`true\` if the string can be made a valid parenthesis sequence.

**Input**: one line, the string.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ s.length ≤ 100`,
    examples: [
      { input: "()", output: "true" },
      { input: "(*)", output: "true" },
      { input: "(*))", output: "true" },
    ],
    hints: [
      "Track a range [lo, hi] of possible open-bracket counts.",
      "'(' raises both; ')' lowers both; '*' widens the range by one in each direction.",
      "Fail if hi goes negative; succeed if lo can end at 0 (clamp lo at 0).",
    ],
    editorial: `Keep the interval \`[lo, hi]\` of achievable open-paren counts: \`(\` increments both, \`)\` decrements both, \`*\` does \`lo−1, hi+1\`. If \`hi < 0\` the string is already broken; clamp \`lo\` at 0 (a \`*\` never has to become \`)\` when nothing is open). Valid iff \`lo == 0\` at the end. One pass, O(1) space — the interval trick replaces exponential case-splitting.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("valid parenthesis string greedy"),
    tags: ["greedy", "string", "dynamic-programming"],
    starterCode: buildStarter("string", "bool", "checkValidString"),
    reference: (input) => {
      const s = (lines(input)[0] ?? "").trim();
      let lo = 0;
      let hi = 0;
      for (const c of s) {
        if (c === "(") {
          lo++;
          hi++;
        } else if (c === ")") {
          lo--;
          hi--;
        } else {
          lo--;
          hi++;
        }
        if (hi < 0) return boolOut(false);
        if (lo < 0) lo = 0;
      }
      return boolOut(lo === 0);
    },
    tests: [
      { input: "()", sample: true },
      { input: "(*)", sample: true },
      { input: "(*))", sample: true },
      { input: ")(" },
      { input: "(((*)" },
      { input: "*(" },
    ],
  },

  {
    slug: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    difficulty: "MEDIUM",
    statement: `Given intervals \`[start, end)\`, return the minimum number of intervals to remove so the rest don't overlap (touching endpoints don't overlap).

**Input**
- Line 1: \`n 2\`
- Next n lines: \`start end\`

**Output**: the minimum removals.`,
    constraints: `- 1 ≤ n ≤ 10^5
- -5·10^4 ≤ start < end ≤ 5·10^4`,
    examples: [
      { input: "4 2\n1 2\n2 3\n3 4\n1 3", output: "1", explanation: "Remove [1,3]." },
      { input: "3 2\n1 2\n1 2\n1 2", output: "2" },
      { input: "2 2\n1 2\n2 3", output: "0" },
    ],
    hints: [
      "Equivalent problem: keep the maximum number of non-overlapping intervals.",
      "Sort by end time; always keep the interval that finishes earliest.",
    ],
    editorial: `Flip to "keep the most non-overlapping intervals" — the classic **activity selection** problem. Sort by end; greedily keep any interval starting at or after the last kept end. The earliest-finishing choice leaves maximal room, provable by exchange. Removals = total − kept. O(n log n).`,
    complexityTime: "O(n log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode non overlapping intervals"),
    tags: ["greedy", "intervals", "sorting"],
    starterCode: buildStarter("matrix", "int", "eraseOverlapIntervals"),
    reference: (input) => {
      const ls = lines(input);
      const [n] = ints(ls[0]);
      const iv: number[][] = [];
      for (let i = 0; i < n; i++) iv.push(ints(ls[1 + i]));
      iv.sort((a, b) => a[1] - b[1]);
      let kept = 0;
      let lastEnd = -Infinity;
      for (const [s, e] of iv) {
        if (s >= lastEnd) {
          kept++;
          lastEnd = e;
        }
      }
      return String(n - kept);
    },
    tests: [
      { input: "4 2\n1 2\n2 3\n3 4\n1 3", sample: true },
      { input: "3 2\n1 2\n1 2\n1 2", sample: true },
      { input: "2 2\n1 2\n2 3", sample: true },
      { input: "1 2\n0 10" },
      { input: "5 2\n0 5\n1 2\n2 3\n3 4\n4 6" },
    ],
  },

  {
    slug: "best-time-to-buy-and-sell-stock-ii",
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "EASY",
    statement: `Given daily prices, you may buy and sell as many times as you like (holding at most one share at a time; selling and re-buying the same day is allowed). Return the maximum total profit.

**Input**: one line of space-separated prices.
**Output**: the maximum profit.`,
    constraints: `- 1 ≤ prices.length ≤ 3·10^4
- 0 ≤ prices[i] ≤ 10^4`,
    examples: [
      {
        input: "7 1 5 3 6 4",
        output: "7",
        explanation: "Buy 1 → sell 5 (+4), buy 3 → sell 6 (+3).",
      },
      { input: "1 2 3 4 5", output: "4", explanation: "One long hold — or every daily rise; same total." },
      { input: "7 6 4 3 1", output: "0" },
    ],
    hints: [
      "With unlimited transactions, which price movements can you capture?",
      "Any multi-day gain decomposes into consecutive daily gains: p[j] − p[i] = Σ daily diffs.",
      "Sum every positive prices[i] − prices[i−1].",
    ],
    editorial: `Harvest every rise: the answer is the sum of all positive day-over-day differences. Why the greedy is exact — any transaction's profit p[sell] − p[buy] telescopes into the sum of daily moves between them, so the best conceivable strategy can never beat collecting every positive move, and 'buy before each rise, sell after' actually achieves that collection. One pass, O(n)/O(1). Contrast with Stock I (single transaction — track min-so-far) and the k-transaction variants (DP): recognizing *which* constraint you're under is the real interview test here.`,
    approaches: [
      {
        name: "Sum positive deltas",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "profit += max(0, p[i] − p[i−1]) — the telescoping argument makes it exact.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("best time to buy and sell stock ii greedy"),
    tags: ["greedy", "array"],
    starterCode: buildStarter("intArray", "int", "maxProfit"),
    reference: (input) => {
      const p = ints(lines(input)[0]);
      let profit = 0;
      for (let i = 1; i < p.length; i++) {
        if (p[i] > p[i - 1]) profit += p[i] - p[i - 1];
      }
      return String(profit);
    },
    tests: [
      { input: "7 1 5 3 6 4", sample: true },
      { input: "1 2 3 4 5", sample: true },
      { input: "7 6 4 3 1", sample: true },
      { input: "5" },
      { input: "2 1 2 0 1" },
      { input: "3 3 5 0 0 3 1 4" },
    ],
  },
];
