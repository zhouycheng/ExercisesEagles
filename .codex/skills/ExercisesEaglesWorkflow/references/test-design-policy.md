# Test Design Policy

Design tests or validation before implementation whenever behavior changes.

## Select The Validation Type

- Bug fix: write or describe a failing reproduction and a regression check.
- New feature: cover model/viewmodel behavior first, then page/component or manual WeChat validation when the feature crosses UI boundaries.
- Architecture cleanup: protect existing behavior with focused tests or command checks before moving code.
- Question-bank runtime changes: validate manifest counts, wrapper syntax, answer keys, explanations, and app-facing indexes.
- Product direction: define validation criteria, user scenarios, or prototype checks before implementation.
- Scripts, build, and release changes: include command-level validation and artifact checks.

## Tixiaoying Surfaces

Common surfaces:

- `miniprogram/models/quiz-session.js`.
- `miniprogram/viewmodels/`.
- `miniprogram/repositories/`.
- `miniprogram/utils/question-bank-catalog.js`.
- `miniprogram/data/question-banks/`.
- `miniprogram/page/` and `miniprogram/components/`.
- `project.config.json`.
- `.codex/skills/question-bank-curator/` and `docs/workflow/question-banks.md`.

## Test Design Output

Before writing tests or implementation, summarize:

- Behavior being protected.
- Test files or command checks to add or run.
- Important edge cases.
- What is intentionally out of scope.
- Manual WeChat Developer Tools checks, if automated coverage is not enough.

## Gate Rule

Do not write tests or implementation until the user explicitly says `可以`, unless the user already asked to directly implement the change.
