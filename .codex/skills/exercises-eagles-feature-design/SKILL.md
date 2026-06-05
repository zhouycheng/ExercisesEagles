---
name: exercises-eagles-feature-design
description: "Use for ExercisesEagles / 题小鹰 design reports, solution options, architecture boundaries, module responsibilities, data/interface changes, branch-name suggestions, acceptance criteria, and out-of-scope decisions before task breakdown or implementation."
---

# ExercisesEagles Feature Design

Use this skill after the requirement is understood and before writing tasks or code.

## Inputs

- User request and any prior `$exercises-eagles-feature-analysis` output.
- `README.md`, `docs/workflow/git.md`, relevant docs under `docs/`, and the affected source files.
- `docs/workflow/question-banks.md` when the feature touches runtime question-bank reading, manifest/latest files, catalog behavior, or app-facing bank data.
- `$question-bank-curator` when the work is about question-bank import, workspace, release, source ledger, tickets, or explanations.

## Design Content

Cover the parts that apply:

- Goals and non-goals.
- Current state and evidence from files.
- User-visible flow and failure states.
- Module responsibilities across pages, ViewModels, repositories, utilities/data, and `models/quiz-session.js`.
- Data model, URL parameter, storage key, runtime manifest, or config changes.
- Technical decisions and alternatives with cost, risk, testability, maintainability, and product impact.
- Acceptance criteria and what is explicitly out of scope.

## Branch Suggestions

When the user is preparing to implement, offer 2 to 4 branch names using `docs/workflow/git.md`:

- `feature/<name>` for user-visible features or complete flows.
- `fix/<name>` for bugs, regressions, compatibility issues, data errors, or build failures.
- `chore/<name>` for tooling, repo structure, scripts, CI, workflow, or generated metadata.
- `docs/<name>` for documentation-only changes.
- `release/vX.Y.Z` or `hotfix/vX.Y.Z` only for release preparation or urgent published-version fixes.

Use lowercase English words, numbers, and hyphens. Do not create or switch branches unless the user confirms.

## Output

Return inline design unless the user asks for `design.md`.

End with:

- Recommended path.
- Branch-name candidates when implementation is likely.
- Suggested next skill: `$exercises-eagles-feature-tasks`, `$exercises-eagles-test-plan`, or `$exercises-eagles-implementation`.
