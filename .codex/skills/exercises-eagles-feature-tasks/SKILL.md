---
name: exercises-eagles-feature-tasks
description: "Use for ExercisesEagles / 题小鹰 ordered task breakdowns from a confirmed design, including file-level implementation tasks, dependencies, test tasks, documentation tasks, status marks, and small executable steps without writing full implementation."
---

# ExercisesEagles Feature Tasks

Use this skill to turn a confirmed design into an implementation task list.

## Inputs

- User request, design notes, and relevant analysis.
- Current source layout and touched files.
- `README.md`, `docs/workflow/git.md`, and docs relevant to the feature.
- `docs/workflow/question-banks.md` for runtime bank interactions; `$question-bank-curator` for data import, release, tickets, source ledger, or explanations.

## Task Shape

Create ordered tasks that are small enough to execute and review independently.

Include:

- Status marks such as `[ ]`, `[~]`, and `[x]` when the user wants a checklist.
- File-level paths and affected modules.
- Dependencies between tasks.
- Implementation skeletons only at the responsibility level; do not write full code in the task list.
- Focused test or validation tasks.
- Documentation, changelog, and archive-log tasks when commit-ready delivery will require them.

## Project Task Surfaces

Common surfaces:

- `miniprogram/page/` for WeChat page event bridges and `setData`.
- `miniprogram/viewmodels/` for page state and commands.
- `miniprogram/repositories/` for stable data access.
- `miniprogram/utils/question-bank-catalog.js` for manifest normalization and quiz data construction.
- `miniprogram/models/quiz-session.js` for quiz state, scoring, answer behavior, view mode, and timer state.
- `miniprogram/data/question-banks/` for runtime snapshot files.
- `project.config.json` for Mini Program project and upload behavior.
- `README.md`, `docs/changelog.md`, and `docs/workflow/` for durable docs.

## Output

Return inline tasks unless the user asks for `tasks.md`.

End with the recommended next skill:

- `$exercises-eagles-test-plan` when validation is not yet designed.
- `$exercises-eagles-implementation` when scope and validation are already clear.
