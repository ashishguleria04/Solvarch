---
title: Graphs
description: BFS, DFS, topological sort, union-find, Dijkstra — and how to pick between them in ten seconds.
category: pattern
order: 21
premium: false
tags: [pattern, graphs, bfs, dfs]
---

Four tools solve nearly every interview graph problem. Pick by question type:

| Question | Tool |
| --- | --- |
| Reachability, regions, flood fill | DFS or BFS (either) |
| **Shortest path, unweighted** / "minimum steps" | **BFS** (only BFS) |
| Ordering with prerequisites, cycle in a DAG | Topological sort |
| Connectivity/components under merging edges | Union-Find |
| Shortest path, weighted non-negative | Dijkstra |
| Minimum spanning tree | Prim / Kruskal |

## Templates

```python
from collections import deque, defaultdict

# BFS — shortest path in an unweighted graph/grid
def bfs(start, neighbors):
    dist = {start: 0}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in neighbors(u):
            if v not in dist:            # mark ON ENQUEUE
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

# Topological sort (Kahn's) — cycle iff processed < n
def topo(n, edges):
    adj, indeg = defaultdict(list), [0] * n
    for a, b in edges:
        adj[b].append(a); indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order if len(order) == n else None

# Union-Find with path compression + union by size
class DSU:
    def __init__(self, n):
        self.p, self.size = list(range(n)), [1] * n
    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.size[ra] < self.size[rb]: ra, rb = rb, ra
        self.p[rb] = ra; self.size[ra] += self.size[rb]
        return True
```

## Key variations

- **Grids are graphs**: neighbors = 4 directions; mark visited by mutating the grid or a set — [Number of Islands](/dsa/number-of-islands), [Max Area of Island](/dsa/max-area-of-island), [Flood Fill](/dsa/flood-fill).
- **Multi-source BFS**: seed the queue with *all* sources at distance 0 — [Rotting Oranges](/dsa/rotting-oranges), [Walls and Gates](/dsa/walls-and-gates).
- **Cycle detection**: directed → topo sort or DFS with 3 colors ([Course Schedule](/dsa/course-schedule)); undirected → union-find, cycle when union returns False ([Redundant Connection](/dsa/redundant-connection)).
- **Valid tree** = connected + exactly n−1 edges — [Graph Valid Tree](/dsa/graph-valid-tree).
- **Dijkstra** = BFS with a min-heap keyed by distance — [Network Delay Time](/dsa/network-delay-time); with a hop limit, relax ≤ k rounds instead — [Cheapest Flights Within K Stops](/dsa/cheapest-flights-within-k-stops).
- **MST**: sort edges + union-find (Kruskal) — [Min Cost to Connect All Points](/dsa/min-cost-to-connect-all-points).

## Classic problems

- [Number of Islands](/dsa/number-of-islands) — the grid staple
- [Rotting Oranges](/dsa/rotting-oranges) — multi-source BFS with levels
- [Course Schedule](/dsa/course-schedule) / [Course Schedule II](/dsa/course-schedule-ii) — topo sort
- [Number of Connected Components](/dsa/number-of-connected-components-in-an-undirected-graph) — union-find warm-up
- [Network Delay Time](/dsa/network-delay-time) — Dijkstra

## Pitfalls

- BFS: mark visited **when enqueuing**, not when dequeuing — otherwise nodes enter the queue multiple times.
- DFS recursion on a 300×300 grid can overflow Python's stack — know the iterative version.
- Directed cycle detection needs the "in current path" state, not just "visited".
- Dijkstra: skip stale heap entries (`if d > dist[u]: continue`); never use it with negative weights.
- Building the adjacency list backwards for prerequisite problems — decide edge direction first.
