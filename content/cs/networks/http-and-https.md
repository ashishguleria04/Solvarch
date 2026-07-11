---
title: HTTP & HTTPS
description: Methods, status codes, HTTP/1.1 → 2 → 3, and what TLS actually does.
order: 2
tags: [networks]
---

HTTP is a stateless request/response protocol: method + path + headers (+ body) in, status + headers (+ body) out. Statelessness is why it scales — any server can answer any request — and why cookies/tokens exist to layer sessions back on top.

## The vocabulary that gets probed

**Methods & semantics** — GET (read, *safe*), POST (create/act), PUT (replace), PATCH (partial update), DELETE. Two properties matter more than the verbs: **safe** (no side effects) and **idempotent** (N identical calls ≡ 1 call — GET/PUT/DELETE yes, POST no). Idempotency is why clients may auto-retry PUT but need idempotency keys for POST.

**Status codes** — 2xx success (200 OK, 201 Created, 204 No Content); 3xx redirects (301 permanent — cached!, 302 temporary, 304 Not Modified — the caching workhorse); 4xx client errors (400, 401 *unauthenticated*, 403 *unauthorized*, 404, 409 conflict, 429 rate-limited); 5xx server errors (500, 502 bad upstream, 503 unavailable, 504 upstream timeout). Getting 401-vs-403 right is a mini shibboleth.

**Headers to know** — `Content-Type`, `Authorization`, `Cache-Control`/`ETag` (see caching), `Set-Cookie` (with `HttpOnly`, `Secure`, `SameSite`), CORS headers (`Access-Control-Allow-Origin` — a *browser* enforcement mechanism, not server security).

## HTTP/1.1 → 2 → 3

- **1.1** — text protocol; one in-flight request per connection (pipelining never worked), so browsers opened ~6 parallel connections per host. Domain sharding, sprite sheets, and bundling exist because of this.
- **2** — binary framing, **multiplexing** many streams over one TCP connection, header compression (HPACK), server push (since abandoned). Killed the 1.1 workarounds — but all streams share one TCP pipe, so a single packet loss stalls every stream (TCP head-of-line blocking).
- **3** — HTTP over **QUIC** (UDP): per-stream loss recovery ends HOL blocking, 0–1-RTT setup, connection migration across networks. Same HTTP semantics, new transport.

## HTTPS / TLS in four bullets

- **Handshake (TLS 1.3)**: one round trip — key exchange (ECDHE) + certificate + Finished. Session resumption enables 0-RTT.
- **Authentication**: the server proves identity with a certificate chaining to a trusted CA; the client verifies the chain and hostname. This is what stops man-in-the-middle — encryption without authentication would be encrypting *to the attacker*.
- **Key exchange establishes a symmetric key**; the actual traffic uses symmetric crypto (AES-GCM/ChaCha20) because it's orders of magnitude faster than asymmetric.
- **Forward secrecy**: ephemeral keys per session — stealing the server's long-term key later can't decrypt recorded past traffic.

## Interview Q&A

**Q: Why is idempotency the property API designers obsess over?**
A: Networks fail after the server acted but before the client heard — clients *will* retry. Idempotent operations make retries safe; non-idempotent ones (POST /charge) need idempotency keys so the second attempt is recognized, not re-executed.

**Q: 401 vs 403?**
A: 401: we don't know who you are (missing/invalid credentials — authenticate and retry). 403: we know exactly who you are, and the answer is no.

**Q: What breaks if you serve your site on both HTTP and HTTPS?**
A: Cookies without `Secure` leak over HTTP; mixed-content warnings; SEO splits; downgrade attacks. Answer: redirect 80→443 and set **HSTS** so browsers refuse plain HTTP entirely.

**Q: Why did HTTP/2 multiplexing still leave performance on the table?**
A: All streams ride one TCP byte stream, so TCP's in-order guarantee makes one lost packet block *every* stream — transport-level HOL blocking. HTTP/3/QUIC gives each stream independent recovery.

**Q: Walk me through what the padlock actually guarantees — and doesn't.**
A: Guarantees: you're talking to the domain in the cert (authentication), traffic is encrypted and tamper-evident (confidentiality/integrity). Doesn't: that the site is trustworthy — phishing sites have valid certs. TLS secures the pipe, not the party.
