## Foundational rules
- After significant changes to the codebase that invalidate the information in this file, you must update this file so that it stays up-to-date. See the Directory section below on where to store and update information.

## Directory
Refer to the following files to get up-to-date quickly on how the repo works
- agent/FRONTEND.md for details on the frontend configuration

Make sure to also update these files where relevant when you make changes that invalidate the information in these files.

## Commands
- `npm run dev` — start Vite dev server
- `npm run build` — type-check and build to `dist/`
- `npm run preview` — preview production build locally
- `npm run test` — run Vitest (single run)
- `npm run test:watch` — run Vitest in watch mode

## Frontend development
Use playwright-cli for frontend development. Check playwright-cli --help for available commands.

## Journal
Store the journal in JOURNAL.md at the root of this repo.

## TDD scope
TDD is required for plugin code (`plugins/`) and utility functions. Layout, styling, and content changes don't require TDD.
