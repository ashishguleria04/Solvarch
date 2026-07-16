// Fixed study roadmaps — ordered, sectioned study plans over the existing
// catalog. DSA entries reference catalog slugs (src/data/problems/*) and
// system-design entries reference content/system-design/*.md slugs; both are
// resolved against the real data at render time (missing slugs are dropped),
// mirroring src/data/companies.ts. The classic lists (Blind 75, Grind 75's
// extended 169) are adapted to the problems available in this catalog, so
// counts can differ slightly from the canonical lists.

export type RoadmapItemKind = "dsa" | "system-design";

export type RoadmapItem = {
  /** /dsa/[slug] for kind "dsa", /system-design/[slug] otherwise. */
  slug: string;
  kind: RoadmapItemKind;
  /** Short context, e.g. why this item sits at this point in the plan. */
  note?: string;
};

export type RoadmapSection = {
  title: string;
  description?: string;
  items: RoadmapItem[];
};

export type Roadmap = {
  slug: string;
  name: string;
  /** One-liner for the roadmap card. */
  tagline: string;
  /** Fuller framing for the roadmap page header. */
  description: string;
  sections: RoadmapSection[];
};

const dsa = (slug: string, note?: string): RoadmapItem => ({
  slug,
  kind: "dsa",
  note,
});

const design = (slug: string, note?: string): RoadmapItem => ({
  slug,
  kind: "system-design",
  note,
});

export const roadmaps: Roadmap[] = [
  {
    slug: "blind-75",
    name: "Blind 75",
    tagline:
      "The classic curated list — the minimum set of problems that covers every core pattern.",
    description:
      "The famous list posted on Blind: a compact set of problems chosen so that solving all of them touches every pattern that shows up in interviews. Work through it topic by topic; each section builds intuition the next one reuses. Adapted to the problems available in the Solvarch catalog.",
    sections: [
      {
        title: "Arrays & Hashing",
        description: "Hash maps, prefix products, and the classic buy/sell scan.",
        items: [
          dsa("two-sum", "The canonical hash-map warm-up."),
          dsa("best-time-to-buy-and-sell-stock"),
          dsa("contains-duplicate"),
          dsa("product-of-array-except-self"),
          dsa("maximum-subarray", "Kadane's algorithm — know it cold."),
          dsa("maximum-product-subarray"),
          dsa("find-minimum-in-rotated-sorted-array"),
          dsa("search-in-rotated-sorted-array"),
          dsa("3sum"),
          dsa("container-with-most-water"),
          dsa("longest-consecutive-sequence", "Hash set gives O(n) — sorting is the trap."),
        ],
      },
      {
        title: "Two Pointers & Strings",
        description: "Window and pointer techniques over strings.",
        items: [
          dsa("valid-palindrome"),
          dsa("valid-anagram"),
          dsa("valid-parentheses"),
          dsa("longest-substring-without-repeating-characters"),
          dsa("longest-repeating-character-replacement"),
          dsa("minimum-window-substring", "The hardest sliding window on the list."),
          dsa("group-anagrams"),
          dsa("longest-palindromic-substring"),
          dsa("palindromic-substrings"),
        ],
      },
      {
        title: "Linked List",
        description: "Pointer surgery: reverse, detect, merge, rewire.",
        items: [
          dsa("reverse-linked-list"),
          dsa("linked-list-cycle"),
          dsa("merge-two-sorted-lists"),
          dsa("remove-nth-node-from-end-of-list"),
          dsa("reorder-list"),
          dsa("merge-k-sorted-lists", "Heap or divide-and-conquer — know both."),
        ],
      },
      {
        title: "Trees & Tries",
        description: "Recursion on trees, BST properties, and prefix trees.",
        items: [
          dsa("maximum-depth-of-binary-tree"),
          dsa("same-tree"),
          dsa("invert-binary-tree"),
          dsa("subtree-of-another-tree"),
          dsa("binary-tree-level-order-traversal"),
          dsa("validate-binary-search-tree"),
          dsa("kth-smallest-element-in-a-bst"),
          dsa("lowest-common-ancestor-of-a-binary-search-tree"),
          dsa("binary-tree-maximum-path-sum", "The classic hard tree question."),
          dsa("implement-trie-prefix-tree"),
          dsa("design-add-and-search-words-data-structure"),
        ],
      },
      {
        title: "Heaps",
        items: [
          dsa("top-k-frequent-elements"),
          dsa("find-median-from-data-stream", "Two heaps — a design favorite."),
        ],
      },
      {
        title: "Graphs",
        description: "BFS/DFS, topological sort, and union-find.",
        items: [
          dsa("number-of-islands"),
          dsa("course-schedule"),
          dsa("graph-valid-tree"),
          dsa("number-of-connected-components-in-an-undirected-graph"),
        ],
      },
      {
        title: "Intervals",
        items: [
          dsa("insert-interval"),
          dsa("merge-intervals"),
          dsa("non-overlapping-intervals"),
        ],
      },
      {
        title: "Dynamic Programming",
        description: "1-D and 2-D DP — the section people skip and regret.",
        items: [
          dsa("climbing-stairs", "The gateway DP."),
          dsa("house-robber"),
          dsa("house-robber-ii"),
          dsa("coin-change"),
          dsa("word-break"),
          dsa("decode-ways"),
          dsa("combination-sum"),
          dsa("longest-increasing-subsequence"),
          dsa("longest-common-subsequence"),
          dsa("unique-paths"),
          dsa("jump-game"),
        ],
      },
      {
        title: "Bit Manipulation",
        items: [
          dsa("single-number"),
          dsa("number-of-1-bits"),
          dsa("counting-bits"),
          dsa("missing-number"),
          dsa("reverse-bits"),
          dsa("sum-of-two-integers"),
        ],
      },
    ],
  },
  {
    slug: "grind-169",
    name: "Grind 169",
    tagline:
      "Blind 75's bigger sibling — a week-by-week plan ordered by difficulty and topic spread.",
    description:
      "The extended Grind list: starts with confidence-building easies, ramps into mediums week by week, and finishes in hard territory. Follow it in order — the sequencing (difficulty, topic variety, spaced repetition of patterns) is the point. Adapted to the problems available in the Solvarch catalog.",
    sections: [
      {
        title: "Week 1 — Foundations",
        description: "Easy problems that establish the core data structures.",
        items: [
          dsa("two-sum"),
          dsa("valid-parentheses"),
          dsa("merge-two-sorted-lists"),
          dsa("best-time-to-buy-and-sell-stock"),
          dsa("valid-palindrome"),
          dsa("invert-binary-tree"),
          dsa("valid-anagram"),
          dsa("binary-search", "Get the boundaries right without thinking."),
          dsa("flood-fill"),
          dsa("lowest-common-ancestor-of-a-binary-search-tree"),
          dsa("linked-list-cycle"),
          dsa("implement-queue-using-stacks"),
        ],
      },
      {
        title: "Week 2 — Easy, but with ideas",
        description: "Each of these hides a technique you'll reuse for years.",
        items: [
          dsa("climbing-stairs"),
          dsa("reverse-linked-list"),
          dsa("majority-element", "Boyer–Moore voting."),
          dsa("add-binary"),
          dsa("diameter-of-binary-tree"),
          dsa("middle-of-the-linked-list", "Fast/slow pointers."),
          dsa("maximum-depth-of-binary-tree"),
          dsa("contains-duplicate"),
          dsa("maximum-subarray"),
        ],
      },
      {
        title: "Week 3 — First mediums",
        items: [
          dsa("insert-interval"),
          dsa("k-closest-points-to-origin"),
          dsa("longest-substring-without-repeating-characters"),
          dsa("3sum"),
          dsa("binary-tree-level-order-traversal"),
          dsa("evaluate-reverse-polish-notation"),
        ],
      },
      {
        title: "Week 4 — Core mediums",
        items: [
          dsa("course-schedule"),
          dsa("implement-trie-prefix-tree"),
          dsa("coin-change"),
          dsa("product-of-array-except-self"),
          dsa("min-stack"),
          dsa("validate-binary-search-tree"),
          dsa("number-of-islands"),
          dsa("rotting-oranges", "Multi-source BFS."),
        ],
      },
      {
        title: "Week 5 — Search & backtracking",
        items: [
          dsa("search-in-rotated-sorted-array"),
          dsa("combination-sum"),
          dsa("permutations"),
          dsa("merge-intervals"),
          dsa("sort-colors", "Dutch national flag."),
        ],
      },
      {
        title: "Week 6 — DP arrives",
        items: [
          dsa("word-break"),
          dsa("partition-equal-subset-sum"),
          dsa("string-to-integer-atoi", "Edge-case discipline test."),
          dsa("subsets"),
          dsa("binary-tree-right-side-view"),
          dsa("longest-palindromic-substring"),
          dsa("unique-paths"),
        ],
      },
      {
        title: "Week 7 — Heavier mediums",
        items: [
          dsa("container-with-most-water"),
          dsa("letter-combinations-of-a-phone-number"),
          dsa("find-all-anagrams-in-a-string"),
          dsa("task-scheduler"),
          dsa("kth-smallest-element-in-a-bst"),
        ],
      },
      {
        title: "Week 8 — Hard territory",
        items: [
          dsa("minimum-window-substring"),
          dsa("trapping-rain-water"),
          dsa("find-median-from-data-stream"),
          dsa("merge-k-sorted-lists"),
          dsa("largest-rectangle-in-histogram", "Monotonic stack, fully general."),
        ],
      },
      {
        title: "Week 9 — Easy sweep",
        description: "Extended-list easies: close every fundamentals gap.",
        items: [
          dsa("same-tree"),
          dsa("symmetric-tree"),
          dsa("single-number"),
          dsa("palindrome-linked-list"),
          dsa("move-zeroes"),
          dsa("longest-common-prefix"),
          dsa("missing-number"),
          dsa("number-of-1-bits"),
          dsa("reverse-bits"),
          dsa("roman-to-integer"),
          dsa("pascals-triangle"),
          dsa("remove-duplicates-from-sorted-array"),
        ],
      },
      {
        title: "Week 10 — Arrays & strings, round two",
        items: [
          dsa("group-anagrams"),
          dsa("longest-consecutive-sequence"),
          dsa("rotate-array"),
          dsa("merge-sorted-arrays", "Merge from the back for O(1) space."),
          dsa("search-a-2d-matrix"),
          dsa("find-first-and-last-position-of-element-in-sorted-array"),
          dsa("longest-repeating-character-replacement"),
          dsa("sort-characters-by-frequency"),
          dsa("palindromic-substrings"),
        ],
      },
      {
        title: "Week 11 — Linked lists, stacks & queues",
        items: [
          dsa("add-two-numbers"),
          dsa("remove-nth-node-from-end-of-list"),
          dsa("reorder-list"),
          dsa("swap-nodes-in-pairs"),
          dsa("odd-even-linked-list"),
          dsa("rotate-list"),
          dsa("daily-temperatures"),
          dsa("next-greater-element-ii"),
          dsa("decode-string"),
          dsa("asteroid-collision"),
          dsa("simplify-path"),
        ],
      },
      {
        title: "Week 12 — Trees, tries & heaps",
        items: [
          dsa("path-sum"),
          dsa("subtree-of-another-tree"),
          dsa("kth-smallest-element-in-a-sorted-matrix"),
          dsa("kth-largest-element-in-an-array", "Heap vs quickselect trade-offs."),
          dsa("kth-largest-element-in-a-stream"),
          dsa("top-k-frequent-elements"),
          dsa("last-stone-weight"),
          dsa("design-add-and-search-words-data-structure"),
          dsa("replace-words"),
          dsa("longest-word-in-dictionary"),
        ],
      },
      {
        title: "Week 13 — Graphs & backtracking",
        items: [
          dsa("course-schedule-ii"),
          dsa("number-of-connected-components-in-an-undirected-graph"),
          dsa("graph-valid-tree"),
          dsa("redundant-connection", "Union-find."),
          dsa("walls-and-gates"),
          dsa("max-area-of-island"),
          dsa("network-delay-time", "Dijkstra."),
          dsa("cheapest-flights-within-k-stops"),
          dsa("subsets-ii"),
          dsa("combination-sum-ii"),
          dsa("generate-parentheses"),
          dsa("palindrome-partitioning"),
          dsa("n-queens-ii"),
        ],
      },
      {
        title: "Week 14 — DP & greedy depth",
        items: [
          dsa("house-robber"),
          dsa("house-robber-ii"),
          dsa("jump-game"),
          dsa("jump-game-ii"),
          dsa("decode-ways"),
          dsa("longest-increasing-subsequence"),
          dsa("longest-common-subsequence"),
          dsa("edit-distance"),
          dsa("maximum-product-subarray"),
          dsa("min-cost-climbing-stairs"),
          dsa("perfect-squares"),
          dsa("target-sum"),
          dsa("partition-labels"),
          dsa("gas-station"),
          dsa("hand-of-straights"),
        ],
      },
      {
        title: "Week 15 — Hard mode",
        description: "Binary search on answers, and the classic hards.",
        items: [
          dsa("koko-eating-bananas"),
          dsa("capacity-to-ship-packages-within-d-days"),
          dsa("median-of-two-sorted-arrays"),
          dsa("sliding-window-maximum"),
          dsa("first-missing-positive"),
          dsa("binary-tree-maximum-path-sum"),
          dsa("min-cost-to-connect-all-points", "MST — Prim or Kruskal."),
        ],
      },
    ],
  },
  {
    slug: "system-design-fundamentals",
    name: "System Design Fundamentals",
    tagline:
      "From scalability basics to your first full case studies, in dependency order.",
    description:
      "A reading path through the system-design library: foundations first, then the building blocks every architecture reuses, then data-at-scale topics, low-level design, and finally full case studies that put it all together. Each item is a guide — mark it complete as you finish reading.",
    sections: [
      {
        title: "Foundations",
        description: "The vocabulary and trade-offs everything else assumes.",
        items: [
          design("scalability", "Start here — vertical vs horizontal, and why it matters."),
          design("cap-theorem"),
          design("api-design"),
          design("microservices"),
        ],
      },
      {
        title: "Core building blocks",
        description: "The boxes you'll draw in every single interview.",
        items: [
          design("load-balancing"),
          design("caching", "The most common follow-up area — know invalidation strategies."),
          design("cdn"),
          design("rate-limiting"),
          design("consistent-hashing"),
        ],
      },
      {
        title: "Data at scale",
        items: [
          design("database-replication"),
          design("database-sharding"),
          design("distributed-transactions"),
          design("message-queues"),
          design("realtime-communication"),
          design("observability"),
        ],
      },
      {
        title: "Object-oriented design (LLD)",
        description: "For machine-coding and low-level design rounds.",
        items: [
          design("solid-principles"),
          design("design-patterns"),
          design("class-diagrams"),
          design("oop-design-interview"),
        ],
      },
      {
        title: "First case studies",
        description: "Apply the blocks — start small, end with a full product.",
        items: [
          design("design-url-shortener", "The canonical warm-up design."),
          design("design-parking-lot", "The canonical LLD prompt."),
          design("design-typeahead"),
          design("design-web-crawler"),
          design("design-instagram", "A full news-feed architecture."),
        ],
      },
    ],
  },
];

const roadmapsBySlug = new Map(roadmaps.map((r) => [r.slug, r]));

export function getRoadmap(slug: string): Roadmap | null {
  return roadmapsBySlug.get(slug) ?? null;
}
