---
name: exercises-eagles-legacy-workflow
description: "Compatibility router for the old ExercisesEaglesWorkflow skill. Use only to route existing calls to the split ExercisesEagles / 题小鹰 workflow skills for analysis, design, tasks, test planning, implementation, review, delivery, Git, PR, release, or archive work."
---

# ExercisesEaglesWorkflow Compatibility Router

The former monolithic workflow has been split into focused project-local skills. Keep using this skill only as a compatibility entrypoint for old references.

## Route By Intent

| User intent | Use |
| --- | --- |
| Unsure which project workflow skill applies | `$exercises-eagles-workflow` |
| Requirement, bug, interaction, or existing-feature analysis | `$exercises-eagles-feature-analysis` |
| Design report, options, boundaries, or branch-name suggestions | `$exercises-eagles-feature-design` |
| Ordered task breakdown | `$exercises-eagles-feature-tasks` |
| Test or validation plan | `$exercises-eagles-test-plan` |
| Confirmed-scope implementation | `$exercises-eagles-implementation` |
| Review, checks, validation, or findings | `$exercises-eagles-review` |
| Changelog, commit details, PR copy, release copy, archive, or final delivery package | `$exercises-eagles-delivery` |
| Question-bank import, workspace, release, source-ledger, tickets, explanations, or runtime sync rules | `$question-bank-curator` |

## Shared Rule

Before non-trivial work, inspect `README.md`, `docs/workflow/git.md`, relevant docs under `docs/`, real source/config/scripts, and Git state. Protect unrelated user changes.
