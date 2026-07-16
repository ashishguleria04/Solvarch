---
title: Backtracking
description: The choose–explore–unchoose template for subsets, permutations, combinations, and constraint search.
category: pattern
order: 20
premium: false
tags: [pattern, backtracking, recursion]
---

Backtracking is DFS over a **decision tree**: at each step, try every valid choice, recurse, then undo. Use it when the problem asks to **enumerate** all solutions (not count them — that's usually DP) and n is small (≤ ~20; check [Big-O](/cheatsheets/big-o)).

## Recognize it

- "Return **all** subsets / permutations / combinations / partitions."
- "Generate all valid …" with structural constraints (parentheses, queens).
- Small n in the constraints is the giveaway.

## Template

```python
def backtrack_template(candidates):
    out, path = [], []

    def bt(start):
        if is_solution(path):
            out.append(path[:])        # COPY the path
            # return here only if solutions can't extend further
        for i in range(start, len(candidates)):
            if not valid(candidates[i]): continue   # prune
            path.append(candidates[i])              # choose
            bt(i + 1)                               # explore
            path.pop()                              # unchoose
    bt(0)
    return out
```

The three lines choose/explore/unchoose are the whole pattern; everything else is deciding **what a "choice" is** and **how to prune**.

## The four canonical shapes

| Shape | Recursion detail | Problem |
| --- | --- | --- |
| Subsets | each element: in or out; record every node | [Subsets](/dsa/subsets) |
| Combinations (reuse ok) | `bt(i)` not `bt(i+1)` to allow reuse | [Combination Sum](/dsa/combination-sum) |
| Permutations | loop over *unused* elements each level | [Permutations](/dsa/permutations) |
| Constraint search | prune aggressively per row/step | [N-Queens II](/dsa/n-queens-ii) |

## Key variations

- **Duplicates in input**: sort, then skip `candidates[i] == candidates[i-1]` when `i > start` — [Subsets II](/dsa/subsets-ii), [Combination Sum II](/dsa/combination-sum-ii).
- **String partitioning**: choice = where to cut next; prune non-palindromes — [Palindrome Partitioning](/dsa/palindrome-partitioning).
- **Mapping digits to letters**: choice per digit — [Letter Combinations of a Phone Number](/dsa/letter-combinations-of-a-phone-number).
- **Structural validity counters**: track `open`/`close` and only add valid chars — [Generate Parentheses](/dsa/generate-parentheses).
- **Sets for O(1) conflict checks**: N-Queens tracks columns and both diagonal families (`r-c`, `r+c`).

## Classic problems

- [Subsets](/dsa/subsets) / [Subsets II](/dsa/subsets-ii)
- [Permutations](/dsa/permutations)
- [Combination Sum](/dsa/combination-sum) / [Combination Sum II](/dsa/combination-sum-ii)
- [Generate Parentheses](/dsa/generate-parentheses)
- [Palindrome Partitioning](/dsa/palindrome-partitioning)
- [N-Queens II](/dsa/n-queens-ii)
- [Target Sum](/dsa/target-sum) — enumerate signs; note the DP speedup when only counting

## Pitfalls

- Appending `path` instead of `path[:]` — every recorded answer mutates into the same (empty) list. The #1 backtracking bug.
- Missing the `i > start` guard when deduping — it skips *genuinely different* solutions.
- Forgetting to undo state that isn't `path` (visited sets, counters) — undo **everything** you changed.
- Pruning too late: check validity before recursing, not at the leaf; that's the difference between "passes" and "times out".
