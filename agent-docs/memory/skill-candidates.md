# Skill Candidates

## Format

```md
### YYYY-MM-DD - <candidate skill>

Trigger:
Workflow:
Required context:
Validation:
Candidate owner:
```

### 2026-06-28 - Agentic dev loop hardening

Trigger: A task involves multiple subagents, Playwright verification, or long-running local servers.
Workflow: Enforce bounded subagent prompts, named Playwright sessions, red-green TDD evidence, task-file evidence updates, and cleanup checks.
Required context: `agent-docs/README.md`, `agent-docs/TESTING.md`, `agent-docs/PLAYWRIGHT_CLI.md`, current task file.
Validation: Forward-test on a frontend change and confirm no agent remains running, the task file contains red-green and verification evidence, and review does not block on missing evidence.
Candidate owner: Main agent.
