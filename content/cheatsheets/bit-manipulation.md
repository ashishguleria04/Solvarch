---
title: Bit Manipulation
description: The XOR family, bit tricks worth memorizing, and adding without the plus sign.
category: pattern
order: 24
premium: false
tags: [pattern, bits]
---

A small pattern with outsized returns: most bit problems reduce to five memorized identities. If a problem says "without extra memory" or "appears exactly once/twice", think XOR before anything else.

## The identities

| Trick | Effect |
| --- | --- |
| `x ^ x == 0`, `x ^ 0 == x` | XOR cancels pairs (order-independent) |
| `x & (x - 1)` | clears the lowest set bit |
| `x & (-x)` | isolates the lowest set bit |
| `x & (x - 1) == 0` | power of two (for x > 0) |
| `(x >> k) & 1` | read bit k · set: `x \| (1 << k)` · clear: `x & ~(1 << k)` |

## Templates

```python
# XOR fold — the element that appears once
def single(nums):
    acc = 0
    for x in nums: acc ^= x
    return acc

# Popcount via Kernighan: loops once per SET bit
def popcount(x):
    n = 0
    while x:
        x &= x - 1
        n += 1
    return n

# Add without '+': XOR = sum bits, AND<<1 = carries
def add(a, b):
    mask = 0xFFFFFFFF                   # simulate 32-bit in Python
    while b & mask:
        a, b = a ^ b, (a & b) << 1
    a &= mask if b > mask else 0xFFFFFFFFFFFFFFFF  # normalize
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)   # restore sign
```

## Key variations

- **XOR with expected values**: missing number = XOR of 0..n and all elements — [Missing Number](/dsa/missing-number).
- **Appears once among triples**: count bits mod 3 per position, or the two-variable automaton — [Single Number II](/dsa/single-number-ii).
- **DP on bits**: `bits[i] = bits[i >> 1] + (i & 1)` — [Counting Bits](/dsa/counting-bits).
- **Bit-by-bit reconstruction**: reverse by shifting out of one number into another — [Reverse Bits](/dsa/reverse-bits).
- **XOR as difference detector**: `a ^ b` has set bits exactly where they differ — [Hamming Distance](/dsa/hamming-distance) is `popcount(a ^ b)`.

## Classic problems

- [Single Number](/dsa/single-number) — the XOR fold
- [Single Number II](/dsa/single-number-ii) — the tricky sibling
- [Number of 1 Bits](/dsa/number-of-1-bits) — Kernighan
- [Counting Bits](/dsa/counting-bits) — bit DP
- [Missing Number](/dsa/missing-number)
- [Reverse Bits](/dsa/reverse-bits)
- [Power of Two](/dsa/power-of-two)
- [Sum of Two Integers](/dsa/sum-of-two-integers) — add without `+`

## Pitfalls

- Python ints are unbounded — negative-number bit problems need explicit 32-bit masking (see `add` above); this *will* come up in Sum of Two Integers.
- `>>` on negatives is arithmetic shift in most languages (sign-extends); use unsigned/logical shift where available (`>>>` in Java/JS).
- Operator precedence: `x & 1 == 0` parses as `x & (1 == 0)` — parenthesize bit expressions.
- Claiming O(1) space while building a list of bits — the trick is doing it with two integers.
