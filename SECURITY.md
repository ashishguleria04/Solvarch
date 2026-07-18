# Security Policy

## Supported Versions

Solvarch is a single, continuously-updated `master` branch — there are no
maintained older versions. Security fixes land on `master`.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report it privately by emailing **guleriaashish65@gmail.com** with:

- A description of the vulnerability and its potential impact.
- Steps to reproduce (a minimal repro is very helpful).
- Any relevant logs, screenshots, or PoC code.

You should expect an initial response within a few days. Once a fix is
confirmed, we'll coordinate on disclosure timing and credit you in the release
notes if you'd like.

## Scope notes

Solvarch has no authentication, no user database, and no server-side storage
of user code or submissions — code execution is proxied to a configurable
external provider (Paiza, Piston, or Judge0) and results are not persisted.
Reports involving those third-party execution providers themselves should also
go to their respective maintainers, but we'd still like to know if Solvarch's
integration with them introduces a problem (e.g., insufficient input
sanitization before sending code to the execution API).
