# Playwright CLI Guide

Use Playwright CLI for browser verification when a task changes UI, navigation, interaction, layout, or accessibility.

## Basic Flow

```sh
playwright-cli -s=library-review open http://127.0.0.1:5173/library --persistent
playwright-cli -s=library-review snapshot
playwright-cli -s=library-review click <ref>
playwright-cli -s=library-review press Tab
playwright-cli -s=library-review press Enter
playwright-cli -s=library-review resize 390 844
playwright-cli -s=library-review snapshot
playwright-cli -s=library-review resize 1440 900
playwright-cli -s=library-review snapshot
playwright-cli -s=library-review console
playwright-cli -s=library-review close
```

Use `npx playwright-cli` if `playwright-cli` is not available globally.

## Session Rules

- Start from the local dev server URL.
- Use a named persistent session for multi-step flows. The default session may close between commands in some environments.
- Use refs from `playwright-cli snapshot` for interactions.
- Refresh the snapshot when a state change makes refs stale.
- Prefer snapshots for structural verification and screenshots for visual defects or final evidence.
- Check console output before finishing.
- Close browser sessions after verification.

## Frontend Review Evidence

Record:

- URL and route.
- Viewports checked.
- Interaction path exercised.
- Console status.
- Any screenshots or snapshots that support findings.
- Whether issues are blocking or non-blocking.
