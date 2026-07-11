---
title: SQL vs NoSQL
description: The four NoSQL families, what you trade for scale, and how to choose in an interview.
order: 5
tags: [dbms]
---

"SQL vs NoSQL" is really "what guarantees do you need vs what scale/shape problem do you have." Relational databases give you a general-purpose query engine, joins, and ACID; NoSQL families each specialize by *giving something up*.

## The families

| Family | Model | Sweet spot | Examples |
| --- | --- | --- | --- |
| Key-value | opaque value by key | Sessions, caches, feature flags | Redis, DynamoDB |
| Document | JSON docs, nested | Entity-per-request apps, flexible schemas | MongoDB, DynamoDB |
| Wide-column | rows with partitioned, sorted columns | Write-heavy time-series, feeds, massive scale | Cassandra, HBase |
| Graph | nodes + edges | Deep relationship traversals (fraud rings, social paths) | Neo4j |

## What relational really gives you

- **Joins & ad-hoc queries** — you don't have to know tomorrow's queries today.
- **ACID transactions** across arbitrary rows/tables.
- **Constraints** (FKs, unique, checks) — the database defends invariants.
- Mature everything: tooling, hiring, ORMs, migrations.

Its scaling story: replicas + caching go far; write-sharding is manual and loses cross-shard joins/transactions (see the sharding guide).

## What NoSQL asks of you

**Query-first modeling.** In Cassandra/DynamoDB you design tables *from your access patterns* — one table per query shape, data duplicated across them. Ad-hoc queries you didn't plan for range from expensive to impossible.

**App-enforced integrity.** No foreign keys, often no multi-item transactions — dedupe, referential cleanup, and invariants move into application code.

**Tunable consistency.** Dynamo-style stores let you dial R/W quorums per request (eventual → strong-ish) — flexibility that's also a footgun if teams don't understand it.

In exchange: near-linear horizontal write scaling, partition tolerance by design, schema flexibility, and single-digit-ms point lookups at any scale.

## Choosing (the honest heuristic)

Default to **Postgres** until a specific pressure says otherwise: relational handles 95% of products, and JSONB covers most "flexible schema" needs. Reach for NoSQL when you can name the pressure: write volume beyond a shardable primary (wide-column), a pure key-value access pattern at huge scale (KV/document), graph-shaped traversals (graph DB), or multi-region active-active writes (Dynamo-style). Real systems are **polyglot**: SQL for orders/money, Redis for sessions, Cassandra for the activity feed, each chosen per workload.

## Interview Q&A

**Q: Why do NoSQL stores scale writes more easily than relational DBs?**
A: They're partitioned from day one (every key hashes to a shard), and they drop the features that don't shard — cross-partition joins, FKs, global transactions. Relational DBs *can* shard, but you implement those losses yourself.

**Q: When is MongoDB a poor fit?**
A: Highly relational data with many-to-many links and ad-hoc cross-entity queries, or strict multi-document invariants — you end up hand-building joins and transactions the RDBMS gives free.

**Q: What is "design your tables from your queries" in DynamoDB?**
A: Choose partition/sort keys so each access pattern is one request: e.g. `PK=user#123, SK=order#2024-06-01` serves "orders for a user by date." New query pattern later → new index (GSI) or table, often with duplicated data.

**Q: Your product is on Postgres and the feed table is the write bottleneck. Move everything to Cassandra?**
A: No — move *the feed*. Keep transactional entities relational; put the append-heavy, per-user-keyed feed in a wide-column store. Migrating everything trades problems you have for problems you don't.

**Q: Is Redis a database or a cache?**
A: Both, deliberately: in-memory KV with optional persistence (RDB/AOF). Treat it as source of truth only for data where loss is acceptable or persistence is configured and tested — otherwise it's a cache with a database's API.
