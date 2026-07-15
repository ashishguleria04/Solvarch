---
title: OSI & TCP/IP Models
description: The layer models that organize every networking answer — what each layer does and where real devices and bugs live.
order: 5
tags: [networks]
---

The OSI model is less a technology than a **filing system for networking knowledge** — and interviewers use it as one: "at which layer does X happen?" Answering fluently requires knowing what each layer owns and which real protocols and devices live there.

## The seven layers (and the four that matter)

| # | OSI layer | Owns | Lives here |
| --- | --- | --- | --- |
| 7 | Application | App semantics | HTTP, DNS, SMTP, gRPC |
| 6 | Presentation | Encoding, encryption | TLS*, JSON/protobuf serialization |
| 5 | Session | Dialog management | (mostly folded into apps/TLS) |
| 4 | **Transport** | Process-to-process delivery, ports | TCP, UDP, QUIC |
| 3 | **Network** | Host-to-host across networks | IP, ICMP, routers, BGP |
| 2 | **Data link** | Same-network delivery | Ethernet, Wi-Fi, MAC, switches |
| 1 | **Physical** | Bits on a medium | Cables, radio, fiber |

The practical **TCP/IP model** collapses this to four: Link, Internet, Transport, Application — layers 5–7 blur together in reality (*where TLS "goes" is famously fuzzy; "between transport and application" is the accepted answer*). Use OSI vocabulary, think in TCP/IP.

## The core idea: encapsulation

Each layer treats everything above it as opaque payload and adds its own header:

```mermaid
flowchart LR
    A[HTTP request] --> B[TCP segment: ports, seq]
    B --> C[IP packet: src/dst IP]
    C --> D[Ethernet frame: MACs]
    D --> E[bits on the wire]
```

Down the stack at the sender, up the stack at the receiver — and *partially* up at each hop: a **switch** reads only frame headers (L2), a **router** unwraps to IP (L3), rewrites L2 framing per hop, and forwards. Key mental model: **MAC addresses change every hop; IP addresses survive end to end** (until NAT, anyway). L3 is what makes the *inter*-net inter.

## Layer boundaries answer real questions

- **Switch vs router vs load balancer**: L2 forwarding by MAC / L3 routing by IP / L4 or L7 depending on whether it reads ports or HTTP.
- **Why can two apps share one machine?** L4 ports multiplex one IP among processes. A connection is the 5-tuple (src IP, src port, dst IP, dst port, protocol).
- **ARP** glues L3 to L2: "who has IP 192.168.1.7? tell me your MAC" — broadcast on the local segment.
- **MTU/fragmentation** is an L3-meets-L2 issue: frames have size limits (~1500 bytes Ethernet); oversized packets fragment (or get dropped with ICMP "too big" — the mechanism behind path MTU discovery, and behind mysterious hangs when firewalls eat ICMP).

## Debugging by layer — the interview flex

"Site is down" walked bottom-up:

1. **L1/L2**: link lights, Wi-Fi associated? (`ip link`)
2. **L3**: do I have an IP? can I ping the gateway, then 8.8.8.8? (`ping`, `traceroute`)
3. **DNS (L7)**: does the name resolve? (`dig`) — *ping IP works but domain fails = DNS.*
4. **L4**: is the port reachable? (`nc -zv host 443`) — IP pings but port refused = service/firewall.
5. **L7**: what does the response actually say? (`curl -v` — certificates, status codes, headers)

Structuring the answer as a layer walk is precisely what the question is testing.

## Interview Q&A

**Q: At which layer does a load balancer operate?**
A: Either — L4 balancers route by IP/port (fast, connection-level); L7 balancers terminate HTTP and route per request by path/headers/cookies (smarter, TLS termination, slightly slower). Real stacks often chain both.

**Q: `ping 8.8.8.8` works but `ping google.com` fails. Layer and fix?**
A: L3 connectivity is fine; name resolution is broken — DNS (application layer). Check `/etc/resolv.conf`, `dig @8.8.8.8 google.com`, the configured resolver.

**Q: Why do MAC addresses exist if we have IPs?**
A: Different jobs: MAC delivers within one physical network segment (L2 has no notion of routes); IP delivers across networks. A packet keeps its IPs end-to-end while its MAC framing is rewritten at every router hop.

**Q: Where does TLS fit in the model?**
A: Between L4 and L7 — it rides on TCP, below HTTP. OSI purists call it presentation/session; practitioners say "transport security wrapping the application protocol." Both accepted; explaining the ambiguity is the strong answer.

**Q: What breaks when MTU is misconfigured (e.g., over a VPN)?**
A: Small requests work; large transfers hang. Full-size packets exceed the tunnel's MTU, the "fragmentation needed" ICMP gets filtered, and path MTU discovery fails silently — the classic "SSH connects but SCP stalls" symptom.
