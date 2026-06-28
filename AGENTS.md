# Agent Guide

For non-trivial development work, use the repo-local workflow in `agent-docs/`.

For non-trivial development work in this repository, the user explicitly requests and authorizes subagents, delegation, and parallel agent work through the repo-local workflow in `agent-docs/`. If the subagent tool is available, spawn the required agents instead of self-performing those roles solely because the current task prompt did not repeat the word "delegate".

Read `agent-docs/README.md` first, then load the specific skill for the next agent role before delegating work. Subagent prompts must explicitly say which skill to read, for example:

```text
Read and follow agent-docs/skills/execution-agent/SKILL.md before working.
```

Frontend changes require the frontend review agent and Playwright CLI verification. Every verification loop must include starting the local dev server and checking the changed route in a browser or HTTP smoke test.

Local dev server sandbox note: in this workspace, starting Vite on `127.0.0.1:5173` can fail inside the default sandbox with `listen EPERM`. When an agent starts the dev server, request escalation on the first attempt instead of trying the sandboxed command first:

```text
cmd: npm run dev -- --host 127.0.0.1 --port 5173
sandbox_permissions: require_escalated
justification: Do you want to allow starting the local Vite dev server on 127.0.0.1:5173 for repo verification?
prefix_rule: ["npm", "run", "dev"]
```

If port `5173` is busy, use the next free port with the same escalation pattern and record the URL in verification evidence.

For agentic development, red-green TDD is a key instruction. Before implementation, define the smallest meaningful failing check, run it red, implement, then rerun it green. If no pre-implementation automated check is practical, document the reason and define a browser/manual red check before coding.
