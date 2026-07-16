---
title: Binary Trees & BSTs
description: DFS recursion shapes, BFS levels, BST invariants, and the global-variable trick for path problems.
category: pattern
order: 16
premium: false
tags: [pattern, trees, recursion]
---

Almost every tree problem is one of two shapes: **DFS** ("answer for a node = combine answers of children") or **BFS** ("process level by level"). Pick the shape, then the recursion usually writes itself.

## Recognize it

- Depth/height/balance/symmetry → DFS returning a value.
- "Level order", "right side view", "minimum depth" → BFS with a queue.
- Sorted-order facts, "k-th smallest", "validate" → BST inorder or range invariants.
- "Best path anywhere in the tree" → DFS that returns one thing but records another.

## Templates

```python
# DFS — combine children
def depth(node):
    if not node: return 0
    return 1 + max(depth(node.left), depth(node.right))

# BFS — one level per loop iteration
from collections import deque
def levels(root):
    if not root: return []
    q, out = deque([root]), []
    while q:
        out.append([])
        for _ in range(len(q)):          # freeze level size
            n = q.popleft()
            out[-1].append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
    return out

# Return-one-record-another (diameter / max path sum)
def diameter(root):
    best = 0
    def down(n):                # longest path going DOWN from n
        nonlocal best
        if not n: return 0
        l, r = down(n.left), down(n.right)
        best = max(best, l + r) # path THROUGH n
        return 1 + max(l, r)
    down(root)
    return best
```

## Key variations

- **Two-tree recursion**: same/subtree/symmetric compare two nodes at once — [Same Tree](/dsa/same-tree), [Symmetric Tree](/dsa/symmetric-tree) (mirror: left vs right), [Subtree of Another Tree](/dsa/subtree-of-another-tree).
- **BST validate with ranges**: pass `(lo, hi)` down; inorder-must-be-increasing is the equivalent one-liner — [Validate BST](/dsa/validate-binary-search-tree).
- **BST navigation**: compare with root and go one side — [LCA of a BST](/dsa/lowest-common-ancestor-of-a-binary-search-tree); k-th smallest = inorder with a counter — [Kth Smallest in a BST](/dsa/kth-smallest-element-in-a-bst).
- **Level tricks**: last node per level = [Right Side View](/dsa/binary-tree-right-side-view).
- **Path problems**: the `down()` value must be a *single* downward arm; the recorded best may join two arms — [Binary Tree Maximum Path Sum](/dsa/binary-tree-maximum-path-sum) (clamp negative arms to 0).
- **Root-to-leaf accumulation**: pass remaining sum down — [Path Sum](/dsa/path-sum).

## Classic problems

- [Maximum Depth](/dsa/maximum-depth-of-binary-tree) · [Invert Binary Tree](/dsa/invert-binary-tree) — warm-ups
- [Diameter of Binary Tree](/dsa/diameter-of-binary-tree) — the return/record split
- [Binary Tree Level Order Traversal](/dsa/binary-tree-level-order-traversal) — BFS template
- [Validate Binary Search Tree](/dsa/validate-binary-search-tree)
- [Binary Tree Maximum Path Sum](/dsa/binary-tree-maximum-path-sum) — the hard one

## Pitfalls

- Validating a BST by only checking children against the parent — the classic wrong answer; you need the full range (or inorder).
- Forgetting to freeze `len(q)` in BFS — levels bleed together.
- Diameter/path-sum: returning the *through* value up the tree instead of the single arm.
- Null root: handle before touching `.left`.
- Recursion depth: a skewed tree of 10⁵ nodes overflows Python's default stack — mention the iterative rewrite.
