---
title: Two Pointers
description: Converging, parallel, and fast/slow pointers — O(n) scans that replace nested loops on sorted or structured data.
category: pattern
order: 11
premium: false
tags: [pattern, arrays, pointers]
---

Two indices moving with purpose. The invariant that makes it correct: every move **permanently discards** part of the search space, so you never revisit — that's what turns O(n²) into O(n).

## Recognize it

- Input is **sorted** (or sortable) and you need a pair/triplet with some sum property.
- Compare/process from **both ends** (palindromes, container walls).
- **In-place** compaction or partitioning (remove/dedupe/move zeroes) — slow pointer writes, fast pointer reads.
- Linked list without random access → fast/slow pointers (see [Linked Lists](/cheatsheets/linked-lists)).

## Templates

```python
# Converging (sorted pair sum)
def pair_sum(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target: return [lo, hi]
        if s < target: lo += 1     # smallest useful move
        else: hi -= 1
    return []

# Reader/writer (in-place compaction)
def remove_dupes(nums):
    write = 0
    for read in range(len(nums)):
        if read == 0 or nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    return write
```

## Key variations

- **Sort first, then converge**: [3Sum](/dsa/3sum) fixes one element, runs pair-sum on the rest; skip duplicates at every level.
- **Greedy wall movement**: [Container With Most Water](/dsa/container-with-most-water) — always move the shorter wall; moving the taller one can only lose.
- **Both ends inward with checks**: [Valid Palindrome](/dsa/valid-palindrome); with one allowed deletion, branch once into two sub-checks ([Valid Palindrome II](/dsa/valid-palindrome-ii)).
- **Two arrays, merge-style**: [Merge Sorted Arrays](/dsa/merge-sorted-arrays) — walk from the **back** to overwrite safely in place.
- **Partitioning**: [Sort Colors](/dsa/sort-colors) — three regions, one pass (Dutch national flag).

## Classic problems

- [Two Sum II](/dsa/two-sum-ii-input-array-is-sorted) — the converging template
- [3Sum](/dsa/3sum) / [3Sum Closest](/dsa/3sum-closest) — fix one + converge
- [Container With Most Water](/dsa/container-with-most-water)
- [Trapping Rain Water](/dsa/trapping-rain-water) — two pointers with running maxes
- [Valid Palindrome](/dsa/valid-palindrome) / [Valid Palindrome II](/dsa/valid-palindrome-ii)
- [Remove Duplicates from Sorted Array](/dsa/remove-duplicates-from-sorted-array) — reader/writer
- [Move Zeroes](/dsa/move-zeroes) — reader/writer, stable
- [Sort Colors](/dsa/sort-colors) — partitioning
- [Boats to Save People](/dsa/boats-to-save-people) — sort + converge, greedy pairing

## Pitfalls

- On unsorted input, converging pointers are simply wrong — sort first or use a hash map.
- Duplicate handling in 3Sum: skip repeats of the fixed element *and* of both pointers after a hit.
- `lo < hi` vs `lo <= hi`: converging pair problems want `<` (a pair needs two distinct indices).
- When asked for **indices** on unsorted input, sorting destroys them — hash map instead, or sort (value, index) pairs.
