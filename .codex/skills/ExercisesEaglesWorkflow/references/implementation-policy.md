# Implementation Policy

Use this policy before editing production code, tests, scripts, docs, or runtime question-bank files.

## Scope

- Implement only the confirmed requirement and validation boundary.
- Do not add unrelated features, broad refactors, visual redesigns, generated artifacts, or formatting churn.
- If the confirmed design becomes impossible or risky, stop and explain the conflict before changing scope.

## Architecture

Follow the current project structure:

```text
pages -> viewmodels -> repositories -> utils/data
                |
                v
          models/quiz-session
```

Rules:

- Pages own WeChat Mini Program API calls, navigation, timers, touch handling, and `setData`.
- ViewModels translate app state and user actions into page data and commands.
- `QuizSession` owns quiz state transitions, answer behavior, scoring, view mode, and test timer state.
- Repositories expose stable data access for ViewModels.
- `question-bank-catalog.js` owns manifest normalization, book/chapter summaries, chapter quiz construction, and book draw quiz construction.
- Question-bank import, workspace, release, source-ledger, explanation, and ticket rules belong to `$question-bank-curator`.

## Code Shape

- Match existing naming, file organization, and error-handling patterns.
- Prefer existing helpers before adding new abstractions.
- Add abstractions only when they remove real duplication, preserve a boundary, or match an established local pattern.
- Avoid 800+ line files when responsibilities can be separated; allow large files only for generated/runtime data or tightly coupled framework code.
- Keep comments rare and useful.

## After Implementation

Summarize:

- What changed.
- Which confirmed validation or behavior boundary it satisfies.
- What did not change.
- Any unclear product or business boundary.

Do not continue to validation until the user explicitly says `可以`, unless the user already asked to directly implement the change.
