// Company question banks — static lists compiled from publicly shared
// interview experiences (LeetCode discuss threads, blog posts, prep guides).
// Exact questions vary interview to interview; these are the recurring
// patterns candidates report. DSA entries reference catalog slugs and are
// resolved against the problem data at render time; system-design entries
// reference content/system-design/*.md slugs.

export type CompanyQuestionKind = "dsa" | "system-design";

/** How often the question shows up in public reports. */
export type Frequency = "high" | "medium" | "low";

export type CompanyQuestion = {
  /** /dsa/[slug] for kind "dsa", /system-design/[slug] otherwise. */
  slug: string;
  kind: CompanyQuestionKind;
  frequency: Frequency;
  /** Short context from reports, e.g. which round it tends to appear in. */
  note?: string;
};

export type Company = {
  slug: string;
  name: string;
  blurb: string;
  questions: CompanyQuestion[];
};

const dsa = (
  slug: string,
  frequency: Frequency,
  note?: string
): CompanyQuestion => ({ slug, kind: "dsa", frequency, note });

const design = (
  slug: string,
  frequency: Frequency,
  note?: string
): CompanyQuestion => ({ slug, kind: "system-design", frequency, note });

export const companies: Company[] = [
  {
    slug: "google",
    name: "Google",
    blurb:
      "Emphasis on clean reasoning from brute force to optimal, graph/DP depth, and follow-ups that mutate the problem.",
    questions: [
      dsa("two-sum", "high", "Warm-up in phone screens; expect the follow-up variants."),
      dsa("longest-substring-without-repeating-characters", "high"),
      dsa("number-of-islands", "high", "Often extended with follow-ups (diagonals, streaming grid)."),
      dsa("merge-intervals", "high"),
      dsa("median-of-two-sorted-arrays", "medium", "Classic onsite hard — binary search partition."),
      dsa("trapping-rain-water", "medium"),
      dsa("course-schedule", "medium", "Topological sort; be ready to detect and print a cycle."),
      dsa("word-break", "medium"),
      dsa("decode-string", "medium", "Stack simulation; recursion follow-up is common."),
      dsa("kth-largest-element-in-an-array", "medium", "Discuss heap vs quickselect trade-offs."),
      dsa("edit-distance", "low"),
      dsa("unique-paths", "low", "Usually a lead-in to obstacle/DP variants."),
      dsa("network-delay-time", "low", "Dijkstra with a twist in senior loops."),
      dsa("generate-parentheses", "low"),
      design("design-web-crawler", "high", "The canonical Google system-design prompt."),
      design("design-typeahead", "medium", "Search-suggestions design shows up across levels."),
      design("design-google-docs", "low", "Collaborative editing for senior rounds."),
    ],
  },
  {
    slug: "amazon",
    name: "Amazon",
    blurb:
      "Pattern-heavy and fast-paced — arrays, BFS grids, heaps — with Leadership Principles woven into every round.",
    questions: [
      dsa("two-sum", "high", "Screening staple."),
      dsa("best-time-to-buy-and-sell-stock", "high"),
      dsa("number-of-islands", "high", "The most-reported Amazon question, year after year."),
      dsa("rotting-oranges", "high", "Multi-source BFS; explain the level-by-level clock."),
      dsa("merge-intervals", "medium"),
      dsa("top-k-frequent-elements", "high", "Heap vs bucket sort discussion expected."),
      dsa("k-closest-points-to-origin", "medium"),
      dsa("search-in-rotated-sorted-array", "medium"),
      dsa("merge-k-sorted-lists", "medium"),
      dsa("reorder-list", "low"),
      dsa("longest-palindromic-substring", "medium"),
      dsa("task-scheduler", "low", "Greedy + counting; a favorite for SDE-2 loops."),
      dsa("valid-parentheses", "medium"),
      dsa("course-schedule", "low"),
      design("design-url-shortener", "high", "The default warm-up design prompt."),
      design("design-notification-system", "medium"),
      design("design-parking-lot", "medium", "LLD/OOD round staple — classes first, patterns second."),
    ],
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    blurb:
      "Fundamentals-first: linked lists, trees, and clean implementation — plus a practical design conversation.",
    questions: [
      dsa("reverse-linked-list", "high", "Iterative and recursive, then reverse-in-groups follow-up."),
      dsa("linked-list-cycle", "high"),
      dsa("merge-two-sorted-lists", "high"),
      dsa("valid-parentheses", "medium"),
      dsa("binary-tree-level-order-traversal", "high", "Zigzag variant is the usual follow-up."),
      dsa("validate-binary-search-tree", "medium"),
      dsa("lowest-common-ancestor-of-a-binary-search-tree", "medium"),
      dsa("rotate-array", "medium", "Expect the O(1)-space reversal trick."),
      dsa("majority-element", "medium", "Boyer–Moore voting earns points."),
      dsa("first-missing-positive", "low"),
      dsa("longest-common-subsequence", "medium"),
      dsa("gas-station", "low"),
      dsa("implement-queue-using-stacks", "low", "Design-flavored warm-up."),
      dsa("binary-tree-maximum-path-sum", "low", "Senior-loop hard."),
      design("design-dropbox", "medium", "File sync design fits the OneDrive org."),
      design("design-elevator-system", "medium", "Recurring LLD prompt."),
    ],
  },
  {
    slug: "meta",
    name: "Meta",
    blurb:
      "Speed matters: two clean mediums in ~35 minutes, verbalizing the approach before code. Heavy on strings, trees, and top-k.",
    questions: [
      dsa("valid-palindrome", "high", "Screen warm-up; valid-palindrome-ii is the follow-up."),
      dsa("valid-palindrome-ii", "high"),
      dsa("two-sum", "medium"),
      dsa("3sum", "high"),
      dsa("product-of-array-except-self", "high"),
      dsa("minimum-window-substring", "medium"),
      dsa("group-anagrams", "medium"),
      dsa("top-k-frequent-elements", "high", "Bucket-sort O(n) answer is the differentiator."),
      dsa("kth-largest-element-in-an-array", "high", "Quickselect expected at full loop."),
      dsa("binary-tree-right-side-view", "high"),
      dsa("diameter-of-binary-tree", "medium"),
      dsa("lowest-common-ancestor-of-a-binary-search-tree", "medium"),
      dsa("subsets", "medium"),
      dsa("merge-intervals", "medium"),
      dsa("find-median-from-data-stream", "low", "Two-heap design; production-scale follow-ups."),
      dsa("add-two-numbers", "low"),
      design("design-instagram", "high", "Feed design is the flagship Meta prompt."),
      design("design-whatsapp", "medium"),
      design("design-notification-system", "low"),
    ],
  },
  {
    slug: "apple",
    name: "Apple",
    blurb:
      "Team-dependent loops that reward polished fundamentals, memory awareness, and API-quality code.",
    questions: [
      dsa("two-sum", "high"),
      dsa("add-two-numbers", "medium"),
      dsa("merge-sorted-arrays", "high", "In-place from the back — a favorite Apple screen."),
      dsa("valid-anagram", "medium"),
      dsa("min-stack", "medium", "Design-flavored; constant-time min is the point."),
      dsa("longest-substring-without-repeating-characters", "medium"),
      dsa("maximum-subarray", "medium", "Kadane plus the divide-and-conquer discussion."),
      dsa("container-with-most-water", "medium"),
      dsa("climbing-stairs", "low"),
      dsa("house-robber", "low"),
      dsa("symmetric-tree", "low"),
      dsa("implement-trie-prefix-tree", "low", "Autocomplete-adjacent teams love tries."),
      design("design-dropbox", "medium", "Sync + offline mirrors iCloud problems."),
      design("rate-limiting", "low"),
    ],
  },
  {
    slug: "netflix",
    name: "Netflix",
    blurb:
      "Senior-leaning loops: fewer puzzle questions, more streaming-scale design, caching, and real-world trade-offs.",
    questions: [
      dsa("top-k-frequent-elements", "high", "Trending-titles framing is common."),
      dsa("sliding-window-maximum", "medium"),
      dsa("longest-repeating-character-replacement", "medium"),
      dsa("task-scheduler", "medium"),
      dsa("kth-largest-element-in-a-stream", "medium", "Streaming top-k fits the domain."),
      dsa("subarray-product-less-than-k", "low"),
      dsa("lemonade-change", "low", "Quick greedy warm-up."),
      design("design-netflix", "high", "Know your own product: CDN, encoding ladder, recommendations."),
      design("cdn", "high"),
      design("caching", "medium"),
      design("rate-limiting", "medium"),
      design("load-balancing", "low"),
    ],
  },
  {
    slug: "uber",
    name: "Uber",
    blurb:
      "Graphs and geospatial flavor — shortest paths, grids, k-nearest — plus marketplace system design.",
    questions: [
      dsa("number-of-islands", "high"),
      dsa("k-closest-points-to-origin", "high", "Nearest-drivers framing."),
      dsa("cheapest-flights-within-k-stops", "medium", "Bellman-Ford/BFS-with-costs discussion."),
      dsa("network-delay-time", "medium"),
      dsa("min-cost-to-connect-all-points", "low", "MST for senior loops."),
      dsa("course-schedule-ii", "medium"),
      dsa("longest-consecutive-sequence", "medium"),
      dsa("gas-station", "medium", "On brand — expect it."),
      dsa("jump-game-ii", "low"),
      dsa("sliding-window-maximum", "low"),
      dsa("asteroid-collision", "medium", "Stack simulation favorite."),
      dsa("evaluate-reverse-polish-notation", "low"),
      design("design-uber", "high", "Ride matching, ETA, surge — the obvious one."),
      design("design-splitwise", "medium", "Payments/ledger LLD round."),
      design("rate-limiting", "medium"),
    ],
  },
  {
    slug: "adobe",
    name: "Adobe",
    blurb:
      "String manipulation and DP dominate reports, with an OOP/design-patterns conversation for product teams.",
    questions: [
      dsa("longest-palindromic-substring", "high"),
      dsa("string-to-integer-atoi", "high", "Edge-case discipline is what's being graded."),
      dsa("roman-to-integer", "medium"),
      dsa("zigzag-conversion", "medium"),
      dsa("valid-parentheses", "medium"),
      dsa("climbing-stairs", "medium"),
      dsa("coin-change", "high"),
      dsa("decode-ways", "medium"),
      dsa("maximum-product-subarray", "medium"),
      dsa("permutations", "low"),
      dsa("daily-temperatures", "low"),
      dsa("largest-rectangle-in-histogram", "low", "Hard-round stack classic."),
      dsa("letter-combinations-of-a-phone-number", "low"),
      design("design-typeahead", "medium"),
      design("design-patterns", "high", "Expect concrete patterns questions (observer, factory, singleton)."),
    ],
  },
  {
    slug: "flipkart",
    name: "Flipkart",
    blurb:
      "Hard-leaning DSA rounds — DP, BFS, heaps under time pressure — then machine-coding/LLD with working code.",
    questions: [
      dsa("rotting-oranges", "high"),
      dsa("coin-change", "high"),
      dsa("jump-game", "medium"),
      dsa("partition-equal-subset-sum", "medium"),
      dsa("sliding-window-maximum", "high"),
      dsa("minimum-window-substring", "medium"),
      dsa("top-k-frequent-elements", "medium"),
      dsa("course-schedule-ii", "medium"),
      dsa("boats-to-save-people", "low"),
      dsa("gas-station", "medium"),
      dsa("3sum", "medium"),
      dsa("trapping-rain-water", "medium"),
      dsa("first-missing-positive", "low"),
      design("design-ticketmaster", "high", "Flash-sale/booking design mirrors Big Billion Days."),
      design("design-url-shortener", "medium"),
      design("message-queues", "low", "Machine-coding rounds probe queue-backed designs."),
    ],
  },
  {
    slug: "goldman-sachs",
    name: "Goldman Sachs",
    blurb:
      "CoderPad rounds heavy on arrays, math, and hash maps, plus CS fundamentals trivia between problems.",
    questions: [
      dsa("best-time-to-buy-and-sell-stock", "high", "On-brand; know the k-transactions family."),
      dsa("majority-element", "high"),
      dsa("first-missing-positive", "medium"),
      dsa("minimum-size-subarray-sum", "medium"),
      dsa("string-to-integer-atoi", "medium"),
      dsa("valid-anagram", "medium"),
      dsa("single-number", "medium", "Bit-trick warm-up."),
      dsa("missing-number", "medium"),
      dsa("climbing-stairs", "low"),
      dsa("house-robber", "medium"),
      dsa("coin-change", "medium"),
      dsa("find-median-from-data-stream", "high", "Running median of a price stream — a GS signature."),
      dsa("evaluate-reverse-polish-notation", "low"),
      dsa("kth-smallest-element-in-a-bst", "low"),
      design("design-splitwise", "medium", "Ledger/settlement LLD."),
      design("rate-limiting", "low"),
    ],
  },
];

const companiesBySlug = new Map(companies.map((c) => [c.slug, c]));

export function getCompany(slug: string): Company | null {
  return companiesBySlug.get(slug) ?? null;
}
