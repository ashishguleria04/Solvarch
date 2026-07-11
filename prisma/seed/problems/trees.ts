import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import {
  int,
  ints,
  boolOut,
  arrOut,
  yt,
  lines,
  matOut,
  parseTree,
  treeOut,
  TNode,
} from "../ref-utils";

// Trees are provided to solve() as real TreeNode structures, built from a
// level-order line where `null` marks a missing child, e.g. "3 9 20 null null 15 7".
export const trees: SeedProblem[] = [
  {
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "EASY",
    statement: `Invert a binary tree (mirror it left-to-right) and return its root.

**Input**: one line — the tree in level order, \`null\` for missing children.
**Output**: the inverted tree in level order (trailing nulls trimmed; \`null\` for an empty tree).`,
    constraints: `- 0 ≤ number of nodes ≤ 100`,
    examples: [
      { input: "4 2 7 1 3 6 9", output: "4 7 2 9 6 3 1" },
      { input: "2 1 3", output: "2 3 1" },
      { input: "null", output: "null" },
    ],
    hints: [
      "Swap the children of every node.",
      "Recursion: invert left, invert right, swap — or BFS with a queue.",
    ],
    editorial: `Recursively swap each node's children: \`root.left, root.right = invert(root.right), invert(root.left)\`. Every node is touched once → O(n) time, O(h) stack. (Famously, the problem Homebrew's author couldn't whiteboard — so know it cold.)`,
    complexityTime: "O(n)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("neetcode invert binary tree"),
    tags: ["tree", "binary-tree", "dfs", "bfs"],
    starterCode: buildStarter("tree", "tree", "invertTree"),
    reference: (input) => {
      const root = parseTree(lines(input)[0]);
      const invert = (n: TNode | null): TNode | null => {
        if (!n) return null;
        const l = invert(n.left);
        n.left = invert(n.right);
        n.right = l;
        return n;
      };
      return treeOut(invert(root));
    },
    tests: [
      { input: "4 2 7 1 3 6 9", sample: true },
      { input: "2 1 3", sample: true },
      { input: "null", sample: true },
      { input: "1" },
      { input: "1 2 null 3" },
    ],
  },

  {
    slug: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "EASY",
    statement: `Return the maximum depth of a binary tree — the number of nodes on the longest root-to-leaf path.

**Input**: one line — the tree in level order, \`null\` for missing children.
**Output**: the depth (0 for an empty tree).`,
    constraints: `- 0 ≤ number of nodes ≤ 10^4`,
    examples: [
      { input: "3 9 20 null null 15 7", output: "3" },
      { input: "1 null 2", output: "2" },
    ],
    hints: [
      "depth(node) = 1 + max(depth(left), depth(right)).",
      "The empty tree has depth 0 — that's your base case.",
    ],
    editorial: `Pure structural recursion: an empty tree has depth 0; otherwise the depth is one more than the deeper subtree. This one-liner is the template for dozens of tree problems — compute something for each child, combine, add the current node's contribution. O(n) time, O(h) stack.`,
    complexityTime: "O(n)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("neetcode maximum depth of binary tree"),
    tags: ["tree", "binary-tree", "dfs", "recursion"],
    starterCode: buildStarter("tree", "int", "maxDepth"),
    reference: (input) => {
      const root = parseTree(lines(input)[0]);
      const depth = (n: TNode | null): number =>
        n ? 1 + Math.max(depth(n.left), depth(n.right)) : 0;
      return String(depth(root));
    },
    tests: [
      { input: "3 9 20 null null 15 7", sample: true },
      { input: "1 null 2", sample: true },
      { input: "null" },
      { input: "0" },
      { input: "1 2 3 4 5 6 7 8" },
    ],
  },

  {
    slug: "same-tree",
    title: "Same Tree",
    difficulty: "EASY",
    statement: `Given two binary trees \`p\` and \`q\`, return \`true\` if they are structurally identical with equal values.

**Input**
- Line 1: tree \`p\` in level order
- Line 2: tree \`q\` in level order

**Output**: \`true\` or \`false\`.`,
    constraints: `- 0 ≤ nodes ≤ 100 per tree`,
    examples: [
      { input: "1 2 3\n1 2 3", output: "true" },
      { input: "1 2\n1 null 2", output: "false" },
      { input: "1 2 1\n1 1 2", output: "false" },
    ],
    hints: [
      "Two empties are the same; empty vs non-empty is not.",
      "Recurse: values equal AND left subtrees same AND right subtrees same.",
    ],
    editorial: `Structural recursion over both trees simultaneously: both null → true; exactly one null or values differ → false; otherwise recurse on both child pairs. O(min(m, n)) time, O(h) stack.`,
    complexityTime: "O(n)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("same tree leetcode"),
    tags: ["tree", "binary-tree", "dfs"],
    starterCode: buildStarter("twoTrees", "bool", "isSameTree"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const same = (a: TNode | null, b: TNode | null): boolean => {
        if (!a && !b) return true;
        if (!a || !b || a.val !== b.val) return false;
        return same(a.left, b.left) && same(a.right, b.right);
      };
      return boolOut(same(parseTree(l0), parseTree(l1)));
    },
    tests: [
      { input: "1 2 3\n1 2 3", sample: true },
      { input: "1 2\n1 null 2", sample: true },
      { input: "1 2 1\n1 1 2", sample: true },
      { input: "null\nnull" },
      { input: "null\n0" },
    ],
  },

  {
    slug: "symmetric-tree",
    title: "Symmetric Tree",
    difficulty: "EASY",
    statement: `Return \`true\` if a binary tree is a mirror of itself around its center.

**Input**: one line — the tree in level order.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ nodes ≤ 1000`,
    examples: [
      { input: "1 2 2 3 4 4 3", output: "true" },
      { input: "1 2 2 null 3 null 3", output: "false" },
    ],
    hints: [
      "Symmetry is a property of two subtrees: left mirrors right.",
      "mirror(a, b) = values equal AND mirror(a.left, b.right) AND mirror(a.right, b.left).",
    ],
    editorial: `Define \`mirror(a, b)\`: both empty → true; one empty or values unequal → false; otherwise \`a.left\` must mirror \`b.right\` and \`a.right\` must mirror \`b.left\` (note the cross). The tree is symmetric iff \`mirror(root.left, root.right)\`. O(n) time, O(h) stack.`,
    complexityTime: "O(n)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("symmetric tree leetcode"),
    tags: ["tree", "binary-tree", "dfs", "bfs"],
    starterCode: buildStarter("tree", "bool", "isSymmetric"),
    reference: (input) => {
      const root = parseTree(lines(input)[0]);
      const mirror = (a: TNode | null, b: TNode | null): boolean => {
        if (!a && !b) return true;
        if (!a || !b || a.val !== b.val) return false;
        return mirror(a.left, b.right) && mirror(a.right, b.left);
      };
      return boolOut(!root || mirror(root.left, root.right));
    },
    tests: [
      { input: "1 2 2 3 4 4 3", sample: true },
      { input: "1 2 2 null 3 null 3", sample: true },
      { input: "1" },
      { input: "1 2 2 2 null 2" },
    ],
  },

  {
    slug: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    difficulty: "EASY",
    statement: `Return the **diameter** of a binary tree: the number of edges on the longest path between any two nodes (the path need not pass through the root).

**Input**: one line — the tree in level order.
**Output**: the diameter.`,
    constraints: `- 1 ≤ nodes ≤ 10^4`,
    examples: [
      { input: "1 2 3 4 5", output: "3", explanation: "Path 4 → 2 → 1 → 3 (3 edges)." },
      { input: "1 2", output: "1" },
    ],
    hints: [
      "The longest path through a node = height(left) + height(right).",
      "Compute heights recursively and update a global best at every node.",
    ],
    editorial: `While computing each node's height, the candidate diameter **through** that node is \`height(left) + height(right)\`. Track the maximum across all nodes during one post-order traversal. This "carry an answer alongside the recursion" trick generalizes to many tree problems. O(n) time, O(h) stack.`,
    complexityTime: "O(n)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("neetcode diameter of binary tree"),
    tags: ["tree", "binary-tree", "dfs"],
    starterCode: buildStarter("tree", "int", "diameterOfBinaryTree"),
    reference: (input) => {
      const root = parseTree(lines(input)[0]);
      let best = 0;
      const height = (n: TNode | null): number => {
        if (!n) return 0;
        const l = height(n.left);
        const r = height(n.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
      };
      height(root);
      return String(best);
    },
    tests: [
      { input: "1 2 3 4 5", sample: true },
      { input: "1 2", sample: true },
      { input: "1" },
      { input: "1 2 null 3 null 4 null" },
    ],
  },

  {
    slug: "path-sum",
    title: "Path Sum",
    difficulty: "EASY",
    statement: `Given a binary tree and an integer \`targetSum\`, return \`true\` if some **root-to-leaf** path sums to \`targetSum\`.

**Input**
- Line 1: the tree in level order
- Line 2: integer \`targetSum\`

**Output**: \`true\` or \`false\`.`,
    constraints: `- 0 ≤ nodes ≤ 5000
- -1000 ≤ values, targetSum ≤ 1000`,
    examples: [
      { input: "5 4 8 11 null 13 4 7 2 null null null 1\n22", output: "true", explanation: "5+4+11+2 = 22." },
      { input: "1 2 3\n5", output: "false" },
      { input: "null\n0", output: "false" },
    ],
    hints: [
      "Subtract the node's value as you descend.",
      "At a leaf, check whether the remaining target equals the leaf's value.",
    ],
    editorial: `Recurse with the remaining target: at each node subtract its value; at a **leaf**, the path works iff the remainder equals the leaf's value. Careful: a node with one child is not a leaf — don't accept early. O(n) time, O(h) stack.`,
    complexityTime: "O(n)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("path sum leetcode dfs"),
    tags: ["tree", "binary-tree", "dfs"],
    starterCode: buildStarter("treeK", "bool", "hasPathSum"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const root = parseTree(l0);
      const target = int(l1);
      const dfs = (n: TNode | null, rem: number): boolean => {
        if (!n) return false;
        rem -= n.val;
        if (!n.left && !n.right) return rem === 0;
        return dfs(n.left, rem) || dfs(n.right, rem);
      };
      return boolOut(dfs(root, target));
    },
    tests: [
      { input: "5 4 8 11 null 13 4 7 2 null null null 1\n22", sample: true },
      { input: "1 2 3\n5", sample: true },
      { input: "null\n0", sample: true },
      { input: "1 2\n1" },
      { input: "-2 null -3\n-5" },
    ],
  },

  {
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM",
    statement: `Return the level order traversal of a binary tree — node values level by level, left to right.

**Input**: one line — the tree in level order (with nulls).
**Output**: one line per level, values space-separated (nothing for an empty tree).`,
    constraints: `- 0 ≤ nodes ≤ 2000`,
    examples: [
      { input: "3 9 20 null null 15 7", output: "3\n9 20\n15 7" },
      { input: "1", output: "1" },
    ],
    hints: [
      "BFS with a queue; process one full level per outer loop iteration.",
      "Snapshot the queue length before the inner loop — that's the level size.",
    ],
    editorial: `Breadth-first search where each outer iteration drains exactly the nodes that were in the queue at its start (one level), collecting their values and enqueueing children. The level-size snapshot is the key detail separating this from plain BFS. O(n) time and space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode binary tree level order traversal"),
    tags: ["tree", "binary-tree", "bfs"],
    starterCode: buildStarter("tree", "intMatrix", "levelOrder"),
    reference: (input) => {
      const root = parseTree(lines(input)[0]);
      if (!root) return "";
      const rows: number[][] = [];
      let q: TNode[] = [root];
      while (q.length) {
        rows.push(q.map((n) => n.val));
        const next: TNode[] = [];
        for (const n of q) {
          if (n.left) next.push(n.left);
          if (n.right) next.push(n.right);
        }
        q = next;
      }
      return matOut(rows);
    },
    tests: [
      { input: "3 9 20 null null 15 7", sample: true },
      { input: "1", sample: true },
      { input: "null" },
      { input: "1 2 3 4 5 6 7" },
      { input: "1 null 2 null 3" },
    ],
  },

  {
    slug: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    difficulty: "MEDIUM",
    statement: `Determine whether a binary tree is a valid **binary search tree**: every node's left subtree contains only smaller values, its right subtree only larger values, and both subtrees are BSTs.

**Input**: one line — the tree in level order.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ nodes ≤ 10^4
- -2^31 ≤ values ≤ 2^31 − 1`,
    examples: [
      { input: "2 1 3", output: "true" },
      { input: "5 1 4 null null 3 6", output: "false", explanation: "3 sits in the right subtree of 5." },
    ],
    hints: [
      "Checking only parent vs children is not enough — the constraint is over whole subtrees.",
      "Pass down (min, max) bounds; each node must lie strictly inside them.",
      "Alternative: an in-order traversal of a BST is strictly increasing.",
    ],
    editorial: `Recurse with an allowed **open interval** \`(lo, hi)\` for each node: the root gets \`(−∞, +∞)\`; going left tightens \`hi\` to the node's value, going right tightens \`lo\`. A node violating its interval anywhere fails the whole tree. Equivalent alternative: verify the in-order sequence is strictly increasing. O(n) time, O(h) stack.`,
    approaches: [
      {
        name: "In-order traversal",
        complexityTime: "O(n)",
        complexitySpace: "O(h)",
        body: "A valid BST yields a strictly increasing in-order sequence; compare neighbors.",
      },
      {
        name: "Bounds propagation",
        complexityTime: "O(n)",
        complexitySpace: "O(h)",
        body: "Each child inherits a narrowed (min, max) window from its parent.",
      },
    ],
    complexityTime: "O(n)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("neetcode validate binary search tree"),
    tags: ["tree", "binary-search-tree", "dfs"],
    starterCode: buildStarter("tree", "bool", "isValidBST"),
    reference: (input) => {
      const root = parseTree(lines(input)[0]);
      const ok = (n: TNode | null, lo: number, hi: number): boolean => {
        if (!n) return true;
        if (n.val <= lo || n.val >= hi) return false;
        return ok(n.left, lo, n.val) && ok(n.right, n.val, hi);
      };
      return boolOut(ok(root, -Infinity, Infinity));
    },
    tests: [
      { input: "2 1 3", sample: true },
      { input: "5 1 4 null null 3 6", sample: true },
      { input: "1" },
      { input: "2 2 2" },
      { input: "10 5 15 null null 6 20" },
    ],
  },

  {
    slug: "lowest-common-ancestor-of-a-binary-search-tree",
    title: "Lowest Common Ancestor of a BST",
    difficulty: "MEDIUM",
    statement: `Given a **BST** and two values \`p\` and \`q\` that exist in it, return the value of their lowest common ancestor — the deepest node that has both among its descendants (a node may be its own descendant).

**Input**
- Line 1: the BST in level order
- Line 2: two integers \`p q\`

**Output**: the LCA node's value.`,
    constraints: `- 2 ≤ nodes ≤ 10^5
- All values distinct; p ≠ q; both present.`,
    examples: [
      { input: "6 2 8 0 4 7 9 null null 3 5\n2 8", output: "6" },
      { input: "6 2 8 0 4 7 9 null null 3 5\n2 4", output: "2", explanation: "An ancestor can be the node itself." },
    ],
    hints: [
      "Use the BST ordering — no generic LCA machinery needed.",
      "If both values are smaller than the current node, go left; both larger, go right; otherwise you've found it.",
    ],
    editorial: `Walk down from the root: if both targets are less than the current value, the LCA lies left; if both are greater, right; otherwise the paths to \`p\` and \`q\` **split here** (or one equals the current node) — this is the LCA. Iterative, O(h) time, O(1) space.`,
    complexityTime: "O(h)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode lowest common ancestor bst"),
    tags: ["tree", "binary-search-tree"],
    starterCode: buildStarter("treePQ", "int", "lowestCommonAncestor"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      let node = parseTree(l0);
      const [p, q] = ints(l1);
      while (node) {
        if (p < node.val && q < node.val) node = node.left;
        else if (p > node.val && q > node.val) node = node.right;
        else break;
      }
      return String(node!.val);
    },
    tests: [
      { input: "6 2 8 0 4 7 9 null null 3 5\n2 8", sample: true },
      { input: "6 2 8 0 4 7 9 null null 3 5\n2 4", sample: true },
      { input: "2 1\n2 1" },
      { input: "6 2 8 0 4 7 9 null null 3 5\n3 5" },
    ],
  },

  {
    slug: "binary-tree-right-side-view",
    title: "Binary Tree Right Side View",
    difficulty: "MEDIUM",
    statement: `Standing to the right of a binary tree, return the values you can see from top to bottom (the rightmost node of each level).

**Input**: one line — the tree in level order.
**Output**: the visible values, space-separated (nothing for an empty tree).`,
    constraints: `- 0 ≤ nodes ≤ 100`,
    examples: [
      { input: "1 2 3 null 5 null 4", output: "1 3 4" },
      { input: "1 null 3", output: "1 3" },
    ],
    hints: [
      "Level order traversal — keep the last node of each level.",
      "DFS alternative: visit right first and record the first node seen at each depth.",
    ],
    editorial: `BFS level by level and record each level's **last** value. Or DFS right-child-first, recording a value the first time each depth is reached. Both are O(n); BFS is the more direct fit for "per-level" questions.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode binary tree right side view"),
    tags: ["tree", "binary-tree", "bfs", "dfs"],
    starterCode: buildStarter("tree", "intArray", "rightSideView"),
    reference: (input) => {
      const root = parseTree(lines(input)[0]);
      if (!root) return "";
      const res: number[] = [];
      let q: TNode[] = [root];
      while (q.length) {
        res.push(q[q.length - 1].val);
        const next: TNode[] = [];
        for (const n of q) {
          if (n.left) next.push(n.left);
          if (n.right) next.push(n.right);
        }
        q = next;
      }
      return arrOut(res);
    },
    tests: [
      { input: "1 2 3 null 5 null 4", sample: true },
      { input: "1 null 3", sample: true },
      { input: "null" },
      { input: "1 2 3 4" },
    ],
  },

  {
    slug: "kth-smallest-element-in-a-bst",
    title: "Kth Smallest Element in a BST",
    difficulty: "MEDIUM",
    statement: `Given a BST and an integer \`k\`, return the k-th smallest value (1-indexed).

**Input**
- Line 1: the BST in level order
- Line 2: integer \`k\`

**Output**: the k-th smallest value.`,
    constraints: `- 1 ≤ k ≤ nodes ≤ 10^4`,
    examples: [
      { input: "3 1 4 null 2\n1", output: "1" },
      { input: "5 3 6 2 4 null null 1\n3", output: "3" },
    ],
    hints: [
      "In-order traversal of a BST visits values in sorted order.",
      "Stop the traversal as soon as you've visited k nodes.",
    ],
    editorial: `An **in-order traversal** (left, node, right) of a BST emits values in ascending order, so the k-th visited node is the answer. An explicit stack lets you stop early after k pops instead of materializing the whole sequence. O(h + k) time, O(h) space.`,
    complexityTime: "O(h + k)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("neetcode kth smallest element in a bst"),
    tags: ["tree", "binary-search-tree", "dfs"],
    starterCode: buildStarter("treeK", "int", "kthSmallest"),
    reference: (input) => {
      const [l0, l1] = lines(input);
      const root = parseTree(l0);
      const k = int(l1);
      const vals: number[] = [];
      const inorder = (n: TNode | null) => {
        if (!n) return;
        inorder(n.left);
        vals.push(n.val);
        inorder(n.right);
      };
      inorder(root);
      return String(vals[k - 1]);
    },
    tests: [
      { input: "3 1 4 null 2\n1", sample: true },
      { input: "5 3 6 2 4 null null 1\n3", sample: true },
      { input: "1\n1" },
      { input: "41 37 44 24 39 42 48 1 35 38 40 null 43 46 49\n10" },
    ],
  },

  {
    slug: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "HARD",
    statement: `A **path** is any sequence of adjacent nodes (each node used at most once) — it need not pass through the root or reach a leaf. Return the maximum possible sum of values along any non-empty path.

**Input**: one line — the tree in level order.
**Output**: the maximum path sum.`,
    constraints: `- 1 ≤ nodes ≤ 3·10^4
- -1000 ≤ values ≤ 1000`,
    examples: [
      { input: "1 2 3", output: "6", explanation: "2 → 1 → 3." },
      { input: "-10 9 20 null null 15 7", output: "42", explanation: "15 → 20 → 7." },
    ],
    hints: [
      "Distinguish two quantities per node: the best downward 'arm' vs the best path through the node.",
      "A path through a node = node + best left arm + best right arm (arms clamped at 0).",
      "Return only the single best arm upward — a parent can't use both.",
    ],
    editorial: `Post-order DFS computing each node's best **arm** — the max sum extending downward through one child, clamped at 0 (a negative arm is better dropped). The best path *through* a node is \`val + leftArm + rightArm\`; track the global maximum of that. Upward, return \`val + max(arms)\` because a parent's path can only continue through one side. O(n) time, O(h) stack.`,
    complexityTime: "O(n)",
    complexitySpace: "O(h)",
    youtubeUrl: yt("neetcode binary tree maximum path sum"),
    tags: ["tree", "binary-tree", "dfs", "dynamic-programming"],
    starterCode: buildStarter("tree", "int", "maxPathSum"),
    reference: (input) => {
      const root = parseTree(lines(input)[0]);
      let best = -Infinity;
      const arm = (n: TNode | null): number => {
        if (!n) return 0;
        const l = Math.max(0, arm(n.left));
        const r = Math.max(0, arm(n.right));
        best = Math.max(best, n.val + l + r);
        return n.val + Math.max(l, r);
      };
      arm(root);
      return String(best);
    },
    tests: [
      { input: "1 2 3", sample: true },
      { input: "-10 9 20 null null 15 7", sample: true },
      { input: "-3" },
      { input: "2 -1" },
      { input: "5 4 8 11 null 13 4 7 2 null null null 1" },
    ],
  },
];
