---
name: verify
description: Build/launch/drive recipe for verifying Solvarch changes in a real browser.
---

# Verifying Solvarch

## Launch

- `npm run dev` (background). Port 3000 is often taken by the user's own server —
  read the startup log for the actual port (3001/3002/…) and target that one.
- **Stale `.next/dev` cache gotcha:** after adding/renaming routes, dev can 404
  routes that plainly exist (router never compiles them — log shows
  `Compiling /_not-found` instead of the route). Fix: kill the server,
  `rm -rf .next`, restart. `rm -rf .next` fails with "Directory not empty"
  while the server is still dying; wait 2s and retry.
- **Zombie servers:** stopping the background `npm run dev` task can leave the
  node child alive and still serving stale code on its port. Check
  `netstat -ano | grep :PORT` and `taskkill //PID <pid> //F` before trusting
  responses from that port.

## Drive

- Playwright works: browsers are preinstalled under `$LOCALAPPDATA/ms-playwright`,
  but the driver package is not resolvable globally (global npm prefix is broken).
  `npm i playwright` in a scratch dir and run scripts from there.
- Dev cold-compiles are slow (30–80s per route): navigate with
  `waitUntil: "load", timeout: 120000`, never `networkidle` (framer-motion keeps
  the network busy).
- **Hydration timing:** localStorage-backed UI (progress marks, streak, editor
  drafts) server-renders empty and flips after hydration. Always
  `waitForSelector` the expected state; reading counts/text immediately after
  `load` gives false negatives.
- **Monaco input:** `page.keyboard.type` races auto-closing brackets and drops
  chars. Set code via
  `page.evaluate(() => window.monaco.editor.getModels()[0].setValue(...))` —
  it still exercises the React onChange path.
- Judge (`/api/submit`, `/api/execute`) calls external runners (Paiza/Piston);
  verdicts take up to ~60s. Wrong-answer flow: submit `print('7 42')` on
  `/dsa/two-sum`.

## Flows worth driving

- Landing `/`: daily challenge card (client-picked from local date, deterministic
  across reloads).
- `/cs/os/processes-and-threads`: Mark as complete → reload → still Completed;
  `/cs/os` shows `1/7 completed` + row check; `/cs` card summary.
- `/system-design/design-url-shortener`: same mark-complete flow; index summary.
- `/dsa/two-sum`: edit code → draft in `localStorage["solvarch.code.v1:two-sum"]`
  (400ms debounce) → reload restores; Reset button restores starter and clears
  the draft; language choice persists too.
- Progress store lives in `localStorage["solvarch.progress.v1"]`.

## Environment gotchas

- Something on this machine auto-commits working-tree changes with generated
  conventional-commit messages. `git status` being clean does NOT mean no work
  happened — check `git log` for the session's commits.
- Some git commands' stdout gets swallowed in the Bash tool; redirect to a file
  and read it if output comes back empty unexpectedly.
