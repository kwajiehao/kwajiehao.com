# Review Template

Use this format for review handoffs. Lead with findings.

```md
# Review: <task title>

Decision: Pass | Needs Changes | Blocked

## Findings

| Severity | File | Issue | Why it matters | Suggested fix |
|---|---|---|---|---|
| Blocking | `<path:line>` | <specific issue> | <impact> | <fix direction> |

## Acceptance Criteria

| ID | Status | Evidence or gap |
|---|---|---|
| AC1 | Pass/Fail/Unknown | <evidence> |

## Verification

- Red-green evidence:
- Tests reviewed:
- Local server evidence:
- Playwright evidence:
- Missing verification:

## Complexity And Maintainability

- Interface quality:
- Data flow:
- Error handling:
- Test coverage:

## Loop Decision

- Return to execution because:
- Invoke verification because:
- Close task because:
```
