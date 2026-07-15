import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, arrOut, yt, sortedMatOut, lines } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const twoPointers: SeedProblem[] = [
  {
    slug: "two-sum-ii-input-array-is-sorted",
    title: "Two Sum II — Input Array Is Sorted",
    difficulty: "MEDIUM",
    statement: `Given a **1-indexed** array of integers \`nums\` sorted in non-decreasing order and an integer \`target\`, find two numbers that add up to \`target\` and return their 1-based indices \`i < j\`. Exactly one solution exists; use only O(1) extra space.

**Input**
- Line 1: space-separated integers \`nums\` (sorted)
- Line 2: integer \`target\`

**Output**
- The two 1-based indices, space-separated.`,
    constraints: `- 2 ≤ nums.length ≤ 3·10^4
- nums is sorted in non-decreasing order
- Exactly one valid pair exists.`,
    examples: [
      { input: "2 7 11 15\n9", output: "1 2", explanation: "2 + 7 = 9 → indices 1 and 2." },
      { input: "-1 0\n-1", output: "1 2" },
    ],
    hints: [
      "The array is sorted — that's the whole trick.",
      "Start pointers at both ends. If the sum is too big, which pointer must move?",
    ],
    editorial: `Place one pointer at each end. If the pair sums above \`target\`, only moving the right pointer left can reduce the sum; if below, only moving the left pointer right can increase it. Each step discards one candidate, so the scan is O(n) with O(1) space — the sorted order guarantees you never skip the answer.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode two sum ii sorted"),
    tags: ["two-pointers", "array", "binary-search"],
    starterCode: buildStarter("intArrayTarget", "intArray", "twoSumSorted"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const target = int(l1);
      let l = 0;
      let r = nums.length - 1;
      while (l < r) {
        const s = nums[l] + nums[r];
        if (s === target) return `${l + 1} ${r + 1}`;
        if (s < target) l++;
        else r--;
      }
      return "";
    },
    tests: [
      { input: "2 7 11 15\n9", sample: true },
      { input: "-1 0\n-1", sample: true },
      { input: "1 2 3 4 4 9 56 90\n8" },
      { input: "5 25 75\n100" },
      { input: "-3 -1 2 6\n5" },
    ],
  },

  {
    slug: "3sum",
    title: "3Sum",
    difficulty: "MEDIUM",
    statement: `Given an integer array \`nums\`, find all **unique** triplets \`[a, b, c]\` such that \`a + b + c = 0\`.

**Input**: one line of space-separated integers.
**Output**: each triplet on its own line with its three numbers in non-decreasing order. Triplets may be produced in any order — the template prints them in a canonical order. Print nothing if there are none.`,
    constraints: `- 3 ≤ nums.length ≤ 3000
- -10^5 ≤ nums[i] ≤ 10^5`,
    examples: [
      {
        input: "-1 0 1 2 -1 -4",
        output: "-1 -1 2\n-1 0 1",
        explanation: "The distinct zero-sum triplets are (-1,-1,2) and (-1,0,1).",
      },
      { input: "0 1 1", output: "", explanation: "No triplet sums to 0." },
    ],
    hints: [
      "Sort the array first — duplicates become adjacent and easy to skip.",
      "Fix the smallest element, then the problem reduces to Two Sum II on the rest.",
      "After finding a match, advance both pointers past equal values to avoid duplicate triplets.",
    ],
    editorial: `Sort \`nums\`. For each index \`i\` (skipping repeated values), run the two-pointer sum search on the subarray to its right looking for \`-nums[i]\`. On a hit, record the triplet and advance both pointers past duplicates. Sorting costs O(n log n) and each fixed \`i\` does an O(n) scan → O(n²) total.`,
    approaches: [
      {
        name: "Hash set per element",
        complexityTime: "O(n²)",
        complexitySpace: "O(n)",
        body: "For each pair, look up the complement in a set. Deduplication is fiddly — you must canonicalize triplets.",
      },
      {
        name: "Sort + two pointers",
        complexityTime: "O(n²)",
        complexitySpace: "O(1)",
        body: "Sort, fix the first element, then converge two pointers. Skipping adjacent duplicates gives uniqueness for free.",
      },
    ],
    complexityTime: "O(n²)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode 3sum"),
    tags: ["two-pointers", "array", "sorting"],
    starterCode: buildStarter("intArray", "sortedIntMatrix", "threeSum"),
    reference: (input) => {
      const nums = first(input).sort((a, b) => a - b);
      const rows: number[][] = [];
      for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let l = i + 1;
        let r = nums.length - 1;
        while (l < r) {
          const s = nums[i] + nums[l] + nums[r];
          if (s === 0) {
            rows.push([nums[i], nums[l], nums[r]]);
            while (l < r && nums[l] === nums[l + 1]) l++;
            while (l < r && nums[r] === nums[r - 1]) r--;
            l++;
            r--;
          } else if (s < 0) l++;
          else r--;
        }
      }
      return sortedMatOut(rows);
    },
    tests: [
      { input: "-1 0 1 2 -1 -4", sample: true },
      { input: "0 1 1", sample: true },
      { input: "0 0 0" },
      { input: "-2 0 1 1 2" },
      { input: "3 -2 1 0" },
      { input: "-4 -2 -2 -2 0 1 2 2 2 3 3 4 4 6 6" },
    ],
  },

  {
    slug: "3sum-closest",
    title: "3Sum Closest",
    difficulty: "MEDIUM",
    statement: `Given an integer array \`nums\` and an integer \`target\`, find three integers in \`nums\` whose sum is **closest** to \`target\` and return that sum. Each input has exactly one answer.

**Input**
- Line 1: space-separated integers \`nums\`
- Line 2: integer \`target\`

**Output**: the closest achievable sum.`,
    constraints: `- 3 ≤ nums.length ≤ 500
- -1000 ≤ nums[i] ≤ 1000
- Exactly one answer is closest.`,
    examples: [
      { input: "-1 2 1 -4\n1", output: "2", explanation: "-1 + 2 + 1 = 2 is closest to 1." },
      { input: "0 0 0\n1", output: "0" },
    ],
    hints: [
      "Sort, fix one element, and two-pointer the rest — just like 3Sum.",
      "Track the best sum seen by absolute distance to target.",
    ],
    editorial: `Sort the array. Fix each index and converge two pointers on the remainder; at every step compare \`|sum − target|\` against the best so far and move the pointer that brings the sum toward \`target\`. O(n²) time, O(1) space.`,
    complexityTime: "O(n²)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("3sum closest leetcode"),
    tags: ["two-pointers", "array", "sorting"],
    starterCode: buildStarter("intArrayTarget", "int", "threeSumClosest"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0).sort((a, b) => a - b);
      const target = int(l1);
      let best = nums[0] + nums[1] + nums[2];
      for (let i = 0; i < nums.length - 2; i++) {
        let l = i + 1;
        let r = nums.length - 1;
        while (l < r) {
          const s = nums[i] + nums[l] + nums[r];
          if (Math.abs(s - target) < Math.abs(best - target)) best = s;
          if (s === target) return String(s);
          if (s < target) l++;
          else r--;
        }
      }
      return String(best);
    },
    tests: [
      { input: "-1 2 1 -4\n1", sample: true },
      { input: "0 0 0\n1", sample: true },
      { input: "1 1 1 0\n-100" },
      { input: "4 0 5 -5 3 3 0 -4 -5\n-2" },
    ],
  },

  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "MEDIUM",
    statement: `You are given an array \`height\` where the i-th element is the height of a vertical line at position \`i\`. Choose two lines that, together with the x-axis, form a container holding the most water. Return the maximum amount of water.

**Input**: one line of space-separated integers \`height\`.
**Output**: the maximum area.`,
    constraints: `- 2 ≤ height.length ≤ 10^5
- 0 ≤ height[i] ≤ 10^4`,
    examples: [
      { input: "1 8 6 2 5 4 8 3 7", output: "49", explanation: "Lines at indices 1 and 8: min(8,7) × 7 = 49." },
      { input: "1 1", output: "1" },
    ],
    hints: [
      "Area = min(left, right) × width. Start with maximum width.",
      "Moving the taller line inward can never help — the height is capped by the shorter one.",
    ],
    editorial: `Start with pointers at both ends (max width) and repeatedly move the **shorter** line inward. Moving the taller one can only shrink or keep the limiting height while reducing width, so it's never better. Track the best area along the way — O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode container with most water"),
    tags: ["two-pointers", "array", "greedy"],
    starterCode: buildStarter("intArray", "int", "maxArea"),
    reference: (input) => {
      const h = first(input);
      let l = 0;
      let r = h.length - 1;
      let best = 0;
      while (l < r) {
        best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
        if (h[l] < h[r]) l++;
        else r--;
      }
      return String(best);
    },
    tests: [
      { input: "1 8 6 2 5 4 8 3 7", sample: true },
      { input: "1 1", sample: true },
      { input: "4 3 2 1 4" },
      { input: "1 2 1" },
      { input: "2 3 4 5 18 17 6" },
    ],
  },

  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "HARD",
    statement: `Given \`n\` non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.

**Input**: one line of space-separated integers \`height\`.
**Output**: total units of trapped water.`,
    constraints: `- 1 ≤ height.length ≤ 2·10^4
- 0 ≤ height[i] ≤ 10^5`,
    examples: [
      { input: "0 1 0 2 1 0 1 3 2 1 2 1", output: "6" },
      { input: "4 2 0 3 2 5", output: "9" },
    ],
    hints: [
      "Water above position i is min(maxLeft, maxRight) − height[i].",
      "Precomputing both max arrays works in O(n) space. Can two pointers avoid that?",
      "Whichever side has the smaller running max is the binding constraint — process from that side.",
    ],
    editorial: `Water at index \`i\` equals \`min(maxLeft, maxRight) − height[i]\`. With two pointers and running maxes from each end, the side with the **smaller** running max is fully determined (the other side is at least as tall somewhere), so we can settle that cell and advance. One pass, O(n) time, O(1) space.`,
    approaches: [
      {
        name: "Prefix/suffix max arrays",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "Precompute maxLeft[i] and maxRight[i]; sum min of both minus height.",
      },
      {
        name: "Two pointers",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "Advance from the side with the smaller running max; that max bounds the water there.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode trapping rain water"),
    tags: ["two-pointers", "array", "stack", "dynamic-programming"],
    starterCode: buildStarter("intArray", "int", "trap"),
    reference: (input) => {
      const h = first(input);
      let l = 0;
      let r = h.length - 1;
      let lm = 0;
      let rm = 0;
      let res = 0;
      while (l < r) {
        if (h[l] < h[r]) {
          lm = Math.max(lm, h[l]);
          res += lm - h[l];
          l++;
        } else {
          rm = Math.max(rm, h[r]);
          res += rm - h[r];
          r--;
        }
      }
      return String(res);
    },
    tests: [
      { input: "0 1 0 2 1 0 1 3 2 1 2 1", sample: true },
      { input: "4 2 0 3 2 5", sample: true },
      { input: "1" },
      { input: "5 4 1 2" },
      { input: "3 0 3" },
      { input: "0 0 0" },
    ],
  },

  {
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "EASY",
    statement: `Given a sorted integer array \`nums\`, remove the duplicates **in place** so that each unique element appears only once, keeping the relative order. Return the resulting deduplicated array.

**Input**: one line of space-separated integers (sorted).
**Output**: the deduplicated array, space-separated.`,
    constraints: `- 1 ≤ nums.length ≤ 3·10^4
- nums is sorted in non-decreasing order.`,
    examples: [
      { input: "1 1 2", output: "1 2" },
      { input: "0 0 1 1 1 2 2 3 3 4", output: "0 1 2 3 4" },
    ],
    hints: [
      "Because the array is sorted, duplicates are adjacent.",
      "Keep a slow 'write' pointer for the last unique value placed.",
    ],
    editorial: `Use a slow/fast pointer pair. The fast pointer scans every element; whenever it sees a value different from the last written one, the slow pointer writes it and advances. Sorted order guarantees all duplicates are adjacent, so one pass suffices — O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode remove duplicates from sorted array"),
    tags: ["two-pointers", "array"],
    starterCode: buildStarter("intArray", "intArray", "removeDuplicates"),
    reference: (input) => {
      const nums = first(input);
      const res = nums.filter((x, i) => i === 0 || x !== nums[i - 1]);
      return arrOut(res);
    },
    tests: [
      { input: "1 1 2", sample: true },
      { input: "0 0 1 1 1 2 2 3 3 4", sample: true },
      { input: "7" },
      { input: "-3 -3 -3" },
      { input: "1 2 3" },
    ],
  },

  {
    slug: "sort-colors",
    title: "Sort Colors",
    difficulty: "MEDIUM",
    statement: `Given an array \`nums\` with values \`0\`, \`1\`, and \`2\` representing red, white, and blue, sort them in place so that same colors are adjacent in the order red → white → blue. Do it in one pass without the library sort. Return the sorted array.

**Input**: one line of space-separated integers (each 0, 1, or 2).
**Output**: the sorted array, space-separated.`,
    constraints: `- 1 ≤ nums.length ≤ 300
- nums[i] ∈ {0, 1, 2}`,
    examples: [
      { input: "2 0 2 1 1 0", output: "0 0 1 1 2 2" },
      { input: "2 0 1", output: "0 1 2" },
    ],
    hints: [
      "Counting sort works in two passes. The Dutch National Flag algorithm does it in one.",
      "Maintain three regions with pointers low, mid, high: 0s before low, 2s after high.",
      "When you swap a 2 to the back, don't advance mid — the swapped-in value is unexamined.",
    ],
    editorial: `**Dutch National Flag** (Dijkstra). Keep three pointers: everything before \`low\` is 0, everything after \`high\` is 2, and \`mid\` scans. On 0 → swap to \`low\`, advance both; on 2 → swap to \`high\`, shrink \`high\` only (the incoming value is unseen); on 1 → advance \`mid\`. One pass, O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode sort colors dutch national flag"),
    tags: ["two-pointers", "array", "sorting"],
    starterCode: buildStarter("intArray", "intArray", "sortColors"),
    reference: (input) => {
      const nums = first(input);
      return arrOut(nums.sort((a, b) => a - b));
    },
    tests: [
      { input: "2 0 2 1 1 0", sample: true },
      { input: "2 0 1", sample: true },
      { input: "0" },
      { input: "1 1 1" },
      { input: "2 2 1 1 0 0" },
    ],
  },

  {
    slug: "is-subsequence",
    title: "Is Subsequence",
    difficulty: "EASY",
    statement: `Given strings \`s\` and \`t\`, return \`true\` if \`s\` is a subsequence of \`t\` — i.e. \`s\` can be formed by deleting characters of \`t\` without reordering the rest.

**Input**
- Line 1: string \`s\`
- Line 2: string \`t\`

**Output**: \`true\` or \`false\`.`,
    constraints: `- 0 ≤ s.length ≤ 100
- 0 ≤ t.length ≤ 10^4
- Lowercase English letters only.`,
    examples: [
      { input: "abc\nahbgdc", output: "true" },
      { input: "axc\nahbgdc", output: "false" },
    ],
    hints: [
      "Walk t once; advance a pointer into s whenever characters match.",
      "s is a subsequence iff the s-pointer reaches the end.",
    ],
    editorial: `Greedy single pass: scan \`t\` with one pointer while a second pointer tracks the next needed character of \`s\`. Matching the first available occurrence is always safe — it leaves the most room for the remaining characters. O(|t|) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("is subsequence leetcode two pointers"),
    tags: ["two-pointers", "string", "greedy"],
    starterCode: buildStarter("twoStrings", "bool", "isSubsequence"),
    reference: (input) => {
      const [s = "", t = ""] = lines(input);
      let i = 0;
      for (const ch of t) {
        if (i < s.length && s[i] === ch) i++;
      }
      return boolOut(i === s.length);
    },
    tests: [
      { input: "abc\nahbgdc", sample: true },
      { input: "axc\nahbgdc", sample: true },
      { input: "\nanything" },
      { input: "b\nabc" },
      { input: "aaaaaa\nbbaaaa" },
    ],
  },

  {
    slug: "merge-sorted-arrays",
    title: "Merge Two Sorted Arrays",
    difficulty: "EASY",
    statement: `Given two integer arrays \`nums1\` and \`nums2\`, each sorted in non-decreasing order, merge them into a single sorted array and return it.

**Input**
- Line 1: space-separated integers \`nums1\` (may be empty)
- Line 2: space-separated integers \`nums2\` (may be empty)

**Output**: the merged sorted array, space-separated.`,
    constraints: `- 0 ≤ nums1.length, nums2.length ≤ 200
- -10^9 ≤ values ≤ 10^9`,
    examples: [
      { input: "1 2 3\n2 5 6", output: "1 2 2 3 5 6" },
      { input: "\n1", output: "1" },
    ],
    hints: [
      "Compare the front of both arrays and take the smaller.",
      "Don't forget the leftovers when one array is exhausted.",
    ],
    editorial: `The classic merge step of merge sort: two read pointers, always append the smaller front element, then append whatever remains. O(m + n) time and output space — this exact routine is the building block of merge sort and external sorting.`,
    complexityTime: "O(m + n)",
    complexitySpace: "O(m + n)",
    youtubeUrl: yt("merge sorted array leetcode"),
    tags: ["two-pointers", "array", "sorting"],
    starterCode: buildStarter("twoIntArrays", "intArray", "mergeArrays"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const a = ints(l0);
      const b = ints(l1);
      const res: number[] = [];
      let i = 0;
      let j = 0;
      while (i < a.length || j < b.length) {
        if (j >= b.length || (i < a.length && a[i] <= b[j])) res.push(a[i++]);
        else res.push(b[j++]);
      }
      return arrOut(res);
    },
    tests: [
      { input: "1 2 3\n2 5 6", sample: true },
      { input: "\n1", sample: true },
      { input: "4\n" },
      { input: "-5 0 5\n-6 6" },
      { input: "1 1 1\n1 1" },
    ],
  },

  {
    slug: "valid-palindrome-ii",
    title: "Valid Palindrome II",
    difficulty: "EASY",
    statement: `Given a string \`s\`, return \`true\` if it can become a palindrome after deleting **at most one** character.

**Input**: one line, the string \`s\`.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ s.length ≤ 10^5
- Lowercase English letters only.`,
    examples: [
      { input: "aba", output: "true" },
      { input: "abca", output: "true", explanation: "Delete 'c' (or 'b')." },
      { input: "abc", output: "false" },
    ],
    hints: [
      "Converge two pointers as in a normal palindrome check.",
      "On the first mismatch you have exactly two options: skip the left char or skip the right char.",
    ],
    editorial: `Run the standard two-pointer palindrome check. At the first mismatch, the only hope is deleting one of the two mismatched characters — so check whether \`s[l+1..r]\` or \`s[l..r−1]\` is a palindrome. Either branch is a plain O(n) check, so the whole thing is O(n).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("valid palindrome ii leetcode"),
    tags: ["two-pointers", "string", "greedy"],
    starterCode: buildStarter("string", "bool", "validPalindrome"),
    reference: (input) => {
      const s = lines(input)[0] ?? "";
      const isPal = (l: number, r: number): boolean => {
        while (l < r) {
          if (s[l] !== s[r]) return false;
          l++;
          r--;
        }
        return true;
      };
      let l = 0;
      let r = s.length - 1;
      while (l < r) {
        if (s[l] !== s[r]) return boolOut(isPal(l + 1, r) || isPal(l, r - 1));
        l++;
        r--;
      }
      return boolOut(true);
    },
    tests: [
      { input: "aba", sample: true },
      { input: "abca", sample: true },
      { input: "abc" },
      { input: "a" },
      { input: "deeee" },
      { input: "cuucu" },
    ],
  },

  {
    slug: "boats-to-save-people",
    title: "Boats to Save People",
    difficulty: "MEDIUM",
    statement: `Each boat carries at most **two** people, subject to a weight \`limit\`. Given everyone's weights, return the minimum number of boats needed to carry every person.

**Input**
- Line 1: space-separated weights
- Line 2: the integer \`limit\`

**Output**: the minimum number of boats.`,
    constraints: `- 1 ≤ people.length ≤ 5·10^4
- 1 ≤ people[i] ≤ limit ≤ 3·10^4`,
    examples: [
      { input: "1 2\n3", output: "1" },
      {
        input: "3 2 2 1\n3",
        output: "3",
        explanation: "Boats: (1,2), (2), (3).",
      },
      { input: "3 5 3 4\n5", output: "4", explanation: "No two fit together." },
    ],
    hints: [
      "Sort. Who should share a boat with the heaviest person?",
      "If the lightest can't pair with the heaviest, the heaviest rides alone — no better partner exists.",
      "Two pointers converging from both ends; one boat per step.",
    ],
    editorial: `Sort the weights and converge two pointers. Each round, the heaviest remaining person boards a boat; the lightest joins them if the pair fits under the limit, otherwise the heavy one sails alone. The greedy is safe because the heaviest person's only possible partner is *someone*, and the lightest is the most likely candidate — if even they don't fit, nobody does. Since each person can only pair with one other (capacity two), no cleverer matching exists. O(n log n) for the sort, O(1) extra beyond it.`,
    approaches: [
      {
        name: "Sort + two pointers",
        complexityTime: "O(n log n)",
        complexitySpace: "O(1)",
        body: "Pair lightest with heaviest when possible; heaviest goes alone otherwise.",
      },
    ],
    complexityTime: "O(n log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("boats to save people leetcode"),
    tags: ["two-pointers", "greedy", "sorting"],
    starterCode: buildStarter("intArrayK", "int", "numRescueBoats"),
    reference: (input) => {
      const people = ints(lines(input)[0]).sort((a, b) => a - b);
      const limit = int(lines(input)[1]);
      let i = 0;
      let j = people.length - 1;
      let boats = 0;
      while (i <= j) {
        if (people[i] + people[j] <= limit) i++;
        j--;
        boats++;
      }
      return String(boats);
    },
    tests: [
      { input: "1 2\n3", sample: true },
      { input: "3 2 2 1\n3", sample: true },
      { input: "3 5 3 4\n5", sample: true },
      { input: "5\n5" },
      { input: "1 1 1 1\n2" },
      { input: "2 4 5 1 3 6\n6" },
    ],
  },
];
