# Playwright CLI Guide

Use Playwright CLI for browser verification when a task changes UI, navigation, interaction, layout, or accessibility.

## Basic Flow

```sh
playwright-cli open http://127.0.0.1:5173/library
playwright-cli snapshot
playwright-cli click <ref>
playwright-cli press Tab
playwright-cli press Enter
playwright-cli resize 390 844
playwright-cli snapshot
playwright-cli resize 1440 900
playwright-cli snapshot
playwright-cli console
playwright-cli close
```

Use `npx playwright-cli` if `playwright-cli` is not available globally.

## Session Rules

- Start from the local dev server URL.
- Use refs from `playwright-cli snapshot` for interactions.
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
