---
title: Linked Lists
description: Dummy heads, fast/slow pointers, reversal — the small toolkit that solves every list problem.
category: pattern
order: 15
premium: false
tags: [pattern, linked-list, pointers]
---

Linked-list problems are pointer choreography. Three tools cover nearly everything: a **dummy head** (kills head-edge cases), **fast/slow pointers** (middle, cycles, k-th from end), and **in-place reversal**. Draw boxes and arrows before coding — always.

## Recognize it

- The input *is* a list: reverse / merge / reorder / remove / detect cycle.
- "In one pass" / "O(1) space" — that's fast/slow or in-place rewiring.
- "k-th from the end", "middle", "does it loop?"

## Templates

```python
# In-place reversal — memorize this cold
def reverse(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev, head = head, nxt
    return prev

# Fast/slow — middle of the list
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow            # second middle for even lengths

# Dummy head — safe deletion/merging
def remove_kth_from_end(head, k):
    dummy = ListNode(0, head)
    lead = follow = dummy
    for _ in range(k): lead = lead.next
    while lead.next:
        lead, follow = lead.next, follow.next
    follow.next = follow.next.next
    return dummy.next
```

## Key variations

- **Cycle detection (Floyd)**: fast meets slow ⇒ cycle — [Linked List Cycle](/dsa/linked-list-cycle). To find the entry, restart one pointer at head and advance both by 1.
- **Merge with dummy**: [Merge Two Sorted Lists](/dsa/merge-two-sorted-lists); k lists → heap of heads ([Merge K Sorted Lists](/dsa/merge-k-sorted-lists)).
- **Half-and-half**: middle + reverse second half → palindrome check ([Palindrome Linked List](/dsa/palindrome-linked-list)) and reorder ([Reorder List](/dsa/reorder-list) = split, reverse, interleave).
- **Arithmetic on lists**: carry propagation node by node — [Add Two Numbers](/dsa/add-two-numbers).
- **Rewiring by parity/groups**: [Odd Even Linked List](/dsa/odd-even-linked-list), [Swap Nodes in Pairs](/dsa/swap-nodes-in-pairs), [Rotate List](/dsa/rotate-list) (close the ring, cut at `n - k % n`).

## Classic problems

- [Reverse Linked List](/dsa/reverse-linked-list) — iterative *and* recursive
- [Linked List Cycle](/dsa/linked-list-cycle)
- [Middle of the Linked List](/dsa/middle-of-the-linked-list)
- [Merge Two Sorted Lists](/dsa/merge-two-sorted-lists) / [Merge K Sorted Lists](/dsa/merge-k-sorted-lists)
- [Remove Nth Node From End](/dsa/remove-nth-node-from-end-of-list)
- [Reorder List](/dsa/reorder-list) — three techniques in one problem
- [Add Two Numbers](/dsa/add-two-numbers)
- [Remove Duplicates from Sorted List](/dsa/remove-duplicates-from-sorted-list)

## Pitfalls

- Losing the rest of the list: save `next` **before** overwriting a pointer.
- Skipping the dummy head, then special-casing "delete the head" — just use the dummy.
- Fast/slow loop condition is `fast and fast.next` — anything else null-crashes on even/odd lengths.
- After splitting a list, **terminate the first half** (`mid.next = None`) or you'll chase your own tail.
- Off-by-one in "second middle vs first middle" — decide which one the problem needs.
