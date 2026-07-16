---
title: Heaps & Top-K
description: Size-k heaps, two-heap medians, and when bucket sort or quickselect beats the heap.
category: pattern
order: 18
premium: false
tags: [pattern, heaps, top-k]
---

A heap gives O(1) access to the extreme element and O(log n) insert/remove. The signature interview move: keep a heap of size **k**, so the answer to "k largest" sits at the top after one O(n log k) pass.

## Recognize it

- "**k** largest/smallest/closest/most frequent."
- "Continuous stream — return the median / k-th largest so far."
- Repeatedly "take the two biggest / merge the two smallest" (simulation).
- Merging several sorted sequences.

## Templates

```python
import heapq

# k LARGEST -> keep a MIN-heap of size k (the gatekeeper is the smallest kept)
def k_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h            # h[0] is the k-th largest

# Two heaps — running median
class Median:
    def __init__(self):
        self.lo = []    # max-heap (negated): smaller half
        self.hi = []    # min-heap: larger half
    def add(self, x):
        heapq.heappush(self.lo, -x)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))
    def median(self):
        if len(self.lo) > len(self.hi): return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2
```

Python's `heapq` is a min-heap only — negate values (or use tuples) for max-heap behavior.

## Key variations

- **Direction flip**: k largest → min-heap of k; k smallest → max-heap of k. Getting this backwards is the most common heap bug.
- **Heap of composite keys**: `(dist, x, y)` for [K Closest Points](/dsa/k-closest-points-to-origin); `(count, word)` for frequency problems.
- **Merge k sorted lists**: heap of (value, list-index, node); pop, push successor — [Merge K Sorted Lists](/dsa/merge-k-sorted-lists).
- **Simulation**: pop two, push the result — [Last Stone Weight](/dsa/last-stone-weight); greedy scheduling with cooldowns — [Task Scheduler](/dsa/task-scheduler).
- **Class wrapper**: [Kth Largest Element in a Stream](/dsa/kth-largest-element-in-a-stream) is exactly the size-k template as an object.
- **Know the alternatives**: frequencies bounded by n → **bucket sort** gives O(n) ([Top K Frequent Elements](/dsa/top-k-frequent-elements)); a single k-th value with no stream → **quickselect** averages O(n) ([Kth Largest Element in an Array](/dsa/kth-largest-element-in-an-array)); sorted matrix → binary search on value ([Kth Smallest in a Sorted Matrix](/dsa/kth-smallest-element-in-a-sorted-matrix)).

## Classic problems

- [Kth Largest Element in an Array](/dsa/kth-largest-element-in-an-array) — heap vs quickselect discussion
- [Top K Frequent Elements](/dsa/top-k-frequent-elements) — heap vs bucket discussion
- [K Closest Points to Origin](/dsa/k-closest-points-to-origin)
- [Find Median from Data Stream](/dsa/find-median-from-data-stream) — two heaps
- [Merge K Sorted Lists](/dsa/merge-k-sorted-lists)
- [Task Scheduler](/dsa/task-scheduler)

## Pitfalls

- Building a heap of all n items when size-k suffices — O(n log n) instead of O(n log k); interviewers notice.
- Two-heap median: rebalance after **every** insert; sizes may differ by at most 1.
- Tuples with unorderable tie-breakers (e.g. comparing objects) crash Python's heap — add an index as the second element.
- `heapify` is O(n) — use it when you already have the array.
