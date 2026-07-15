---
title: Joins & Query Execution
description: The join types, how the engine actually executes them (nested loop, hash, merge), and reading EXPLAIN.
order: 6
tags: [dbms]
---

Everyone can recite INNER vs LEFT. The differentiating layer is *how the database executes a join* — nested loop vs hash vs merge — and how to read a query plan. That's what this page drills.

## The join types, precisely

```sql
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id;   -- only matching pairs
LEFT  JOIN ...                              -- all users; NULLs where no order
RIGHT JOIN ...                              -- mirror of LEFT (rarely written)
FULL  JOIN ...                              -- everything, matched where possible
CROSS JOIN ...                              -- Cartesian product (m × n rows)
```

The patterns worth having ready:

- **Anti-join** — "users with no orders": `LEFT JOIN … WHERE o.id IS NULL` (or `NOT EXISTS`, which optimizers often like better).
- **Semi-join** — "users who have at least one order": `WHERE EXISTS (…)` — returns each user once, unlike a JOIN which duplicates per match.
- **The LEFT JOIN filter trap**: putting a right-table condition in `WHERE` (`WHERE o.status = 'paid'`) silently turns your LEFT JOIN into an INNER — NULL rows fail the filter. Right-table filters belong in the `ON` clause.
- **Self-join**: employees ↔ managers, or pairing rows within a table.

## How joins actually execute

The optimizer picks among three physical algorithms:

| Algorithm | How | Best when |
| --- | --- | --- |
| **Nested loop** | For each outer row, look up matches in the inner table | Outer side is small and the inner lookup hits an **index** — OLTP's bread and butter |
| **Hash join** | Build a hash table on the smaller side, probe with the larger | Big unsorted inputs, equality joins — analytics default |
| **Merge join** | Sort (or use index order) both sides, zip through | Both inputs already sorted (indexes, previous sorts); also handles ranges |

A nested loop without an index on the inner side is O(m·n) — the classic "query was fine in dev (100 rows), died in prod (10M)" story. The fix is almost always **an index on the join key**, which either accelerates the nested loop or lets a merge join use index order.

## Reading EXPLAIN without fear

`EXPLAIN (ANALYZE)` shows the plan tree — read it inside-out (deepest node first):

```text
Hash Join  (cost=... rows=1200) (actual rows=890)
  -> Seq Scan on orders          (rows=100000)
  -> Hash
     -> Index Scan on users_pkey (rows=50)
```

What to scan for, in order:

1. **Seq Scan on a big table** with a selective filter → missing/unusable index.
2. **Estimated vs actual rows off by 100×** → stale statistics (`ANALYZE` the table); the optimizer chose the wrong algorithm because it believed the wrong cardinality.
3. **Nested Loop with a huge outer side** → should have been a hash join; usually the row-estimate problem above.
4. Sorts spilling to disk → `work_mem` (or rewrite to use index order).

The meta-skill interviewers grade: you *measure* (EXPLAIN ANALYZE), then reason — never guess-and-index.

## Join ordering and the optimizer

Join order matters enormously (filtering early shrinks intermediates) and the optimizer explores orders using table statistics — histograms of value distributions. This is why statistics freshness dominates real-world performance, and why ORMs generating N+1 queries (one per row — a nested loop *implemented in your app over the network*) are the most common join problem in production. Fix with eager loading / a single joined query.

## Interview Q&A

**Q: INNER JOIN vs EXISTS for "users with orders" — any difference?**
A: JOIN emits one row per match (a user with 5 orders appears 5×, needing DISTINCT); EXISTS is a semi-join — one row per user, short-circuiting at the first match. Semantically cleaner and often faster.

**Q: Why did the optimizer pick a sequential scan even though an index exists?**
A: It estimated the predicate matches a large fraction of the table — random index hops cost more than one contiguous scan past ~5–10% selectivity. Or the predicate isn't sargable (function on the column, type mismatch), or stats are stale.

**Q: Hash join vs merge join — when does merge win?**
A: When inputs are already sorted (clustered/covering indexes on join keys) or the join is a range condition (hash joins need equality). Merge also streams without a large build-side memory footprint.

**Q: What's an N+1 query and why is it a join problem?**
A: Fetch N parents, then one child query per parent — N+1 round trips. It's a nested-loop join executed over the network at network latency. Batch it into one JOIN or an `IN` query.

**Q: `COUNT(*)` vs `COUNT(col)`?**
A: `COUNT(*)` counts rows; `COUNT(col)` skips NULLs in that column. After a LEFT JOIN, `COUNT(right.id)` counts only matched rows — a deliberate and useful difference.
