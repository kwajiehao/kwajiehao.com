# Coding Standards

These standards are based on John Ousterhout's design principles: reduce complexity, create deep modules with simple interfaces, hide information, design strategically, and write code for future readers.

## Design Principles

- Prefer strategic changes over tactical patches. Spend a little time improving the shape of the solution when it prevents recurring complexity.
- Keep interfaces simple and modules deep. A component or helper should hide meaningful detail behind a small API.
- Make common cases obvious and special cases rare. If a branch exists only to patch over a weak model, reconsider the model.
- Define errors out of existence when practical. Prefer data validation, clear types, and constrained inputs over scattered defensive checks.
- Keep related decisions together. Avoid spreading one concept across distant files unless the repo already has that pattern.
- Preserve consistency. Local style beats generic preference.
- Comments should explain non-obvious intent, invariants, and tradeoffs. Do not narrate code that already says what it does.

## Repository Standards

- Use TypeScript and Preact idioms already present in `src/`.
- Keep content data in `content/` and validation or virtual module logic in `plugins/`.
- Prefer structured parsing and typed data over string manipulation.
- Keep components focused. Extract helpers only when they reduce real duplication or isolate a meaningful concept.
- Avoid broad refactors when the task is narrow.
- Preserve existing user changes. Do not revert unrelated dirty files.
- New source files should follow the existing `ABOUTME` header style when adjacent files use it.

## Frontend Standards

- Make the first screen the actual product experience, not explanatory scaffolding.
- Favor quiet, browsable interfaces for content libraries. The library should support scanning, filtering, and comparison.
- Use semantic HTML first: headings, buttons, lists, details, forms, labels, and landmarks where appropriate.
- Interactive rows, toggles, filters, and accordions must work with keyboard and pointer input.
- Make focus states visible and meaningful.
- Maintain sufficient color contrast in light and dark themes.
- Use stable dimensions and responsive constraints so content changes do not cause layout jumps.
- Check mobile and desktop. Text must not overlap, clip, or require fragile viewport assumptions.
- Avoid card nesting, decorative clutter, one-note palettes, and oversized type inside dense tool surfaces.

## Testing Standards

- Practice red-green TDD for behavior changes. Define the smallest meaningful failing check first, run it red, implement the change, then rerun it green.
- Prefer automated red checks: unit tests, parser/plugin tests, component tests, or focused integration tests.
- For UI changes where no practical automated pre-check exists, define the expected browser failure before coding, then prove the green state with Playwright CLI after implementation.
- Do not skip red-green evidence silently. If TDD is not applicable, explain why in the task handoff.
- Add or update tests when behavior changes in parsing, filtering, sorting, rendering logic, or reusable helpers.
- For UI-only changes, use browser verification in addition to build and unit tests.
- Every task handoff must name the commands run and the result.
- Do not claim a user flow works without exercising it through the running app when browser behavior matters.
