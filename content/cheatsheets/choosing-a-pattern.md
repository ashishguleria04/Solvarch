---
title: Choosing a Pattern
description: A decision guide — map the phrases in a problem statement to the pattern that solves it.
category: reference
order: 2
premium: false
tags: [reference, patterns]
---

Most interview problems are a known pattern wearing a costume. Before coding, match the statement against these cues — saying "this smells like X because Y" out loud is exactly what interviewers want to hear.

## Cue → pattern

| The problem says… | Reach for | Sheet |
| --- | --- | --- |
| "pair/triplet that sums to…", "have you seen this before?" | Hash map | [Arrays & Hashing](/cheatsheets/arrays-hashing) |
| **Sorted** array, pair from both ends, in-place dedupe | Two pointers | [Two Pointers](/cheatsheets/two-pointers) |
| "longest/shortest **substring/subarray** with property P" | Sliding window | [Sliding Window](/cheatsheets/sliding-window) |
| Sorted anything, "minimum X such that…", answer is monotonic | Binary search | [Binary Search](/cheatsheets/binary-search) |
| Matching brackets, undo/nesting, "next greater element" | Stack / monotonic stack | [Stacks](/cheatsheets/stacks-monotonic) |
| Reverse/reorder a list, cycle detection, k-th from end | Linked-list pointers | [Linked Lists](/cheatsheets/linked-lists) |
| Anything on a binary tree | DFS recursion or BFS levels | [Binary Trees](/cheatsheets/binary-trees) |
| Prefix matching, autocomplete, word dictionary | Trie | [Tries](/cheatsheets/tries) |
| "k largest/smallest/closest/most frequent", running median | Heap | [Heaps & Top-K](/cheatsheets/heaps-top-k) |
| Ranges with start/end, "merge", "overlap", meeting times | Intervals | [Intervals](/cheatsheets/intervals) |
| "All combinations/permutations/ways to…" (n ≤ ~20) | Backtracking | [Backtracking](/cheatsheets/backtracking) |
| Grid regions, connectivity, prerequisites/dependencies | Graph BFS/DFS, topo sort, union-find | [Graphs](/cheatsheets/graphs) |
| "Number of ways", "min cost to reach", choices with overlap | Dynamic programming | [Dynamic Programming](/cheatsheets/dynamic-programming) |
| "Maximum you can schedule/keep", local choice feels safe | Greedy (prove it!) | [Greedy](/cheatsheets/greedy) |
| XOR, "appears once", powers of two, count bits | Bit manipulation | [Bit Manipulation](/cheatsheets/bit-manipulation) |

## Tie-breakers

- **Substring vs subsequence**: contiguous → sliding window / two pointers; non-contiguous → DP.
- **"All ways" vs "how many ways"**: enumerate them → backtracking; just count → DP.
- **Top-k vs k-th**: keep a stream of answers → heap of size k; single k-th once → quickselect or heap.
- **Graph shortest path**: unweighted → BFS; weighted non-negative → Dijkstra ([Network Delay Time](/dsa/network-delay-time)); ≤ k hops → Bellman-Ford style relaxation ([Cheapest Flights](/dsa/cheapest-flights-within-k-stops)).
- **Sorted input is a gift** — it usually means two pointers or binary search; if you're not using the sortedness, you're probably missing the intended solution.

## When you're stuck

1. Restate inputs/outputs and solve a tiny example by hand — the manual process often *is* the algorithm.
2. Say the brute force and its complexity. Then ask: what work is repeated? (→ DP/memo) What information would make each step O(1)? (→ hash map, stack, heap)
3. Sort the input mentally — does the problem get easier? 
4. Check the constraints table in [Big-O Complexity](/cheatsheets/big-o) — the size of n narrows the pattern to two or three candidates.
