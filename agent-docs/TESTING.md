# Testing And Verification

Use this file for every task in the agent loop. Prefer tighter checks during execution, then full verification before handoff.

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
- `npm run test`: pass
- `npm run build`: pass
- Local server: `npm run dev -- --host 127.0.0.1 --port 5173`
- HTTP smoke: `/` 200, `/library` 200
- Playwright: desktop and mobile snapshots checked; no console errors
- Notes: ...
```

If a command fails for an environmental reason, include the exact failure and the next action needed.
