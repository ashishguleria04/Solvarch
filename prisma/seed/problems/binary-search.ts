import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, yt, lines } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const binarySearch: SeedProblem[] = [
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "EASY",
    statement: `Given a sorted (ascending) integer array \`nums\` of distinct values and an integer \`target\`, return the index of \`target\`, or \`-1\` if it is not present. Your algorithm must run in O(log n).

**Input**
- Line 1: space-separated integers \`nums\` (sorted, distinct)
- Line 2: integer \`target\`

**Output**: the index, or -1.`,
    constraints: `- 1 ≤ nums.length ≤ 10^4
- All values are distinct and sorted ascending.`,
    examples: [
      { input: "-1 0 3 5 9 12\n9", output: "4" },
      { input: "-1 0 3 5 9 12\n2", output: "-1" },
    ],
    hints: [
      "Compare the middle element with the target and discard half the array.",
      "Beware off-by-one: use lo ≤ hi with hi = n − 1, or lo < hi with hi = n — pick one convention and stick to it.",
    ],
    editorial: `Classic binary search: maintain an inclusive range \`[lo, hi]\`, probe the midpoint, and discard the half that cannot contain the target. Each step halves the search space → O(log n). The two standard invariant styles (inclusive-inclusive vs half-open) both work; mixing them is where bugs come from.`,
    complexityTime: "O(log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode binary search"),
    tags: ["binary-search", "array"],
    starterCode: buildStarter("intArrayTarget", "int", "search"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const target = int(l1);
      let lo = 0;
      let hi = nums.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return String(mid);
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
      return "-1";
    },
    tests: [
      { input: "-1 0 3 5 9 12\n9", sample: true },
      { input: "-1 0 3 5 9 12\n2", sample: true },
      { input: "5\n5" },
      { input: "5\n-5" },
      { input: "1 3\n3" },
    ],
  },

  {
    slug: "search-insert-position",
    title: "Search Insert Position",
    difficulty: "EASY",
    statement: `Given a sorted array of distinct integers \`nums\` and a \`target\`, return the index of \`target\` if found; otherwise return the index where it would be inserted to keep the array sorted. Must run in O(log n).

**Input**
- Line 1: space-separated integers (sorted, distinct)
- Line 2: integer \`target\`

**Output**: the index.`,
    constraints: `- 1 ≤ nums.length ≤ 10^4
- Distinct values, sorted ascending.`,
    examples: [
      { input: "1 3 5 6\n5", output: "2" },
      { input: "1 3 5 6\n2", output: "1" },
      { input: "1 3 5 6\n7", output: "4" },
    ],
    hints: [
      "You're looking for the first index whose value is ≥ target — a lower bound.",
      "When the loop ends, lo is exactly that boundary.",
    ],
    editorial: `This is **lower bound**: the first position with value ≥ target. Binary search with a half-open range \`[lo, hi)\`: if \`nums[mid] < target\` move \`lo = mid + 1\`, else \`hi = mid\`. When the range empties, \`lo\` is both the found index and the insertion point — no special cases needed.`,
    complexityTime: "O(log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("search insert position binary search"),
    tags: ["binary-search", "array"],
    starterCode: buildStarter("intArrayTarget", "int", "searchInsert"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const target = int(l1);
      let lo = 0;
      let hi = nums.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      return String(lo);
    },
    tests: [
      { input: "1 3 5 6\n5", sample: true },
      { input: "1 3 5 6\n2", sample: true },
      { input: "1 3 5 6\n7", sample: true },
      { input: "1\n0" },
      { input: "1 3\n2" },
    ],
  },

  {
    slug: "sqrtx",
    title: "Sqrt(x)",
    difficulty: "EASY",
    statement: `Given a non-negative integer \`x\`, return the integer square root of \`x\` — the largest integer \`r\` such that \`r² ≤ x\`. Do not use built-in exponent/sqrt functions.

**Input**: one line, the integer \`x\`.
**Output**: the integer square root.`,
    constraints: `- 0 ≤ x ≤ 2^31 − 1`,
    examples: [
      { input: "4", output: "2" },
      { input: "8", output: "2", explanation: "√8 ≈ 2.83, truncated to 2." },
    ],
    hints: [
      "Binary search the answer space [0, x].",
      "Find the largest mid with mid·mid ≤ x. Watch for overflow in languages with fixed ints.",
    ],
    editorial: `Binary search over the **answer space**: the predicate \`mid² ≤ x\` is monotone (true then false), so find the last true. In fixed-width languages compare via \`mid ≤ x / mid\` to dodge overflow. O(log x).`,
    complexityTime: "O(log x)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("sqrt x binary search leetcode"),
    tags: ["binary-search", "math"],
    starterCode: buildStarter("int", "int", "mySqrt"),
    reference: (input) => {
      const x = int(lines(input)[0]);
      let lo = 0;
      let hi = x;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (mid * mid <= x) lo = mid + 1;
        else hi = mid - 1;
      }
      return String(hi);
    },
    tests: [
      { input: "4", sample: true },
      { input: "8", sample: true },
      { input: "0" },
      { input: "1" },
      { input: "2147395599" },
    ],
  },

  {
    slug: "peak-index-in-a-mountain-array",
    title: "Peak Index in a Mountain Array",
    difficulty: "MEDIUM",
    statement: `A mountain array increases strictly to a single peak and then decreases strictly. Given a mountain array \`arr\`, return the index of the peak in O(log n).

**Input**: one line of space-separated integers (a valid mountain).
**Output**: the peak index.`,
    constraints: `- 3 ≤ arr.length ≤ 10^5
- arr is guaranteed to be a mountain.`,
    examples: [
      { input: "0 1 0", output: "1" },
      { input: "0 10 5 2", output: "1" },
      { input: "3 9 8 6 4", output: "1" },
    ],
    hints: [
      "Compare arr[mid] with arr[mid + 1].",
      "If it's rising you're on the left slope; if falling, the peak is at mid or left of it.",
    ],
    editorial: `Binary search on the slope: if \`arr[mid] < arr[mid+1]\` you are strictly left of the peak (move \`lo = mid + 1\`), otherwise the peak is at \`mid\` or before (\`hi = mid\`). The invariant converges to the single peak in O(log n).`,
    complexityTime: "O(log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("peak index mountain array binary search"),
    tags: ["binary-search", "array"],
    starterCode: buildStarter("intArray", "int", "peakIndexInMountainArray"),
    reference: (input) => {
      const arr = first(input);
      let lo = 0;
      let hi = arr.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (arr[mid] < arr[mid + 1]) lo = mid + 1;
        else hi = mid;
      }
      return String(lo);
    },
    tests: [
      { input: "0 1 0", sample: true },
      { input: "0 10 5 2", sample: true },
      { input: "3 9 8 6 4", sample: true },
      { input: "1 2 3 4 5 3 1" },
      { input: "24 69 100 99 79 78 67 36 26 19" },
    ],
  },

  {
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "MEDIUM",
    statement: `A sorted array of **distinct** integers was rotated at an unknown pivot (e.g. \`[0,1,2,4,5,6,7]\` → \`[4,5,6,7,0,1,2]\`). Given the rotated array \`nums\` and a \`target\`, return its index or \`-1\`, in O(log n).

**Input**
- Line 1: space-separated integers (rotated sorted, distinct)
- Line 2: integer \`target\`

**Output**: the index, or -1.`,
    constraints: `- 1 ≤ nums.length ≤ 5000
- Distinct values.`,
    examples: [
      { input: "4 5 6 7 0 1 2\n0", output: "4" },
      { input: "4 5 6 7 0 1 2\n3", output: "-1" },
    ],
    hints: [
      "At any midpoint, at least one half is perfectly sorted.",
      "Check whether the target lies inside that sorted half; if not, search the other half.",
    ],
    editorial: `At every step one side of \`mid\` is sorted (compare \`nums[lo]\` with \`nums[mid]\`). If the target's value falls within the sorted side's range, binary-search there; otherwise recurse into the unsorted side, which is itself a rotated sorted array. Each iteration halves the range → O(log n).`,
    complexityTime: "O(log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode search in rotated sorted array"),
    tags: ["binary-search", "array"],
    starterCode: buildStarter("intArrayTarget", "int", "searchRotated"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const target = int(l1);
      let lo = 0;
      let hi = nums.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return String(mid);
        if (nums[lo] <= nums[mid]) {
          if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
          else lo = mid + 1;
        } else {
          if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
          else hi = mid - 1;
        }
      }
      return "-1";
    },
    tests: [
      { input: "4 5 6 7 0 1 2\n0", sample: true },
      { input: "4 5 6 7 0 1 2\n3", sample: true },
      { input: "1\n1" },
      { input: "5 1 3\n3" },
      { input: "1 2 3 4 5\n4" },
    ],
  },

  {
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "MEDIUM",
    statement: `A sorted array of distinct integers was rotated between 1 and n times. Find the minimum element in O(log n).

**Input**: one line of space-separated integers (rotated sorted, distinct).
**Output**: the minimum value.`,
    constraints: `- 1 ≤ nums.length ≤ 5000
- Distinct values.`,
    examples: [
      { input: "3 4 5 1 2", output: "1" },
      { input: "4 5 6 7 0 1 2", output: "0" },
      { input: "11 13 15 17", output: "11" },
    ],
    hints: [
      "Compare nums[mid] against nums[hi], not nums[lo].",
      "If nums[mid] > nums[hi], the minimum is strictly right of mid.",
    ],
    editorial: `Compare the midpoint with the right end. If \`nums[mid] > nums[hi]\` the rotation point (and minimum) lies right of \`mid\`, so \`lo = mid + 1\`; otherwise the minimum is at \`mid\` or left, so \`hi = mid\`. The loop converges on the smallest element in O(log n).`,
    complexityTime: "O(log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode find minimum in rotated sorted array"),
    tags: ["binary-search", "array"],
    starterCode: buildStarter("intArray", "int", "findMin"),
    reference: (input) => {
      const nums = first(input);
      let lo = 0;
      let hi = nums.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
      }
      return String(nums[lo]);
    },
    tests: [
      { input: "3 4 5 1 2", sample: true },
      { input: "4 5 6 7 0 1 2", sample: true },
      { input: "11 13 15 17", sample: true },
      { input: "2 1" },
      { input: "1" },
    ],
  },

  {
    slug: "find-first-and-last-position-of-element-in-sorted-array",
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "MEDIUM",
    statement: `Given a non-decreasing integer array \`nums\` and a \`target\`, return the first and last index of \`target\`. If it is absent, return \`-1 -1\`. Must run in O(log n).

**Input**
- Line 1: space-separated integers (sorted, may repeat)
- Line 2: integer \`target\`

**Output**: two indices, space-separated.`,
    constraints: `- 0 ≤ nums.length ≤ 10^5
- Sorted non-decreasing.`,
    examples: [
      { input: "5 7 7 8 8 10\n8", output: "3 4" },
      { input: "5 7 7 8 8 10\n6", output: "-1 -1" },
    ],
    hints: [
      "Run two binary searches: a lower bound for the first occurrence and an upper bound for one past the last.",
      "If lowerBound points past the array or at a different value, the target is absent.",
    ],
    editorial: `Two boundary searches: **lower bound** (first index with value ≥ target) gives the start; **upper bound** (first index with value > target) minus one gives the end. If the lower bound doesn't land on the target, return \`-1 -1\`. Two O(log n) passes, no linear scanning.`,
    complexityTime: "O(log n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("find first and last position binary search"),
    tags: ["binary-search", "array"],
    starterCode: buildStarter("intArrayTarget", "intArray", "searchRange"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const target = int(l1);
      const bound = (gt: boolean): number => {
        let lo = 0;
        let hi = nums.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (nums[mid] < target || (gt && nums[mid] === target)) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      };
      const start = bound(false);
      if (start === nums.length || nums[start] !== target) return "-1 -1";
      return `${start} ${bound(true) - 1}`;
    },
    tests: [
      { input: "5 7 7 8 8 10\n8", sample: true },
      { input: "5 7 7 8 8 10\n6", sample: true },
      { input: "\n0" },
      { input: "1\n1" },
      { input: "2 2 2 2\n2" },
    ],
  },

  {
    slug: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    difficulty: "MEDIUM",
    statement: `Koko has \`piles\` of bananas and \`h\` hours. Each hour she picks one pile and eats up to \`k\` bananas from it (a pile smaller than \`k\` still costs the whole hour). Return the minimum integer speed \`k\` that finishes all piles within \`h\` hours.

**Input**
- Line 1: space-separated integers \`piles\`
- Line 2: integer \`h\`

**Output**: the minimum k.`,
    constraints: `- 1 ≤ piles.length ≤ 10^4
- piles.length ≤ h ≤ 10^9
- 1 ≤ piles[i] ≤ 10^9`,
    examples: [
      { input: "3 6 7 11\n8", output: "4" },
      { input: "30 11 23 4 20\n5", output: "30" },
      { input: "30 11 23 4 20\n6", output: "23" },
    ],
    hints: [
      "For a fixed k, hours needed = Σ ceil(pile / k) — checkable in O(n).",
      "That predicate is monotone in k: faster speeds always finish sooner. Binary search k.",
    ],
    editorial: `Binary search the **answer space** k ∈ [1, max(piles)]. For a candidate speed, the required time \`Σ ceil(pile/k)\` decreases monotonically as k grows, so find the smallest k whose time is ≤ h. O(n log max(piles)).`,
    complexityTime: "O(n log M)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode koko eating bananas"),
    tags: ["binary-search", "array"],
    starterCode: buildStarter("intArrayK", "int", "minEatingSpeed"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const piles = ints(l0);
      const h = int(l1);
      let lo = 1;
      let hi = Math.max(...piles);
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        const hours = piles.reduce((acc, p) => acc + Math.ceil(p / mid), 0);
        if (hours <= h) hi = mid;
        else lo = mid + 1;
      }
      return String(lo);
    },
    tests: [
      { input: "3 6 7 11\n8", sample: true },
      { input: "30 11 23 4 20\n5", sample: true },
      { input: "30 11 23 4 20\n6", sample: true },
      { input: "1\n1" },
      { input: "312884470\n312884469" },
    ],
  },

  {
    slug: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    difficulty: "MEDIUM",
    statement: `You are given an \`r × c\` matrix where each row is sorted ascending and the first value of each row is greater than the last value of the previous row. Determine whether \`target\` exists in the matrix, in O(log(r·c)).

**Input**
- Line 1: two integers \`r c\`
- Next r lines: the matrix rows
- Last line: the integer \`target\`

**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ r, c ≤ 100
- Rows sorted; row starts exceed previous row ends.`,
    examples: [
      { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3", output: "true" },
      { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13", output: "false" },
    ],
    hints: [
      "The whole matrix is one sorted list read row by row.",
      "Binary search indices 0 … r·c−1 and map i → (i / c, i % c).",
    ],
    editorial: `Because rows chain in sorted order, the matrix is a single sorted array of length r·c viewed through index arithmetic: element \`i\` lives at row \`⌊i/c⌋\`, column \`i mod c\`. One standard binary search over that virtual array gives O(log(r·c)) with no extra space.`,
    complexityTime: "O(log(r·c))",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode search 2d matrix"),
    tags: ["binary-search", "matrix"],
    starterCode: buildStarter("matrixK", "bool", "searchMatrix"),
    reference: (input) => {
      const ls = lines(input);
      const [r, c] = ints(ls[0]);
      const grid: number[][] = [];
      for (let i = 0; i < r; i++) grid.push(ints(ls[1 + i]));
      const target = int(ls[1 + r]);
      let lo = 0;
      let hi = r * c - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const v = grid[Math.floor(mid / c)][mid % c];
        if (v === target) return boolOut(true);
        if (v < target) lo = mid + 1;
        else hi = mid - 1;
      }
      return boolOut(false);
    },
    tests: [
      { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3", sample: true },
      { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13", sample: true },
      { input: "1 1\n5\n5" },
      { input: "1 2\n1 3\n2" },
      { input: "2 2\n1 3\n5 7\n7" },
    ],
  },

  {
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "HARD",
    statement: `Given two sorted arrays \`nums1\` and \`nums2\`, return the median of the combined sorted data. The intended solution runs in O(log(min(m, n))).

**Input**
- Line 1: space-separated integers \`nums1\` (may be empty)
- Line 2: space-separated integers \`nums2\` (may be empty)

**Output**: the median with two decimal places (the template formats it).`,
    constraints: `- 0 ≤ m, n ≤ 1000, m + n ≥ 1
- -10^6 ≤ values ≤ 10^6`,
    examples: [
      { input: "1 3\n2", output: "2.00", explanation: "Merged: [1,2,3], median 2." },
      { input: "1 2\n3 4", output: "2.50", explanation: "Merged: [1,2,3,4], median (2+3)/2." },
    ],
    hints: [
      "A merge gives O(m+n). The target bound demands partitioning, not merging.",
      "Binary search a cut in the shorter array; the cut in the other array is forced by the half-length.",
      "A correct partition has every left element ≤ every right element across both arrays.",
    ],
    editorial: `Binary search the cut position in the shorter array. A cut of \`i\` elements there forces \`(m+n+1)/2 − i\` from the other array. The partition is correct when \`maxLeft₁ ≤ minRight₂\` and \`maxLeft₂ ≤ minRight₁\`; then the median comes from the boundary values. Each probe adjusts the cut like standard binary search → O(log min(m, n)).`,
    approaches: [
      {
        name: "Merge and index",
        complexityTime: "O(m + n)",
        complexitySpace: "O(m + n)",
        body: "Merge both arrays and read the middle. Simple, and fine when the log bound isn't required.",
      },
      {
        name: "Partition binary search",
        complexityTime: "O(log min(m, n))",
        complexitySpace: "O(1)",
        body: "Search the cut point satisfying the cross inequalities; median from boundary max/min values.",
      },
    ],
    complexityTime: "O(log min(m, n))",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode median of two sorted arrays"),
    tags: ["binary-search", "array", "divide-and-conquer"],
    starterCode: buildStarter("twoIntArrays", "float2", "findMedianSortedArrays"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const merged = [...ints(l0), ...ints(l1)].sort((a, b) => a - b);
      const n = merged.length;
      const median =
        n % 2 === 1 ? merged[(n - 1) / 2] : (merged[n / 2 - 1] + merged[n / 2]) / 2;
      return median.toFixed(2);
    },
    tests: [
      { input: "1 3\n2", sample: true },
      { input: "1 2\n3 4", sample: true },
      { input: "\n1" },
      { input: "2\n" },
      { input: "1 1 1\n1 1" },
      { input: "-5 3 6 12 15\n-12 -10 -6 -3 4 10" },
    ],
  },
];
