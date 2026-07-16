---
title: Greedy
description: When the locally best choice is globally safe — recognizing greedy problems and defending the choice out loud.
category: pattern
order: 23
premium: false
tags: [pattern, greedy]
---

Greedy = commit to the locally best choice and never look back. It's the fastest pattern when it works and confidently wrong when it doesn't — so in an interview, the algorithm is half the answer; the **exchange argument** ("swapping any other choice for mine never improves the result") is the other half.

## Recognize it

- "Maximum number of events you can attend / tasks you can finish."
- "Minimum jumps/refuels/moves to reach the end."
- Sorting one way makes each decision obvious and irreversible.
- A DP formulation exists but the constraint sizes demand O(n log n).

## Templates

```python
# Reach/coverage greedy (Jump Game)
def can_jump(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach: return False
        reach = max(reach, i + x)
    return True

# Level-up greedy (Jump Game II): expand a frontier like BFS
def min_jumps(nums):
    jumps = cur_end = far = 0
    for i in range(len(nums) - 1):
        far = max(far, i + nums[i])
        if i == cur_end:          # must jump now
            jumps += 1
            cur_end = far
    return jumps
```

## Canonical greedy arguments

- **Earliest deadline / earliest end first**: keeps maximum room for the rest — interval scheduling ([Non-overlapping Intervals](/dsa/non-overlapping-intervals), see [Intervals](/cheatsheets/intervals)).
- **Total ≥ 0 means a start exists, and failures skip whole prefixes**: [Gas Station](/dsa/gas-station) — when the tank dips negative at i, no station ≤ i can be the start.
- **Serve the cheapest satisfiable demand**: sort both sides — [Assign Cookies](/dsa/assign-cookies), [Boats to Save People](/dsa/boats-to-save-people) (pair heaviest with lightest).
- **Spend big bills first**: [Lemonade Change](/dsa/lemonade-change) — keep small denominations flexible.
- **Most frequent first with cooldown**: [Task Scheduler](/dsa/task-scheduler) — the count formula or a heap.
- **Consume in sorted order**: [Hand of Straights](/dsa/hand-of-straights) — smallest card must start a straight.
- **Range of possibilities instead of decisions**: track [lo, hi] of open parens — [Valid Parenthesis String](/dsa/valid-parenthesis-string).

## Classic problems

- [Jump Game](/dsa/jump-game) / [Jump Game II](/dsa/jump-game-ii)
- [Gas Station](/dsa/gas-station)
- [Best Time to Buy and Sell Stock II](/dsa/best-time-to-buy-and-sell-stock-ii) — take every uphill
- [Partition Labels](/dsa/partition-labels)
- [Task Scheduler](/dsa/task-scheduler)
- [Remove K Digits](/dsa/remove-k-digits) — greedy with a stack

## Pitfalls

- Asserting greedy without an argument — if you can't sketch why local ⇒ global, suspect DP.
- Sorting by the wrong key: interval scheduling by start instead of end is the textbook failure.
- Greedy on knapsack-style value problems is wrong (that's DP); greedy works for *fractional* knapsack only.
- Test greedy against a brute force on small inputs when unsure — a 30-second mental check that catches most false greedies.
