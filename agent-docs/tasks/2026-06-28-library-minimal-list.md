# Task: Library Minimal List Revamp

Date: 2026-06-28
Owner: main agent
Status: Verified

## User Request

Revamp the website library of books. The current maximalist card grid is hard to browse. Make it minimalist: each book gets a single line of key information such as title, authors, publisher, and year. Tapping that line drops down a blurb and additional metadata.

## Outcome

The `/library` page becomes a scannable text-first list. Users can keep using search, filters, and sorting, then expand a book row in place for notes and metadata without opening a modal.

## Context

- Relevant files:
  - `src/pages/LibraryPage.tsx`
  - `src/components/BookCard.tsx`
  - `src/components/BookModal.tsx`
  - `src/components/BookFilterBar.tsx`
  - `src/types.ts`
  - `content/books.yaml`
- Existing behavior:
  - `/library` renders a responsive card grid using `BookCard`.
  - Clicking a card opens `BookModal`.
  - Search includes title, author, publisher, and note text.
  - Tag filtering uses AND semantics.
  - Sorting supports date added, title, author, and year.
- Constraints:
  - Keep the data model stable unless the implementation proves a narrow type addition is needed.
  - Preserve search, tag filtering, result counts, clear filters, and sorting.
  - Design should be quiet, text-first, and easy to scan.
  - The row toggle must work on mobile, pointer, and keyboard.
- Non-goals:
  - Do not add external book APIs.
  - Do not redesign the whole site navigation or theme system.
  - Do not add new book content.

## Agent Roles

- Task generation: `agent-docs/skills/task-generation-agent/SKILL.md`
- Execution: `agent-docs/skills/execution-agent/SKILL.md`
- Review: `agent-docs/skills/review-agent/SKILL.md`
- Frontend review: `agent-docs/skills/frontend-review-agent/SKILL.md`
- Verification: `agent-docs/skills/verification-agent/SKILL.md`

## Implementation Notes

- Expected files or ownership boundary:
  - Replace the card grid in `LibraryPage.tsx` with a list/accordion surface.
  - Replace or retire `BookCard` and `BookModal` only if they are no longer used.
  - Add a focused list item component if it keeps `LibraryPage.tsx` simple.
- Data model or API changes:
  - Current `Book` fields are enough: `title`, `author`, `year`, `publisher`, `tags`, `notes`, `dateAdded`, and optional `coverImage`.
  - `notes` are the current blurb source.
- Accessibility and responsive concerns:
  - Prefer native `details`/`summary` or a button with `aria-expanded`.
  - Row summaries must not rely on hover.
  - Expanded content must be reachable and understandable by keyboard and screen readers.
  - Long titles, multiple authors, and missing optional metadata must wrap without overlap.
- Risks:
  - Removing the modal may leave dead component imports or tests unadjusted.
  - Dense rows can become visually cramped on mobile if metadata is not prioritized.
  - Native `summary` styling needs care so the whole row feels clickable without looking heavy.

## Self-Verifying Acceptance Criteria

| ID | Criterion | Validation action | Expected evidence | Status |
|---|---|---|---|---|
| AC1 | `/library` renders books as a minimalist text list instead of the current image card grid. | Inspect `LibraryPage.tsx` and open `/library` in browser. | `LibraryPage.tsx` renders a `<ul>` of `BookListItem`; Playwright desktop snapshot `page-2026-06-28T08-43-42-670Z.yml` shows compact row buttons and no card grid/modal. | Pass |
| AC2 | Each collapsed row shows key information: title, author or authors, and available year/publisher metadata. | Use Playwright snapshot on `/library` desktop and mobile. | Desktop snapshot `page-2026-06-28T08-43-42-670Z.yml` and mobile snapshot `page-2026-06-28T08-46-56-669Z.yml` show title, author, and publisher/year per row. | Pass |
| AC3 | Tapping or activating a row expands inline details with blurb and additional metadata. | Use Playwright CLI to click or press Enter/Space on a row. | Click snapshot `page-2026-06-28T08-44-06-667Z.yml` shows inline note, date, publisher/year/added metadata, and tags; Enter collapsed it in `page-2026-06-28T08-44-18-492Z.yml`. | Pass |
| AC4 | Search, tag filters, clear filters, result count, and sort controls still work. | Exercise search, a tag toggle, clear, and each sort option in browser. | Playwright verified title search, note search, `japan` tag filter, Clear filters, all sort buttons, empty state, and no console errors. | Pass |
| AC5 | Keyboard and accessibility behavior is valid for the row toggles. | Tab to a row, toggle with keyboard, inspect semantic control in snapshot or DOM. | `BookListItem` uses a native button with `aria-expanded`, `aria-controls`, and focus-visible styling; Playwright Enter toggled collapse. | Pass |
| AC6 | Mobile layout remains readable and touch-friendly. | Resize Playwright to `390 844`, inspect and interact with rows. | Mobile snapshots `page-2026-06-28T08-46-56-669Z.yml` and `page-2026-06-28T08-47-11-074Z.yml` show readable rows and expanded details. | Pass |
| AC7 | Local dev server runs and `/library` responds. | Start `npm run dev -- --host 127.0.0.1 --port 5173`; check `/library`. | Vite served `http://127.0.0.1:5173/`; `curl -I /` and `curl -I /library` returned HTTP 200. | Pass |
| AC8 | Project checks pass. | Run `npm run test` and `npm run build`. | `npm run test` passed 53 tests; `npm run build` passed and prerendered `/library`. | Pass |

## Test Plan

- Unit or integration tests:
  - Run `npm run test`.
  - Add focused tests only if sorting/filtering behavior or parsing logic changes.
- Build:
  - Run `npm run build`.
- Local server:
  - Run `npm run dev -- --host 127.0.0.1 --port 5173`.
  - Smoke-check `/` and `/library`.
- Playwright CLI flow:
  - Open `/library`.
  - Snapshot collapsed list.
  - Expand and collapse at least one row.
  - Search for a title and a note term.
  - Toggle a tag and clear filters.
  - Check sort options.
  - Resize to `390 844` and repeat row expansion.
  - Check console output.
- Manual checks:
  - Light and dark theme row contrast.
  - Long title and multiple-author wrapping.
  - Empty state after an unmatched search.

## Handoff Evidence

- Commands run:
  - `npm run test`: pass, 53 tests.
  - `npm run build`: pass.
  - `npm run dev -- --host 127.0.0.1 --port 5173`: server started.
  - `curl -I http://127.0.0.1:5173/`: HTTP 200.
  - `curl -I http://127.0.0.1:5173/library`: HTTP 200.
  - `playwright-cli -s=library-review open http://127.0.0.1:5173/library --persistent`: pass.
  - Playwright interactions: expand row, keyboard collapse, title search, note search, tag filter, clear filters, Recent/Title/Author/Year sort controls, empty state, mobile resize and expansion, console checks.
- Browser routes checked:
  - `/`
  - `/library`
- Artifacts:
  - `.playwright-cli/page-2026-06-28T08-43-42-670Z.yml`: desktop collapsed list.
  - `.playwright-cli/page-2026-06-28T08-44-06-667Z.yml`: desktop expanded row.
  - `.playwright-cli/page-2026-06-28T08-44-18-492Z.yml`: keyboard-collapsed row.
  - `.playwright-cli/page-2026-06-28T08-45-12-785Z.yml`: `japan` tag filter.
  - `.playwright-cli/page-2026-06-28T08-45-55-941Z.yml`: Title sort.
  - `.playwright-cli/page-2026-06-28T08-46-56-669Z.yml`: mobile collapsed list.
  - `.playwright-cli/page-2026-06-28T08-47-11-074Z.yml`: mobile expanded row.
- Known limitations:
  - No automated browser test was added; verification was performed with Playwright CLI snapshots and interactions.

## Review Notes

- Blocking findings:
  - Initial code review blocked on missing recorded verification evidence. Evidence has now been recorded above.
- Non-blocking findings:
  - Frontend reviewer found no blocking product-code issue. Its own Playwright session was unstable, but the verification agent and main-thread Playwright pass completed the missing browser interactions.
- Reviewer decision:
  - Verified. Code review found no implementation defect, frontend review found no product-code blocker, and verification agent confirmed tests, build, local server, desktop/mobile Playwright flows, and clean console.

## Memory Candidates

- Lessons:
  - Use a named persistent Playwright CLI session for multi-step browser verification when the default session exits between commands.
- Skill candidates:
- Tool or plugin ideas:
