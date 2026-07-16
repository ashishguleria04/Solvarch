---
title: Dynamic Programming
description: State, transition, base case — the five DP families and a recipe for deriving each from brute force.
category: pattern
order: 22
premium: false
tags: [pattern, dynamic-programming]
---

DP = recursion + not repeating yourself. Every DP has three parts: a **state** (what uniquely describes a subproblem), a **transition** (state from smaller states), and **base cases**. Derive it from brute force — "what choices do I have at each step, and what do I need to remember?"

## Recognize it

- "**Number of ways** to …", "**minimum/maximum** cost to reach …".
- Choices at each step with **overlapping** subproblems (naive recursion recomputes).
- Subsequence (non-contiguous) problems on strings/arrays.
- "Can you partition/segment/decode …?"

## The recipe

1. Write the brute-force recursion.
2. Identify the arguments that change → that's the state.
3. Memoize it (`@lru_cache`). Correct? Now it's already O(states × transition).
4. Optionally convert to a table, then compress rows if only the previous row is read.

```python
# 1-D: min cost climbing (only prev two matter -> O(1) space)
def min_cost(cost):
    a = b = 0                      # best to reach step i-2, i-1
    for c in cost:
        a, b = b, min(a, b) + c
    return min(a, b)

# 2-D on two strings: LCS
def lcs(s, t):
    dp = [[0] * (len(t) + 1) for _ in range(len(s) + 1)]
    for i in range(1, len(s) + 1):
        for j in range(1, len(t) + 1):
            dp[i][j] = (dp[i-1][j-1] + 1 if s[i-1] == t[j-1]
                        else max(dp[i-1][j], dp[i][j-1]))
    return dp[-1][-1]

# Unbounded knapsack: coin change (min coins)
def coin_change(coins, amount):
    dp = [0] + [float("inf")] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1
```

## The five families

| Family | State | Problems |
| --- | --- | --- |
| Linear (1-D) | `dp[i]` = best using first i | [Climbing Stairs](/dsa/climbing-stairs), [House Robber](/dsa/house-robber), [Word Break](/dsa/word-break), [Decode Ways](/dsa/decode-ways) |
| Grid paths | `dp[r][c]` from top/left | [Unique Paths](/dsa/unique-paths), [Minimum Path Sum](/dsa/minimum-path-sum) |
| Two sequences | `dp[i][j]` over prefixes | [Longest Common Subsequence](/dsa/longest-common-subsequence), [Edit Distance](/dsa/edit-distance) |
| Knapsack | `dp[amount]` / `dp[i][cap]` | [Coin Change](/dsa/coin-change), [Partition Equal Subset Sum](/dsa/partition-equal-subset-sum), [Target Sum](/dsa/target-sum) |
| Interval / substring | `dp[i][j]` over ranges | [Longest Palindromic Substring](/dsa/longest-palindromic-substring), [Longest Palindromic Subsequence](/dsa/longest-palindromic-subsequence) |

## Key variations

- **Circular constraint**: run linear DP twice (with/without first element) — [House Robber II](/dsa/house-robber-ii).
- **Track two values**: max product needs the running **min** too (negatives flip) — [Maximum Product Subarray](/dsa/maximum-product-subarray).
- **0/1 vs unbounded knapsack**: 0/1 iterates capacity **downward** (each item once); unbounded iterates upward. Loop order is the correctness.
- **Combinations vs permutations of ways**: coins-outer counts combinations; amount-outer counts ordered sequences. Know which the problem wants.
- **LIS in O(n log n)**: patience sorting with binary search — [Longest Increasing Subsequence](/dsa/longest-increasing-subsequence).

## Pitfalls

- State too small (missing a dimension the answer depends on) — symptoms: right answer on examples, wrong on hidden tests.
- Base cases: `dp[0] = 1` ("one way to make zero") powers most counting DPs; get it wrong and everything shifts.
- Iterating knapsack capacity in the wrong direction silently double-counts items.
- Recursion + memo hits Python's stack limit around 10⁴ depth — convert hot paths to tables.
- Don't stop at the memoized version if the interviewer asks for space optimization — most 2-D tables compress to two rows.
