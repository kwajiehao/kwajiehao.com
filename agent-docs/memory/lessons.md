# Lessons

## Format

```md
### YYYY-MM-DD - <short lesson>

Context:
Decision or lesson:
Evidence:
Applies when:
```

### 2026-06-28 - Use named persistent Playwright CLI sessions

Context: During the library revamp verification, the default Playwright CLI session closed between commands for some agents, causing stale refs and incomplete frontend review.
Decision or lesson: Use a named persistent session such as `playwright-cli -s=library-review open <url> --persistent` for multi-step browser verification, refresh snapshots after state changes, and close sessions at the end.
Evidence: Main-thread verification succeeded with a named persistent session; subagents using default sessions struggled to complete interaction checks.
Applies when: Verifying multi-step UI flows with Playwright CLI.

### 2026-06-28 - Subagents need bounded stop conditions

Context: The execution and verification subagents spent too long in long-running work and had to be interrupted.
Decision or lesson: Give every subagent a bounded scope, explicit stop condition, and concise status instruction. The main agent should interrupt stalled agents and continue from concrete workspace state instead of waiting indefinitely.
Evidence: The main thread completed implementation review and verification after interrupting stalled subagents.
Applies when: Delegating execution, frontend review, or verification work.

### 2026-06-28 - Record verification evidence in the task file

Context: Code review initially blocked because verification evidence existed in chat/tool output but not in the task handoff evidence.
Decision or lesson: Treat the task file as the source of truth for acceptance evidence. Update it before asking review to pass.
Evidence: Once acceptance criteria and Playwright/test evidence were recorded in the task file, the review blocker was resolved.
Applies when: Closing any `agent-docs/tasks/` task.

### 2026-06-28 - Red-green TDD must be an explicit gate

Context: The library revamp was implemented and verified successfully, but the workflow did not force a red phase before implementation.
Decision or lesson: Require execution agents to define and run a focused failing check before coding, then record the green pass. If automated TDD is not practical for a UI-only change, require a documented browser/manual red check before implementation.
Evidence: The agent-docs workflow now includes red-green evidence in standards, testing, task templates, execution, and review.
Applies when: Planning or executing behavior changes.
