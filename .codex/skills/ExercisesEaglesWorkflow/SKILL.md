---
name: ExercisesEaglesWorkflow
description: Use when working in the Tixiaoying project on requirement discussion, bug fixes, new features, architecture cleanup, product direction, branch or worktree setup, test design, implementation, validation, documentation, changelog updates, commit message preparation, PR preparation, release tags, question-bank runtime changes, or any non-trivial project workflow. Inspect project docs and actual code; when docs lag behind a clearly advanced implementation, prefer the real project state and mark docs stale.
---

# 题小鹰 Project Workflow

Use this skill for non-trivial work in `/Users/leftzhou/WorkSpace.localized/题小鹰/project`, from initial requirement discussion through PR preparation. This is the project workflow skill, not just a Git helper.

## First Checks

Before proposing or changing anything:

1. Read `README.md`, `docs/workflow/git.md`, and relevant docs under `docs/`.
2. For question-bank data, runtime snapshot, manifest, source ledger, import tickets, or release sync work, read `docs/workflow/question-banks.md` and use `$question-bank-curator`.
3. Inspect the real project state with targeted file searches and source reads. Do not rely on docs alone.
4. Inspect `git status --short --branch` and `git branch --show-current`; inspect recent history when branch context matters.
5. When the solution depends on current framework behavior, APIs, tooling, product practice, or market-standard implementation choices, check official documentation or credible professional sources before recommending a path.

If docs and code disagree, decide whether the code has clearly moved beyond the docs or whether the code is drifting away from a confirmed rule. Prefer actual project state only when implementation is ahead; otherwise surface the conflict and ask or propose a correction.

## References

- Read `references/branch-and-worktree-policy.md` before creating, naming, switching, syncing, or troubleshooting branches and worktrees.
- Read `references/test-design-policy.md` before writing tests or code.
- Read `references/implementation-policy.md` before editing production code, scripts, tests, docs, or question-bank runtime files.
- Read `references/review-and-validation-policy.md` before reviewing, running checks, building, or reporting validation results.
- Read `references/documentation-and-pr-policy.md` before updating docs, changelog, preparing commit details, or preparing PR copy.
- Read `references/commit-policy.md` when drafting, splitting, or reviewing commit messages.
- Read `references/release-policy.md` for release branches, hotfix branches, release notes, or tags.

## Workflow Gates

### Gate 1: Requirement And Solution Discussion

Understand the request, the project reality, and the relevant external practice before proposing a final plan.

- Do not simply agree with the user. Challenge weak assumptions and offer stronger product, engineering, or maintenance alternatives when they fit.
- Present meaningful options with strengths, tradeoffs, cost, risk, testability, maintainability, and product impact.
- Ask boundary questions as needed.
- Do not move to branch setup or execution until the user explicitly says `可以`, unless the user directly asks you to implement or update files in the current turn.

### Gate 2: Branch Or Worktree Setup

Protect `main` and keep task work isolated.

- `main` is the only long-lived trunk branch.
- Do not do daily development work directly on `main`.
- Use short-lived branches: `feature/*`, `fix/*`, `chore/*`, `docs/*`, `release/*`, or `hotfix/*`.
- Keep one branch focused on one kind of change.
- Use lowercase English, numbers, and hyphens in branch names.
- Do not stage, commit, revert, delete, or format unrelated user changes.

**Branch Selection by intent:**

| Prefix | Use |
|---|---|
| `feature/<name>` | user-visible capability or complete flow |
| `fix/<name>` | bug fix, regression, compatibility issue, data error, build failure |
| `chore/<name>` | tooling, dependencies, repo structure, CI, workflow, metadata |
| `docs/<name>` | documentation-only change |
| `release/vX.Y.Z` | release preparation |
| `hotfix/vX.Y.Z` | urgent fix for an already released version |

When starting a new task, offer 2 to 4 suitable branch names unless the user already gave an exact name. Validate candidate names with `git check-ref-format --branch <branch-name>`.

**Worktree Rule:**

Prefer `git worktree` when the current checkout has unrelated uncommitted work or the user needs a separate task without disturbing the current workspace. Use `worktrees/<task-slug>`.

From latest remote `main`:
```bash
git fetch origin
git worktree add worktrees/<task-slug> -b <branch-name> origin/main
```

Open an existing branch:
```bash
git worktree add worktrees/<task-slug> <branch-name>
```

Do not delete a worktree until its branch has been merged, pushed, or explicitly abandoned and its local status is clean.

**Branch Creation Troubleshooting:**

If branch creation reports `cannot lock ref`, do not assume the name is bad. Check both format and existing refs:
```bash
git check-ref-format --branch <branch-name>
git branch --list <prefix>
git branch --list '<prefix>/*'
git for-each-ref --format='%(refname:short)' refs/heads refs/remotes/origin
```

Treat it as a real ref path conflict only when a branch and branch namespace occupy the same path, such as existing `fix` vs requested `fix/example`. If no ref conflict exists and the error mentions `.git/refs/heads/`, `Operation not permitted`, `Permission denied`, `unable to create directory`, or `couldn't create`, classify it as an environment or sandbox write problem and retry with permission to write Git refs.

After creating or opening the task branch, check whether the remote base has new commits and sync appropriately.

### Gate 3: Test Design

Design tests or validation before implementation.

- Choose unit, model/viewmodel, repository, runtime data, lint, WeChat Developer Tools, or manual validation based on the actual change.
- Confirm behavior boundaries and product expectations with the user when the change is ambiguous.
- Do not write tests until the user explicitly says `可以`, unless the user already requested direct implementation.

### Gate 4: Implementation

Implement only the confirmed scope.

- Follow the current project shape: pages call ViewModels; ViewModels use repositories/models; question-bank data flows through `question-bank-catalog.js`.
- Use `$question-bank-curator` for data import, workspace, release, source-ledger, ticket, explanation, or runtime sync rules.
- Do not add unrelated features, broad refactors, formatting churn, or generated artifacts.
- Avoid very large files when responsibilities can be separated.
- After implementation, summarize what changed, what did not change, and any uncertain boundary.
- Do not proceed to validation until the user explicitly says `可以`, unless the user already requested direct implementation.

### Gate 5: Review And Validation

Run checks that match the touched files and review the product boundary.

Default required checks:
```bash
git diff --check
npm run lint
```

For question-bank runtime changes, also run:
```bash
find miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;
```

For mini-program pages, components, npm build output, cloud functions, or project config changes, also report the needed WeChat Developer Tools validation, such as build npm, compile, preview, or real-device testing. If it cannot be run from the current environment, say so clearly.

- If issues appear, explain the issue, cause, fix, and why the fix is appropriate.

### Gate 6: Documentation, Sync, Commit, PR, And Release Preparation

Keep docs and review artifacts current.

- Update docs when behavior, architecture, data models, question-bank flow, testing, release flow, user-visible behavior, or developer workflow changes.
- Update `docs/changelog.md` for every commit-worthy change; keep the entry concise and release-oriented.
- For bug fixes, add a focused log under `docs/archive/logs/YYYY-MM-DD-<bug-slug>.md`. Bug-fix logs apply to `fix/*`, `hotfix/*`, `fix:` commits, or changes mainly fixing exceptions, regressions, compatibility, data errors, or build failures.
- Sync latest remote code when needed, resolve conflicts if any, and rerun the relevant Gate 5 checks.
- Do not stage, commit, or push unless the user explicitly asks.

**Commit format:** Use Conventional Commits with Chinese summaries:
```text
<type>(optional-scope): <中文摘要>
```
Common types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build`, `ci`. Split commits by logical behavior or project boundary. Keep broad formatting separate. Do not mix generated files with manual source edits unless generation is the point of the commit.

**Release tags:** Official releases use semantic version tags from `main`: `vMAJOR.MINOR.PATCH`. For simple releases, tag directly from clean, current `main`. For larger release preparation, use `release/vX.Y.Z`; for urgent published-version fixes, use `hotfix/vX.Y.Z`. Prefer squash merge into `main` unless the user asks for another merge strategy.

- After docs, changelog, sync, and validation are complete, always end a commit-ready task with a final delivery package.
- The final delivery package must include commit details and detailed PR title/description copy using the fixed format in `references/documentation-and-pr-policy.md`.
- When the task involves a release branch, hotfix branch, tag, release notes, release artifacts, release manifest, or distribution workflow, also include release description copy using the fixed format in `references/release-policy.md`.
- Do not invent alternate PR or release description headings such as mixing `概述`, `Summary`, or `Overview`; keep the fixed Chinese headings and order.

## Default Rules

- Protect unrelated user changes.
- Keep branch, commit, docs, and PR behavior consistent with `docs/workflow/git.md`.
- Prefer precise project evidence over generic advice.
- Keep discussion and implementation scoped to the active request.
- Project-level skills live under `.codex/skills/` in this repository unless the user explicitly requests another project-local skill location.
