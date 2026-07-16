---
title: Arrays & Hashing
description: Hash maps, sets, prefix sums, and frequency counting — the pattern behind a third of all easy/medium problems.
category: pattern
order: 10
premium: false
tags: [pattern, arrays, hash-map]
---

The core move: trade O(n) lookup for O(1) by remembering what you've seen in a hash map or set. If the brute force is "for each element, scan for another element", hashing almost always deletes the inner loop.

## Recognize it

- "Find a **pair/complement**" — store what you still need, keyed by value.
- "Has this **appeared before**?" — a set.
- "**Count** occurrences / group equals" — a frequency map, often with a canonical key.
- "Sum of a **range**" asked many times — prefix sums.

## Templates

```python
# Complement lookup (Two Sum)
def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i

# Grouping by canonical key (Group Anagrams)
from collections import defaultdict
def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        groups[tuple(sorted(s))].append(s)   # or a 26-count tuple
    return list(groups.values())

# Prefix sums: sum(i..j) = pre[j+1] - pre[i]
pre = [0]
for x in nums:
    pre.append(pre[-1] + x)
```

## Key variations

- **Canonical keys**: sorted string or letter-count tuple for anagrams; normalized fraction for slopes; `tuple(diffs)` for shifted strings.
- **Prefix sum + hash map**: "count subarrays with sum k" stores counts of prefix values seen so far — the subarray version of Two Sum.
- **Index math instead of hashing**: when values are bounded by n, the array itself is the hash table ([First Missing Positive](/dsa/first-missing-positive) marks in place).
- **Set for O(n) sequence scan**: [Longest Consecutive Sequence](/dsa/longest-consecutive-sequence) — only start counting at `x` when `x-1` is absent.
- **Running best while scanning**: Kadane ([Maximum Subarray](/dsa/maximum-subarray)), single-pass min-so-far ([Best Time to Buy and Sell Stock](/dsa/best-time-to-buy-and-sell-stock)).

## Classic problems

- [Two Sum](/dsa/two-sum) — the template itself
- [Contains Duplicate](/dsa/contains-duplicate) — set membership
- [Valid Anagram](/dsa/valid-anagram) — frequency map
- [Group Anagrams](/dsa/group-anagrams) — canonical key grouping
- [Top K Frequent Elements](/dsa/top-k-frequent-elements) — count, then bucket
- [Product of Array Except Self](/dsa/product-of-array-except-self) — prefix/suffix products
- [Longest Consecutive Sequence](/dsa/longest-consecutive-sequence) — set + smart start
- [Majority Element](/dsa/majority-element) — counting, or Boyer–Moore for O(1) space
- [First Missing Positive](/dsa/first-missing-positive) — array-as-hash-table

## Pitfalls

- Inserting before checking in Two Sum — you'll match an element with itself.
- Mutable keys: lists can't be dict keys; convert to `tuple`.
- Prefix-sum off-by-one: define `pre[0] = 0` and `pre[i]` = sum of first i elements, then range sums never need special cases.
- "O(1) average" hash ops — say it, and know a sort-based fallback if asked about adversarial inputs.
