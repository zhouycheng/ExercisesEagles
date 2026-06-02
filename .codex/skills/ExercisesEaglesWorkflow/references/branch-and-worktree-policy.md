# Branch And Worktree Policy

题小鹰 uses a lightweight trunk-based workflow:

```text
short-lived branch -> PR / MR -> main -> release tag
```

`main` is the only long-lived branch. Do not do daily development work directly on `main`, and do not prepare direct commits to `main`.

## Branch Types

- `feature/<name>`: user-visible features, new business capabilities, or complete flows.
- `fix/<name>`: bug fixes, regressions, behavior corrections, data errors, or build failures.
- `chore/<name>`: repository structure, tooling, dependencies, CI, scripts, generated metadata, or broad workflow maintenance.
- `docs/<name>`: documentation-only work.
- `release/vX.Y.Z`: release preparation.
- `hotfix/vX.Y.Z`: urgent fix for an already released version.

## Naming Rules

- Use lowercase English words, numbers, and hyphens.
- Prefer project domain words such as `book-catalog`, `question-bank`, `quiz`, `simulated-test`, `runtime`, `manifest`, `workflow`.
- Keep the branch name about the change, not the agent or tool.
- Give the user 2-4 suitable branch-name options when starting a new task.

## Before Creating Branches

1. Inspect `git status --short --branch`.
2. Inspect `git branch --show-current`.
3. If currently on `main`, sync latest remote `main` before branching when possible.
4. Validate proposed names:

```bash
git check-ref-format --branch <branch-name>
```

## Worktree Rule

Use `git worktree` when a new task should start without disturbing the current working tree.

Create worktrees under:

```text
worktrees/<task-slug>
```

From latest remote `main`:

```bash
git fetch origin
git worktree add worktrees/<task-slug> -b <branch-name> origin/main
```

Open an existing branch:

```bash
git worktree add worktrees/<task-slug> <branch-name>
```

## Branch Creation Troubleshooting

If branch creation reports `cannot lock ref`, do not assume the branch name conflicts.

First check format and refs:

```bash
git check-ref-format --branch <branch-name>
git branch --list <prefix>
git branch --list '<prefix>/*'
git for-each-ref --format='%(refname:short)' refs/heads refs/remotes/origin
```

Treat it as a real ref path conflict only when a branch and branch namespace occupy the same path, such as existing `fix` vs requested `fix/example`.

If no real ref conflict exists and the error mentions `.git/refs/heads/`, `Operation not permitted`, `Permission denied`, `unable to create directory`, or `couldn't create`, classify it as an environment or sandbox write problem and retry with permission to write Git refs.

## Safety Rules

- Do not stage, revert, delete, or format unrelated user changes.
- Do not create worktrees in tracked source directories.
- Do not run broad formatting from the parent checkout in a way that traverses ignored worktrees.
- Do not delete a worktree until its branch has been merged, pushed, or explicitly abandoned.
