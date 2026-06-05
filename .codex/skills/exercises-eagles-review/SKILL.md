---
name: exercises-eagles-review
description: "Use for ExercisesEagles / 题小鹰 code review, changed-file inspection, validation, lint, runtime syntax checks, Mini Program manual validation reporting, stale-doc checks, and risk reporting after implementation. Does not prepare commit, PR, release, or archive copy."
---

# ExercisesEagles Review

Use this skill after implementation or when the user asks for review, validation, checks, or risk assessment.

## Review Inputs

- `git status --short --branch`.
- `git diff --stat` and focused diffs for changed files.
- Relevant docs: `README.md`, `docs/workflow/git.md`, `docs/workflow/question-banks.md`, and `docs/changelog.md` when touched.
- `$question-bank-curator` rules when reviewing question-bank import, release, tickets, explanations, or source-ledger changes.

## Review Focus

Prioritize findings by severity:

- Product boundary creep.
- Architecture boundary violations between pages, ViewModels, models, repositories, and data utilities.
- Missing validation for changed behavior.
- Broken question-bank runtime assumptions.
- Broken packaging or upload assumptions in `project.config.json`.
- Stale docs or changelog caused by the change.
- Unrelated user changes accidentally included.

## Default Checks

Run checks that match touched files. Defaults:

```bash
git diff --check
npm run lint
```

For runtime question-bank changes:

```bash
find miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;
```

Also verify manifest/runtime counts when manifest, latest, bank files, wrappers, or catalog logic change.

Add relevant checks:

- `node --check` for changed JavaScript entrypoints when lint is too broad or unavailable.
- WeChat Developer Tools compile, preview, or real-device validation for page, component, app config, project config, tabBar, or interaction changes.
- Packaging/upload checks when `project.config.json` or `packOptions` changes.

## Reporting

For review requests, lead with findings ordered by severity and file/line references. If there are no issues, say that clearly and mention remaining test gaps or manual validation that could not run.

For validation requests, report:

- Commands run.
- Concrete pass/fail result.
- Root cause for failures when known.
- Fix and re-run result when a fix was made.

Do not prepare commit details, PR copy, release copy, or archives from this skill; use `$exercises-eagles-delivery`.
