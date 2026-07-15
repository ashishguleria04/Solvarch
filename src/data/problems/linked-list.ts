import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, arrOut, yt, lines } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

// Linked lists are provided to your solve() function as real ListNode chains,
// built from a line of space-separated values. Reference outputs are computed
// with equivalent array logic.
export const linkedList: SeedProblem[] = [
  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "EASY",
    statement: `Given the head of a singly linked list, reverse it and return the new head.

**Input**: one line of space-separated integers — the list values in order (may be empty).
**Output**: the reversed list's values, space-separated.`,
    constraints: `- 0 ≤ list length ≤ 5000
- -5000 ≤ node values ≤ 5000`,
    examples: [
      { input: "1 2 3 4 5", output: "5 4 3 2 1" },
      { input: "1 2", output: "2 1" },
      { input: "", output: "" },
    ],
    hints: [
      "Walk the list keeping prev and curr pointers; flip one .next per step.",
      "Save curr.next before overwriting it.",
    ],
    editorial: `Iterate with two pointers: at each node, remember its successor, point \`curr.next\` back at \`prev\`, then advance both. When \`curr\` runs off the end, \`prev\` is the new head. O(n) time, O(1) space. The recursive version is elegant but costs O(n) stack.`,
    approaches: [
      {
        name: "Iterative pointer flip",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "prev/curr walk; reverse one link per step.",
      },
      {
        name: "Recursive",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "Reverse the tail, then attach the head behind it.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode reverse linked list"),
    tags: ["linked-list", "recursion"],
    starterCode: buildStarter("list", "list", "reverseList"),
    reference: (input) => arrOut(first(input).reverse()),
    tests: [
      { input: "1 2 3 4 5", sample: true },
      { input: "1 2", sample: true },
      { input: "" },
      { input: "7" },
      { input: "-1 0 1" },
    ],
  },

  {
    slug: "middle-of-the-linked-list",
    title: "Middle of the Linked List",
    difficulty: "EASY",
    statement: `Given the head of a singly linked list, return the **middle node** (the second middle if there are two). The output prints the list from that node to the end.

**Input**: one line of space-separated integers — the list values.
**Output**: values from the middle node onward, space-separated.`,
    constraints: `- 1 ≤ list length ≤ 100`,
    examples: [
      { input: "1 2 3 4 5", output: "3 4 5" },
      { input: "1 2 3 4 5 6", output: "4 5 6", explanation: "Two middles (3, 4) — return the second." },
    ],
    hints: [
      "Fast and slow pointers: the fast one moves two steps per iteration.",
      "When fast reaches the end, slow is at the middle.",
    ],
    editorial: `The classic **tortoise and hare**: advance \`slow\` one step and \`fast\` two steps until \`fast\` falls off the list. \`slow\` then sits exactly at the middle (the second one for even lengths, because \`fast\` starts at the head). One pass, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("middle of the linked list fast slow pointers"),
    tags: ["linked-list", "two-pointers"],
    starterCode: buildStarter("list", "list", "middleNode"),
    reference: (input) => {
      const vals = first(input);
      return arrOut(vals.slice(Math.floor(vals.length / 2)));
    },
    tests: [
      { input: "1 2 3 4 5", sample: true },
      { input: "1 2 3 4 5 6", sample: true },
      { input: "9" },
      { input: "1 2" },
    ],
  },

  {
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "EASY",
    statement: `Merge two sorted linked lists \`l1\` and \`l2\` into one sorted list by splicing their nodes, and return its head.

**Input**
- Line 1: values of \`l1\` (sorted, may be empty)
- Line 2: values of \`l2\` (sorted, may be empty)

**Output**: the merged list's values, space-separated.`,
    constraints: `- 0 ≤ each list's length ≤ 50
- -100 ≤ node values ≤ 100`,
    examples: [
      { input: "1 2 4\n1 3 4", output: "1 1 2 3 4 4" },
      { input: "\n", output: "" },
      { input: "\n0", output: "0" },
    ],
    hints: [
      "A dummy head node removes all the 'is this the first node?' special cases.",
      "Advance whichever list has the smaller front value; attach the leftover tail at the end.",
    ],
    editorial: `Use a **dummy head** and a tail pointer. Repeatedly attach the smaller of the two front nodes and advance that list; when one empties, attach the other's remainder wholesale. O(m + n) time, O(1) extra space since nodes are reused.`,
    complexityTime: "O(m + n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode merge two sorted lists"),
    tags: ["linked-list", "recursion"],
    starterCode: buildStarter("twoLists", "list", "mergeTwoLists"),
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
      { input: "1 2 4\n1 3 4", sample: true },
      { input: "\n", sample: true },
      { input: "\n0", sample: true },
      { input: "-3 5\n-10 -3 20" },
      { input: "1 1 1\n" },
    ],
  },

  {
    slug: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "EASY",
    statement: `Determine whether a linked list contains a cycle — i.e. some node can be reached again by following \`next\` pointers. Use O(1) memory.

**Input**
- Line 1: the list values in order
- Line 2: integer \`pos\` — the tail connects to the node at this 0-based index (\`-1\` means no cycle). Your function receives only the head; the cycle is already wired.

**Output**: \`true\` or \`false\`.`,
    constraints: `- 0 ≤ list length ≤ 10^4
- pos is -1 or a valid index.`,
    examples: [
      { input: "3 2 0 -4\n1", output: "true", explanation: "Tail connects back to value 2." },
      { input: "1 2\n0", output: "true" },
      { input: "1\n-1", output: "false" },
    ],
    hints: [
      "A visited-set works but uses O(n) memory.",
      "Floyd's algorithm: if fast (2 steps) ever equals slow (1 step), there's a cycle.",
    ],
    editorial: `**Floyd's cycle detection**: move \`slow\` one step and \`fast\` two. In a cycle, \`fast\` gains one position on \`slow\` per iteration, so they must meet; without a cycle, \`fast\` hits the end. O(n) time, O(1) space — the interview follow-up everyone should know.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode linked list cycle floyd"),
    tags: ["linked-list", "two-pointers"],
    starterCode: buildStarter("listCycle", "bool", "hasCycle"),
    reference: (input) => {
      const pos = int(lines(input)[1]);
      return boolOut(pos >= 0);
    },
    tests: [
      { input: "3 2 0 -4\n1", sample: true },
      { input: "1 2\n0", sample: true },
      { input: "1\n-1", sample: true },
      { input: "\n-1" },
      { input: "1 2 3 4 5\n4" },
      { input: "1 2 3 4 5\n-1" },
    ],
  },

  {
    slug: "remove-nth-node-from-end-of-list",
    title: "Remove Nth Node From End of List",
    difficulty: "MEDIUM",
    statement: `Remove the \`k\`-th node from the **end** of a linked list and return the head. Try to do it in one pass.

**Input**
- Line 1: the list values
- Line 2: integer \`k\` (1 ≤ k ≤ length)

**Output**: the resulting list's values, space-separated.`,
    constraints: `- 1 ≤ list length ≤ 30
- 1 ≤ k ≤ length`,
    examples: [
      { input: "1 2 3 4 5\n2", output: "1 2 3 5" },
      { input: "1\n1", output: "" },
      { input: "1 2\n1", output: "1" },
    ],
    hints: [
      "Two passes is easy: count, then delete node (length − k).",
      "One pass: lead a right pointer k steps ahead, then move both until it hits the end.",
      "A dummy node before the head handles deleting the first node cleanly.",
    ],
    editorial: `Advance a \`fast\` pointer \`k\` steps from a dummy pre-head, then walk \`fast\` and \`slow\` together until \`fast\` reaches the last node. \`slow\` now precedes the victim: splice it out with \`slow.next = slow.next.next\`. The dummy makes "remove the head" a non-special case. One pass, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode remove nth node from end"),
    tags: ["linked-list", "two-pointers"],
    starterCode: buildStarter("listK", "list", "removeNthFromEnd"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const vals = ints(l0);
      const k = int(l1);
      vals.splice(vals.length - k, 1);
      return arrOut(vals);
    },
    tests: [
      { input: "1 2 3 4 5\n2", sample: true },
      { input: "1\n1", sample: true },
      { input: "1 2\n1", sample: true },
      { input: "1 2\n2" },
      { input: "10 20 30 40\n4" },
    ],
  },

  {
    slug: "remove-duplicates-from-sorted-list",
    title: "Remove Duplicates from Sorted List",
    difficulty: "EASY",
    statement: `Given the head of a **sorted** linked list, delete duplicates so each value appears once, and return the (still sorted) list.

**Input**: one line of space-separated integers (sorted).
**Output**: the deduplicated list's values.`,
    constraints: `- 0 ≤ list length ≤ 300
- Sorted non-decreasing.`,
    examples: [
      { input: "1 1 2", output: "1 2" },
      { input: "1 1 2 3 3", output: "1 2 3" },
    ],
    hints: [
      "Duplicates are adjacent in a sorted list.",
      "If curr.val equals curr.next.val, splice out curr.next; otherwise advance.",
    ],
    editorial: `Walk the list once: when the current node's value equals its successor's, bypass the successor (\`curr.next = curr.next.next\`) without advancing; otherwise step forward. Sortedness guarantees all equal values are consecutive. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("remove duplicates from sorted list leetcode"),
    tags: ["linked-list"],
    starterCode: buildStarter("list", "list", "deleteDuplicates"),
    reference: (input) => {
      const vals = first(input);
      return arrOut(vals.filter((x, i) => i === 0 || x !== vals[i - 1]));
    },
    tests: [
      { input: "1 1 2", sample: true },
      { input: "1 1 2 3 3", sample: true },
      { input: "" },
      { input: "5 5 5 5" },
      { input: "-2 -1 0" },
    ],
  },

  {
    slug: "palindrome-linked-list",
    title: "Palindrome Linked List",
    difficulty: "EASY",
    statement: `Return \`true\` if a singly linked list reads the same forwards and backwards. The follow-up asks for O(n) time and O(1) space.

**Input**: one line of space-separated integers.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ list length ≤ 10^5
- 0 ≤ node values ≤ 9`,
    examples: [
      { input: "1 2 2 1", output: "true" },
      { input: "1 2", output: "false" },
    ],
    hints: [
      "Copying values to an array makes it trivial — but costs O(n) space.",
      "Find the middle (fast/slow), reverse the second half in place, then compare halves.",
    ],
    editorial: `For O(1) space: locate the middle with fast/slow pointers, **reverse the second half** in place, then walk both halves comparing values. (Optionally restore the list afterwards.) Any mismatch → not a palindrome. O(n) time, O(1) space.`,
    approaches: [
      {
        name: "Copy to array",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "Dump values and two-pointer the array.",
      },
      {
        name: "Reverse second half",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "Fast/slow to the middle, reverse, compare, optionally restore.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("palindrome linked list neetcode"),
    tags: ["linked-list", "two-pointers"],
    starterCode: buildStarter("list", "bool", "isPalindrome"),
    reference: (input) => {
      const vals = first(input);
      const rev = [...vals].reverse();
      return boolOut(vals.every((v, i) => v === rev[i]));
    },
    tests: [
      { input: "1 2 2 1", sample: true },
      { input: "1 2", sample: true },
      { input: "1" },
      { input: "1 0 1" },
      { input: "1 2 3 2 2" },
    ],
  },

  {
    slug: "reorder-list",
    title: "Reorder List",
    difficulty: "MEDIUM",
    statement: `Given a list L₀ → L₁ → … → Lₙ, reorder it in place to L₀ → Lₙ → L₁ → Lₙ₋₁ → L₂ → … and return the head. Only nodes may be rearranged, not values (though the judge only checks the resulting order).

**Input**: one line of space-separated integers.
**Output**: the reordered list's values.`,
    constraints: `- 1 ≤ list length ≤ 5·10^4`,
    examples: [
      { input: "1 2 3 4", output: "1 4 2 3" },
      { input: "1 2 3 4 5", output: "1 5 2 4 3" },
    ],
    hints: [
      "Three classic subroutines chained: find middle, reverse, merge.",
      "Split at the middle, reverse the second half, then interleave the two halves.",
    ],
    editorial: `Three steps, each a standard pattern: (1) fast/slow pointers find the middle; (2) reverse the second half in place; (3) interleave the two halves node by node. Chaining known subroutines is exactly what interviewers want to see here. O(n) time, O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode reorder list"),
    tags: ["linked-list", "two-pointers"],
    starterCode: buildStarter("list", "list", "reorderList"),
    reference: (input) => {
      const vals = first(input);
      const res: number[] = [];
      let i = 0;
      let j = vals.length - 1;
      while (i <= j) {
        res.push(vals[i]);
        if (i !== j) res.push(vals[j]);
        i++;
        j--;
      }
      return arrOut(res);
    },
    tests: [
      { input: "1 2 3 4", sample: true },
      { input: "1 2 3 4 5", sample: true },
      { input: "1" },
      { input: "1 2" },
      { input: "10 20 30 40 50 60" },
    ],
  },

  {
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "MEDIUM",
    statement: `Two non-empty linked lists represent non-negative integers with digits stored in **reverse order** (ones digit first). Add them and return the sum as a linked list in the same format.

**Input**
- Line 1: digits of the first number (reverse order)
- Line 2: digits of the second number (reverse order)

**Output**: digits of the sum, reverse order, space-separated.`,
    constraints: `- 1 ≤ each list's length ≤ 100
- 0 ≤ digit ≤ 9; no leading zeros except the number 0.`,
    examples: [
      { input: "2 4 3\n5 6 4", output: "7 0 8", explanation: "342 + 465 = 807." },
      { input: "0\n0", output: "0" },
      { input: "9 9 9 9 9 9 9\n9 9 9 9", output: "8 9 9 9 0 0 0 1" },
    ],
    hints: [
      "Reverse order means you add ones-first — exactly like grade-school addition.",
      "Track a carry; keep going while either list or the carry is non-zero.",
    ],
    editorial: `Walk both lists in lockstep summing \`digit + digit + carry\`, emitting \`sum % 10\` and carrying \`sum / 10\`. Continue while either list has nodes **or a carry remains** (the classic missed edge case: 999 + 1). A dummy head keeps the code clean. O(max(m, n)).`,
    complexityTime: "O(max(m, n))",
    complexitySpace: "O(max(m, n))",
    youtubeUrl: yt("neetcode add two numbers"),
    tags: ["linked-list", "math", "recursion"],
    starterCode: buildStarter("twoLists", "list", "addTwoNumbers"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const a = ints(l0);
      const b = ints(l1);
      const res: number[] = [];
      let carry = 0;
      for (let i = 0; i < Math.max(a.length, b.length) || carry; i++) {
        const s = (a[i] ?? 0) + (b[i] ?? 0) + carry;
        res.push(s % 10);
        carry = Math.floor(s / 10);
      }
      return arrOut(res);
    },
    tests: [
      { input: "2 4 3\n5 6 4", sample: true },
      { input: "0\n0", sample: true },
      { input: "9 9 9 9 9 9 9\n9 9 9 9", sample: true },
      { input: "5\n5" },
      { input: "1 8\n0" },
    ],
  },

  {
    slug: "odd-even-linked-list",
    title: "Odd Even Linked List",
    difficulty: "MEDIUM",
    statement: `Group all nodes at **odd positions** (1st, 3rd, …) followed by nodes at even positions, preserving relative order within each group. Solve in O(1) space and O(n) time.

**Input**: one line of space-separated integers.
**Output**: the regrouped list's values.`,
    constraints: `- 0 ≤ list length ≤ 10^4`,
    examples: [
      { input: "1 2 3 4 5", output: "1 3 5 2 4" },
      { input: "2 1 3 5 6 4 7", output: "2 3 6 7 1 5 4" },
    ],
    hints: [
      "Positions, not values: it's about 1st/2nd/3rd nodes.",
      "Weave two chains (odd and even) in one pass, then append the even chain to the odd tail.",
    ],
    editorial: `Maintain two running chains: \`odd\` links every other node starting at position 1, \`even\` the rest. In one pass, \`odd.next = even.next; even.next = odd.next.next\`-style rewiring separates the chains; finally attach the even head after the odd tail. O(n) time, O(1) space, order preserved within groups.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("odd even linked list leetcode"),
    tags: ["linked-list"],
    starterCode: buildStarter("list", "list", "oddEvenList"),
    reference: (input) => {
      const vals = first(input);
      const odd = vals.filter((_, i) => i % 2 === 0);
      const even = vals.filter((_, i) => i % 2 === 1);
      return arrOut([...odd, ...even]);
    },
    tests: [
      { input: "1 2 3 4 5", sample: true },
      { input: "2 1 3 5 6 4 7", sample: true },
      { input: "" },
      { input: "1" },
      { input: "1 2" },
    ],
  },

  {
    slug: "swap-nodes-in-pairs",
    title: "Swap Nodes in Pairs",
    difficulty: "EASY",
    statement: `Swap every two adjacent nodes of the list and return the new head. Swap the **nodes themselves**, not just their values.

**Input**: one line of space-separated integers — the list values (may be empty).
**Output**: the resulting list's values, space-separated.`,
    constraints: `- 0 ≤ list length ≤ 100`,
    examples: [
      { input: "1 2 3 4", output: "2 1 4 3" },
      { input: "1", output: "1" },
      { input: "1 2 3", output: "2 1 3" },
    ],
    hints: [
      "A dummy node before the head removes the 'new head' special case.",
      "To swap (a, b) you must also rewire the node *before* a — track prev.",
      "Draw the four pointer updates before coding; order matters.",
    ],
    editorial: `Use a dummy pre-head and a \`prev\` pointer. For each pair (a = prev.next, b = a.next): point prev at b, a at b's successor, b at a — then advance prev to a. The dummy makes the head swap identical to every other swap, which is the whole lesson of this problem: sentinel nodes delete edge cases. O(n) time, O(1) space. The recursive version (swap first pair, recurse on the rest) reads beautifully but spends O(n) stack.`,
    approaches: [
      {
        name: "Iterative with dummy",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "Three-pointer rewire per pair behind a sentinel node.",
      },
      {
        name: "Recursive",
        complexityTime: "O(n)",
        complexitySpace: "O(n)",
        body: "head.next = swapPairs(head.next.next); return the old second node.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("swap nodes in pairs leetcode"),
    tags: ["linked-list", "recursion"],
    starterCode: buildStarter("list", "list", "swapPairs"),
    reference: (input) => {
      const a = first(input);
      for (let i = 0; i + 1 < a.length; i += 2) {
        const t = a[i];
        a[i] = a[i + 1];
        a[i + 1] = t;
      }
      return arrOut(a);
    },
    tests: [
      { input: "1 2 3 4", sample: true },
      { input: "1", sample: true },
      { input: "1 2 3", sample: true },
      { input: "" },
      { input: "5 4 3 2 1 0" },
    ],
  },

  {
    slug: "rotate-list",
    title: "Rotate List",
    difficulty: "MEDIUM",
    statement: `Rotate the list to the right by \`k\` places: the last \`k\` nodes move to the front (in order).

**Input**
- Line 1: space-separated integers — the list values (may be empty)
- Line 2: the integer \`k\`

**Output**: the rotated list's values, space-separated.`,
    constraints: `- 0 ≤ list length ≤ 500
- 0 ≤ k ≤ 2·10^9`,
    examples: [
      { input: "1 2 3 4 5\n2", output: "4 5 1 2 3" },
      { input: "0 1 2\n4", output: "2 0 1", explanation: "k=4 on length 3 is k=1." },
    ],
    hints: [
      "k can exceed the length — rotating by n is a no-op, so reduce k mod n first.",
      "Find the length, connect tail to head to form a ring, then cut it at the right place.",
      "The new tail is at position n − k − 1 (0-indexed) from the old head.",
    ],
    editorial: `Walk once to find the length n and the tail; take k mod n (if n is 0 or k reduces to 0, return the list unchanged). Join tail → head to close the ring, walk n − k − 1 steps from the old head to the new tail, set the new head to its successor, and cut. Two passes, O(n) time, O(1) space. The mod is where naive solutions die — k up to 2·10⁹ makes step-by-step rotation a timeout, and forgetting the empty-list guard makes it a crash.`,
    approaches: [
      {
        name: "Close the ring and cut",
        complexityTime: "O(n)",
        complexitySpace: "O(1)",
        body: "Length + tail in one pass; link tail to head; sever at n − k mod n.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("rotate list leetcode"),
    tags: ["linked-list", "two-pointers"],
    starterCode: buildStarter("listK", "list", "rotateRight"),
    reference: (input) => {
      const a = ints(lines(input)[0]);
      const kRaw = int(lines(input)[1]);
      const n = a.length;
      if (n === 0) return "";
      const k = kRaw % n;
      return arrOut(a.slice(n - k).concat(a.slice(0, n - k)));
    },
    tests: [
      { input: "1 2 3 4 5\n2", sample: true },
      { input: "0 1 2\n4", sample: true },
      { input: "\n3" },
      { input: "1\n99" },
      { input: "1 2\n2" },
      { input: "7 8 9\n0" },
    ],
  },
];
