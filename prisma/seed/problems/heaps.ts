import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, arrOut, yt, lines, linesOut, matOut } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const heaps: SeedProblem[] = [
  {
    slug: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "MEDIUM",
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the k-th **largest** element (in sorted order, not the k-th distinct value).

**Input**
- Line 1: space-separated integers \`nums\`
- Line 2: integer \`k\`

**Output**: the k-th largest value.`,
    constraints: `- 1 ≤ k ≤ nums.length ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4`,
    examples: [
      { input: "3 2 1 5 6 4\n2", output: "5" },
      { input: "3 2 3 1 2 4 5 5 6\n4", output: "4" },
    ],
    hints: [
      "Sorting is O(n log n) — fine, but interviewers want better.",
      "A min-heap of size k keeps exactly the k largest seen so far.",
      "Quickselect reaches average O(n) by partitioning like quicksort but recursing one side.",
    ],
    editorial: `Keep a **min-heap of size k**: push each element, popping the minimum whenever the heap exceeds k. Whatever survives is the k largest, and the heap's root is the answer — O(n log k). **Quickselect** (partition around a pivot, recurse only into the side containing index n−k) achieves average O(n) with O(1) space and is the expected follow-up.`,
    approaches: [
      {
        name: "Min-heap of size k",
        complexityTime: "O(n log k)",
        complexitySpace: "O(k)",
        body: "Maintain the k largest; the heap root is the k-th largest.",
      },
      {
        name: "Quickselect",
        complexityTime: "O(n) average",
        complexitySpace: "O(1)",
        body: "Partition and recurse into the half containing the target index.",
      },
    ],
    complexityTime: "O(n log k)",
    complexitySpace: "O(k)",
    youtubeUrl: yt("neetcode kth largest element in an array"),
    tags: ["heap", "quickselect", "sorting"],
    starterCode: buildStarter("intArrayK", "int", "findKthLargest"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0).sort((a, b) => b - a);
      return String(nums[int(l1) - 1]);
    },
    tests: [
      { input: "3 2 1 5 6 4\n2", sample: true },
      { input: "3 2 3 1 2 4 5 5 6\n4", sample: true },
      { input: "1\n1" },
      { input: "-1 -2 -3\n3" },
      { input: "7 7 7 7\n2" },
    ],
  },

  {
    slug: "last-stone-weight",
    title: "Last Stone Weight",
    difficulty: "EASY",
    statement: `You have stones with positive integer weights. Each turn, smash the two **heaviest** together: equal weights → both destroyed; otherwise the heavier survives with the difference. Return the weight of the last stone, or \`0\` if none remain.

**Input**: one line of space-separated integers.
**Output**: the final weight (or 0).`,
    constraints: `- 1 ≤ stones.length ≤ 30
- 1 ≤ stones[i] ≤ 1000`,
    examples: [
      { input: "2 7 4 1 8 1", output: "1", explanation: "8&7→1, 4&2→2, 2&1→1, 1&1→0 leaves 1." },
      { input: "1", output: "1" },
    ],
    hints: [
      "You repeatedly need the two largest — that's a max-heap's specialty.",
      "Pop two, push back the difference if non-zero, repeat until ≤ 1 stone.",
    ],
    editorial: `Push everything into a **max-heap**. While at least two stones remain: pop the two heaviest, and if they differ push back the difference. Each smash is O(log n) and removes at least one stone → O(n log n) overall. (Languages with only min-heaps: negate the values.)`,
    complexityTime: "O(n log n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("last stone weight heap leetcode"),
    tags: ["heap", "simulation"],
    starterCode: buildStarter("intArray", "int", "lastStoneWeight"),
    reference: (input) => {
      const stones = first(input);
      while (stones.length > 1) {
        stones.sort((a, b) => a - b);
        const y = stones.pop()!;
        const x = stones.pop()!;
        if (y !== x) stones.push(y - x);
      }
      return String(stones[0] ?? 0);
    },
    tests: [
      { input: "2 7 4 1 8 1", sample: true },
      { input: "1", sample: true },
      { input: "3 3" },
      { input: "9 3 2 10" },
      { input: "1 1 1" },
    ],
  },

  {
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "MEDIUM",
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent values, ordered by frequency (highest first); break frequency ties by smaller value first.

**Input**
- Line 1: space-separated integers \`nums\`
- Line 2: integer \`k\`

**Output**: the k values, space-separated.`,
    constraints: `- 1 ≤ nums.length ≤ 10^5
- k is between 1 and the number of distinct values.`,
    examples: [
      { input: "1 1 1 2 2 3\n2", output: "1 2" },
      { input: "4 4 7 7\n2", output: "4 7", explanation: "Tie on frequency — smaller value first." },
    ],
    hints: [
      "Count frequencies with a hash map first.",
      "A heap of (frequency, value) gets O(n log k). Bucket sort by frequency gets O(n).",
    ],
    editorial: `Count with a hash map, then select the top k. A heap keyed on (frequency, value) does it in O(n log k). **Bucket sort** does better: index an array by frequency (max possible is n), drop each value into its bucket, then read buckets from high to low — O(n) total, no comparisons needed.`,
    approaches: [
      {
        name: "Heap of size k",
        complexityTime: "O(n log k)",
        complexitySpace: "O(n)",
        body: "Min-heap on frequency; pop when size exceeds k.",
      },
      {
        name: "Bucket sort by frequency",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "bucket[f] = values occurring f times; sweep from n down.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode top k frequent elements"),
    tags: ["heap", "hash-table", "bucket-sort"],
    starterCode: buildStarter("intArrayK", "intArray", "topKFrequent"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const nums = ints(l0);
      const k = int(l1);
      const freq = new Map<number, number>();
      for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);
      const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
      return arrOut(sorted.slice(0, k).map(([v]) => v));
    },
    tests: [
      { input: "1 1 1 2 2 3\n2", sample: true },
      { input: "4 4 7 7\n2", sample: true },
      { input: "1\n1" },
      { input: "5 5 5 -1 -1 -1 2\n2" },
      { input: "3 0 1 0\n1" },
    ],
  },

  {
    slug: "k-closest-points-to-origin",
    title: "K Closest Points to Origin",
    difficulty: "MEDIUM",
    statement: `Given points on a plane, return the \`k\` points closest to the origin by Euclidean distance, ordered by distance (ties: smaller x first, then smaller y).

**Input**
- Line 1: two integers \`n 2\` (n points, 2 coordinates each)
- Next n lines: \`x y\` of each point
- Last line: integer \`k\`

**Output**: k lines, each \`x y\`.`,
    constraints: `- 1 ≤ k ≤ n ≤ 10^4
- -10^4 ≤ coordinates ≤ 10^4`,
    examples: [
      { input: "2 2\n1 3\n-2 2\n1", output: "-2 2", explanation: "√8 < √10." },
      { input: "3 2\n3 3\n5 -1\n-2 4\n2", output: "3 3\n-2 4" },
    ],
    hints: [
      "Compare squared distances — no sqrt needed.",
      "A max-heap of size k keeps the k closest; or quickselect on squared distance.",
    ],
    editorial: `Distance comparisons don't need square roots — compare \`x² + y²\` directly. A **max-heap of size k** (evict the farthest) processes the stream in O(n log k); quickselect on squared distance achieves average O(n). Sorting the k survivors for stable output costs O(k log k).`,
    complexityTime: "O(n log k)",
    complexitySpace: "O(k)",
    youtubeUrl: yt("k closest points to origin heap"),
    tags: ["heap", "quickselect", "geometry"],
    starterCode: buildStarter("matrixK", "intMatrix", "kClosest"),
    reference: (input) => {
      const ls = lines(input);
      const [n] = ints(ls[0]);
      const pts: number[][] = [];
      for (let i = 0; i < n; i++) pts.push(ints(ls[1 + i]));
      const k = int(ls[1 + n]);
      const d = (p: number[]) => p[0] * p[0] + p[1] * p[1];
      pts.sort((a, b) => d(a) - d(b) || a[0] - b[0] || a[1] - b[1]);
      return matOut(pts.slice(0, k));
    },
    tests: [
      { input: "2 2\n1 3\n-2 2\n1", sample: true },
      { input: "3 2\n3 3\n5 -1\n-2 4\n2", sample: true },
      { input: "1 2\n0 0\n1" },
      { input: "4 2\n1 0\n0 1\n-1 0\n0 -1\n4" },
    ],
  },

  {
    slug: "kth-largest-element-in-a-stream",
    title: "Kth Largest Element in a Stream",
    difficulty: "EASY",
    statement: `Design a class that tracks the k-th largest element in a stream of test scores.

**Input**: one operation per line —
- \`init k v1 v2 …\` — first line: initialize with k and the initial values (possibly none)
- \`add x\` — add a score and print the current k-th largest

**Output**: \`init\` prints \`null\`; each \`add\` prints the k-th largest after insertion. There are always at least k values when \`add\` is called.`,
    constraints: `- 1 ≤ k ≤ 10^4
- Up to 10^4 add calls.`,
    examples: [
      {
        input: "init 3 4 5 8 2\nadd 3\nadd 5\nadd 10\nadd 9\nadd 4",
        output: "null\n4\n5\n5\n8\n8",
      },
    ],
    hints: [
      "You only ever need the k largest values — nothing below matters.",
      "A min-heap capped at size k has the answer at its root, always.",
    ],
    editorial: `Maintain a **min-heap of exactly k elements** — the k largest seen. On \`add\`, push and pop the minimum if size exceeds k; the root is then the k-th largest. Each add is O(log k), and the state stays tiny regardless of stream length — the same pattern behind leaderboards.`,
    complexityTime: "O(log k) per add",
    complexitySpace: "O(k)",
    youtubeUrl: yt("kth largest element in a stream heap"),
    tags: ["heap", "design", "stream"],
    starterCode: buildStarter("ops", "lines", "processOps"),
    reference: (input) => {
      const ops = lines(input).filter((l) => l.trim().length > 0);
      const out: string[] = [];
      let k = 0;
      let vals: number[] = [];
      for (const op of ops) {
        const parts = op.trim().split(/\s+/);
        if (parts[0] === "init") {
          k = parseInt(parts[1], 10);
          vals = parts.slice(2).map((x) => parseInt(x, 10));
          out.push("null");
        } else {
          vals.push(parseInt(parts[1], 10));
          const sorted = [...vals].sort((a, b) => b - a);
          out.push(String(sorted[k - 1]));
        }
      }
      return linesOut(out);
    },
    tests: [
      { input: "init 3 4 5 8 2\nadd 3\nadd 5\nadd 10\nadd 9\nadd 4", sample: true },
      { input: "init 1\nadd -3\nadd -2\nadd -4\nadd 0\nadd 4" },
      { input: "init 2 0\nadd -1\nadd 1\nadd -2\nadd -4\nadd 3" },
    ],
  },

  {
    slug: "task-scheduler",
    title: "Task Scheduler",
    difficulty: "MEDIUM",
    statement: `A CPU runs tasks labeled A–Z, one per time unit, and identical tasks must be at least \`n\` units apart (idle slots allowed). Return the minimum total units to finish all tasks.

**Input**
- Line 1: the task letters as one string (e.g. \`AAB\`)
- Line 2: integer \`n\` (the cooldown)

**Output**: the minimum number of time units.`,
    constraints: `- 1 ≤ tasks ≤ 10^4
- 0 ≤ n ≤ 100`,
    examples: [
      { input: "AAABBB\n2", output: "8", explanation: "A B idle A B idle A B." },
      { input: "AAABBB\n0", output: "6" },
      { input: "AAAABBBBCCD\n2", output: "12" },
    ],
    hints: [
      "The most frequent task dictates the skeleton: (maxFreq − 1) gaps of size n + 1.",
      "Other tasks fill the gaps; if they overflow, no idling is needed at all.",
      "Answer = max(total tasks, (maxFreq − 1) × (n + 1) + count of tasks with maxFreq).",
    ],
    editorial: `Schedule the most frequent task first: it forces \`(maxFreq − 1)\` blocks of length \`n + 1\`, plus a final row holding every task that shares the top frequency. All other tasks slot into the gaps. If tasks outnumber that frame, the CPU never idles and the answer is simply the task count: \`max(len, (maxFreq − 1)(n + 1) + #maxFreq)\`. O(n) counting, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode task scheduler"),
    tags: ["heap", "greedy", "counting"],
    starterCode: buildStarter("stringInt", "int", "leastInterval"),
    reference: (input) => {
      const [tasks = "", nline] = lines(input);
      const n = int(nline);
      const freq = new Map<string, number>();
      for (const c of tasks) freq.set(c, (freq.get(c) ?? 0) + 1);
      const maxFreq = Math.max(...freq.values());
      const maxCount = [...freq.values()].filter((f) => f === maxFreq).length;
      return String(Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount));
    },
    tests: [
      { input: "AAABBB\n2", sample: true },
      { input: "AAABBB\n0", sample: true },
      { input: "AAAABBBBCCD\n2", sample: true },
      { input: "A\n100" },
      { input: "ABCDEFG\n2" },
    ],
  },

  {
    slug: "sort-characters-by-frequency",
    title: "Sort Characters By Frequency",
    difficulty: "MEDIUM",
    statement: `Given a string \`s\`, sort its characters by **decreasing frequency** and return the result. Characters with equal frequency appear in ascending character order (so the output is deterministic).

**Input**: one line, the string \`s\`.
**Output**: the frequency-sorted string.`,
    constraints: `- 1 ≤ s.length ≤ 5·10^5
- Letters and digits.`,
    examples: [
      { input: "tree", output: "eert", explanation: "'e' twice, then 'r' and 't' (tie → ascending)." },
      { input: "cccaaa", output: "aaaccc", explanation: "Tie at 3 — 'a' before 'c'." },
    ],
    hints: [
      "Count characters, then order groups by count.",
      "A heap or a simple sort of (count, char) pairs both work; bucket sort gives O(n).",
    ],
    editorial: `Count each character, sort the distinct characters by (frequency descending, character ascending), and emit each character repeated by its count. The comparator-based version is O(u log u) over u distinct characters; a frequency-bucket version reaches O(n). The tie-break rule just makes the answer unique.`,
    complexityTime: "O(n + u log u)",
    complexitySpace: "O(u)",
    youtubeUrl: yt("sort characters by frequency heap"),
    tags: ["heap", "hash-table", "sorting", "string"],
    starterCode: buildStarter("string", "string", "frequencySort"),
    reference: (input) => {
      const s = lines(input)[0] ?? "";
      const freq = new Map<string, number>();
      for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);
      const groups = [...freq.entries()].sort(
        (a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)
      );
      return groups.map(([c, f]) => c.repeat(f)).join("");
    },
    tests: [
      { input: "tree", sample: true },
      { input: "cccaaa", sample: true },
      { input: "Aabb" },
      { input: "2a554442f544asfasssffffasss" },
      { input: "x" },
    ],
  },

  {
    slug: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    difficulty: "HARD",
    statement: `Design a structure that ingests integers and can return the median of everything seen so far at any time.

**Input**: one operation per line —
- \`addNum x\` — add integer x
- \`findMedian\` — print the median formatted with **one decimal place** (e.g. \`2.0\`, \`1.5\`)

**Output**: \`addNum\` prints \`null\`; \`findMedian\` prints the median.`,
    constraints: `- -10^5 ≤ x ≤ 10^5
- Up to 5·10^4 operations; findMedian is only called after at least one add.`,
    examples: [
      {
        input: "addNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian",
        output: "null\nnull\n1.5\nnull\n2.0",
      },
    ],
    hints: [
      "Keep the lower half and upper half of the data separated.",
      "A max-heap for the low half + a min-heap for the high half, kept balanced within 1.",
      "The median is a heap root (odd count) or the average of both roots (even).",
    ],
    editorial: `Maintain two heaps: a **max-heap** holding the smaller half and a **min-heap** holding the larger half, rebalanced so their sizes differ by at most one. Insertion routes through one root and possibly migrates an element — O(log n). The median reads off the roots in O(1). This two-heap pattern is the canonical streaming-median answer.`,
    complexityTime: "O(log n) add, O(1) median",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode find median from data stream"),
    tags: ["heap", "design", "stream"],
    starterCode: buildStarter("ops", "lines", "processOps"),
    reference: (input) => {
      const ops = lines(input).filter((l) => l.trim().length > 0);
      const vals: number[] = [];
      const out: string[] = [];
      for (const op of ops) {
        const parts = op.trim().split(/\s+/);
        if (parts[0] === "addNum") {
          const x = parseInt(parts[1], 10);
          let lo = 0;
          let hi = vals.length;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (vals[mid] < x) lo = mid + 1;
            else hi = mid;
          }
          vals.splice(lo, 0, x);
          out.push("null");
        } else {
          const n = vals.length;
          const median =
            n % 2 === 1 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2;
          out.push(median.toFixed(1));
        }
      }
      return linesOut(out);
    },
    tests: [
      { input: "addNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian", sample: true },
      { input: "addNum -1\nfindMedian\naddNum -2\nfindMedian\naddNum -3\nfindMedian" },
      { input: "addNum 6\nfindMedian\naddNum 10\nfindMedian\naddNum 2\nfindMedian\naddNum 6\nfindMedian\naddNum 5\nfindMedian" },
    ],
  },

  {
    slug: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "HARD",
    statement: `Merge \`k\` sorted linked lists into one sorted linked list and return it.

**Input**
- Line 1: integer \`k\`
- Next k lines: each list's values in order (a line may be empty)

**Output**: the merged list's values, space-separated.`,
    constraints: `- 0 ≤ k ≤ 10^4
- Total nodes ≤ 10^4; each list sorted ascending.`,
    examples: [
      { input: "3\n1 4 5\n1 3 4\n2 6", output: "1 1 2 3 4 4 5 6" },
      { input: "1\n", output: "" },
    ],
    hints: [
      "Merging lists one by one into an accumulator is O(k·N).",
      "A min-heap over the k current heads gives O(N log k).",
      "Divide and conquer — merge pairs, then pairs of pairs — also gives O(N log k).",
    ],
    editorial: `Put each list's head in a **min-heap**; repeatedly pop the smallest node, append it to the result, and push its successor. Every node passes through the heap once → O(N log k). Pairwise **divide-and-conquer** merging achieves the same bound using only the two-list merge you already know.`,
    approaches: [
      {
        name: "Sequential merging",
        complexityTime: "O(k·N)",
        complexitySpace: "O(1)",
        body: "Fold lists into an accumulator with merge-two — the first list is traversed k times.",
      },
      {
        name: "Min-heap of heads",
        complexityTime: "O(N log k)",
        complexitySpace: "O(k)",
        body: "Heap always knows the globally smallest remaining node.",
      },
      {
        name: "Divide and conquer",
        complexityTime: "O(N log k)",
        complexitySpace: "O(log k)",
        body: "Merge pairs of lists, halving the count each round.",
      },
    ],
    complexityTime: "O(N log k)",
    complexitySpace: "O(k)",
    youtubeUrl: yt("neetcode merge k sorted lists"),
    tags: ["heap", "linked-list", "divide-and-conquer"],
    starterCode: buildStarter("kLists", "list", "mergeKLists"),
    reference: (input) => {
      const ls = lines(input);
      const k = int(ls[0]);
      const all: number[] = [];
      for (let i = 0; i < k; i++) all.push(...ints(ls[1 + i]));
      return arrOut(all.sort((a, b) => a - b));
    },
    tests: [
      { input: "3\n1 4 5\n1 3 4\n2 6", sample: true },
      { input: "1\n", sample: true },
      { input: "0" },
      { input: "2\n-10 -5 0\n-7 3" },
      { input: "4\n1\n\n2\n1 1" },
    ],
  },
];
