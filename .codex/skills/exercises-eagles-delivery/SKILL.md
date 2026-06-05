---
name: exercises-eagles-delivery
description: "Use for ExercisesEagles / 题小鹰 delivery work: docs and changelog requirements, bug archive logs, commit details, PR title and description, release description, final delivery package, archive handoff, branch status, and release/tag copy. Does not perform code review as its primary job."
---

# ExercisesEagles Delivery

Use this skill when the implementation and validation state is known and the user needs delivery artifacts.

## Inputs

- `git status --short --branch`, current branch, and changed-file summary.
- Relevant diff context and validation results from `$exercises-eagles-review`.
- `docs/workflow/git.md`, `docs/changelog.md`, and relevant workflow docs.
- `docs/workflow/question-banks.md` for runtime bank or release sync delivery.
- `$question-bank-curator` for question-bank import/release/ticket/source-ledger delivery rules.

## Documentation And Records

Update or require updates when the change affects:

- Architecture or module boundaries.
- Question-bank data models, runtime snapshots, release sync, source ledger, or compatibility values.
- Testing, build, release, or developer workflow.
- User-visible behavior or product scope.
- Mini Program packaging or upload requirements.

Every commit-worthy change should update:

```text
docs/changelog.md
```

Bug fixes should also create or update:

```text
docs/archive/logs/YYYY-MM-DD-<bug-slug>.md
```

Do not stage, commit, push, tag, or create a PR unless the user explicitly asks.

## Commit Rules

Use Conventional Commits with Chinese summaries:

```text
<type>(optional-scope): <中文摘要>
```

Common types:

```text
feat, fix, docs, refactor, test, chore, build, ci
```

Split commits by logical behavior or project boundary. Keep broad formatting separate. Do not include unrelated user edits.

## Commit Details Format

```markdown
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

## PR Description Format

Use this exact section order:

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

Keep all sections present. Use `无` or `不适用` instead of deleting a section.

## Release Description Format

Use only for release branches, hotfix branches, tags, release notes, release artifacts, update manifests, distribution workflow, or direct user request.

```markdown
## 版本摘要

- <版本号、发布类型和一句话范围>

## 主要变更

- <面向用户、开发者或发布流程的主要变化>

## 验证与兼容

- <自动化检查、构建、打包验证、平台兼容结论>

## 发布产物

- <小程序版本、上传包、体验版、题库 release manifest、latest/runtime 快照；没有则写 不适用>

## 已知风险

- <已知问题、灰度范围、回滚风险；没有则写 无>

## 升级与回滚说明

- <升级路径、回滚步骤或版本恢复方式>

## 关联记录

- <PR、commit、tag、changelog、bug log、release note 或不适用说明>
```

## Final Delivery Package

When the task is commit-ready, include:

- Scoped file summary.
- Checks run and results.
- Commit details.
- PR title and detailed PR description.
- Release description when relevant.
- Remaining risks or manual validation that could not be completed.
