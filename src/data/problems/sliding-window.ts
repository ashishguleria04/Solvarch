import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, arrOut, yt, lines } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const slidingWindow: SeedProblem[] = [
  {
    slug: "maximum-average-subarray-i",
    title: "Maximum Average Subarray I",
    difficulty: "EASY",
    statement: `Given an integer array \`nums\` and an integer \`k\`, find the contiguous subarray of length exactly \`k\` with the maximum average, and return that average.

**Input**
- Line 1: space-separated integers \`nums\`
- Line 2: integer \`k\`

**Output**: the maximum average, printed with two decimal places (the template formats it for you).`,
    constraints: `- 1 ≤ k ≤ nums.length ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4`,
    examples: [
      { input: "1 12 -5 -6 50 3\n4", output: "12.75", explanation: "(12 - 5 - 6 + 50) / 4 = 12.75." },
      { input: "5\n1", output: "5.00" },
    ],
    hints: [
      "Recomputing each window sum from scratch is O(n·k).",
      "Slide the window: add the entering element, subtract the leaving one.",
    ],
    editorial: `Compute the sum of the first \`k\` elements, then slide the window one step at a time: add the new element, subtract the one that left. Track the maximum sum and divide by \`k\` at the end. O(n) time, O(1) space — the canonical fixed-size sliding window.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("maximum average subarray sliding window"),
    tags: ["sliding-window", "array"],
    starterCode: buildStarter("intArrayK", "float2", "findMaxAverage"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const k = int(l1);
      let sum = 0;
      for (let i = 0; i < k; i++) sum += nums[i];
      let best = sum;
      for (let i = k; i < nums.length; i++) {
        sum += nums[i] - nums[i - k];
        best = Math.max(best, sum);
      }
      return (best / k).toFixed(2);
    },
    tests: [
      { input: "1 12 -5 -6 50 3\n4", sample: true },
      { input: "5\n1", sample: true },
      { input: "0 4 0 3 2\n1" },
      { input: "-1 -2 -3 -4\n2" },
      { input: "8 2 4 6\n4" },
    ],
  },

  {
    slug: "minimum-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    difficulty: "MEDIUM",
    statement: `Given an array of **positive** integers \`nums\` and a positive integer \`target\`, return the minimal length of a contiguous subarray whose sum is ≥ \`target\`. If there is no such subarray, return \`0\`.

**Input**
- Line 1: space-separated positive integers \`nums\`
- Line 2: integer \`target\`

**Output**: the minimal length, or 0.`,
    constraints: `- 1 ≤ nums.length ≤ 10^5
- 1 ≤ nums[i] ≤ 10^4
- 1 ≤ target ≤ 10^9`,
    examples: [
      { input: "2 3 1 2 4 3\n7", output: "2", explanation: "[4,3] has sum 7 with length 2." },
      { input: "1 1 1 1\n11", output: "0" },
    ],
    hints: [
      "All numbers are positive, so growing the window only increases the sum.",
      "Expand the right edge until the sum reaches target, then shrink from the left while it still holds.",
    ],
    editorial: `A variable-size window works because every element is positive: the window sum is monotonic in both directions. Expand right until \`sum ≥ target\`, then contract left as far as possible, recording the window length at each valid state. Each index enters and leaves the window once → O(n).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("minimum size subarray sum sliding window"),
    tags: ["sliding-window", "array", "binary-search"],
    starterCode: buildStarter("intArrayTarget", "int", "minSubArrayLen"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const target = int(l1);
      let best = Infinity;
      let sum = 0;
      let l = 0;
      for (let r = 0; r < nums.length; r++) {
        sum += nums[r];
        while (sum >= target) {
          best = Math.min(best, r - l + 1);
          sum -= nums[l++];
        }
      }
      return String(best === Infinity ? 0 : best);
    },
    tests: [
      { input: "2 3 1 2 4 3\n7", sample: true },
      { input: "1 1 1 1\n11", sample: true },
      { input: "1 4 4\n4" },
      { input: "5\n5" },
      { input: "1 2 3 4 5\n15" },
    ],
  },

  {
    slug: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "MEDIUM",
    statement: `You are given a string \`s\` of uppercase English letters and an integer \`k\`. You may replace at most \`k\` characters with any other letter. Return the length of the longest substring containing a single repeated letter achievable this way.

**Input**
- Line 1: string \`s\`
- Line 2: integer \`k\`

**Output**: the maximum length.`,
    constraints: `- 1 ≤ s.length ≤ 10^5
- 0 ≤ k ≤ s.length
- Uppercase English letters only.`,
    examples: [
      { input: "ABAB\n2", output: "4", explanation: "Replace both A's (or both B's) → AAAA." },
      { input: "AABABBA\n1", output: "4", explanation: "Replace the middle A → AABBBBA, window BBBB." },
    ],
    hints: [
      "A window is fixable iff (window length − count of its most frequent letter) ≤ k.",
      "Grow the right edge; when the window becomes invalid, slide the left edge forward.",
      "maxFreq never needs to decrease — a stale value only makes the window criterion stricter, never wrong.",
    ],
    editorial: `Maintain letter counts in a window and \`maxFreq\`, the highest count seen. The window is valid when \`len − maxFreq ≤ k\` (the other characters can all be replaced). Expand right; if invalid, advance left one step. Since the answer only cares about the largest valid window and \`maxFreq\` never shrinking keeps the window size monotone, the single pass is O(n) with an O(26) counter.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode longest repeating character replacement"),
    tags: ["sliding-window", "string", "hash-table"],
    starterCode: buildStarter("stringInt", "int", "characterReplacement"),
    reference: (input) => {
      const [s = "", kline] = lines(input);
      const k = int(kline);
      const count = new Map<string, number>();
      let l = 0;
      let maxFreq = 0;
      let best = 0;
      for (let r = 0; r < s.length; r++) {
        count.set(s[r], (count.get(s[r]) ?? 0) + 1);
        maxFreq = Math.max(maxFreq, count.get(s[r])!);
        while (r - l + 1 - maxFreq > k) {
          count.set(s[l], count.get(s[l])! - 1);
          l++;
        }
        best = Math.max(best, r - l + 1);
      }
      return String(best);
    },
    tests: [
      { input: "ABAB\n2", sample: true },
      { input: "AABABBA\n1", sample: true },
      { input: "AAAA\n0" },
      { input: "ABCDE\n1" },
      { input: "BAAAB\n2" },
    ],
  },

  {
    slug: "permutation-in-string",
    title: "Permutation in String",
    difficulty: "MEDIUM",
    statement: `Given two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\` as a substring.

**Input**
- Line 1: string \`s1\`
- Line 2: string \`s2\`

**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ s1.length, s2.length ≤ 10^4
- Lowercase English letters only.`,
    examples: [
      { input: "ab\neidbaooo", output: "true", explanation: "\"ba\" is a permutation of \"ab\"." },
      { input: "ab\neidboaoo", output: "false" },
    ],
    hints: [
      "Two strings are permutations of each other iff their letter counts match.",
      "Slide a window of length |s1| across s2, updating counts incrementally.",
    ],
    editorial: `A permutation match is a frequency match. Keep a count array for \`s1\` and one for the current window of length \`|s1|\` in \`s2\`; slide the window one character at a time, incrementing the entering letter and decrementing the leaving one, and compare counts (or track how many of the 26 letters currently match). O(n) time, O(26) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode permutation in string"),
    tags: ["sliding-window", "string", "hash-table"],
    starterCode: buildStarter("twoStrings", "bool", "checkInclusion"),
    reference: (input) => {
      const [s1 = "", s2 = ""] = lines(input);
      if (s1.length > s2.length) return boolOut(false);
      const need = new Array(26).fill(0);
      const win = new Array(26).fill(0);
      const idx = (c: string) => c.charCodeAt(0) - 97;
      for (const c of s1) need[idx(c)]++;
      for (let i = 0; i < s2.length; i++) {
        win[idx(s2[i])]++;
        if (i >= s1.length) win[idx(s2[i - s1.length])]--;
        if (i >= s1.length - 1 && need.every((v, j) => v === win[j])) return boolOut(true);
      }
      return boolOut(false);
    },
    tests: [
      { input: "ab\neidbaooo", sample: true },
      { input: "ab\neidboaoo", sample: true },
      { input: "a\na" },
      { input: "abc\nccccbbbbaaaa" },
      { input: "adc\ndcda" },
    ],
  },

  {
    slug: "find-all-anagrams-in-a-string",
    title: "Find All Anagrams in a String",
    difficulty: "MEDIUM",
    statement: `Given two strings \`s\` and \`p\`, return the start indices of all anagrams of \`p\` inside \`s\`, in increasing order.

**Input**
- Line 1: string \`s\`
- Line 2: string \`p\`

**Output**: the start indices, space-separated (nothing if none).`,
    constraints: `- 1 ≤ s.length, p.length ≤ 3·10^4
- Lowercase English letters only.`,
    examples: [
      { input: "cbaebabacd\nabc", output: "0 6", explanation: "\"cba\" at 0 and \"bac\" at 6." },
      { input: "abab\nab", output: "0 1 2" },
    ],
    hints: [
      "Same idea as Permutation in String, but collect every matching window.",
      "Maintain letter counts for a window of length |p| and compare as you slide.",
    ],
    editorial: `Slide a fixed window of length \`|p|\` across \`s\`, maintaining a letter-count array that is updated in O(1) per step. Whenever the window's counts equal \`p\`'s counts, record the window start. O(n · 26) worst case, effectively O(n).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("find all anagrams in a string leetcode"),
    tags: ["sliding-window", "string", "hash-table"],
    starterCode: buildStarter("twoStrings", "intArray", "findAnagrams"),
    reference: (input) => {
      const [s = "", p = ""] = lines(input);
      if (p.length > s.length) return "";
      const need = new Array(26).fill(0);
      const win = new Array(26).fill(0);
      const idx = (c: string) => c.charCodeAt(0) - 97;
      for (const c of p) need[idx(c)]++;
      const res: number[] = [];
      for (let i = 0; i < s.length; i++) {
        win[idx(s[i])]++;
        if (i >= p.length) win[idx(s[i - p.length])]--;
        if (i >= p.length - 1 && need.every((v, j) => v === win[j])) res.push(i - p.length + 1);
      }
      return arrOut(res);
    },
    tests: [
      { input: "cbaebabacd\nabc", sample: true },
      { input: "abab\nab", sample: true },
      { input: "aaaa\naa" },
      { input: "xyz\nabc" },
      { input: "af\nbe" },
    ],
  },

  {
    slug: "fruit-into-baskets",
    title: "Fruit Into Baskets",
    difficulty: "MEDIUM",
    statement: `You walk along a row of trees; \`fruits[i]\` is the fruit type of the i-th tree. You have two baskets, each holding only one type. Starting anywhere, you pick one fruit per tree moving right, stopping when a tree's fruit fits neither basket. Return the maximum number of fruits you can collect — i.e. the longest subarray with at most **two distinct** values.

**Input**: one line of space-separated integers \`fruits\`.
**Output**: the maximum number of fruits.`,
    constraints: `- 1 ≤ fruits.length ≤ 10^5
- 0 ≤ fruits[i] ≤ 10^5`,
    examples: [
      { input: "1 2 1", output: "3" },
      { input: "0 1 2 2", output: "3", explanation: "[1,2,2] uses two types." },
      { input: "1 2 3 2 2", output: "4", explanation: "[2,3,2,2]." },
    ],
    hints: [
      "This is 'longest subarray with at most 2 distinct elements' in disguise.",
      "Track counts per type in the window; shrink from the left when a third type appears.",
    ],
    editorial: `Maintain a window and a map \`type → count\`. Expand right; when the map grows beyond two keys, shrink from the left, decrementing counts and deleting zeros, until only two types remain. Every element is added and removed at most once → O(n).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("fruit into baskets sliding window"),
    tags: ["sliding-window", "array", "hash-table"],
    starterCode: buildStarter("intArray", "int", "totalFruit"),
    reference: (input) => {
      const fruits = first(input);
      const count = new Map<number, number>();
      let l = 0;
      let best = 0;
      for (let r = 0; r < fruits.length; r++) {
        count.set(fruits[r], (count.get(fruits[r]) ?? 0) + 1);
        while (count.size > 2) {
          const c = count.get(fruits[l])! - 1;
          if (c === 0) count.delete(fruits[l]);
          else count.set(fruits[l], c);
          l++;
        }
        best = Math.max(best, r - l + 1);
      }
      return String(best);
    },
    tests: [
      { input: "1 2 1", sample: true },
      { input: "0 1 2 2", sample: true },
      { input: "1 2 3 2 2", sample: true },
      { input: "3 3 3 1 2 1 1 2 3 3 4" },
      { input: "5" },
    ],
  },

  {
    slug: "max-consecutive-ones-iii",
    title: "Max Consecutive Ones III",
    difficulty: "MEDIUM",
    statement: `Given a binary array \`nums\` and an integer \`k\`, return the length of the longest contiguous run of 1s achievable if you may flip at most \`k\` zeros.

**Input**
- Line 1: space-separated 0/1 integers
- Line 2: integer \`k\`

**Output**: the maximum length.`,
    constraints: `- 1 ≤ nums.length ≤ 10^5
- nums[i] ∈ {0, 1}
- 0 ≤ k ≤ nums.length`,
    examples: [
      { input: "1 1 1 0 0 0 1 1 1 1 0\n2", output: "6", explanation: "Flip the last two 0s in the window [0,0,1,1,1,1]." },
      { input: "0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1\n3", output: "10" },
    ],
    hints: [
      "Reframe: longest window containing at most k zeros.",
      "Count zeros in the window; when the count exceeds k, move the left edge.",
    ],
    editorial: `The answer is the longest window with at most \`k\` zeros. Expand the right edge, incrementing a zero counter; when it exceeds \`k\`, advance the left edge (decrementing when a zero leaves). Track the best window length. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("max consecutive ones iii sliding window"),
    tags: ["sliding-window", "array"],
    starterCode: buildStarter("intArrayK", "int", "longestOnes"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const k = int(l1);
      let l = 0;
      let zeros = 0;
      let best = 0;
      for (let r = 0; r < nums.length; r++) {
        if (nums[r] === 0) zeros++;
        while (zeros > k) {
          if (nums[l] === 0) zeros--;
          l++;
        }
        best = Math.max(best, r - l + 1);
      }
      return String(best);
    },
    tests: [
      { input: "1 1 1 0 0 0 1 1 1 1 0\n2", sample: true },
      { input: "0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1\n3", sample: true },
      { input: "0 0 0\n0" },
      { input: "1 1 1\n0" },
      { input: "0 0 0 1\n4" },
    ],
  },

  {
    slug: "longest-subarray-of-1s-after-deleting-one-element",
    title: "Longest Subarray of 1's After Deleting One Element",
    difficulty: "MEDIUM",
    statement: `Given a binary array \`nums\`, you must delete exactly one element. Return the length of the longest run of 1s in the resulting array.

**Input**: one line of space-separated 0/1 integers.
**Output**: the maximum length (0 if none).`,
    constraints: `- 1 ≤ nums.length ≤ 10^5
- nums[i] ∈ {0, 1}`,
    examples: [
      { input: "1 1 0 1", output: "3", explanation: "Delete the 0 → [1,1,1]." },
      { input: "0 1 1 1 0 1 1 0 1", output: "5", explanation: "Delete the middle 0 → run of 5." },
      { input: "1 1 1", output: "2", explanation: "You must delete something." },
    ],
    hints: [
      "This is a window with at most one zero — minus one for the mandatory deletion.",
      "Answer = longest such window length − 1.",
    ],
    editorial: `Find the longest window containing at most one zero (same pattern as Max Consecutive Ones III with k = 1), then subtract 1 because one element — a zero if present, otherwise a one — must be deleted. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("longest subarray of 1s after deleting one element"),
    tags: ["sliding-window", "array"],
    starterCode: buildStarter("intArray", "int", "longestSubarray"),
    reference: (input) => {
      const nums = first(input);
      let l = 0;
      let zeros = 0;
      let best = 0;
      for (let r = 0; r < nums.length; r++) {
        if (nums[r] === 0) zeros++;
        while (zeros > 1) {
          if (nums[l] === 0) zeros--;
          l++;
        }
        best = Math.max(best, r - l + 1);
      }
      return String(best - 1);
    },
    tests: [
      { input: "1 1 0 1", sample: true },
      { input: "0 1 1 1 0 1 1 0 1", sample: true },
      { input: "1 1 1", sample: true },
      { input: "0" },
      { input: "0 0 0" },
    ],
  },

  {
    slug: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    difficulty: "HARD",
    statement: `Given an integer array \`nums\` and a window size \`k\`, return the maximum of each contiguous window of size \`k\` as it slides left to right.

**Input**
- Line 1: space-separated integers \`nums\`
- Line 2: integer \`k\`

**Output**: the window maximums, space-separated.`,
    constraints: `- 1 ≤ k ≤ nums.length ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4`,
    examples: [
      {
        input: "1 3 -1 -3 5 3 6 7\n3",
        output: "3 3 5 5 6 7",
        explanation: "Windows: [1,3,-1] [3,-1,-3] [-1,-3,5] [-3,5,3] [5,3,6] [3,6,7].",
      },
      { input: "1\n1", output: "1" },
    ],
    hints: [
      "Recomputing each window max is O(n·k). A heap gets O(n log n). Can you reach O(n)?",
      "Keep a deque of indices whose values are strictly decreasing.",
      "A smaller element behind a newer, larger one can never be a future maximum — drop it.",
    ],
    editorial: `Use a **monotonic deque** of indices with decreasing values. For each new element: pop smaller values from the back (they're dominated), push the index, and pop the front if it slid out of the window. The front is always the current maximum. Every index enters and leaves the deque once → O(n).`,
    approaches: [
      {
        name: "Max-heap of (value, index)",
        complexityTime: "O(n log n)",
        complexitySpace: "O(n)",
        body: "Push everything; lazily discard heap tops that are outside the window.",
      },
      {
        name: "Monotonic deque",
        complexityTime: "O(n)",
        complexitySpace: "O(k)",
        body: "Maintain decreasing values; front of the deque is the window max.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(k)",
    youtubeUrl: yt("neetcode sliding window maximum"),
    tags: ["sliding-window", "deque", "heap", "monotonic-stack"],
    starterCode: buildStarter("intArrayK", "intArray", "maxSlidingWindow"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const k = int(l1);
      const res: number[] = [];
      for (let i = 0; i + k <= nums.length; i++) {
        res.push(Math.max(...nums.slice(i, i + k)));
      }
      return arrOut(res);
    },
    tests: [
      { input: "1 3 -1 -3 5 3 6 7\n3", sample: true },
      { input: "1\n1", sample: true },
      { input: "9 8 7 6 5\n2" },
      { input: "1 2 3 4 5\n5" },
      { input: "4 -2\n2" },
    ],
  },

  {
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "HARD",
    statement: `Given strings \`s\` and \`t\`, return the minimum-length substring of \`s\` that contains every character of \`t\` (including duplicates). If no such window exists, print an empty line. The answer is guaranteed unique.

**Input**
- Line 1: string \`s\`
- Line 2: string \`t\`

**Output**: the minimum window, or empty output if none.`,
    constraints: `- 1 ≤ s.length, t.length ≤ 10^5
- English letters (upper and lower case).`,
    examples: [
      { input: "ADOBECODEBANC\nABC", output: "BANC" },
      { input: "a\na", output: "a" },
      { input: "a\naa", output: "", explanation: "Two 'a's are required but only one exists." },
    ],
    hints: [
      "Track how many of t's required characters the window currently satisfies.",
      "Expand right until the window is valid; then shrink left while it stays valid.",
      "Only characters that appear in t affect validity — count them with a 'have vs need' counter.",
    ],
    editorial: `Keep \`need\` counts for \`t\` and a \`have\` counter of how many distinct characters currently meet their required count. Expand the right edge; when \`have\` equals the number of required distinct characters, contract from the left recording the best window, until validity breaks. Each pointer moves at most n steps → O(|s| + |t|).`,
    complexityTime: "O(n + m)",
    complexitySpace: "O(m)",
    youtubeUrl: yt("neetcode minimum window substring"),
    tags: ["sliding-window", "string", "hash-table"],
    starterCode: buildStarter("twoStrings", "string", "minWindow"),
    reference: (input) => {
      const [s = "", t = ""] = lines(input);
      if (t.length > s.length) return "";
      const need = new Map<string, number>();
      for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
      let have = 0;
      const required = need.size;
      const win = new Map<string, number>();
      let best = "";
      let bestLen = Infinity;
      let l = 0;
      for (let r = 0; r < s.length; r++) {
        const c = s[r];
        win.set(c, (win.get(c) ?? 0) + 1);
        if (need.has(c) && win.get(c) === need.get(c)) have++;
        while (have === required) {
          if (r - l + 1 < bestLen) {
            bestLen = r - l + 1;
            best = s.slice(l, r + 1);
          }
          const lc = s[l];
          win.set(lc, win.get(lc)! - 1);
          if (need.has(lc) && win.get(lc)! < need.get(lc)!) have--;
          l++;
        }
      }
      return best;
    },
    tests: [
      { input: "ADOBECODEBANC\nABC", sample: true },
      { input: "a\na", sample: true },
      { input: "a\naa" },
      { input: "aaflslflsldkalskaaa\naaa" },
      { input: "cabwefgewcwaefgcf\ncae" },
    ],
  },
];
