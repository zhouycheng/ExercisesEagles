# Documentation And PR Policy

Use this policy at the final workflow stage.

## Documentation Updates

Update docs when a change affects:

- Architecture or module boundaries.
- Question-bank data models, runtime snapshots, release sync, source ledger, or compatibility values.
- Testing, build, release, or developer workflow.
- User-visible behavior or product scope.
- Mini Program packaging or upload requirements.

Prefer `README.md`, `docs/workflow/git.md`, `docs/workflow/question-banks.md`, and `docs/changelog.md` for lasting facts. Use `docs/archive/` for focused historical logs when needed.

## Change Records

Every commit-ready change must update:

```text
docs/changelog.md
```

Bug fixes must also create or update a focused archive log:

```text
docs/archive/logs/YYYY-MM-DD-<bug-slug>.md
```

Use the existing changelog shape:

```text
YYYY-MM-DD｜vX.Y.Z｜Release 或 No Release
One-line summary of what changed that day.

### Added

- New capability or user-visible addition.

### Changed

- Behavior, architecture, workflow, or maintenance change.

### Fixed

- Bug fix or corrected behavior.

### Verified

- Checks, tests, builds, or manual validation performed.
```

## Sync Before Final Recommendation

After docs are updated:

1. Fetch or pull the latest remote base in a way that preserves the task branch when needed.
2. Resolve conflicts if they appear.
3. Re-run the relevant checks from `review-and-validation-policy.md`.

## Final Delivery Package

Do not run `git add`, `git commit`, or `git push` unless the user explicitly asks.

After documentation, changelog, sync, and validation are complete, end every commit-ready requirement with a final delivery package. This applies even when the user has not explicitly asked for PR copy.

The final delivery package must include:

- Scoped file summary.
- Checks run and results.
- Commit details.
- PR title and detailed PR description.
- Release description when the task touches a release branch, hotfix branch, tag, release notes, release artifacts, update manifest, or distribution workflow.

Keep section headings stable. Do not alternate between Chinese and English headings, and do not rename headings per task. If a fixed section is not applicable, keep the heading and write `不适用` or `无`.

## Commit Details Format

Commit details should include:

- Recommended commit message.
- Commit scope.
- Whether a commit body is needed.
- Body text when motivation, migration risk, compatibility impact, data-release impact, or validation notes are not obvious.

Commit candidates should use Conventional Commits with Chinese text after the colon, for example:

```text
feat(quiz): 支持整本抽题和模拟测试
docs(workflow): 更新题库运行态工作流
chore(workflow): 补充项目级工作流技能
```

Use this fixed response shape:

```text
## 提交详情

推荐提交：
`<type>(scope): 中文摘要`

提交范围：
- <文件或模块范围>

提交正文：
- 需要 / 不需要
- 原因：<为什么需要或不需要>

建议正文：
<仅在需要时填写>
```

## PR Details Format

PR details must be detailed enough for review. Base them on the branch diff, validation results, changelog entry, and known risk surface. Do not summarize only the last file edited.

Use a PR title with the same Conventional Commits style as commits when possible:

```text
<type>(scope): 中文摘要
```

Use this exact PR description template:

```markdown
## 变更概览

- <本 PR 做了什么，按用户可见行为、工程流程或模块边界分组>

## 背景与目标

- <为什么要做，本次要解决的需求或问题>

## 实现详情

- <关键文件、模块、流程或数据结构变化>

## 验证结果

- <已执行命令、测试、构建或人工验证及结果>

## 风险与回滚

- <主要风险、兼容影响、回滚方式；没有则写 无>

## 文档与变更记录

- <同步更新的 docs、changelog、bug log、release note 或不适用说明>

## 评审重点

- <希望 reviewer 重点看的边界、文件或决策>
```

The headings above are mandatory and must remain in this order. Keep all sections present; use `无` or `不适用` instead of deleting a section.
