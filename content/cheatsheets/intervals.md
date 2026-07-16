---
title: Intervals
description: Sort-then-sweep — merging, inserting, and scheduling ranges without off-by-one wounds.
category: pattern
order: 19
premium: false
tags: [pattern, intervals, sorting]
---

Interval problems are 90% one idea: **sort by start (or end), sweep once, compare each interval with the last one kept**. The remaining 10% is being careful about what "overlap" means at the boundary.

## Recognize it

- Input is pairs `[start, end]`: meetings, bookings, ranges.
- "Merge", "insert", "overlap", "minimum removals", "maximum you can attend".
- "How many at once?" → sweep over start/end events.

## Templates

```python
# Merge — sort by START
def merge(intervals):
    intervals.sort()
    out = []
    for s, e in intervals:
        if out and s <= out[-1][1]:           # overlaps last kept
            out[-1][1] = max(out[-1][1], e)   # extend
        else:
            out.append([s, e])
    return out

# Max non-overlapping count — sort by END, greedy keep
def max_events(intervals):
    intervals.sort(key=lambda iv: iv[1])
    count, last_end = 0, float("-inf")
    for s, e in intervals:
        if s >= last_end:      # fits after the last kept one
            count += 1
            last_end = e
    return count
```

Two sorts, two purposes: **merge/insert → sort by start**; **scheduling (keep the most) → sort by end** (finishing earliest leaves the most room — the classic greedy proof).

## Key variations

- **Insert into sorted intervals**: emit everything ending before the new one, merge everything overlapping it, emit the rest — [Insert Interval](/dsa/insert-interval).
- **Min removals = n − max kept**: [Non-overlapping Intervals](/dsa/non-overlapping-intervals) is the end-sort greedy in disguise.
- **Event sweep**: split into `(start, +1)` and `(end, −1)` events, sort, running sum = rooms/CPUs in use at once.
- **Touching vs overlapping**: `[1,2]` and `[2,3]` — merged in Merge Intervals (`s <= last_end`), *compatible* in scheduling (`s >= last_end`). Read the problem, pick the operator, write a boundary test.
- **Partition by last occurrence**: [Partition Labels](/dsa/partition-labels) — grow the current window to each char's last index; cut when `i == window_end`.

## Classic problems

- [Merge Intervals](/dsa/merge-intervals) — the template
- [Insert Interval](/dsa/insert-interval) — three-phase sweep
- [Non-overlapping Intervals](/dsa/non-overlapping-intervals) — end-sort greedy
- [Partition Labels](/dsa/partition-labels) — window variant

## Pitfalls

- Forgetting to sort — nothing below works on unsorted intervals.
- Extending with `out[-1][1] = e` instead of `max(...)` — fails when one interval swallows another (`[1,10], [2,3]`).
- Boundary semantics (`<` vs `<=`) — the single most common interval bug; test touching intervals explicitly.
- Sorting by start for scheduling problems — the greedy proof only works sorted by **end**.
