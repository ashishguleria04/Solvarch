---
title: Tries
description: Prefix trees for autocomplete, dictionaries, and wildcard search — when a hash set of words isn't enough.
category: pattern
order: 17
premium: false
tags: [pattern, tries, strings]
---

A trie stores strings character by character down a tree, so all words sharing a prefix share a path. Use it the moment a problem cares about **prefixes** rather than whole words — a hash set can answer "is this a word?" but not "is this a prefix of any word?" in O(L).

## Recognize it

- "Autocomplete", "starts with", "shortest prefix/root of this word".
- A dictionary queried many times against words or prefixes.
- Wildcard characters in search patterns (`.` matches anything) → trie + DFS.

## Template

```python
class TrieNode:
    __slots__ = ("children", "end")
    def __init__(self):
        self.children = {}     # char -> TrieNode
        self.end = False       # a word terminates here

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.end

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for c in s:
            node = node.children.get(c)
            if node is None: return None
        return node
```

All operations are **O(L)** in the key length — independent of how many words are stored.

## Key variations

- **Wildcard search**: on `.`, branch into every child (DFS over the trie) — [Design Add and Search Words](/dsa/design-add-and-search-words-data-structure).
- **Shortest-root replacement**: walk each word, stop at the first `end` node — [Replace Words](/dsa/replace-words).
- **Store extras on nodes**: counts (how many words pass through — answers "count words with prefix", [Counting Words With a Given Prefix](/dsa/counting-words-with-a-given-prefix)), or the full word at terminal nodes for easy collection.
- **Buildable-word chains**: a word is buildable if every prefix node has `end=True` — [Longest Word in Dictionary](/dsa/longest-word-in-dictionary).
- **Trie over a grid search**: for multi-word board search, DFS the board while walking the trie so shared prefixes are explored once.

## Classic problems

- [Implement Trie (Prefix Tree)](/dsa/implement-trie-prefix-tree) — the template
- [Design Add and Search Words](/dsa/design-add-and-search-words-data-structure) — wildcard DFS
- [Replace Words](/dsa/replace-words)
- [Longest Word in Dictionary](/dsa/longest-word-in-dictionary)
- [Longest Common Prefix](/dsa/longest-common-prefix) — trivial with a trie; know the scan solution too

## Pitfalls

- Forgetting the `end` flag and treating any path as a word — "app" vs "apple".
- Wildcard DFS must try **all** children on `.`, not just the first match.
- A trie can be memory-heavy (a dict per node) — mention array-of-26 children as the compact alternative.
- Deleting from a trie (rare in interviews) needs reference counts or path pruning — say so rather than improvising.
