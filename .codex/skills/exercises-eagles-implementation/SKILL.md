---
name: exercises-eagles-implementation
description: "Use for ExercisesEagles / 题小鹰 confirmed-scope implementation in code, tests, docs, scripts, config, or runtime question-bank files. Follow local Mini Program architecture, protect unrelated changes, use question-bank-curator for data import/release rules, and stop for validation unless implementation plus validation was requested."
---

# ExercisesEagles Implementation

Use this skill only when the scope is confirmed or the user directly asks for implementation.

## Before Editing

- Inspect `git status --short --branch` and the relevant source files.
- Read `README.md`, `docs/workflow/git.md`, and docs relevant to the change.
- Use `$exercises-eagles-test-plan` first when validation boundaries are unclear.
- For question-bank import, workspace, release, source-ledger, ticket, or explanation work, use `$question-bank-curator`.
- Do not stage, commit, revert, delete, or format unrelated user changes.

## Architecture Rules

Follow the current project shape:

```text
pages -> viewmodels -> repositories -> utils/data
                |
                v
          models/quiz-session
```

- Pages own WeChat Mini Program API calls, navigation, timers, touch handling, and `setData`.
- ViewModels translate app state and user actions into page data and commands.
- `QuizSession` owns quiz state transitions, answer behavior, scoring, view mode, and test timer state.
- Repositories expose stable data access for ViewModels.
- `question-bank-catalog.js` owns manifest normalization, book/chapter summaries, chapter quiz construction, and book draw quiz construction.
- Runtime question-bank files under `miniprogram/data/question-banks/` must keep JSON and CommonJS wrapper expectations aligned.

## Code Shape

- Match existing naming, file organization, and error-handling patterns.
- Prefer existing helpers before adding new abstractions.
- Add abstractions only when they remove real duplication, preserve a boundary, or match an established local pattern.
- Avoid large unrelated refactors, visual redesigns, generated artifacts, or formatting churn.
- Keep comments rare and useful.

## After Implementation

Summarize:

- What changed.
- Which confirmed behavior or validation boundary it satisfies.
- What did not change.
- Any unclear product or business boundary.

If the user did not ask for validation in the same turn, stop after implementation and suggest `$exercises-eagles-review`.
