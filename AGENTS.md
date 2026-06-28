# Agent Guide

For non-trivial development work, use the repo-local workflow in `agent-docs/`.

Read `agent-docs/README.md` first, then load the specific skill for the next agent role before delegating work. Subagent prompts must explicitly say which skill to read, for example:

```text
Read and follow agent-docs/skills/execution-agent/SKILL.md before working.
```

Frontend changes require the frontend review agent and Playwright CLI verification. Every verification loop must include starting the local dev server and checking the changed route in a browser or HTTP smoke test.
