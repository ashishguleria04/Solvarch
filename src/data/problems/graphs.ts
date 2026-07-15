import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, arrOut, yt, lines, matOut } from "../ref-utils";

const parseGrid = (input: string): { grid: number[][]; rest: string[] } => {
  const ls = lines(input);
  const [r] = ints(ls[0]);
  const grid: number[][] = [];
  for (let i = 0; i < r; i++) grid.push(ints(ls[1 + i]));
  return { grid, rest: ls.slice(1 + r) };
};

const parseEdges = (input: string): { n: number; edges: number[][]; rest: string[] } => {
  const ls = lines(input);
  const [n, m] = ints(ls[0]);
  const edges: number[][] = [];
  for (let i = 0; i < m; i++) edges.push(ints(ls[1 + i]));
  return { n, edges, rest: ls.slice(1 + m) };
};

export const graphs: SeedProblem[] = [
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "MEDIUM",
    statement: `Given an \`r × c\` grid of \`1\` (land) and \`0\` (water), count the islands — groups of land connected horizontally or vertically.

**Input**
- Line 1: two integers \`r c\`
- Next r lines: the grid rows (space-separated 0/1)

**Output**: the number of islands.`,
    constraints: `- 1 ≤ r, c ≤ 300`,
    examples: [
      { input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", output: "1" },
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3" },
    ],
    hints: [
      "Every unvisited land cell starts a new island.",
      "Flood-fill (DFS or BFS) marks the whole island so it's counted once.",
    ],
    editorial: `Scan the grid; each time you find un-visited land, increment the count and **flood fill** from it (DFS/BFS through 4-directional neighbors), sinking the island by marking cells visited. Every cell is visited a constant number of times → O(r·c). This is *the* template for connected-component-in-grid problems.`,
    complexityTime: "O(r·c)",
    complexitySpace: "O(r·c)",
    youtubeUrl: yt("neetcode number of islands"),
    tags: ["graph", "bfs", "dfs", "matrix", "union-find"],
    starterCode: buildStarter("matrix", "int", "numIslands"),
    reference: (input) => {
      const { grid } = parseGrid(input);
      const r = grid.length;
      const c = grid[0].length;
      let count = 0;
      const sink = (i: number, j: number) => {
        if (i < 0 || j < 0 || i >= r || j >= c || grid[i][j] !== 1) return;
        grid[i][j] = 0;
        sink(i + 1, j);
        sink(i - 1, j);
        sink(i, j + 1);
        sink(i, j - 1);
      };
      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          if (grid[i][j] === 1) {
            count++;
            sink(i, j);
          }
        }
      }
      return String(count);
    },
    tests: [
      { input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", sample: true },
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", sample: true },
      { input: "1 1\n0" },
      { input: "1 3\n1 0 1" },
      { input: "3 3\n1 0 1\n0 1 0\n1 0 1" },
    ],
  },

  {
    slug: "max-area-of-island",
    title: "Max Area of Island",
    difficulty: "MEDIUM",
    statement: `Given a 0/1 grid, return the area (cell count) of the largest island, or \`0\` if there is no land. Islands connect 4-directionally.

**Input**
- Line 1: \`r c\`
- Next r lines: the grid rows

**Output**: the maximum island area.`,
    constraints: `- 1 ≤ r, c ≤ 50`,
    examples: [
      {
        input: "4 5\n0 1 0 0 1\n1 1 0 1 1\n0 0 0 1 1\n0 0 0 0 0",
        output: "5",
        explanation: "The right-side island has 5 cells.",
      },
      { input: "1 1\n0", output: "0" },
    ],
    hints: [
      "Same flood fill as Number of Islands, but return the size of each fill.",
      "DFS returns 1 + sum of its four neighbor fills.",
    ],
    editorial: `Flood fill each island, but make the DFS **return the area**: 0 for water/out-of-bounds, else 1 plus the four recursive neighbor areas, marking cells as visited on entry. Track the max over all starts. O(r·c) time.`,
    complexityTime: "O(r·c)",
    complexitySpace: "O(r·c)",
    youtubeUrl: yt("max area of island neetcode"),
    tags: ["graph", "dfs", "bfs", "matrix"],
    starterCode: buildStarter("matrix", "int", "maxAreaOfIsland"),
    reference: (input) => {
      const { grid } = parseGrid(input);
      const r = grid.length;
      const c = grid[0].length;
      const area = (i: number, j: number): number => {
        if (i < 0 || j < 0 || i >= r || j >= c || grid[i][j] !== 1) return 0;
        grid[i][j] = 0;
        return 1 + area(i + 1, j) + area(i - 1, j) + area(i, j + 1) + area(i, j - 1);
      };
      let best = 0;
      for (let i = 0; i < r; i++)
        for (let j = 0; j < c; j++) best = Math.max(best, area(i, j));
      return String(best);
    },
    tests: [
      { input: "4 5\n0 1 0 0 1\n1 1 0 1 1\n0 0 0 1 1\n0 0 0 0 0", sample: true },
      { input: "1 1\n0", sample: true },
      { input: "2 2\n1 1\n1 1" },
      { input: "3 3\n1 0 0\n0 1 0\n0 0 1" },
    ],
  },

  {
    slug: "flood-fill",
    title: "Flood Fill",
    difficulty: "EASY",
    statement: `Given an image as an integer grid, a start pixel \`(sr, sc)\`, and a new \`color\`, flood-fill: recolor the start pixel and every 4-directionally connected pixel sharing its original color. Return the resulting image.

**Input**
- Line 1: \`r c\`
- Next r lines: the image rows
- Last line: three integers \`sr sc color\`

**Output**: the filled image, one row per line.`,
    constraints: `- 1 ≤ r, c ≤ 50
- 0 ≤ colors ≤ 2^16`,
    examples: [
      {
        input: "3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2",
        output: "2 2 2\n2 2 0\n2 0 1",
        explanation: "The bottom-right 1 is not 4-connected to the start.",
      },
      { input: "2 2\n0 0\n0 0\n0 0 0", output: "0 0\n0 0" },
    ],
    hints: [
      "Standard DFS/BFS from the start pixel over same-colored neighbors.",
      "If the new color equals the old color, return immediately — otherwise you'll loop forever.",
    ],
    editorial: `Record the start pixel's original color and DFS/BFS outward, recoloring matching neighbors. The one classic trap: when \`color\` equals the original, the naive recursion never terminates — bail out early. O(r·c) time.`,
    complexityTime: "O(r·c)",
    complexitySpace: "O(r·c)",
    youtubeUrl: yt("flood fill leetcode dfs"),
    tags: ["graph", "dfs", "bfs", "matrix"],
    starterCode: buildStarter("matrixK", "intMatrix", "floodFill"),
    reference: (input) => {
      const { grid, rest } = parseGrid(input);
      const [sr, sc, color] = ints(rest[0]);
      const old = grid[sr][sc];
      if (old !== color) {
        const r = grid.length;
        const c = grid[0].length;
        const fill = (i: number, j: number) => {
          if (i < 0 || j < 0 || i >= r || j >= c || grid[i][j] !== old) return;
          grid[i][j] = color;
          fill(i + 1, j);
          fill(i - 1, j);
          fill(i, j + 1);
          fill(i, j - 1);
        };
        fill(sr, sc);
      }
      return matOut(grid);
    },
    tests: [
      { input: "3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2", sample: true },
      { input: "2 2\n0 0\n0 0\n0 0 0", sample: true },
      { input: "1 1\n5\n0 0 9" },
      { input: "2 3\n1 2 1\n2 1 2\n0 1 7" },
    ],
  },

  {
    slug: "rotting-oranges",
    title: "Rotting Oranges",
    difficulty: "MEDIUM",
    statement: `In a grid, \`0\` is empty, \`1\` is a fresh orange, \`2\` is rotten. Every minute, fresh oranges 4-adjacent to a rotten one rot. Return the minutes until no fresh orange remains, or \`-1\` if that never happens.

**Input**
- Line 1: \`r c\`
- Next r lines: the grid rows

**Output**: minutes, or -1.`,
    constraints: `- 1 ≤ r, c ≤ 10`,
    examples: [
      { input: "3 3\n2 1 1\n1 1 0\n0 1 1", output: "4" },
      { input: "3 3\n2 1 1\n0 1 1\n1 0 1", output: "-1", explanation: "The bottom-left orange is unreachable." },
      { input: "1 3\n0 2 0", output: "0" },
    ],
    hints: [
      "Rot spreads simultaneously from every rotten orange — that's multi-source BFS.",
      "Seed the queue with all initially rotten oranges; each BFS layer is one minute.",
      "Count fresh oranges up front to detect the impossible case.",
    ],
    editorial: `**Multi-source BFS**: enqueue every initially rotten orange at time 0 and expand layer by layer; each layer is one simultaneous minute. Track the fresh count — if any remain after the queue drains, return -1, else the time of the last rot. O(r·c) time. Single-source BFS from each rotten orange overcounts time; simultaneity is the crux.`,
    complexityTime: "O(r·c)",
    complexitySpace: "O(r·c)",
    youtubeUrl: yt("neetcode rotting oranges"),
    tags: ["graph", "bfs", "matrix"],
    starterCode: buildStarter("matrix", "int", "orangesRotting"),
    reference: (input) => {
      const { grid } = parseGrid(input);
      const r = grid.length;
      const c = grid[0].length;
      let fresh = 0;
      let q: Array<[number, number]> = [];
      for (let i = 0; i < r; i++)
        for (let j = 0; j < c; j++) {
          if (grid[i][j] === 1) fresh++;
          else if (grid[i][j] === 2) q.push([i, j]);
        }
      let minutes = 0;
      while (q.length && fresh > 0) {
        const next: Array<[number, number]> = [];
        for (const [i, j] of q) {
          for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && nj >= 0 && ni < r && nj < c && grid[ni][nj] === 1) {
              grid[ni][nj] = 2;
              fresh--;
              next.push([ni, nj]);
            }
          }
        }
        q = next;
        minutes++;
      }
      return String(fresh === 0 ? minutes : -1);
    },
    tests: [
      { input: "3 3\n2 1 1\n1 1 0\n0 1 1", sample: true },
      { input: "3 3\n2 1 1\n0 1 1\n1 0 1", sample: true },
      { input: "1 3\n0 2 0", sample: true },
      { input: "1 1\n1" },
      { input: "2 2\n2 2\n2 2" },
    ],
  },

  {
    slug: "walls-and-gates",
    title: "Walls and Gates",
    difficulty: "MEDIUM",
    statement: `You are given a grid where \`-1\` is a wall, \`0\` is a gate, and \`2147483647\` (INF) is an empty room. Fill each empty room with the distance to its **nearest gate** (leave INF if unreachable). Return the grid.

**Input**
- Line 1: \`r c\`
- Next r lines: the grid rows

**Output**: the filled grid, one row per line.`,
    constraints: `- 1 ≤ r, c ≤ 250`,
    examples: [
      {
        input: "4 4\n2147483647 -1 0 2147483647\n2147483647 2147483647 2147483647 -1\n2147483647 -1 2147483647 -1\n0 -1 2147483647 2147483647",
        output: "3 -1 0 1\n2 2 1 -1\n1 -1 2 -1\n0 -1 3 4",
      },
      { input: "1 2\n-1 0", output: "-1 0" },
    ],
    hints: [
      "BFS from every room to its nearest gate is O((r·c)²).",
      "Flip it: BFS **from all gates at once** — first arrival is the nearest gate.",
    ],
    editorial: `Multi-source BFS seeded with **every gate simultaneously**. Expanding layer by layer, the first time a room is reached is necessarily its shortest gate distance, so each cell is written once. O(r·c) total — versus quadratic if you BFS from each room separately.`,
    complexityTime: "O(r·c)",
    complexitySpace: "O(r·c)",
    youtubeUrl: yt("walls and gates multi source bfs"),
    tags: ["graph", "bfs", "matrix"],
    starterCode: buildStarter("matrix", "intMatrix", "wallsAndGates"),
    reference: (input) => {
      const { grid } = parseGrid(input);
      const r = grid.length;
      const c = grid[0].length;
      const INF = 2147483647;
      let q: Array<[number, number]> = [];
      for (let i = 0; i < r; i++)
        for (let j = 0; j < c; j++) if (grid[i][j] === 0) q.push([i, j]);
      let dist = 0;
      while (q.length) {
        dist++;
        const next: Array<[number, number]> = [];
        for (const [i, j] of q) {
          for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && nj >= 0 && ni < r && nj < c && grid[ni][nj] === INF) {
              grid[ni][nj] = dist;
              next.push([ni, nj]);
            }
          }
        }
        q = next;
      }
      return matOut(grid);
    },
    tests: [
      {
        input: "4 4\n2147483647 -1 0 2147483647\n2147483647 2147483647 2147483647 -1\n2147483647 -1 2147483647 -1\n0 -1 2147483647 2147483647",
        sample: true,
      },
      { input: "1 2\n-1 0", sample: true },
      { input: "1 1\n2147483647" },
      { input: "2 2\n0 2147483647\n2147483647 2147483647" },
    ],
  },

  {
    slug: "course-schedule",
    title: "Course Schedule",
    difficulty: "MEDIUM",
    statement: `There are \`n\` courses labeled \`0 … n−1\`. Each prerequisite pair \`a b\` means you must take course \`b\` before course \`a\`. Return \`true\` if all courses can be finished.

**Input**
- Line 1: two integers \`n m\` (courses, prerequisite pairs)
- Next m lines: \`a b\`

**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ n ≤ 2000
- 0 ≤ m ≤ 5000`,
    examples: [
      { input: "2 1\n1 0", output: "true", explanation: "Take 0, then 1." },
      { input: "2 2\n1 0\n0 1", output: "false", explanation: "Circular dependency." },
    ],
    hints: [
      "The question is: does the prerequisite graph contain a cycle?",
      "Kahn's algorithm: repeatedly remove nodes with indegree 0.",
      "If you can't remove all n nodes, a cycle blocks the rest.",
    ],
    editorial: `Model courses as a directed graph (edge b → a). All courses are finishable iff the graph is a **DAG**. Kahn's algorithm: compute indegrees, repeatedly dequeue indegree-0 nodes and decrement their neighbors. If the processed count reaches n, no cycle exists. DFS coloring (white/gray/black) detects cycles equally well. O(V + E).`,
    approaches: [
      {
        name: "DFS cycle detection",
        complexityTime: "O(V + E)",
        complexitySpace: "O(V)",
        body: "Gray nodes on the current path; hitting a gray node means a cycle.",
      },
      {
        name: "Kahn's topological sort",
        complexityTime: "O(V + E)",
        complexitySpace: "O(V)",
        body: "Peel indegree-0 vertices; a full peel means acyclic.",
      },
    ],
    complexityTime: "O(V + E)",
    complexitySpace: "O(V + E)",
    youtubeUrl: yt("neetcode course schedule"),
    tags: ["graph", "topological-sort", "bfs", "dfs"],
    starterCode: buildStarter("nEdges", "bool", "canFinish"),
    reference: (input) => {
      const { n, edges } = parseEdges(input);
      const adj: number[][] = Array.from({ length: n }, () => []);
      const indeg = new Array(n).fill(0);
      for (const [a, b] of edges) {
        adj[b].push(a);
        indeg[a]++;
      }
      const q: number[] = [];
      for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
      let seen = 0;
      while (q.length) {
        const u = q.shift()!;
        seen++;
        for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
      }
      return boolOut(seen === n);
    },
    tests: [
      { input: "2 1\n1 0", sample: true },
      { input: "2 2\n1 0\n0 1", sample: true },
      { input: "1 0" },
      { input: "4 3\n1 0\n2 1\n3 2" },
      { input: "3 3\n0 1\n1 2\n2 0" },
    ],
  },

  {
    slug: "course-schedule-ii",
    title: "Course Schedule II",
    difficulty: "MEDIUM",
    statement: `Same setup as Course Schedule: \`n\` courses and prerequisite pairs \`a b\` (take \`b\` before \`a\`). Return a valid order to take all courses; among valid orders return the **lexicographically smallest**. If impossible, print \`-1\`.

**Input**
- Line 1: \`n m\`
- Next m lines: \`a b\`

**Output**: the order, space-separated — or -1.`,
    constraints: `- 1 ≤ n ≤ 2000
- 0 ≤ m ≤ 5000`,
    examples: [
      { input: "2 1\n1 0", output: "0 1" },
      { input: "4 4\n1 0\n2 0\n3 1\n3 2", output: "0 1 2 3" },
      { input: "2 2\n1 0\n0 1", output: "-1" },
    ],
    hints: [
      "Kahn's algorithm produces a topological order as it peels.",
      "For the lexicographically smallest order, always peel the smallest available course — use a min-heap instead of a queue.",
    ],
    editorial: `Kahn's algorithm emits a valid topological order directly. To make the answer deterministic and lexicographically smallest, replace the FIFO queue with a **min-heap**: always process the smallest indegree-0 course available. If the emitted order is shorter than n, a cycle makes it impossible. O((V + E) log V) with the heap.`,
    complexityTime: "O((V + E) log V)",
    complexitySpace: "O(V + E)",
    youtubeUrl: yt("course schedule ii topological sort"),
    tags: ["graph", "topological-sort", "heap"],
    starterCode: buildStarter("nEdges", "intArray", "findOrder"),
    reference: (input) => {
      const { n, edges } = parseEdges(input);
      const adj: number[][] = Array.from({ length: n }, () => []);
      const indeg = new Array(n).fill(0);
      for (const [a, b] of edges) {
        adj[b].push(a);
        indeg[a]++;
      }
      const avail: number[] = [];
      for (let i = 0; i < n; i++) if (indeg[i] === 0) avail.push(i);
      const order: number[] = [];
      while (avail.length) {
        avail.sort((a, b) => a - b);
        const u = avail.shift()!;
        order.push(u);
        for (const v of adj[u]) if (--indeg[v] === 0) avail.push(v);
      }
      return order.length === n ? arrOut(order) : "-1";
    },
    tests: [
      { input: "2 1\n1 0", sample: true },
      { input: "4 4\n1 0\n2 0\n3 1\n3 2", sample: true },
      { input: "2 2\n1 0\n0 1", sample: true },
      { input: "1 0" },
      { input: "3 2\n0 2\n1 2" },
    ],
  },

  {
    slug: "graph-valid-tree",
    title: "Graph Valid Tree",
    difficulty: "MEDIUM",
    statement: `Given \`n\` nodes labeled \`0 … n−1\` and a list of undirected edges, return \`true\` if the edges form a valid tree: connected and acyclic.

**Input**
- Line 1: \`n m\`
- Next m lines: \`u v\`

**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ n ≤ 2000
- 0 ≤ m ≤ 5000; no duplicate edges.`,
    examples: [
      { input: "5 4\n0 1\n0 2\n0 3\n1 4", output: "true" },
      { input: "5 5\n0 1\n1 2\n2 3\n1 3\n1 4", output: "false", explanation: "1-2-3 forms a cycle." },
    ],
    hints: [
      "A tree on n nodes has exactly n − 1 edges.",
      "n − 1 edges + connected ⟺ tree. Check connectivity with BFS/DFS or union-find.",
    ],
    editorial: `Use the counting fact: a graph is a tree iff it has exactly **n − 1 edges** and is **connected** (either condition alone is insufficient). Check the edge count, then one BFS/DFS (or union-find, where any merge of two already-joined nodes signals a cycle) confirms connectivity. O(V + E).`,
    complexityTime: "O(V + E)",
    complexitySpace: "O(V)",
    youtubeUrl: yt("graph valid tree union find"),
    tags: ["graph", "union-find", "bfs", "dfs"],
    starterCode: buildStarter("nEdges", "bool", "validTree"),
    reference: (input) => {
      const { n, edges } = parseEdges(input);
      if (edges.length !== n - 1) return boolOut(false);
      const parent = Array.from({ length: n }, (_, i) => i);
      const find = (x: number): number => {
        while (parent[x] !== x) {
          parent[x] = parent[parent[x]];
          x = parent[x];
        }
        return x;
      };
      for (const [u, v] of edges) {
        const ru = find(u);
        const rv = find(v);
        if (ru === rv) return boolOut(false);
        parent[ru] = rv;
      }
      return boolOut(true);
    },
    tests: [
      { input: "5 4\n0 1\n0 2\n0 3\n1 4", sample: true },
      { input: "5 5\n0 1\n1 2\n2 3\n1 3\n1 4", sample: true },
      { input: "1 0" },
      { input: "4 2\n0 1\n2 3" },
      { input: "2 1\n0 1" },
    ],
  },

  {
    slug: "number-of-connected-components-in-an-undirected-graph",
    title: "Number of Connected Components in an Undirected Graph",
    difficulty: "MEDIUM",
    statement: `Given \`n\` nodes and a list of undirected edges, return the number of connected components.

**Input**
- Line 1: \`n m\`
- Next m lines: \`u v\`

**Output**: the component count.`,
    constraints: `- 1 ≤ n ≤ 2000
- 0 ≤ m ≤ 5000`,
    examples: [
      { input: "5 3\n0 1\n1 2\n3 4", output: "2" },
      { input: "5 4\n0 1\n1 2\n2 3\n3 4", output: "1" },
    ],
    hints: [
      "Start with n components; each edge that joins two different groups reduces the count by one.",
      "Union-find with path compression makes each union nearly O(1).",
    ],
    editorial: `**Union-find**: initialize n singleton components; for each edge, union its endpoints and decrement the count when the union actually merges two distinct roots. Path compression + union by size gives near-constant amortized operations → O(E α(V)). BFS/DFS counting works equally well at O(V + E).`,
    complexityTime: "O(E α(V))",
    complexitySpace: "O(V)",
    youtubeUrl: yt("number of connected components union find"),
    tags: ["graph", "union-find", "bfs", "dfs"],
    starterCode: buildStarter("nEdges", "int", "countComponents"),
    reference: (input) => {
      const { n, edges } = parseEdges(input);
      const parent = Array.from({ length: n }, (_, i) => i);
      const find = (x: number): number => {
        while (parent[x] !== x) {
          parent[x] = parent[parent[x]];
          x = parent[x];
        }
        return x;
      };
      let count = n;
      for (const [u, v] of edges) {
        const ru = find(u);
        const rv = find(v);
        if (ru !== rv) {
          parent[ru] = rv;
          count--;
        }
      }
      return String(count);
    },
    tests: [
      { input: "5 3\n0 1\n1 2\n3 4", sample: true },
      { input: "5 4\n0 1\n1 2\n2 3\n3 4", sample: true },
      { input: "3 0" },
      { input: "1 0" },
      { input: "4 4\n0 1\n1 2\n2 0\n0 3" },
    ],
  },

  {
    slug: "redundant-connection",
    title: "Redundant Connection",
    difficulty: "MEDIUM",
    statement: `A tree with \`n\` nodes (labeled 1…n) had exactly one extra undirected edge added. Given the resulting edge list, return the edge that can be removed to restore a tree. If several qualify, return the one appearing **last** in the input.

**Input**
- Line 1: \`n n\` (the graph has exactly n edges)
- Next n lines: \`u v\`

**Output**: the edge \`u v\`.`,
    constraints: `- 3 ≤ n ≤ 1000
- The input is a tree plus one extra edge.`,
    examples: [
      { input: "3 3\n1 2\n1 3\n2 3", output: "2 3" },
      { input: "5 5\n1 2\n2 3\n3 4\n1 4\n1 5", output: "1 4" },
    ],
    hints: [
      "Process edges in order, unioning endpoints.",
      "The first edge whose endpoints are already connected closes the cycle — and it's the last-in-input edge on that cycle.",
    ],
    editorial: `Feed edges into **union-find** in input order. The moment an edge's endpoints already share a root, that edge closes the cycle — and because every earlier cycle edge merged successfully, it is precisely the last cycle edge in input order, satisfying the tie-break for free. O(n α(n)).`,
    complexityTime: "O(n α(n))",
    complexitySpace: "O(n)",
    youtubeUrl: yt("redundant connection union find"),
    tags: ["graph", "union-find"],
    starterCode: buildStarter("nEdges", "intArray", "findRedundantConnection"),
    reference: (input) => {
      const { n, edges } = parseEdges(input);
      const parent = Array.from({ length: n + 1 }, (_, i) => i);
      const find = (x: number): number => {
        while (parent[x] !== x) {
          parent[x] = parent[parent[x]];
          x = parent[x];
        }
        return x;
      };
      for (const [u, v] of edges) {
        const ru = find(u);
        const rv = find(v);
        if (ru === rv) return `${u} ${v}`;
        parent[ru] = rv;
      }
      return "";
    },
    tests: [
      { input: "3 3\n1 2\n1 3\n2 3", sample: true },
      { input: "5 5\n1 2\n2 3\n3 4\n1 4\n1 5", sample: true },
      { input: "4 4\n1 2\n3 4\n2 3\n1 4" },
      { input: "3 3\n2 3\n1 2\n1 3" },
    ],
  },

  {
    slug: "network-delay-time",
    title: "Network Delay Time",
    difficulty: "MEDIUM",
    statement: `A network has \`n\` nodes (1…n) and directed edges \`u v w\` meaning a signal takes \`w\` time to travel u → v. A signal starts at node \`k\`. Return the time for **all** nodes to receive it, or \`-1\` if some node never does.

**Input**
- Line 1: \`n m\`
- Next m lines: \`u v w\`
- Last line: the start node \`k\`

**Output**: the total time, or -1.`,
    constraints: `- 1 ≤ n ≤ 100
- 1 ≤ m ≤ 6000
- 1 ≤ w ≤ 100`,
    examples: [
      { input: "4 3\n2 1 1\n2 3 1\n3 4 1\n2", output: "2" },
      { input: "2 1\n1 2 1\n1", output: "1" },
      { input: "2 1\n1 2 1\n2", output: "-1" },
    ],
    hints: [
      "You need shortest paths from one source with non-negative weights.",
      "Dijkstra with a min-heap; the answer is the largest shortest-path distance.",
      "Any unreachable node forces -1.",
    ],
    editorial: `Single-source shortest paths with non-negative weights → **Dijkstra**. Run it from \`k\` with a min-heap; the answer is the maximum distance over all nodes (the last one to hear the signal), or -1 if any distance stays infinite. O(E log V).`,
    complexityTime: "O(E log V)",
    complexitySpace: "O(V + E)",
    youtubeUrl: yt("network delay time dijkstra"),
    tags: ["graph", "dijkstra", "shortest-path", "heap"],
    starterCode: buildStarter("nEdgesQ", "int", "networkDelayTime"),
    reference: (input) => {
      const { n, edges, rest } = parseEdges(input);
      const k = int(rest[0]);
      const adj: Array<Array<[number, number]>> = Array.from({ length: n + 1 }, () => []);
      for (const [u, v, w] of edges) adj[u].push([v, w]);
      const dist = new Array(n + 1).fill(Infinity);
      dist[k] = 0;
      const visited = new Array(n + 1).fill(false);
      for (let iter = 0; iter < n; iter++) {
        let u = -1;
        for (let i = 1; i <= n; i++)
          if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
        if (u === -1 || dist[u] === Infinity) break;
        visited[u] = true;
        for (const [v, w] of adj[u])
          if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
      }
      let best = 0;
      for (let i = 1; i <= n; i++) best = Math.max(best, dist[i]);
      return String(best === Infinity ? -1 : best);
    },
    tests: [
      { input: "4 3\n2 1 1\n2 3 1\n3 4 1\n2", sample: true },
      { input: "2 1\n1 2 1\n1", sample: true },
      { input: "2 1\n1 2 1\n2", sample: true },
      { input: "1 0\n1" },
      { input: "3 3\n1 2 1\n2 3 2\n1 3 4\n1" },
    ],
  },

  {
    slug: "cheapest-flights-within-k-stops",
    title: "Cheapest Flights Within K Stops",
    difficulty: "MEDIUM",
    statement: `There are \`n\` cities (0…n−1) and directed flights \`u v w\` (from u to v costing w). Find the cheapest price from \`src\` to \`dst\` using **at most k stops** (i.e. at most k intermediate cities), or \`-1\` if impossible.

**Input**
- Line 1: \`n m\`
- Next m lines: \`u v w\`
- Last line: three integers \`src dst k\`

**Output**: the cheapest price, or -1.`,
    constraints: `- 1 ≤ n ≤ 100
- 0 ≤ k < n
- 1 ≤ w ≤ 10^4`,
    examples: [
      { input: "4 5\n0 1 100\n1 2 100\n2 0 100\n1 3 600\n2 3 200\n0 3 1", output: "700", explanation: "0→1→3; the cheaper 0→1→2→3 needs 2 stops." },
      { input: "3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 1", output: "200" },
      { input: "3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 0", output: "500" },
    ],
    hints: [
      "Plain Dijkstra ignores the stop limit — it can lock in a cheap path that uses too many hops.",
      "Bellman-Ford naturally bounds path length: k+1 relaxation rounds allow at most k stops.",
      "Relax from a snapshot of the previous round's distances so one round adds at most one edge per path.",
    ],
    editorial: `**Bellman-Ford, bounded**: run exactly \`k + 1\` relaxation rounds (a path with k stops has k+1 edges), each round relaxing all edges against a **copy** of the previous round's distances — the copy prevents multi-edge propagation inside a single round. Final \`dist[dst]\` (or -1) answers it. O(k · E).`,
    complexityTime: "O(k · E)",
    complexitySpace: "O(V)",
    youtubeUrl: yt("neetcode cheapest flights within k stops"),
    tags: ["graph", "bellman-ford", "shortest-path", "dynamic-programming"],
    starterCode: buildStarter("nEdgesQ", "int", "findCheapestPrice"),
    reference: (input) => {
      const { n, edges, rest } = parseEdges(input);
      const [src, dst, k] = ints(rest[0]);
      let dist = new Array(n).fill(Infinity);
      dist[src] = 0;
      for (let round = 0; round <= k; round++) {
        const next = [...dist];
        for (const [u, v, w] of edges) {
          if (dist[u] !== Infinity && dist[u] + w < next[v]) next[v] = dist[u] + w;
        }
        dist = next;
      }
      return String(dist[dst] === Infinity ? -1 : dist[dst]);
    },
    tests: [
      { input: "4 5\n0 1 100\n1 2 100\n2 0 100\n1 3 600\n2 3 200\n0 3 1", sample: true },
      { input: "3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 1", sample: true },
      { input: "3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 0", sample: true },
      { input: "2 1\n1 0 5\n0 1 0" },
      { input: "5 6\n0 1 5\n1 2 5\n0 3 2\n3 1 2\n1 4 1\n4 2 1\n0 2 2" },
    ],
  },

  {
    slug: "min-cost-to-connect-all-points",
    title: "Min Cost to Connect All Points",
    difficulty: "MEDIUM",
    statement: `You are given points on a 2D plane. The cost to connect two points is their **Manhattan distance** |x₁−x₂| + |y₁−y₂|. Return the minimum total cost to make all points connected (directly or indirectly) — i.e., the weight of a minimum spanning tree.

**Input**
- Line 1: \`n 2\` — the number of points and the coordinate count
- Next n lines: \`x y\` for each point

**Output**: the minimum total cost.`,
    constraints: `- 1 ≤ n ≤ 1000
- -10^6 ≤ coordinates ≤ 10^6
- All points distinct.`,
    examples: [
      {
        input: "5 2\n0 0\n2 2\n3 10\n5 2\n7 0",
        output: "20",
        explanation: "Edges (0,0)-(2,2), (2,2)-(5,2), (5,2)-(7,0), (2,2)-(3,10) cost 4+3+4+9.",
      },
      { input: "3 2\n3 12\n-2 5\n-4 1", output: "18" },
    ],
    hints: [
      "Connecting everything at minimum cost with no cycles worth paying for = minimum spanning tree.",
      "The graph is complete (n² edges) — Kruskal must sort them all; Prim without a heap is O(n²) and needs no edge list at all.",
      "Prim on dense graphs: keep dist[v] = cheapest link from the growing tree to v; each round, absorb the closest outsider and relax.",
    ],
    editorial: `The graph is *complete* — every pair of points is an edge — which flips the usual advice: Kruskal pays O(n² log n) to sort half a million edges, while **array-based Prim** runs O(n²) with O(n) memory and never materializes an edge list. Maintain \`dist[v]\`: the cheapest Manhattan edge from the current tree to each outside point. Each of n rounds picks the closest outsider, adds its distance to the total, and relaxes every remaining point against the newcomer. For n = 1000 that's a million distance computations — instant. The interview lesson: heap-Prim (O(E log V)) is for sparse graphs; on dense ones the humble O(n²) scan wins. Union-Find Kruskal remains the right call the moment edges are given explicitly and sparsely.`,
    approaches: [
      {
        name: "Prim, O(n²) array version",
        complexityTime: "O(n²)",
        complexitySpace: "O(n)",
        body: "dist[] relaxation against each absorbed point; no edge list, no heap.",
      },
      {
        name: "Kruskal + Union-Find",
        complexityTime: "O(n² log n)",
        complexitySpace: "O(n²)",
        body: "Generate all pair edges, sort, union until n−1 accepted. Fine, but dominated here.",
      },
    ],
    complexityTime: "O(n²)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode min cost to connect all points"),
    tags: ["graph", "minimum-spanning-tree", "prim"],
    starterCode: buildStarter("matrix", "int", "minCostConnectPoints"),
    reference: (input) => {
      const ls = lines(input);
      const [n] = ints(ls[0]);
      const pts: number[][] = [];
      for (let i = 0; i < n; i++) pts.push(ints(ls[1 + i]));
      const dist = new Array(n).fill(Infinity);
      const used = new Array(n).fill(false);
      dist[0] = 0;
      let total = 0;
      for (let round = 0; round < n; round++) {
        let u = -1;
        for (let v = 0; v < n; v++) {
          if (!used[v] && (u === -1 || dist[v] < dist[u])) u = v;
        }
        used[u] = true;
        total += dist[u];
        for (let v = 0; v < n; v++) {
          if (!used[v]) {
            const d =
              Math.abs(pts[u][0] - pts[v][0]) + Math.abs(pts[u][1] - pts[v][1]);
            if (d < dist[v]) dist[v] = d;
          }
        }
      }
      return String(total);
    },
    tests: [
      { input: "5 2\n0 0\n2 2\n3 10\n5 2\n7 0", sample: true },
      { input: "3 2\n3 12\n-2 5\n-4 1", sample: true },
      { input: "1 2\n0 0" },
      { input: "2 2\n-1000000 -1000000\n1000000 1000000" },
      { input: "4 2\n0 0\n0 1\n1 0\n1 1" },
    ],
  },
];
