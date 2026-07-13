import type { SeedTopic } from "./types";
import { arrays } from "./problems/arrays";
import { strings } from "./problems/strings";
import { twoPointers } from "./problems/two-pointers";
import { slidingWindow } from "./problems/sliding-window";
import { binarySearch } from "./problems/binary-search";
import { stacksQueues } from "./problems/stacks-queues";
import { linkedList } from "./problems/linked-list";
import { trees } from "./problems/trees";
import { tries } from "./problems/tries";
import { heaps } from "./problems/heaps";
import { backtracking } from "./problems/backtracking";
import { graphs } from "./problems/graphs";
import { greedy } from "./problems/greedy";
import { dynamicProgramming } from "./problems/dynamic-programming";
import { bitManipulation } from "./problems/bit-manipulation";

// Full DSA taxonomy, every topic wired to its authored problem set.
export const dsaTopics: SeedTopic[] = [
  {
    slug: "arrays",
    name: "Arrays",
    description: "Traversals, prefix sums, in-place tricks, and the hash-map staples.",
    icon: "Brackets",
    order: 1,
    problems: arrays,
  },
  {
    slug: "strings",
    name: "Strings",
    description: "Two pointers, sliding windows, and frequency counting on text.",
    icon: "Type",
    order: 2,
    problems: strings,
  },
  {
    slug: "two-pointers",
    name: "Two Pointers",
    description: "Converging and fast/slow pointer techniques on sorted data.",
    icon: "MoveHorizontal",
    order: 3,
    problems: twoPointers,
  },
  {
    slug: "sliding-window",
    name: "Sliding Window",
    description: "Fixed and variable windows for subarray/substring problems.",
    icon: "RectangleHorizontal",
    order: 4,
    problems: slidingWindow,
  },
  {
    slug: "binary-search",
    name: "Binary Search",
    description: "Search on sorted arrays and on the answer space.",
    icon: "Search",
    order: 5,
    problems: binarySearch,
  },
  {
    slug: "stacks-queues",
    name: "Stacks & Queues",
    description: "Monotonic stacks, queues, and expression parsing.",
    icon: "Layers",
    order: 6,
    problems: stacksQueues,
  },
  {
    slug: "linked-list",
    name: "Linked Lists",
    description: "Pointer manipulation, cycle detection, and reversal.",
    icon: "Link2",
    order: 7,
    problems: linkedList,
  },
  {
    slug: "trees",
    name: "Trees",
    description: "Binary trees, BSTs, traversals, and recursion.",
    icon: "GitFork",
    order: 8,
    problems: trees,
  },
  {
    slug: "tries",
    name: "Tries",
    description: "Prefix trees for word and dictionary problems.",
    icon: "Network",
    order: 9,
    problems: tries,
  },
  {
    slug: "heaps",
    name: "Heaps & Priority Queues",
    description: "Top-K, streaming medians, and scheduling with heaps.",
    icon: "TriangleRight",
    order: 10,
    problems: heaps,
  },
  {
    slug: "backtracking",
    name: "Backtracking",
    description: "Systematic search over subsets, permutations, and boards.",
    icon: "Undo2",
    order: 11,
    problems: backtracking,
  },
  {
    slug: "graphs",
    name: "Graphs",
    description: "BFS, DFS, topological sort, and union-find.",
    icon: "Waypoints",
    order: 12,
    problems: graphs,
  },
  {
    slug: "greedy",
    name: "Greedy",
    description: "Locally optimal choices that yield global optima.",
    icon: "TrendingUp",
    order: 13,
    problems: greedy,
  },
  {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    description: "Memoization and tabulation over overlapping subproblems.",
    icon: "Boxes",
    order: 14,
    problems: dynamicProgramming,
  },
  {
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    description: "XOR tricks, masks, and counting bits.",
    icon: "Binary",
    order: 15,
    problems: bitManipulation,
  },
];
