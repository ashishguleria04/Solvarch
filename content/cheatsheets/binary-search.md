---
title: Binary Search
description: The bulletproof template, boundary (first/last) searches, rotated arrays, and binary search on the answer space.
category: pattern
order: 13
premium: false
tags: [pattern, binary-search]
---

Halve a **monotonic** search space until one candidate remains. The input doesn't have to be a sorted array — any yes/no question that flips exactly once over an ordered domain is binary-searchable, including "is capacity c enough?".

## Recognize it

- Sorted (or rotated-sorted) array.
- "Minimum/maximum X such that condition(X)" where the condition is monotone in X.
- O(log n) demanded, or n up to 10⁹+.

## Templates

```python
# Exact match
def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target: return mid
        if nums[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1

# Lower bound — FIRST index where condition holds.
# This one template solves most "first/last occurrence" problems.
def lower_bound(lo, hi, ok):
    while lo < hi:
        mid = (lo + hi) // 2
        if ok(mid): hi = mid        # mid might be the answer — keep it
        else: lo = mid + 1          # mid is out — discard it
    return lo

# Binary search on the ANSWER
def min_feasible(lo, hi, feasible):
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid): hi = mid
        else: lo = mid + 1
    return lo
```

## Key variations

- **First/last position**: lower bound for first; for last, search first index of `> target` and subtract one — [Find First and Last Position](/dsa/find-first-and-last-position-of-element-in-sorted-array).
- **Rotated array**: one half is always sorted; decide which, check if target lies in it — [Search in Rotated Sorted Array](/dsa/search-in-rotated-sorted-array), [Find Minimum in Rotated Sorted Array](/dsa/find-minimum-in-rotated-sorted-array).
- **On the answer space**: domain = candidate answers, predicate = a greedy O(n) feasibility check — [Koko Eating Bananas](/dsa/koko-eating-bananas) (speed), [Capacity to Ship Packages](/dsa/capacity-to-ship-packages-within-d-days) (capacity).
- **2-D as 1-D**: treat an m×n sorted matrix as one array with `divmod` — [Search a 2D Matrix](/dsa/search-a-2d-matrix).
- **On structure**: peak finding compares `mid` with `mid+1` — [Peak Index in a Mountain Array](/dsa/peak-index-in-a-mountain-array).
- **Partition search**: [Median of Two Sorted Arrays](/dsa/median-of-two-sorted-arrays) binary-searches the cut position, not a value.

## Classic problems

- [Binary Search](/dsa/binary-search) · [Search Insert Position](/dsa/search-insert-position) · [Sqrt(x)](/dsa/sqrtx)
- [Search in Rotated Sorted Array](/dsa/search-in-rotated-sorted-array)
- [Koko Eating Bananas](/dsa/koko-eating-bananas) — answer-space template
- [Kth Smallest Element in a Sorted Matrix](/dsa/kth-smallest-element-in-a-sorted-matrix) — binary search on value + count
- [Median of Two Sorted Arrays](/dsa/median-of-two-sorted-arrays) — the classic hard

## Pitfalls

- Infinite loop: with `lo < hi` and `hi = mid`, `mid` must round **down**; if you ever use `lo = mid`, round up (`(lo+hi+1)//2`).
- Mixing templates mid-problem — pick exact-match or lower-bound and commit; rewriting under pressure is where bugs breed.
- Answer-space bounds: `lo` must be feasible-exclusive-safe (e.g. max element for Koko's lower bound? No — 1; but `hi` must be guaranteed feasible, e.g. max(piles)).
- Overflow in `(lo+hi)/2` matters in Java/C++ — write `lo + (hi - lo) / 2`.
- Verify with a 2-element array — it exposes almost every off-by-one.
