# Agent Docs

This directory defines the development loop for this site. The goal is fast iteration without losing independent verification.

## Canonical Loop

1. Main agent receives the user request and reads this file.
2. Main agent invokes the task generation agent with `agent-docs/skills/task-generation-agent/SKILL.md`.
3. Task generation agent creates or updates a task file under `agent-docs/tasks/` using `agent-docs/TASK_TEMPLATE.md`.
4. Main agent invokes the execution agent with `agent-docs/skills/execution-agent/SKILL.md`.
5. Execution agent practices red-green TDD, implements the task, follows `agent-docs/CODING_STANDARDS.md`, and records focused test evidence.
6. Main agent invokes the review agent with `agent-docs/skills/review-agent/SKILL.md`.
7. Review agent decides whether specialist verification is needed. UI work always requires `agent-docs/skills/frontend-review-agent/SKILL.md`.
8. Verification agent runs the final checks with `agent-docs/skills/verification-agent/SKILL.md`. The loop always includes a local dev server smoke test.
9. Main agent either sends findings back to execution or closes the task with evidence.
10. Main agent updates memory using `agent-docs/MEMORY_SYSTEM.md` when there are durable learnings.

## Role Boundaries

Task generation agent: turns an underspecified request into an executable task with self-verifying acceptance criteria. It does not edit product code.

Execution agent: owns implementation. It reads the task, standards, and testing guidance before editing. It does not declare the task complete without evidence.

Review agent: acts as an independent staff engineer. It reviews the diff, task fit, complexity, maintainability, and test gaps. It can request verification but should not blur review judgment with implementation.

Verification agent: executes tests and browser checks. It records commands, routes, observations, and artifacts. It does not fix code.

Frontend review agent: specialist frontend reviewer using Playwright CLI. It checks task correctness, accessibility, responsive behavior, interaction quality, visual polish, and console errors.

## Subagent Control Rules

Subagents accelerate work only when their output is bounded and independently useful. The main agent owns orchestration, integration, and final evidence.

- Use `fork_context: false` when the goal is to clear context or get an independent pass.
- Give each subagent a concrete role, file scope, and stop condition.
- Ask execution agents to report changed files and checks immediately after their bounded task.
- Do not wait indefinitely. If a subagent stalls on a long-running server or browser session, interrupt it, ask for concise status, and continue from the current workspace state.
- Record verification evidence in the task file, not only in chat or subagent messages.
- Close completed or stuck subagents after their output is no longer needed.

## Review And Verification Split

Keep review and verification separate by default. Review is judgment about whether the change should be accepted. Verification is evidence from running the system. A frontend reviewer may use Playwright while reviewing, but the verification agent still owns the final command log and live-server evidence.

## Automatic Invocation Contract

The main agent must include the relevant skill path in every subagent prompt. Use this exact form:

```text
Read and follow agent-docs/skills/<role>/SKILL.md. Also read agent-docs/CODING_STANDARDS.md, agent-docs/TESTING.md, and the task file if your skill requires them.
```

For frontend changes, include both review roles:

```text
Read and follow agent-docs/skills/frontend-review-agent/SKILL.md. Use playwright-cli against the local dev server and verify the primary user flow on desktop and mobile.
```

## Artifacts

- Task specs: `agent-docs/tasks/YYYY-MM-DD-short-slug.md`
- Task template: `agent-docs/TASK_TEMPLATE.md`
- Review template: `agent-docs/REVIEW_TEMPLATE.md`
- Playwright CLI guide: `agent-docs/PLAYWRIGHT_CLI.md`
- Standards: `agent-docs/CODING_STANDARDS.md`
- Testing guidance: `agent-docs/TESTING.md`
- Durable memory: `agent-docs/memory/`

## Gate To Finish

A task is not done until:

- Acceptance criteria in the task file have concrete evidence.
- Red-green TDD evidence is recorded, or a specific exception is documented.
- `npm run test` and `npm run build` have been run or a documented reason explains why they were not applicable.
- The local dev server has been started and verified.
- UI work has Playwright CLI evidence on at least desktop and mobile viewports.
- Review has no blocking findings.
- Any durable lessons or tool ideas have been considered for memory.
