import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, arrOut, yt } from "../ref-utils";

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
];
