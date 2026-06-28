# Task Template

Copy this template into `agent-docs/tasks/YYYY-MM-DD-short-slug.md`.

```md
# Task: <short title>

Date: <YYYY-MM-DD>
Owner: <main agent or subagent id>
Status: Draft | Ready | In Progress | In Review | Needs Changes | Verified | Closed

## User Request

<quote or concise paraphrase>

## Outcome

<one or two sentences describing the user-visible result>

## Context

- Relevant files:
- Existing behavior:
- Constraints:
- Non-goals:

## Agent Roles

- Task generation:
- Execution:
- Review:
- Frontend review:
- Verification:

## Implementation Notes

- Expected files or ownership boundary:
- Data model or API changes:
- Accessibility and responsive concerns:
- Risks:

## Red-Green TDD Plan

- Red check:
- Expected initial failure:
- Green check:
- Exception reason if TDD is not practical:

## Self-Verifying Acceptance Criteria

Every criterion must include how to prove it. Include at least one local-server criterion for every task.

| ID | Criterion | Validation action | Expected evidence | Status |
|---|---|---|---|---|
| AC1 | <behavior or quality bar> | <command, test, browser action, or inspection> | <observable result> | Pending |
| AC2 | Local dev server runs and changed route responds | Start `npm run dev -- --host 127.0.0.1 --port 5173`; check route | HTTP 200 or browser-rendered route with no blocking errors | Pending |

## Test Plan

- Unit or integration tests:
- Build:
- Local server:
- Playwright CLI flow:
- Manual checks:

## Handoff Evidence

- Commands run:
- Red-green evidence:
- Browser routes checked:
- Artifacts:
- Known limitations:

## Review Notes

- Blocking findings:
- Non-blocking findings:
- Reviewer decision:

## Memory Candidates

- Lessons:
- Skill candidates:
- Tool or plugin ideas:
```
