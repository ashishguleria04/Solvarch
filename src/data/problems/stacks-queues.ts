import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, arrOut, yt, lines, linesOut, words } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const stacksQueues: SeedProblem[] = [
  {
    slug: "min-stack",
    title: "Min Stack",
    difficulty: "MEDIUM",
    statement: `Design a stack that supports \`push\`, \`pop\`, \`top\`, and retrieving the minimum element — all in O(1).

**Input**: one operation per line —
- \`push x\` — push integer x
- \`pop\` — remove the top
- \`top\` — read the top
- \`getMin\` — read the minimum

**Output**: one line per operation — \`push\` and \`pop\` print \`null\`; \`top\` and \`getMin\` print their result. Operations are always valid (no pop/top on an empty stack).`,
    constraints: `- Up to 3·10^4 operations
- -2^31 ≤ x ≤ 2^31 − 1`,
    examples: [
      {
        input: "push -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin",
        output: "null\nnull\nnull\n-3\nnull\n0\n-2",
      },
    ],
    hints: [
      "A single min variable breaks when the minimum gets popped.",
      "Store the minimum *so far* alongside every element — or keep a second stack of minimums.",
    ],
    editorial: `Keep a second stack that records the minimum of everything at or below each position: on \`push x\`, push \`min(x, minStack.top)\`; on \`pop\`, pop both. \`getMin\` is then just the top of the min stack. Every operation is a plain stack operation → O(1) each, O(n) space.`,
    complexityTime: "O(1) per operation",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode min stack"),
    tags: ["stack", "design"],
    starterCode: buildStarter("ops", "lines", "processOps"),
    reference: (input) => {
      const ops = lines(input).filter((l) => l.trim().length > 0);
      const st: number[] = [];
      const mins: number[] = [];
      const out: string[] = [];
      for (const op of ops) {
        const parts = op.trim().split(/\s+/);
        if (parts[0] === "push") {
          const x = parseInt(parts[1], 10);
          st.push(x);
          mins.push(mins.length ? Math.min(x, mins[mins.length - 1]) : x);
          out.push("null");
        } else if (parts[0] === "pop") {
          st.pop();
          mins.pop();
          out.push("null");
        } else if (parts[0] === "top") {
          out.push(String(st[st.length - 1]));
        } else {
          out.push(String(mins[mins.length - 1]));
        }
      }
      return linesOut(out);
    },
    tests: [
      { input: "push -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin", sample: true },
      { input: "push 5\ntop\ngetMin\npush 3\ngetMin\npop\ngetMin" },
      { input: "push 1\npush 1\npush 1\ngetMin\npop\npop\ntop" },
      { input: "push 2147483647\ngetMin\npush -2147483648\ngetMin\npop\ngetMin" },
    ],
  },

  {
    slug: "implement-queue-using-stacks",
    title: "Implement Queue using Stacks",
    difficulty: "EASY",
    statement: `Implement a FIFO queue using only two stacks.

**Input**: one operation per line —
- \`push x\` — enqueue integer x
- \`pop\` — dequeue and print the front
- \`peek\` — print the front
- \`empty\` — print \`true\`/\`false\`

**Output**: one line per operation — \`push\` prints \`null\`; the others print their result.`,
    constraints: `- Up to 100 operations; pop/peek are always valid.`,
    examples: [
      {
        input: "push 1\npush 2\npeek\npop\nempty",
        output: "null\nnull\n1\n1\nfalse",
      },
    ],
    hints: [
      "Two stacks: one for inbox, one for outbox.",
      "Only flip the inbox into the outbox when the outbox is empty — that preserves order.",
    ],
    editorial: `Push everything onto an **in** stack. When popping or peeking, if the **out** stack is empty, pour the in-stack into it (reversing order — oldest ends up on top), then serve from out. Each element moves at most twice, so operations are **amortized O(1)**.`,
    complexityTime: "Amortized O(1)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("implement queue using stacks leetcode"),
    tags: ["stack", "queue", "design"],
    starterCode: buildStarter("ops", "lines", "processOps"),
    reference: (input) => {
      const ops = lines(input).filter((l) => l.trim().length > 0);
      const q: number[] = [];
      const out: string[] = [];
      for (const op of ops) {
        const parts = op.trim().split(/\s+/);
        if (parts[0] === "push") {
          q.push(parseInt(parts[1], 10));
          out.push("null");
        } else if (parts[0] === "pop") {
          out.push(String(q.shift()));
        } else if (parts[0] === "peek") {
          out.push(String(q[0]));
        } else {
          out.push(q.length === 0 ? "true" : "false");
        }
      }
      return linesOut(out);
    },
    tests: [
      { input: "push 1\npush 2\npeek\npop\nempty", sample: true },
      { input: "empty\npush 7\nempty\npop\nempty" },
      { input: "push 1\npush 2\npush 3\npop\npop\npush 4\npop\npop\nempty" },
    ],
  },

  {
    slug: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "MEDIUM",
    statement: `Evaluate an arithmetic expression given in Reverse Polish (postfix) notation. Valid operators are \`+\`, \`-\`, \`*\`, \`/\`. Division truncates toward zero. The expression is always valid and no division by zero occurs.

**Input**: one line of space-separated tokens.
**Output**: the value of the expression.`,
    constraints: `- 1 ≤ tokens.length ≤ 10^4
- Intermediate values fit in a 32-bit integer.`,
    examples: [
      { input: "2 1 + 3 *", output: "9", explanation: "(2 + 1) × 3." },
      { input: "4 13 5 / +", output: "6", explanation: "4 + (13 / 5) = 4 + 2." },
      { input: "10 6 9 3 + -11 * / * 17 + 5 +", output: "22" },
    ],
    hints: [
      "Push numbers; on an operator, pop two operands, apply, push the result.",
      "Order matters for - and /: the second pop is the left operand.",
      "Truncate division toward zero (not floor) — mind negative results.",
    ],
    editorial: `Postfix expressions evaluate naturally with a stack: operands are pushed, and each operator consumes the top two values (the first popped is the **right** operand) and pushes the result. Division must truncate toward zero, which differs from floor division for negatives. One pass, O(n) time and space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode evaluate reverse polish notation"),
    tags: ["stack", "array", "math"],
    starterCode: buildStarter("stringArray", "int", "evalRPN"),
    reference: (input) => {
      const tokens = words(lines(input)[0]);
      const st: number[] = [];
      for (const t of tokens) {
        if (t === "+" || t === "-" || t === "*" || t === "/") {
          const b = st.pop()!;
          const a = st.pop()!;
          let v: number;
          if (t === "+") v = a + b;
          else if (t === "-") v = a - b;
          else if (t === "*") v = a * b;
          else v = Math.trunc(a / b);
          st.push(v);
        } else {
          st.push(parseInt(t, 10));
        }
      }
      return String(st[0]);
    },
    tests: [
      { input: "2 1 + 3 *", sample: true },
      { input: "4 13 5 / +", sample: true },
      { input: "10 6 9 3 + -11 * / * 17 + 5 +" },
      { input: "42" },
      { input: "-7 3 /" },
    ],
  },

  {
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "MEDIUM",
    statement: `Given an array \`temperatures\`, return an array \`answer\` where \`answer[i]\` is the number of days you must wait after day \`i\` for a warmer temperature, or \`0\` if none exists.

**Input**: one line of space-separated integers.
**Output**: the answer array, space-separated.`,
    constraints: `- 1 ≤ temperatures.length ≤ 10^5
- 30 ≤ temperatures[i] ≤ 100`,
    examples: [
      { input: "73 74 75 71 69 72 76 73", output: "1 1 4 2 1 1 0 0" },
      { input: "30 40 50 60", output: "1 1 1 0" },
    ],
    hints: [
      "Brute force scans forward for each day — O(n²).",
      "Keep a stack of indices whose warmer day hasn't been found yet.",
      "When a warmer temperature arrives, it resolves every colder index on the stack.",
    ],
    editorial: `Maintain a **monotonic stack** of indices with strictly decreasing temperatures. Each new day pops every index whose temperature is lower — the wait for those days is the index difference — then pushes itself. Every index is pushed and popped once → O(n).`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode daily temperatures"),
    tags: ["stack", "monotonic-stack", "array"],
    starterCode: buildStarter("intArray", "intArray", "dailyTemperatures"),
    reference: (input) => {
      const t = first(input);
      const res = new Array(t.length).fill(0);
      const st: number[] = [];
      for (let i = 0; i < t.length; i++) {
        while (st.length && t[i] > t[st[st.length - 1]]) {
          const j = st.pop()!;
          res[j] = i - j;
        }
        st.push(i);
      }
      return arrOut(res);
    },
    tests: [
      { input: "73 74 75 71 69 72 76 73", sample: true },
      { input: "30 40 50 60", sample: true },
      { input: "30 60 90" },
      { input: "90 60 30" },
      { input: "55" },
    ],
  },

  {
    slug: "next-greater-element-ii",
    title: "Next Greater Element II",
    difficulty: "MEDIUM",
    statement: `Given a **circular** integer array \`nums\`, return for each element the next greater element scanning forward (wrapping around); use \`-1\` if none exists.

**Input**: one line of space-separated integers.
**Output**: the result array, space-separated.`,
    constraints: `- 1 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9`,
    examples: [
      { input: "1 2 1", output: "2 -1 2", explanation: "The last 1 wraps around to find 2." },
      { input: "1 2 3 4 3", output: "2 3 4 -1 4" },
    ],
    hints: [
      "Handle circularity by iterating the array twice (indices mod n).",
      "Use the same decreasing monotonic stack as in Daily Temperatures.",
    ],
    editorial: `Run the standard next-greater monotonic stack over indices \`0 … 2n−1\`, taking values at \`i mod n\`. The second lap lets elements near the end see candidates at the front, and only the first lap pushes indices. O(n) time, O(n) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("next greater element ii monotonic stack"),
    tags: ["stack", "monotonic-stack", "array"],
    starterCode: buildStarter("intArray", "intArray", "nextGreaterElements"),
    reference: (input) => {
      const nums = first(input);
      const n = nums.length;
      const res = new Array(n).fill(-1);
      const st: number[] = [];
      for (let i = 0; i < 2 * n; i++) {
        const v = nums[i % n];
        while (st.length && nums[st[st.length - 1]] < v) {
          res[st.pop()!] = v;
        }
        if (i < n) st.push(i);
      }
      return arrOut(res);
    },
    tests: [
      { input: "1 2 1", sample: true },
      { input: "1 2 3 4 3", sample: true },
      { input: "5 4 3 2 1" },
      { input: "1 1 1" },
      { input: "7" },
    ],
  },

  {
    slug: "asteroid-collision",
    title: "Asteroid Collision",
    difficulty: "MEDIUM",
    statement: `Asteroids move along a line: the absolute value is size, the sign is direction (positive → right, negative → left). All move at the same speed. When two collide, the smaller explodes (both if equal). Asteroids moving the same direction never meet. Return the state after all collisions.

**Input**: one line of space-separated non-zero integers.
**Output**: the surviving asteroids, space-separated (empty if none survive).`,
    constraints: `- 2 ≤ asteroids.length ≤ 10^4
- -1000 ≤ asteroids[i] ≤ 1000, non-zero.`,
    examples: [
      { input: "5 10 -5", output: "5 10", explanation: "10 destroys -5." },
      { input: "8 -8", output: "", explanation: "Mutual destruction." },
      { input: "10 2 -5", output: "10", explanation: "-5 destroys 2, then 10 destroys -5." },
    ],
    hints: [
      "Collisions only happen when a right-mover is followed by a left-mover.",
      "Keep survivors on a stack; a new left-mover fights the stack top repeatedly.",
    ],
    editorial: `Scan left to right with a stack of survivors. A new asteroid only fights while the stack top moves right and the newcomer moves left: pop smaller right-movers, annihilate on ties, and discard the newcomer if the top is bigger. Each asteroid is pushed/popped at most once → O(n).`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("asteroid collision leetcode stack"),
    tags: ["stack", "array", "simulation"],
    starterCode: buildStarter("intArray", "intArray", "asteroidCollision"),
    reference: (input) => {
      const asteroids = first(input);
      const st: number[] = [];
      for (const a of asteroids) {
        let alive = true;
        while (alive && a < 0 && st.length && st[st.length - 1] > 0) {
          const top = st[st.length - 1];
          if (top < -a) {
            st.pop();
          } else if (top === -a) {
            st.pop();
            alive = false;
          } else {
            alive = false;
          }
        }
        if (alive) st.push(a);
      }
      return arrOut(st);
    },
    tests: [
      { input: "5 10 -5", sample: true },
      { input: "8 -8", sample: true },
      { input: "10 2 -5", sample: true },
      { input: "-2 -1 1 2" },
      { input: "1 -2 -2 -2" },
    ],
  },

  {
    slug: "simplify-path",
    title: "Simplify Path",
    difficulty: "MEDIUM",
    statement: `Given an absolute Unix file path, return the simplified canonical path: it starts with a single \`/\`, has no trailing slash (unless it is the root), no \`.\` or \`..\` segments, and no double slashes.

**Input**: one line, the path.
**Output**: the canonical path.`,
    constraints: `- 1 ≤ path.length ≤ 3000
- Consists of letters, digits, '.', '/', '_'.
- Always starts with '/'.`,
    examples: [
      { input: "/home/", output: "/home" },
      { input: "/../", output: "/", explanation: "You cannot go above the root." },
      { input: "/home//foo/", output: "/home/foo" },
      { input: "/a/./b/../../c/", output: "/c" },
    ],
    hints: [
      "Split on '/' and process each segment.",
      "'..' pops the last directory; '.' and empty segments are ignored.",
    ],
    editorial: `Split on \`/\` and fold the segments through a stack: normal names push, \`..\` pops (if anything to pop), while \`.\` and empty segments (from doubled slashes) are skipped. Join the stack with \`/\` and prefix the root. O(n) time and space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("simplify path leetcode stack"),
    tags: ["stack", "string"],
    starterCode: buildStarter("string", "string", "simplifyPath"),
    reference: (input) => {
      const path = lines(input)[0] ?? "";
      const st: string[] = [];
      for (const seg of path.split("/")) {
        if (seg === "" || seg === ".") continue;
        if (seg === "..") st.pop();
        else st.push(seg);
      }
      return "/" + st.join("/");
    },
    tests: [
      { input: "/home/", sample: true },
      { input: "/../", sample: true },
      { input: "/home//foo/", sample: true },
      { input: "/a/./b/../../c/" },
      { input: "/.../a/../b/c/../d/./" },
    ],
  },

  {
    slug: "decode-string",
    title: "Decode String",
    difficulty: "MEDIUM",
    statement: `Given an encoded string where \`k[encoded]\` means the bracketed content is repeated \`k\` times (nestable), return the decoded string.

**Input**: one line, the encoded string.
**Output**: the decoded string.`,
    constraints: `- 1 ≤ s.length ≤ 30
- k is a positive integer ≤ 300; input is always valid.
- Output length ≤ 10^5.`,
    examples: [
      { input: "3[a]2[bc]", output: "aaabcbc" },
      { input: "3[a2[c]]", output: "accaccacc" },
      { input: "2[abc]3[cd]ef", output: "abcabccdcdcdef" },
    ],
    hints: [
      "Nesting screams stack (or recursion).",
      "On '[' push the current string and count; on ']' pop and combine.",
      "Numbers can be multi-digit — accumulate them.",
    ],
    editorial: `Walk the string keeping a current segment and repeat count. On \`[\`, push both onto a stack and reset; on \`]\`, pop \`(prev, k)\` and set current = prev + current×k. Digits accumulate into the count (they can be multi-digit). Each character is processed once → O(n + output).`,
    complexityTime: "O(n + |output|)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode decode string"),
    tags: ["stack", "string", "recursion"],
    starterCode: buildStarter("string", "string", "decodeString"),
    reference: (input) => {
      const s = lines(input)[0] ?? "";
      const st: Array<[string, number]> = [];
      let cur = "";
      let k = 0;
      for (const ch of s) {
        if (ch >= "0" && ch <= "9") {
          k = k * 10 + (ch.charCodeAt(0) - 48);
        } else if (ch === "[") {
          st.push([cur, k]);
          cur = "";
          k = 0;
        } else if (ch === "]") {
          const [prev, times] = st.pop()!;
          cur = prev + cur.repeat(times);
        } else {
          cur += ch;
        }
      }
      return cur;
    },
    tests: [
      { input: "3[a]2[bc]", sample: true },
      { input: "3[a2[c]]", sample: true },
      { input: "2[abc]3[cd]ef", sample: true },
      { input: "abc" },
      { input: "10[a]" },
    ],
  },

  {
    slug: "remove-k-digits",
    title: "Remove K Digits",
    difficulty: "MEDIUM",
    statement: `Given a string \`num\` representing a non-negative integer and an integer \`k\`, remove exactly \`k\` digits so the remaining number is the smallest possible. Strip leading zeros; if nothing remains, return \`0\`.

**Input**
- Line 1: the digit string \`num\`
- Line 2: integer \`k\`

**Output**: the smallest resulting number as a string.`,
    constraints: `- 1 ≤ num.length ≤ 10^5
- 0 ≤ k ≤ num.length
- No leading zeros in the input (except "0" itself).`,
    examples: [
      { input: "1432219\n3", output: "1219", explanation: "Remove 4, 3, 2." },
      { input: "10200\n1", output: "200", explanation: "Remove the 1; leading zeros are stripped." },
      { input: "10\n2", output: "0" },
    ],
    hints: [
      "A bigger digit followed by a smaller one should be deleted — greedily, from the left.",
      "Keep a stack of digits; pop while the top exceeds the incoming digit and removals remain.",
      "If removals are left over at the end, trim from the tail.",
    ],
    editorial: `Build the answer with a **monotonic non-decreasing stack** of digits: while the incoming digit is smaller than the stack top and removals remain, pop. Leftover removals come off the end (the tail is the largest suffix). Finally strip leading zeros. Each digit is pushed and popped at most once → O(n).`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("remove k digits monotonic stack"),
    tags: ["stack", "monotonic-stack", "greedy", "string"],
    starterCode: buildStarter("stringInt", "string", "removeKdigits"),
    reference: (input) => {
      const [num = "", kline] = lines(input);
      let k = int(kline);
      const st: string[] = [];
      for (const d of num) {
        while (k > 0 && st.length && st[st.length - 1] > d) {
          st.pop();
          k--;
        }
        st.push(d);
      }
      while (k > 0) {
        st.pop();
        k--;
      }
      const res = st.join("").replace(/^0+/, "");
      return res === "" ? "0" : res;
    },
    tests: [
      { input: "1432219\n3", sample: true },
      { input: "10200\n1", sample: true },
      { input: "10\n2", sample: true },
      { input: "9\n0" },
      { input: "112\n1" },
      { input: "5337\n2" },
    ],
  },

  {
    slug: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "HARD",
    statement: `Given an array \`heights\` of bar heights (width 1 each), return the area of the largest rectangle that fits inside the histogram.

**Input**: one line of space-separated integers.
**Output**: the maximum area.`,
    constraints: `- 1 ≤ heights.length ≤ 10^5
- 0 ≤ heights[i] ≤ 10^4`,
    examples: [
      { input: "2 1 5 6 2 3", output: "10", explanation: "Bars 5 and 6 give 5 × 2 = 10." },
      { input: "2 4", output: "4" },
    ],
    hints: [
      "For each bar, the best rectangle using its height extends to the nearest shorter bar on each side.",
      "A monotonic increasing stack finds both boundaries as bars are popped.",
      "Append a sentinel height 0 to flush the stack at the end.",
    ],
    editorial: `Sweep with a stack of indices whose heights increase. When the incoming bar is lower, pop: the popped bar's rectangle is bounded on the right by the current index and on the left by the new stack top. A trailing sentinel of height 0 flushes everything. Each bar enters and leaves the stack once → O(n).`,
    approaches: [
      {
        name: "Divide and conquer on the minimum",
        complexityTime: "O(n log n) average",
        complexitySpace: "O(log n)",
        body: "Best rectangle spans the minimum bar or lies entirely on one side of it.",
      },
      {
        name: "Monotonic stack",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "Pop when a shorter bar arrives; the pop computes that bar's maximal width.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode largest rectangle in histogram"),
    tags: ["stack", "monotonic-stack", "array"],
    starterCode: buildStarter("intArray", "int", "largestRectangleArea"),
    reference: (input) => {
      const heights = first(input);
      const st: number[] = [];
      let best = 0;
      const h = [...heights, 0];
      for (let i = 0; i < h.length; i++) {
        while (st.length && h[st[st.length - 1]] > h[i]) {
          const height = h[st.pop()!];
          const left = st.length ? st[st.length - 1] : -1;
          best = Math.max(best, height * (i - left - 1));
        }
        st.push(i);
      }
      return String(best);
    },
    tests: [
      { input: "2 1 5 6 2 3", sample: true },
      { input: "2 4", sample: true },
      { input: "1" },
      { input: "0 0" },
      { input: "5 5 5 5" },
      { input: "6 7 5 2 4 5 9 3" },
    ],
  },

  {
    slug: "next-greater-element-i",
    title: "Next Greater Element I",
    difficulty: "EASY",
    statement: `\`nums1\` is a subset of \`nums2\` (all values distinct). For each element of \`nums1\`, find the first element **greater than it** appearing to its right in \`nums2\`, or −1 if none exists.

**Input**
- Line 1: space-separated integers — \`nums1\`
- Line 2: space-separated integers — \`nums2\`

**Output**: the answers for \`nums1\`, space-separated.`,
    constraints: `- 1 ≤ nums1.length ≤ nums2.length ≤ 1000
- All values in nums2 are distinct; every nums1 value appears in nums2.`,
    examples: [
      {
        input: "4 1 2\n1 3 4 2",
        output: "-1 3 -1",
        explanation: "Nothing right of 4 is bigger; 3 follows 1; nothing follows 2.",
      },
      { input: "2 4\n1 2 3 4", output: "3 -1" },
    ],
    hints: [
      "Solve it entirely on nums2 first; nums1 just reads the answers.",
      "A monotonic decreasing stack: while the new element beats the stack top, the top just found its next-greater.",
      "Store the results in a map keyed by value (values are distinct).",
    ],
    editorial: `One pass over nums2 with a monotonic stack: push each element; whenever the incoming value exceeds the stack top, pop it and record incoming as its next-greater in a hash map. Elements left on the stack at the end have no answer (−1). Then map nums1 through the answers. Every element is pushed and popped at most once — O(n + m). This is the miniature version of the monotonic-stack pattern behind Daily Temperatures and stock spans: the stack always holds elements still waiting for something bigger.`,
    approaches: [
      {
        name: "Monotonic stack + map",
        complexityTime: "O(n + m)",
        complexitySpace: "O(n)",
        body: "Precompute next-greater for all of nums2; answer nums1 by lookup.",
      },
    ],
    complexityTime: "O(n + m)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("next greater element i monotonic stack"),
    tags: ["stack", "monotonic-stack", "hash-map"],
    starterCode: buildStarter("twoIntArrays", "intArray", "nextGreaterElement"),
    reference: (input) => {
      const nums1 = ints(lines(input)[0]);
      const nums2 = ints(lines(input)[1]);
      const next = new Map<number, number>();
      const stack: number[] = [];
      for (const x of nums2) {
        while (stack.length && stack[stack.length - 1] < x) {
          next.set(stack.pop() as number, x);
        }
        stack.push(x);
      }
      return arrOut(nums1.map((x) => next.get(x) ?? -1));
    },
    tests: [
      { input: "4 1 2\n1 3 4 2", sample: true },
      { input: "2 4\n1 2 3 4", sample: true },
      { input: "5\n5" },
      { input: "1 3 5 2 4\n6 5 4 3 2 1" },
      { input: "3 1 4 2\n1 2 3 4" },
    ],
  },
];
