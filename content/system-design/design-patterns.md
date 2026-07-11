---
title: Design Patterns for Interviews
description: The dozen patterns that actually appear in LLD rounds, with when-to-use triggers.
category: lld
order: 31
premium: false
tags: [oop, patterns]
videos:
  - title: "Design Patterns — quick guide"
    url: https://www.youtube.com/results?search_query=design+patterns+interview+guide
---

You don't need all 23 GoF patterns — you need the ~12 that LLD interviews actually reward, each with its **trigger**: the sentence in a problem statement that should make you reach for it.

## Creational

- **Factory Method / Abstract Factory** — *trigger: "the code shouldn't know which concrete class it's creating."* Creation behind an interface: `PaymentFactory.create("upi")`. Abstract Factory when whole families vary together (dark/light widget sets).
- **Builder** — *trigger: constructor with 6+ parameters, half optional.* Fluent step-by-step construction: `Pizza.builder().size(L).extraCheese().build()`.
- **Singleton** — *trigger: exactly one instance system-wide (config, connection pool).* Know it, and know why it's disliked: global state, hidden coupling, test pain. Saying "I'd prefer a DI container managing one instance" is a plus.

## Structural

- **Adapter** — *trigger: interface you have ≠ interface you need.* Wrap the legacy/third-party API behind your interface.
- **Decorator** — *trigger: stacking optional behaviors without subclass explosion.* `new Logging(new Retrying(new HttpClient()))` — same interface, layered features. (Coffee-with-toppings is the classic toy.)
- **Facade** — *trigger: subsystem is complex, callers need it simple.* One `PlaceOrderFacade.execute()` orchestrating inventory, payment, shipping.
- **Composite** — *trigger: trees where one item and a group are treated alike.* Files/folders, UI elements, org charts — `getSize()` works on both.
- **Proxy** — *trigger: control access to an object.* Lazy loading, permission checks, caching, RPC stubs.

## Behavioral

- **Strategy** — *trigger: interchangeable algorithms / that growing switch.* Pricing rules, routing choices, compression codecs. The single most-used pattern in LLD rounds.
- **Observer** — *trigger: "when X happens, notify interested parties."* Event listeners, pub/sub in the small. Order status changes → email, SMS, analytics subscribers.
- **State** — *trigger: behavior depends on a lifecycle stage; if-else on a status enum spreading through methods.* Order/vending-machine/elevator states as classes with legal transitions.
- **Command** — *trigger: undo/redo, queuing or logging operations.* Encapsulate actions as objects with `execute()`/`undo()` — text editors, task schedulers.
- **Template Method** — *trigger: fixed skeleton, variable steps.* Base class drives the algorithm; subclasses fill in hooks (data pipelines: extract → transform → load).

## How to deploy patterns in interviews

Name the pattern **as you use it, with the reason**: "Notifications go through an Observer so adding a Slack notifier later touches nothing else." Never force patterns in — a design narrated as five patterns bolted together reads worse than a clean design with two well-motivated ones. And when asked "why not just if-else?", the answer is always the same shape: isolation of change and testability.
