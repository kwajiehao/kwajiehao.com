# Testing And Verification

Use this file for every task in the agent loop. Prefer tighter checks during execution, then full verification before handoff.

## Red-Green TDD Loop

Use red-green TDD for every behavior change.

1. Red: write or identify the smallest check that should fail before the change.
2. Run that focused check and record the failure.
3. Green: implement the smallest coherent change.
4. Rerun the focused check and record the pass.
5. Broaden to `npm run test`, `npm run build`, local server, and Playwright as required.

Acceptable red checks include:

- A Vitest unit test for parsing, filtering, sorting, data transforms, or helpers.
- A component or integration test when one is practical in the current stack.
- A documented Playwright/manual browser expectation for UI-only work where adding an automated test would be disproportionate.

If no red check is practical, record the reason before implementation and make the review agent evaluate that exception.

## Standard Commands

Install dependencies only when missing or stale:

```sh
npm install
```

Run unit tests:

```sh
npm run test
```

Run type-check and production build:

```sh
npm run build
```

Start the local dev server:

```sh
npm run dev -- --host 127.0.0.1 --port 5173
```

Codex agents should start this server with escalated sandbox permissions on the first attempt, because binding Vite to `127.0.0.1:5173` can fail in the default sandbox with `listen EPERM`.

Use these `exec_command` parameters:

```text
cmd: npm run dev -- --host 127.0.0.1 --port 5173
sandbox_permissions: require_escalated
justification: Do you want to allow starting the local Vite dev server on 127.0.0.1:5173 for repo verification?
prefix_rule: ["npm", "run", "dev"]
```

If port `5173` is busy, use the next free port and record it in the verification notes.

## Mandatory Local Server Check

Every verification loop must include starting the local dev server and checking that the site responds. For docs-only tasks, a single server smoke test is enough. For app changes, verify the changed route and user flow.

Minimum smoke checks:

```sh
curl -I http://127.0.0.1:5173/
curl -I http://127.0.0.1:5173/library
```

Stop the server after verification unless the user asked to keep it running.

## Frontend Verification

For UI changes, use Playwright CLI against the local server:

```sh
playwright-cli open http://127.0.0.1:5173/library
playwright-cli snapshot
playwright-cli console
playwright-cli resize 390 844
playwright-cli snapshot
playwright-cli resize 1440 900
playwright-cli snapshot
playwright-cli close
```

Use `npx playwright-cli` only if the global `playwright-cli` command is unavailable.

See `agent-docs/PLAYWRIGHT_CLI.md` for the repo-local browser verification workflow.

Required frontend evidence:

- Route loaded and primary content is visible.
- Main user flow works through browser interaction, not only code inspection.
- Desktop and mobile layouts do not overlap or clip important text.
- Keyboard and pointer interactions are usable.
- Console has no relevant errors.
- Empty, loading, and filtered states are checked when the task touches them.

## Evidence Format

Record verification in the task or handoff:

```md
Verification:
- Red-green: `<focused check>` failed before implementation, then passed after implementation
- `npm run test`: pass
- `npm run build`: pass
- Local server: `npm run dev -- --host 127.0.0.1 --port 5173`
- HTTP smoke: `/` 200, `/library` 200
- Playwright: desktop and mobile snapshots checked; no console errors
- Notes: ...
```

If a command fails for an environmental reason, include the exact failure and the next action needed.
