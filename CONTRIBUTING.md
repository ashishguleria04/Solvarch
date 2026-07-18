# Contributing to Solvarch

Thanks for considering a contribution — Solvarch is a free, open interview-prep platform, and it stays good because people fix, extend, and correct it. This guide covers everything you need to go from clone to merged PR.

## Table of contents

- [Code of Conduct](#code-of-conduct)
- [Ways to contribute](#ways-to-contribute)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Adding a DSA problem](#adding-a-dsa-problem)
- [Adding or editing content (System Design / CS Fundamentals / Cheatsheets)](#adding-or-editing-content)
- [Coding conventions](#coding-conventions)
- [Commit messages](#commit-messages)
- [Submitting a pull request](#submitting-a-pull-request)
- [Reporting bugs and requesting features](#reporting-bugs-and-requesting-features)

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Ways to contribute

- **Fix bugs** — UI glitches, incorrect judge behavior, broken links, hydration warnings, etc.
- **Add DSA problems** — new problems, or filling out thin topics (see [good first issues](https://github.com/ashishguleria04/Solvarch/labels/good%20first%20issue)).
- **Improve content** — clarify a System Design write-up, fix an inaccuracy in a CS Fundamentals page, tighten a cheatsheet.
- **Improve accessibility, performance, or mobile responsiveness.**
- **Improve docs** — this file, the README, or inline comments where the *why* isn't obvious.

If you're unsure whether an idea fits, open an issue first and describe it — no need to write code before getting a sanity check.

## Development setup

Requires **Node.js 20+**. No database, no API keys required for local dev.

```bash
git clone https://github.com/<your-fork>/Solvarch.git
cd Solvarch
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Code execution works out of the box against Paiza's guest tier. See [.env.example](.env.example) if you want to point at a different execution provider.

Before opening a PR, run:

```bash
npm run lint
npm run build
```

Both must pass. There is currently no automated test suite for problem content — correctness is verified by the reference solution generating expected outputs at load time (see below), so a broken reference solution will surface as a build/type error or a visibly wrong expected output.

## Project structure

```text
content/                     # System Design + CS Fundamentals + cheatsheets (markdown + frontmatter)
  system-design/
  cs/{dbms,networks,oop,os}/
  cheatsheets/
src/
  data/
    topics.ts                # The 15-topic DSA taxonomy
    problems/                # One file per topic; each problem includes a
                              # reference solution used to generate expected outputs
    ref-utils.ts              # Shared parsing/printing helpers for reference solutions
    starters.ts                # Starter-code templates (Python/JS/Java/C++) per problem shape
    questions.ts              # Behavioral / HR / trivia question bank
    companies.ts               # Company-tagged question sets
    roadmaps.ts                 # Study roadmaps
  app/
    (marketing)/               # Landing page
    (app)/                      # DSA workspace, System Design, CS, Question Bank, roadmaps
    api/                        # execute, submit
  components/
    editor/                    # Monaco-based code editor + workspace
    design-system/              # Shared primitives (badges, markdown renderer, mermaid, etc.)
    ui/                          # Radix-based low-level UI components
  lib/
    execution/                  # Execution provider abstraction: paiza | piston | judge0
    judge.ts                     # Runs test suites, maps outcomes to verdicts
    progress.ts, review.ts, ...  # Local-storage-backed progress/spaced-repetition features
```

There is no backend database — all content is checked into the repo, and per-user state (progress, drafts, review schedule) lives in the browser's `localStorage`.

## Adding a DSA problem

This is the highest-leverage contribution and the easiest to get merged cleanly. Each problem is a plain object of type `SeedProblem` (see [src/data/types.ts](src/data/types.ts)) appended to the array in `src/data/problems/<topic>.ts`.

1. **Pick a topic file.** `Tries` (`src/data/problems/tries.ts`) is currently the thinnest at 6 problems — a good place to add without needing to touch `topics.ts`.
2. **Look at an existing entry in that file** as a template (slug, title, difficulty, statement, constraints, examples, hints, editorial, tags, starter code, reference, tests).
3. **Write the reference solution first.** It's a plain function `(input: string) => string` operating on the raw stdin format you define in the statement. Use the helpers in [src/data/ref-utils.ts](src/data/ref-utils.ts) (`lines`, `ints`, `words`, `boolOut`, `linesOut`, `parseTree`/`treeOut` for tree problems, etc.) instead of re-deriving stdin parsing.
4. **Use `buildStarter(...)` from `src/data/starters.ts`** to generate the Python/JavaScript/Java/C++ starter bundle for a matching input/output shape, rather than hand-writing four language variants.
5. **Add at least one `sample: true` test** (shown to the user) plus a few hidden edge-case tests (empty input, single element, max constraints, duplicates, etc.).
6. **Do not hand-write expected outputs.** They're computed from your reference solution when the catalog loads — this is what keeps tests and solutions from drifting apart. If your reference solution is wrong, the bug shows up as a wrong "expected output," not a separate data-entry mistake.
7. Run `npm run dev`, open the problem, and try both the sample tests and a submission with a known-correct approach to sanity-check your reference solution and starter code.

Keep new problems well-known/standard (LeetCode-style) rather than inventing obscure variants, unless the issue you're addressing asks for something specific.

## Adding or editing content

System Design case studies, concept guides, CS Fundamentals, and cheatsheets are markdown files with frontmatter under `content/`. Match the frontmatter shape and heading structure of a neighboring file in the same folder. Mermaid diagrams are supported directly in fenced ` ```mermaid ` blocks. Keep explanations accurate and concise — these pages are meant to be skimmed before an interview, not read cover to cover.

## Coding conventions

- **TypeScript, strictly typed.** Avoid `any`; prefer narrowing and the existing types in `src/data/types.ts`.
- **No new client-side constants imported into server components** — this has caused build issues before; keep data that's safe for the client in files without server-only imports.
- **Follow existing patterns** in the file you're editing over introducing a new one. This is a large, consistent codebase — a one-off abstraction for a single use site usually isn't worth it.
- **Don't add a database, auth, or backend service.** Solvarch is explicitly static-content + client-local-storage; if your contribution needs persistent server-side state, open an issue to discuss first.
- Run `npm run lint` before pushing; fix warnings in files you touched.

## Commit messages

Recent history uses short, imperative, `type: summary` messages (`feat: add roadmaps and review system`, `fix: correct import statement for useCodeDraft`). Follow that style — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` prefixes are all fine. Keep the subject line under ~72 characters; add a body if the *why* isn't obvious from the diff.

## Submitting a pull request

1. Fork the repo and create a branch off `master` (`git checkout -b feat/add-trie-problems`).
2. Keep the PR focused — one concern per PR (e.g., "add 3 Tries problems" rather than "add problems + refactor editor + fix typo").
3. Make sure `npm run lint` and `npm run build` both pass locally.
4. Fill out the PR template — link the issue it closes if there is one (`Closes #123`).
5. A maintainer will review and may ask for changes. Small, well-scoped PRs get reviewed fastest.

## Reporting bugs and requesting features

Please use the issue templates:

- **Bug report** — for anything broken (judge giving wrong verdicts, UI bugs, broken links).
- **Feature request** — for new capabilities or improvements.
- **New problem proposal** — for suggesting a specific DSA problem to add (or claim one from the [good first issue](https://github.com/ashishguleria04/Solvarch/labels/good%20first%20issue) list before starting work, so two people don't duplicate effort).

Security issues should **not** be filed as public issues — see [SECURITY.md](SECURITY.md).
