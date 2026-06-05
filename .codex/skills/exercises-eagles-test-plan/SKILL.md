---
name: exercises-eagles-test-plan
description: "Use for ExercisesEagles / 题小鹰 test plans and validation plans. Writes how to test model, ViewModel, repository, runtime data, Mini Program page/component, packaging, lint, and manual WeChat Developer Tools behavior; it does not run tests."
---

# ExercisesEagles Test Plan

Use this skill to design validation before implementation or before review. This skill writes the plan; it does not run checks.

## Inputs

- Requirement, analysis, design, tasks, or changed-file list.
- `README.md`, `docs/workflow/git.md`, and relevant docs.
- `docs/workflow/question-banks.md` when runtime bank data, manifest/latest, catalog logic, or upload package behavior is involved.
- `$question-bank-curator` for question-bank import, release, ticket, explanation, or source-ledger validation rules.

## Validation Selection

- Bug fix: include a reproduction and a regression check.
- New feature: cover model/ViewModel behavior first, then page/component or manual WeChat validation when UI boundaries are crossed.
- Architecture cleanup: protect current behavior before moving code.
- Question-bank runtime changes: include wrapper syntax, manifest/runtime counts, answer keys, explanations, and app-facing index consistency.
- Scripts, build, workflow, or release changes: include command-level checks and artifact checks.
- Product direction or prototype work: define user scenarios and acceptance criteria.

## Common Checks

Default command checks:

```bash
git diff --check
npm run lint
```

For runtime question-bank JavaScript wrappers:

```bash
find miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;
```

For runtime manifest count checks, use the manifest from `miniprogram/data/question-banks/manifest.js` and compare the actual books, chapters, and question counts needed by the change.

For pages, components, app config, project config, Mini Program npm output, or visible interactions, include WeChat Developer Tools compile, preview, or real-device validation. If those cannot run in the current environment, mark them as manual follow-up.

## Output

Return:

- Behavior being protected.
- Automated checks to run or add.
- Manual Mini Program checks.
- Edge cases and data cases.
- Out-of-scope validation.
- Acceptance criteria.

Do not execute the checks from this skill; use `$exercises-eagles-review` for that.
