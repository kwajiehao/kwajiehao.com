# Agent Memory System

The memory system captures durable lessons without turning the repo into a scratchpad.

## Goals

- Preserve repo-specific facts that repeatedly save time.
- Record testing recipes that caught real issues.
- Identify patterns that should become skills, scripts, or plugins.
- Give the main agent a reflection checkpoint at natural handoff points.

## Storage

- `agent-docs/memory/lessons.md`: stable repo lessons and decisions.
- `agent-docs/memory/skill-candidates.md`: repeated workflows that may become Codex skills.
- `agent-docs/memory/tooling-backlog.md`: tools, scripts, hooks, or plugins worth building.

Do not store secrets, credentials, private personal data, or raw logs unless they are scrubbed and directly useful.

## Reflection Hooks

Task generation:
- Read relevant memory before finalizing the task.
- Add applicable prior lessons to the task context.

Execution handoff:
- Note any repeated friction, unclear code boundary, missing helper, or brittle command.

Review:
- Record recurring defect patterns and standards gaps.
- Suggest skill or tooling updates when the same issue would be easy to prevent automatically.

Verification:
- Record commands, browser flows, and failure modes that future agents should reuse.

Main agent closeout:
- Promote only durable items into memory.
- Convert repeated lessons into skill edits or tool backlog entries.
- Keep transient observations in the task file, not memory.

## Promotion Criteria

Promote a lesson when at least one is true:

- It prevented or caught a bug.
- It explains a non-obvious repo convention.
- It saves meaningful time on future tasks.
- It occurred in two or more tasks.
- It identifies a missing reusable tool, script, skill, or plugin.

## Skill And Plugin Feedback

When a lesson points to automation, add it to `tooling-backlog.md` with:

- Problem:
- Frequency:
- Proposed tool or plugin:
- Inputs and outputs:
- Verification method:
- Priority:

When a lesson points to agent behavior, add it to `skill-candidates.md` with:

- Trigger:
- Workflow:
- Required context:
- Validation:
- Candidate owner:
