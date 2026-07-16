---
title: Sliding Window
description: Fixed and variable windows over strings and arrays — longest/shortest substring problems in O(n).
category: pattern
order: 12
premium: false
tags: [pattern, strings, arrays]
---

A window `[left, right]` slides over the input; a small state (count map, sum) describes the window and is updated **incrementally** instead of recomputed. Works when the property is monotone: shrinking a bad window can make it good, growing a good window keeps the answer candidates flowing.

## Recognize it

- "Longest/shortest **substring/subarray** such that …" — contiguous is the keyword.
- "Contains at most k distinct / at most k changes / sum ≥ target."
- Fixed window size k: "average/max of every window of size k", "anagram of p in s".

## Templates

```python
# Variable window — LONGEST window satisfying a constraint
def longest(s):
    state = {}          # e.g. char counts
    left = best = 0
    for right, c in enumerate(s):
        add(state, c)
        while invalid(state):        # shrink until valid again
            remove(state, s[left])
            left += 1
        best = max(best, right - left + 1)
    return best

# Variable window — SHORTEST window satisfying a constraint
def shortest(s):
    left, best = 0, float("inf")
    for right, c in enumerate(s):
        add(state, c)
        while satisfied(state):      # shrink while still valid
            best = min(best, right - left + 1)
            remove(state, s[left])
            left += 1
    return best
```

The two shapes differ only in **when you record the answer**: longest records outside the shrink loop, shortest records inside it.

## Key variations

- **Fixed size k**: add `s[i]`, remove `s[i-k]`, record every step — [Maximum Average Subarray I](/dsa/maximum-average-subarray-i), [Permutation in String](/dsa/permutation-in-string), [Find All Anagrams](/dsa/find-all-anagrams-in-a-string).
- **Counting trick**: "window is valid if `len - max_freq <= k`" — [Longest Repeating Character Replacement](/dsa/longest-repeating-character-replacement).
- **Need/have matching**: track how many required chars are fully matched — [Minimum Window Substring](/dsa/minimum-window-substring).
- **At most k zeros/deletions**: count violations, shrink when count > k — [Max Consecutive Ones III](/dsa/max-consecutive-ones-iii), [Longest Subarray of 1's After Deleting One Element](/dsa/longest-subarray-of-1s-after-deleting-one-element).
- **Products/sums with positives**: shrink while product ≥ k — [Subarray Product Less Than K](/dsa/subarray-product-less-than-k); each step adds `right - left + 1` subarrays.
- **Window max in O(1)**: pair the window with a monotonic deque — [Sliding Window Maximum](/dsa/sliding-window-maximum).

## Classic problems

- [Longest Substring Without Repeating Characters](/dsa/longest-substring-without-repeating-characters)
- [Minimum Size Subarray Sum](/dsa/minimum-size-subarray-sum) — shortest-window shape
- [Minimum Window Substring](/dsa/minimum-window-substring) — the boss fight
- [Fruit Into Baskets](/dsa/fruit-into-baskets) — at most 2 distinct
- [Sliding Window Maximum](/dsa/sliding-window-maximum) — deque hybrid

## Pitfalls

- Negative numbers break sum-based shrinking (the "shrink makes it smaller" monotonicity dies) — reach for prefix sums + hash map instead.
- Recomputing window state from scratch per step: that's O(n·k) — the whole point is incremental update.
- Deleting a zero-count key matters when you check `len(counts)` for distinct-count windows.
- Off-by-one: window length is `right - left + 1` with inclusive bounds — pick a convention and never mix.
