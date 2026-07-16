---
title: Big-O Complexity
description: Common complexities, data-structure operation costs, and how to read constraints to guess the intended solution.
category: reference
order: 1
premium: false
tags: [reference, complexity]
---

Complexity questions are guaranteed in every round: "what's the complexity?" after you code, and "can you do better?" before. This sheet is the lookup table.

## The ladder

| Complexity | Name | Feel at n = 10⁶ |
| --- | --- | --- |
| O(1) | constant | instant |
| O(log n) | logarithmic | ~20 steps |
| O(n) | linear | 10⁶ steps |
| O(n log n) | linearithmic | ~2×10⁷ — fine |
| O(n²) | quadratic | 10¹² — **too slow** |
| O(2ⁿ) | exponential | dead past n ≈ 25 |
| O(n!) | factorial | dead past n ≈ 11 |

## Read the constraints → guess the target

The constraint block tells you the intended complexity before you write a line:

| n up to | Intended complexity | Typical approach |
| --- | --- | --- |
| 10–20 | O(2ⁿ) or O(n!) | backtracking, bitmask DP |
| ~100 | O(n³) | DP over pairs, Floyd–Warshall |
| ~1,000 | O(n²) | 2-D DP, nested loops |
| ~10⁵–10⁶ | O(n log n) or O(n) | sort, heap, two pointers, sliding window, hash map |
| ~10⁹+ | O(log n) or O(1) | binary search, math |

## Data-structure operation costs

| Structure | Access | Search | Insert | Delete |
| --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) | O(n) |
| Sorted array | O(1) | O(log n) | O(n) | O(n) |
| Hash map / set | — | O(1) avg | O(1) avg | O(1) avg |
| Linked list | O(n) | O(n) | O(1)* | O(1)* |
| Binary heap | O(1) top | O(n) | O(log n) | O(log n) top |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) |
| Trie | — | O(L) | O(L) | O(L) |

\* given a reference to the node; finding it is O(n). L = key length.

## Sorting

- Comparison sorts bottom out at **O(n log n)** — merge sort (stable, O(n) extra), heap sort (in place), quicksort (O(n²) worst case, fast in practice).
- **Counting/bucket/radix** beat it when keys are small integers or fixed-width — that's the trick behind O(n) answers to [Top K Frequent Elements](/dsa/top-k-frequent-elements) and [Sort Characters by Frequency](/dsa/sort-characters-by-frequency).

## Rules of thumb when stating complexity

- State **time and space separately**, and say what n (and m) refer to.
- Recursion: complexity = number of nodes in the call tree × work per node; don't forget **O(depth) stack space**.
- Amortized is a real answer: appending to a dynamic array is O(1) amortized; each element enters and leaves a monotonic stack once, so the loop is O(n) total.
- Hash map worst case is O(n) per op — mention it, then move on with "expected O(1)".

## Pitfalls

- String concatenation in a loop is O(n²) in most languages — collect parts and join.
- `list.pop(0)` / `shift()` are O(n); use a deque.
- Slicing (`s[i:j]`) copies — inside a loop that's hidden quadratic cost.
- "We sort first" means the total can never be reported below O(n log n).
