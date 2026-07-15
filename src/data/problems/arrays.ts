import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, arrOut, yt, lines, matOut } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const arrays: SeedProblem[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "EASY",
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers that add up to \`target\`. Exactly one valid answer exists, and you may not use the same element twice. Return the indices in increasing order.

**Input**
- Line 1: space-separated integers \`nums\`
- Line 2: integer \`target\`

**Output**
- The two indices, space-separated (smaller index first).`,
    constraints: `- 2 ≤ nums.length ≤ 10^4
- -10^9 ≤ nums[i] ≤ 10^9
- Only one valid answer exists.`,
    examples: [
      { input: "2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
      { input: "3 2 4\n6", output: "1 2", explanation: "nums[1] + nums[2] = 2 + 4 = 6." },
    ],
    hints: [
      "The brute-force approach checks every pair in O(n²). Can you do better?",
      "For each number x, you need to find target − x. What data structure gives O(1) lookups?",
      "Use a hash map from value → index. As you scan, check if the complement was already seen.",
    ],
    editorial: `The optimal solution scans the array once, keeping a hash map from each value to its index. For every element \`x\`, the complement we need is \`target − x\`. If that complement is already in the map, we've found the answer; otherwise we store \`x\` and continue. This trades O(n) extra space for a drop from O(n²) to O(n) time.`,
    approaches: [
      {
        name: "Brute force",
        complexityTime: "O(n²)",
        complexitySpace: "O(1)",
        body: "Check every pair (i, j) and return the first that sums to target.",
      },
      {
        name: "Hash map (one pass)",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "Store seen value → index. For each x, look up target − x before inserting x.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode two sum"),
    tags: ["array", "hash-table"],
    starterCode: buildStarter("intArrayTarget", "intArray", "twoSum"),
    reference: (input) => {
      const [l0, l1] = input.split("\n");
      const nums = ints(l0);
      const target = int(l1);
      const seen = new Map<number, number>();
      for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (seen.has(need)) return `${seen.get(need)} ${i}`;
        seen.set(nums[i], i);
      }
      return "";
    },
    tests: [
      { input: "2 7 11 15\n9", sample: true },
      { input: "3 2 4\n6", sample: true },
      { input: "3 3\n6" },
      { input: "-1 -2 -3 -4 -5\n-8" },
      { input: "0 4 3 0\n0" },
      { input: "1 2 3 4 5 6 7 8 9 10\n19" },
    ],
  },

  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "EASY",
    statement: `You are given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`. Buy on one day and sell on a later day to maximize profit. Return the maximum profit, or \`0\` if no profit is possible.

**Input**: one line of space-separated integers \`prices\`.
**Output**: the maximum profit.`,
    constraints: `- 1 ≤ prices.length ≤ 10^5
- 0 ≤ prices[i] ≤ 10^4`,
    examples: [
      { input: "7 1 5 3 6 4", output: "5", explanation: "Buy at 1, sell at 6 → profit 5." },
      { input: "7 6 4 3 1", output: "0", explanation: "Prices only fall; no profitable trade." },
    ],
    hints: [
      "Track the minimum price seen so far as you scan left to right.",
      "At each day, the best profit selling today is price − minSoFar.",
    ],
    editorial: `Walk through the prices once, remembering the lowest price seen so far. For each day, the profit from selling that day is \`price − minSoFar\`; keep the maximum. This is O(n) time and O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode best time to buy and sell stock"),
    tags: ["array", "dynamic-programming", "greedy"],
    starterCode: buildStarter("intArray", "int", "maxProfit"),
    reference: (input) => {
      const prices = first(input);
      let min = Infinity;
      let profit = 0;
      for (const p of prices) {
        if (p < min) min = p;
        else if (p - min > profit) profit = p - min;
      }
      return String(profit);
    },
    tests: [
      { input: "7 1 5 3 6 4", sample: true },
      { input: "7 6 4 3 1", sample: true },
      { input: "1", },
      { input: "2 4 1", },
      { input: "3 2 6 5 0 3", },
      { input: "1 2 3 4 5", },
    ],
  },

  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "MEDIUM",
    statement: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) with the largest sum, and return that sum.

**Input**: one line of space-separated integers.
**Output**: the maximum subarray sum.`,
    constraints: `- 1 ≤ nums.length ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4`,
    examples: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6", explanation: "[4,-1,2,1] has sum 6." },
      { input: "5 4 -1 7 8", output: "23", explanation: "The whole array sums to 23." },
    ],
    hints: [
      "If the running sum ever goes negative, it can only hurt future subarrays.",
      "Kadane's algorithm: at each index, either extend the previous subarray or start fresh.",
    ],
    editorial: `**Kadane's algorithm.** Keep a running sum \`cur\`. At each element, \`cur = max(x, cur + x)\` — either start a new subarray at \`x\` or extend the current one. Track the best \`cur\` seen. O(n) time, O(1) space.`,
    approaches: [
      {
        name: "Kadane's algorithm",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "Reset the running sum whenever extending would do worse than starting over at the current element.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode maximum subarray kadane"),
    tags: ["array", "divide-and-conquer", "dynamic-programming"],
    starterCode: buildStarter("intArray", "int", "maxSubArray"),
    reference: (input) => {
      const nums = first(input);
      let best = nums[0];
      let cur = nums[0];
      for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
      }
      return String(best);
    },
    tests: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", sample: true },
      { input: "5 4 -1 7 8", sample: true },
      { input: "1", },
      { input: "-1", },
      { input: "-2 -1", },
      { input: "8 -19 5 -4 20", },
    ],
  },

  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "EASY",
    statement: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice, and \`false\` if every element is distinct.

**Input**: one line of space-separated integers.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ nums.length ≤ 10^5
- -10^9 ≤ nums[i] ≤ 10^9`,
    examples: [
      { input: "1 2 3 1", output: "true", explanation: "1 appears twice." },
      { input: "1 2 3 4", output: "false", explanation: "All distinct." },
    ],
    hints: [
      "A set stores only distinct values.",
      "If the set's size is smaller than the array's length, there was a duplicate.",
    ],
    editorial: `Insert every element into a hash set. If you ever try to insert a value already present — equivalently, if the final set size is less than the array length — there's a duplicate. O(n) time and space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode contains duplicate"),
    tags: ["array", "hash-table", "sorting"],
    starterCode: buildStarter("intArray", "bool", "containsDuplicate"),
    reference: (input) => {
      const nums = first(input);
      return boolOut(new Set(nums).size !== nums.length);
    },
    tests: [
      { input: "1 2 3 1", sample: true },
      { input: "1 2 3 4", sample: true },
      { input: "1 1 1 3 3 4 3 2 4 2", },
      { input: "5", },
      { input: "-1 -1", },
    ],
  },

  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "MEDIUM",
    statement: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is the product of all elements of \`nums\` **except** \`nums[i]\`. Solve it without using the division operator, in O(n) time.

**Input**: one line of space-separated integers.
**Output**: the answer array, space-separated.`,
    constraints: `- 2 ≤ nums.length ≤ 10^5
- The product of any prefix or suffix fits in a 32-bit integer.`,
    examples: [
      { input: "1 2 3 4", output: "24 12 8 6" },
      { input: "-1 1 0 -3 3", output: "0 0 9 0 0" },
    ],
    hints: [
      "answer[i] = (product of everything to the left) × (product of everything to the right).",
      "Compute prefix products in one pass, then multiply by suffix products in a second pass.",
    ],
    editorial: `Do two passes. First, fill \`answer[i]\` with the product of all elements **before** \`i\` (prefix products). Then sweep right-to-left maintaining a running **suffix** product and multiply it into \`answer[i]\`. No division, O(n) time, O(1) extra space (excluding the output).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode product of array except self"),
    tags: ["array", "prefix-sum"],
    starterCode: buildStarter("intArray", "intArray", "productExceptSelf"),
    reference: (input) => {
      const nums = first(input);
      const n = nums.length;
      const res = new Array(n).fill(1);
      let pre = 1;
      for (let i = 0; i < n; i++) {
        res[i] = pre;
        pre *= nums[i];
      }
      let post = 1;
      for (let i = n - 1; i >= 0; i--) {
        res[i] *= post;
        post *= nums[i];
      }
      return arrOut(res);
    },
    tests: [
      { input: "1 2 3 4", sample: true },
      { input: "-1 1 0 -3 3", sample: true },
      { input: "2 3", },
      { input: "5 1 1 1", },
      { input: "1 2 3 4 5 6", },
    ],
  },

  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "EASY",
    statement: `Given an integer array \`nums\`, move all \`0\`s to the end while keeping the relative order of the non-zero elements. Return the resulting array.

**Input**: one line of space-separated integers.
**Output**: the transformed array, space-separated.`,
    constraints: `- 1 ≤ nums.length ≤ 10^4
- -2^31 ≤ nums[i] ≤ 2^31 − 1`,
    examples: [
      { input: "0 1 0 3 12", output: "1 3 12 0 0" },
      { input: "0", output: "0" },
    ],
    hints: [
      "Keep a write pointer for the next non-zero slot.",
      "Copy non-zero elements forward, then fill the remaining slots with zeros.",
    ],
    editorial: `Use a two-pointer approach: a \`write\` index marks where the next non-zero value goes. Scan the array; each non-zero value is placed at \`write\` and \`write\` advances. Finally, fill positions from \`write\` to the end with zeros. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode move zeroes"),
    tags: ["array", "two-pointers"],
    starterCode: buildStarter("intArray", "intArray", "moveZeroes"),
    reference: (input) => {
      const nums = first(input);
      const res = nums.filter((x) => x !== 0);
      while (res.length < nums.length) res.push(0);
      return arrOut(res);
    },
    tests: [
      { input: "0 1 0 3 12", sample: true },
      { input: "0", sample: true },
      { input: "1 2 3", },
      { input: "0 0 1", },
      { input: "4 0 5 0 0 6", },
    ],
  },

  {
    slug: "majority-element",
    title: "Majority Element",
    difficulty: "EASY",
    statement: `Given an array \`nums\` of size \`n\`, return the majority element — the element that appears **more than ⌊n/2⌋ times**. You may assume it always exists.

**Input**: one line of space-separated integers.
**Output**: the majority element.`,
    constraints: `- 1 ≤ nums.length ≤ 5·10^4
- The majority element always exists.`,
    examples: [
      { input: "3 2 3", output: "3" },
      { input: "2 2 1 1 1 2 2", output: "2" },
    ],
    hints: [
      "A hash map of counts works but uses O(n) space.",
      "Boyer–Moore voting: keep a candidate and a counter; matching votes increment, others decrement.",
    ],
    editorial: `**Boyer–Moore majority vote.** Maintain a candidate and a count. When count hits 0, adopt the current element as the candidate. Increment count on a match, decrement otherwise. Because the majority element occurs more than n/2 times, it survives as the final candidate. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode majority element boyer moore"),
    tags: ["array", "hash-table", "divide-and-conquer"],
    starterCode: buildStarter("intArray", "int", "majorityElement"),
    reference: (input) => {
      const nums = first(input);
      let count = 0;
      let cand = nums[0];
      for (const x of nums) {
        if (count === 0) cand = x;
        count += x === cand ? 1 : -1;
      }
      return String(cand);
    },
    tests: [
      { input: "3 2 3", sample: true },
      { input: "2 2 1 1 1 2 2", sample: true },
      { input: "1", },
      { input: "6 5 5", },
      { input: "8 8 7 7 7", },
    ],
  },

  {
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "MEDIUM",
    statement: `Given an integer array \`nums\`, find a contiguous non-empty subarray with the largest **product**, and return that product.

**Input**: one line of space-separated integers.
**Output**: the maximum product.`,
    constraints: `- 1 ≤ nums.length ≤ 2·10^4
- -10 ≤ nums[i] ≤ 10
- The answer fits in a 32-bit integer.`,
    examples: [
      { input: "2 3 -2 4", output: "6", explanation: "[2,3] gives 6." },
      { input: "-2 0 -1", output: "0", explanation: "The best you can do is 0." },
    ],
    hints: [
      "A negative number flips the sign — today's minimum can become tomorrow's maximum.",
      "Track both the max and min product ending at each index.",
    ],
    editorial: `Because negatives flip signs, track **both** the maximum and minimum product ending at each position. At each element \`x\`, the new max/min come from \`{x, max·x, min·x}\`. The running best over all positions is the answer. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode maximum product subarray"),
    tags: ["array", "dynamic-programming"],
    starterCode: buildStarter("intArray", "int", "maxProduct"),
    reference: (input) => {
      const nums = first(input);
      let best = nums[0];
      let maxP = nums[0];
      let minP = nums[0];
      for (let i = 1; i < nums.length; i++) {
        const x = nums[i];
        const cands = [x, maxP * x, minP * x];
        maxP = Math.max(...cands);
        minP = Math.min(...cands);
        best = Math.max(best, maxP);
      }
      return String(best);
    },
    tests: [
      { input: "2 3 -2 4", sample: true },
      { input: "-2 0 -1", sample: true },
      { input: "-2", },
      { input: "2 -5 -2 -4 3", },
      { input: "3 -1 4", },
    ],
  },

  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "MEDIUM",
    statement: `Given a list of intervals \`[start, end]\`, merge all overlapping intervals and return the result sorted by start.

**Input**
- Line 1: two integers \`n 2\` (n intervals)
- Next n lines: \`start end\`

**Output**: the merged intervals, one per line as \`start end\`.`,
    constraints: `- 1 ≤ n ≤ 10^4
- 0 ≤ start ≤ end ≤ 10^4`,
    examples: [
      {
        input: "4 2\n1 3\n2 6\n8 10\n15 18",
        output: "1 6\n8 10\n15 18",
        explanation: "[1,3] and [2,6] overlap → [1,6].",
      },
      { input: "2 2\n1 4\n4 5", output: "1 5", explanation: "Touching endpoints merge." },
    ],
    hints: [
      "Sort by start — overlapping intervals become neighbors.",
      "Extend the current merged interval while the next one starts at or before its end.",
    ],
    editorial: `Sort by start, then sweep: keep a current merged interval and either **extend** it (next start ≤ current end → end = max of ends) or **emit** it and start fresh. Sorting is the insight that turns pairwise overlap checks into one linear pass. O(n log n) time, O(n) output.`,
    complexityTime: "O(n log n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode merge intervals"),
    tags: ["array", "intervals", "sorting"],
    starterCode: buildStarter("matrix", "intMatrix", "mergeIntervals"),
    reference: (input) => {
      const ls = lines(input);
      const [n] = ints(ls[0]);
      const iv: number[][] = [];
      for (let i = 0; i < n; i++) iv.push(ints(ls[1 + i]));
      iv.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const out: number[][] = [];
      for (const [s, e] of iv) {
        if (out.length && s <= out[out.length - 1][1]) {
          out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);
        } else {
          out.push([s, e]);
        }
      }
      return matOut(out);
    },
    tests: [
      { input: "4 2\n1 3\n2 6\n8 10\n15 18", sample: true },
      { input: "2 2\n1 4\n4 5", sample: true },
      { input: "1 2\n0 0" },
      { input: "3 2\n5 6\n1 2\n3 4" },
      { input: "3 2\n1 10\n2 3\n4 5" },
    ],
  },

  {
    slug: "insert-interval",
    title: "Insert Interval",
    difficulty: "MEDIUM",
    statement: `You are given non-overlapping intervals sorted by start, plus one new interval. Insert the new interval and merge as needed so the result stays sorted and non-overlapping.

**Input**
- Line 1: \`n 2\`
- Next n lines: the existing intervals
- Last line: the new interval \`start end\`

**Output**: the resulting intervals, one per line.`,
    constraints: `- 0 ≤ n ≤ 10^4
- Intervals sorted by start, non-overlapping.`,
    examples: [
      { input: "2 2\n1 3\n6 9\n2 5", output: "1 5\n6 9" },
      {
        input: "5 2\n1 2\n3 5\n6 7\n8 10\n12 16\n4 8",
        output: "1 2\n3 10\n12 16",
        explanation: "The new [4,8] swallows [3,5], [6,7], [8,10].",
      },
    ],
    hints: [
      "Three phases: intervals entirely before, the overlapping middle, entirely after.",
      "Fold every overlapping interval into the new one by min/max of endpoints.",
    ],
    editorial: `Emit intervals ending before the new one starts; then absorb every interval that overlaps it (\`newStart = min\`, \`newEnd = max\`); then emit the merged interval and everything after. Sortedness makes each phase a contiguous scan — one O(n) pass, no re-sort needed.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode insert interval"),
    tags: ["array", "intervals"],
    starterCode: buildStarter("matrixK", "intMatrix", "insertInterval"),
    reference: (input) => {
      const ls = lines(input);
      const [n] = ints(ls[0]);
      const iv: number[][] = [];
      for (let i = 0; i < n; i++) iv.push(ints(ls[1 + i]));
      let [ns, ne] = ints(ls[1 + n]);
      const out: number[][] = [];
      let i = 0;
      while (i < n && iv[i][1] < ns) out.push(iv[i++]);
      while (i < n && iv[i][0] <= ne) {
        ns = Math.min(ns, iv[i][0]);
        ne = Math.max(ne, iv[i][1]);
        i++;
      }
      out.push([ns, ne]);
      while (i < n) out.push(iv[i++]);
      return matOut(out);
    },
    tests: [
      { input: "2 2\n1 3\n6 9\n2 5", sample: true },
      { input: "5 2\n1 2\n3 5\n6 7\n8 10\n12 16\n4 8", sample: true },
      { input: "0 2\n5 7" },
      { input: "1 2\n1 5\n2 3" },
      { input: "2 2\n1 2\n8 9\n4 5" },
    ],
  },

  {
    slug: "rotate-array",
    title: "Rotate Array",
    difficulty: "EASY",
    statement: `Rotate the array \`nums\` to the right by \`k\` steps and return it.

**Input**
- Line 1: space-separated integers \`nums\`
- Line 2: integer \`k\` (k ≥ 0)

**Output**: the rotated array, space-separated.`,
    constraints: `- 1 ≤ nums.length ≤ 10^5
- 0 ≤ k ≤ 10^5`,
    examples: [
      { input: "1 2 3 4 5 6 7\n3", output: "5 6 7 1 2 3 4" },
      { input: "-1 -100 3 99\n2", output: "3 99 -1 -100" },
    ],
    hints: [
      "k can exceed the length — reduce it modulo n.",
      "The O(1)-space trick: reverse the whole array, then reverse both halves.",
    ],
    editorial: `Take \`k mod n\` first. The elegant in-place method is **three reversals**: reverse everything, then reverse the first k elements, then the rest — each element lands exactly k positions right of where it started (cyclically). O(n) time, O(1) space.`,
    approaches: [
      {
        name: "Extra array",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "result[(i + k) % n] = nums[i].",
      },
      {
        name: "Three reversals",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "Reverse all, reverse first k, reverse the remainder.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("rotate array three reversals"),
    tags: ["array", "two-pointers", "math"],
    starterCode: buildStarter("intArrayK", "intArray", "rotate"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const k = int(l1) % nums.length;
      return arrOut([...nums.slice(nums.length - k), ...nums.slice(0, nums.length - k)]);
    },
    tests: [
      { input: "1 2 3 4 5 6 7\n3", sample: true },
      { input: "-1 -100 3 99\n2", sample: true },
      { input: "1\n0" },
      { input: "1 2\n3" },
      { input: "1 2 3\n3" },
    ],
  },

  {
    slug: "first-missing-positive",
    title: "First Missing Positive",
    difficulty: "HARD",
    statement: `Given an unsorted integer array, return the smallest **positive** integer not present. Your algorithm must run in O(n) time and O(1) extra space.

**Input**: one line of space-separated integers.
**Output**: the smallest missing positive.`,
    constraints: `- 1 ≤ nums.length ≤ 10^5
- -2^31 ≤ nums[i] ≤ 2^31 − 1`,
    examples: [
      { input: "1 2 0", output: "3" },
      { input: "3 4 -1 1", output: "2" },
      { input: "7 8 9 11 12", output: "1" },
    ],
    hints: [
      "The answer is always in [1, n+1] — values outside that range are irrelevant.",
      "Use the array itself as a hash table: value v belongs at index v−1.",
      "Cyclic sort: keep swapping nums[i] to its home slot until it can't move.",
    ],
    editorial: `Key fact: with n elements the answer lies in \`[1, n+1]\`. **Cyclic sort** places each value v ∈ [1, n] at index v−1 by repeated swapping (each swap homes at least one value, so total swaps ≤ n). A final scan finds the first index i where \`nums[i] ≠ i+1\` — that i+1 is the answer; if all match, it's n+1. O(n) time, O(1) space, using the array itself as the hash table.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode first missing positive"),
    tags: ["array", "hash-table", "cyclic-sort"],
    starterCode: buildStarter("intArray", "int", "firstMissingPositive"),
    reference: (input) => {
      const nums = first(input);
      const n = nums.length;
      for (let i = 0; i < n; i++) {
        while (
          nums[i] > 0 &&
          nums[i] <= n &&
          nums[nums[i] - 1] !== nums[i]
        ) {
          const j = nums[i] - 1;
          [nums[i], nums[j]] = [nums[j], nums[i]];
        }
      }
      for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) return String(i + 1);
      }
      return String(n + 1);
    },
    tests: [
      { input: "1 2 0", sample: true },
      { input: "3 4 -1 1", sample: true },
      { input: "7 8 9 11 12", sample: true },
      { input: "1" },
      { input: "2" },
      { input: "1 1" },
    ],
  },

  {
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    difficulty: "MEDIUM",
    statement: `Given an unsorted array of integers, return the length of the longest run of consecutive values (e.g. 1, 2, 3, 4) present anywhere in the array. Your algorithm must run in O(n) time — sorting is the baseline to beat.

**Input**: one line of space-separated integers (may be empty).
**Output**: the length of the longest consecutive run.`,
    constraints: `- 0 ≤ nums.length ≤ 10^5
- -10^9 ≤ values ≤ 10^9`,
    examples: [
      {
        input: "100 4 200 1 3 2",
        output: "4",
        explanation: "The run 1, 2, 3, 4 has length 4.",
      },
      { input: "0 3 7 2 5 8 4 6 0 1", output: "9" },
    ],
    hints: [
      "A hash set answers 'does x exist?' in O(1).",
      "Only start counting from numbers that begin a run — those with no x−1 in the set.",
      "Each element is then visited at most twice overall.",
    ],
    editorial: `Dump everything into a hash set. A value x starts a run only if x−1 is absent — so for each such x, walk x+1, x+2, … while they exist and track the best length. Every element is touched O(1) times amortized (once as a member, once as a potential starter), giving O(n) despite the nested-looking loop. The 'only start at run beginnings' guard is the entire trick — without it the walk degenerates to O(n²).`,
    approaches: [
      {
        name: "Sort and scan",
        complexityTime: "O(n log n)",
        complexitySpace: "O(1)",
        body: "Sort, then count streaks skipping duplicates. Simple, but misses the O(n) requirement.",
      },
      {
        name: "Hash set run-starts",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "Set membership + walk upward only from values with no predecessor.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode longest consecutive sequence"),
    tags: ["array", "hash-set"],
    starterCode: buildStarter("intArray", "int", "longestConsecutive"),
    reference: (input) => {
      const nums = first(input);
      const set = new Set(nums);
      let best = 0;
      for (const x of set) {
        if (set.has(x - 1)) continue;
        let len = 1;
        while (set.has(x + len)) len++;
        if (len > best) best = len;
      }
      return String(best);
    },
    tests: [
      { input: "100 4 200 1 3 2", sample: true },
      { input: "0 3 7 2 5 8 4 6 0 1", sample: true },
      { input: "" },
      { input: "5" },
      { input: "9 1 4 7 3 -1 0 5 8 -1 6" },
      { input: "-3 -2 -1 0 1" },
    ],
  },

  {
    slug: "pascals-triangle",
    title: "Pascal's Triangle",
    difficulty: "EASY",
    statement: `Generate the first \`n\` rows of Pascal's triangle, where every number is the sum of the two directly above it.

**Input**: one line, the integer \`n\`.
**Output**: n lines — row i contains i space-separated integers.`,
    constraints: `- 1 ≤ n ≤ 30`,
    examples: [
      {
        input: "5",
        output: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1",
      },
      { input: "1", output: "1" },
    ],
    hints: [
      "Row i has i+1 entries; the first and last are always 1.",
      "Each interior entry is prev[j-1] + prev[j].",
    ],
    editorial: `Build row by row: start each row as all 1s, then fill interior cells from the previous row — \`row[j] = prev[j−1] + prev[j]\`. Total work is 1 + 2 + … + n = O(n²), which is also the output size, so it's optimal. The follow-up worth knowing: a *single* row k can be produced in O(k) with the multiplicative identity C(n, r+1) = C(n, r) · (n−r)/(r+1).`,
    complexityTime: "O(n²)",
    complexitySpace: "O(n²)",
    youtubeUrl: yt("pascals triangle leetcode"),
    tags: ["array", "math", "simulation"],
    starterCode: buildStarter("int", "intMatrix", "generate"),
    reference: (input) => {
      const n = int(lines(input)[0]);
      const rows: number[][] = [];
      for (let i = 0; i < n; i++) {
        const row = new Array(i + 1).fill(1);
        for (let j = 1; j < i; j++) row[j] = rows[i - 1][j - 1] + rows[i - 1][j];
        rows.push(row);
      }
      return matOut(rows);
    },
    tests: [
      { input: "5", sample: true },
      { input: "1", sample: true },
      { input: "2" },
      { input: "10" },
      { input: "30" },
    ],
  },
];
