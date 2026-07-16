---
title: Stacks & Monotonic Stack
description: Matching, simulation, expression evaluation, and the monotonic stack behind every "next greater" problem.
category: pattern
order: 14
premium: false
tags: [pattern, stacks]
---

A stack remembers "what's still open". Reach for one whenever the **most recent unfinished thing** is the one you must deal with first: brackets, nested structures, undo, and — the interview favorite — monotonic stacks for next-greater/smaller queries.

## Recognize it

- Brackets/nesting/"valid sequence".
- Decode/parse with nested scopes (`3[a2[c]]`).
- "**Next greater/smaller** element", "how many days until warmer", histogram areas.
- Simulation where things collide with or cancel the latest survivor.

## Templates

```python
# Matching
def valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    st = []
    for c in s:
        if c in "([{":
            st.append(c)
        elif not st or st.pop() != pairs[c]:
            return False
    return not st

# Monotonic stack — next greater element to the right
def next_greater(nums):
    res = [-1] * len(nums)
    st = []                          # indices, values strictly decreasing
    for i, x in enumerate(nums):
        while st and nums[st[-1]] < x:
            res[st.pop()] = x        # x is the answer for everything smaller
        st.append(i)
    return res
```

Each index is pushed and popped at most once → O(n) despite the nested loop.

## Key variations

- **Store indices**, not values — distances ([Daily Temperatures](/dsa/daily-temperatures)) and widths ([Largest Rectangle](/dsa/largest-rectangle-in-histogram)) need them.
- **Circular array**: iterate `2n` times with `i % n` — [Next Greater Element II](/dsa/next-greater-element-ii).
- **Increasing vs decreasing**: next **greater** → keep the stack decreasing; next **smaller** → increasing. Strict vs non-strict handles duplicates — decide before coding.
- **Histogram**: when a bar pops, its rectangle's height is the popped bar, width spans to the new stack top — [Largest Rectangle in Histogram](/dsa/largest-rectangle-in-histogram); append a sentinel 0 to flush.
- **Build-a-smaller-number greedily**: pop while the top is bigger than the incoming digit and removals remain — [Remove K Digits](/dsa/remove-k-digits).
- **Two stacks / stack with metadata**: [Min Stack](/dsa/min-stack) stores (value, min-so-far) pairs; [Implement Queue Using Stacks](/dsa/implement-queue-using-stacks) amortizes transfers.

## Classic problems

- [Valid Parentheses](/dsa/valid-parentheses) — matching
- [Min Stack](/dsa/min-stack) — auxiliary min
- [Evaluate Reverse Polish Notation](/dsa/evaluate-reverse-polish-notation) — operand stack
- [Decode String](/dsa/decode-string) — nested scopes
- [Simplify Path](/dsa/simplify-path) — `..` pops
- [Asteroid Collision](/dsa/asteroid-collision) — collision simulation
- [Daily Temperatures](/dsa/daily-temperatures) — monotonic, distances
- [Largest Rectangle in Histogram](/dsa/largest-rectangle-in-histogram) — the hard classic
- [Valid Parenthesis String](/dsa/valid-parenthesis-string) — range of open counts (stack-free twist)

## Pitfalls

- Popping an empty stack — guard every pop.
- Forgetting the **flush** at the end: leftover stack items are the "no answer" cases (or need a sentinel to force them out).
- Duplicates and strict/non-strict comparison change answers — test `[2,2,2]`.
- RPN in Python: integer division toward zero is `int(a / b)`, not `a // b`.
