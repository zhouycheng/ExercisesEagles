---
name: exercises-eagles-workflow
description: "Lightweight router for the ExercisesEagles / 题小鹰 project-level workflow skills. Use when the user asks for the full workflow, is unsure which project skill to use, or requests work spanning requirement analysis, design, task breakdown, test planning, implementation, review, validation, Git, PR, release, archive, or delivery."
---

# ExercisesEagles Workflow Router

Use this as the project entrypoint for `/Users/leftzhou/WorkSpace.localized/ExercisesEagles`. Route to the smallest project-local skill that fits the request.

## Common Ground Rules

- Work in this repository unless the user changes scope.
- Read `README.md`, `docs/workflow/git.md`, and relevant docs under `docs/` before non-trivial work.
- For question-bank import, normalization, workspace, release, source-ledger, ticket, explanation, or runtime sync rules, use `$question-bank-curator`; do not duplicate or edit that skill.
- Inspect real source, tests, scripts, config, and Git state before changing behavior.
- If docs and code disagree, prefer actual implementation only when it has clearly moved ahead of stale docs; otherwise surface the conflict.
- Protect unrelated user changes and keep work scoped to the active request.

## Skill Router

| User intent | Skill |
| --- | --- |
| Analyze a requirement, bug, feature, interaction chain, logic tree, or existing behavior | `$exercises-eagles-feature-analysis` |
| Write a design report, options, boundaries, architecture decisions, or branch-name suggestions | `$exercises-eagles-feature-design` |
| Break a design into ordered implementation tasks | `$exercises-eagles-feature-tasks` |
| Write a test plan or validation plan | `$exercises-eagles-test-plan` |
| Implement confirmed scope | `$exercises-eagles-implementation` |
| Review changed files or run validation | `$exercises-eagles-review` |
| Prepare changelog, commit details, PR copy, release copy, archive, or final delivery package | `$exercises-eagles-delivery` |

## Project Shape

题小鹰 is a WeChat Mini Program local question-bank practice app. The main app flow is:

```text
pages -> viewmodels -> repositories -> utils/data
                |
                v
          models/quiz-session
```

The runtime question-bank snapshot lives under `miniprogram/data/question-banks/`; source and release maintenance data lives under `data/question-banks/`.
