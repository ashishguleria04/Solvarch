---
title: SOLID Principles
description: The five principles with violations and fixes you can actually cite in an interview.
category: lld
order: 30
premium: false
tags: [oop, design]
videos:
  - title: "SOLID Principles — in depth"
    url: https://www.youtube.com/results?search_query=solid+principles+explained+examples
---

SOLID is five heuristics for code that survives change. In interviews, reciting definitions scores nothing — pairing each principle with a **violation and its fix** does.

## S — Single Responsibility

*A class should have one reason to change.* "Responsibility" means a stakeholder/axis of change, not "one method."

**Violation:** `Report` that computes figures, formats HTML, *and* writes to disk — finance changes, design changes, and infra changes all edit one class.
**Fix:** `ReportData` / `ReportFormatter` / `ReportWriter`. Each changes for exactly one reason.

## O — Open/Closed

*Open for extension, closed for modification* — add behavior with new code, not by editing tested code.

**Violation:** `calculateShipping()` with a growing `switch (carrier)` — every new carrier edits the same function.
**Fix:** a `ShippingStrategy` interface; new carriers are new classes. The switch statement you keep adding cases to is the classic tell.

## L — Liskov Substitution

*Subtypes must be usable wherever the base type is expected — honoring its contract, not just its signatures.*

**Violation:** `Square extends Rectangle` overriding `setWidth` to also set height — code that resizes a `Rectangle` silently breaks. Or a subclass throwing `UnsupportedOperationException` on an inherited method.
**Fix:** don't force the is-a; model `Shape` with `area()`, or split the interface. If a subclass strengthens preconditions or weakens postconditions, inheritance was the wrong tool.

## I — Interface Segregation

*No client should depend on methods it doesn't use.*

**Violation:** a fat `Machine` interface (`print/scan/fax`) forcing a simple printer to stub `fax()`.
**Fix:** `Printer`, `Scanner`, `Fax` interfaces; classes implement what they are. Symptom to name: implementing an interface and leaving half of it as no-ops.

## D — Dependency Inversion

*High-level policy depends on abstractions, not concrete details; details depend on the same abstractions.*

**Violation:** `OrderService` constructing `new MySqlOrderRepo()` and `new SmtpMailer()` inside itself — untestable, welded to infrastructure.
**Fix:** depend on `OrderRepo` / `Mailer` interfaces, injected in (constructor injection). This is what makes unit testing possible and is the principle underlying every DI framework.

## Using SOLID in an LLD interview

When designing (say) a parking lot or payment flow, narrate the principles as *decisions*: "Fee calculation is a strategy interface — new vehicle types won't modify existing code (OCP), and I can inject a fake in tests (DIP)." One sentence like that, tied to your actual design, beats reciting all five definitions.
