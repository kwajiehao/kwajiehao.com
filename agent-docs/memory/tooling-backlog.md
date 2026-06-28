# Tooling Backlog

## Format

```md
### YYYY-MM-DD - <tool or plugin idea>

Problem:
Frequency:
Proposed tool or plugin:
Inputs:
Outputs:
Verification method:
Priority:
```

### 2026-06-28 - Verification runner script

Problem: Verification evidence is currently assembled manually across `npm run test`, `npm run build`, server start, curl smoke checks, and Playwright CLI.
Frequency: Every frontend or route-changing task.
Proposed tool or plugin: Add a repo script that starts Vite on a free port, runs HTTP smoke checks, runs a supplied Playwright CLI scenario with a named persistent session, captures artifact paths, and stops the server.
Inputs: Route, viewport list, interaction scenario, optional expected text.
Outputs: Markdown evidence block suitable for a task file.
Verification method: Run the script against `/library` and confirm it reports test/build/server/browser results and leaves no port listener.
Priority: High.

### 2026-06-28 - Subagent watchdog checklist

Problem: Subagents can stall on long-running servers or browser sessions and delay the main loop.
Frequency: Any delegated verification or frontend review.
Proposed tool or plugin: A lightweight orchestration checklist or helper that records spawned agents, expected output, timeout, interrupt message, and close status.
Inputs: Agent id, role, timeout, expected artifact.
Outputs: Status summary and recommended interrupt/close action.
Verification method: Use it in a delegated frontend task and confirm stalled agents are interrupted and closed without losing workspace progress.
Priority: Medium.

### 2026-06-28 - TDD evidence helper

Problem: Red-green evidence can be forgotten unless task files require it and commands are easy to record.
Frequency: Every behavior-changing task.
Proposed tool or plugin: Add a small task-file updater or checklist that prompts for red command, red result, green command, green result, and exception reason.
Inputs: Task file path and command/result snippets.
Outputs: Updated `Red-Green TDD Plan` and handoff evidence sections.
Verification method: Use it on a sample task and verify review-agent sees complete red-green evidence.
Priority: Medium.
