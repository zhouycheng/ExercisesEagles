# Git 分支与提交流程

## 文档目的

这份文档记录题小鹰项目的 Git 分支结构、日常开发流程、提交规则、发布流程和合并要求。

目标是避免直接在 `main` 上提交开发改动，同时保持流程足够轻量，适合当前本地题库微信小程序的迭代节奏。

题库数据流、运行态快照、题库发布同步和题库校验规则见 `docs/workflow/question-banks.md`。本文件只负责 Git、提交、PR 和 tag 规则。

## 核心原则

- `main` 是唯一长期主干，代表当前可构建、可测试、可发布的状态。
- 日常开发不直接提交到 `main`，所有改动通过短生命周期分支完成。
- 短分支完成后通过 PR / MR 合并回 `main`。
- 发布版本以 `main` 上的 tag 为准。
- 只有发布准备或紧急修复需要额外使用 `release/*` 或 `hotfix/*` 分支。
- 不要 stage、commit、revert、delete 或 format 与当前任务无关的用户改动。

## 分支结构

```text
main
  ↑ PR / MR
feature/*
fix/*
chore/*
docs/*
release/*
hotfix/*
```

## 分支创建失败诊断

创建分支前可以先校验分支名格式：

```bash
git check-ref-format --branch fix/example-name
```

如果 `git switch -c <branch>` 或 `git branch <branch>` 报 `cannot lock ref`，不要直接判断为分支名冲突。先区分两类问题。

### 真实 Ref 命名冲突

Git 分支在 `.git/refs/heads/` 下以路径形式保存，因此下面两种情况会冲突：

- 已有 `fix` 分支，再创建 `fix/example-name`。
- 已有 `fix/example-name` 分支，再创建 `fix`。

诊断命令：

```bash
git branch --list fix
git branch --list 'fix/*'
git for-each-ref --format='%(refname:short)' refs/heads refs/remotes/origin
```

只有确认存在文件型分支和目录型分支互相占用时，才按命名冲突处理，并改用不会占用相同 ref 路径的分支名。

### 环境或沙盒写入失败

如果没有发现上述命名冲突，但错误信息包含下面关键词，优先按环境或沙盒写 `.git` 失败处理：

```text
unable to create directory
Permission denied
Operation not permitted
couldn't create
cannot lock ref
.git/refs/heads/
```

这种情况不要反复更换分支名。应该说明分支名有效且未发现 ref 冲突，然后用允许写入 `.git` 的方式重试创建分支。

## 长期分支

### `main`

`main` 是项目主干分支。

要求：

- 保持可构建。
- 保持核心检查通过。
- 不直接提交日常开发改动。
- 只通过 PR / MR 接收 `feature/*`、`fix/*`、`chore/*`、`docs/*`、`release/*` 或 `hotfix/*` 的合并。
- 正式发布版本从 `main` 打 tag。

当前不设置长期 `develop` 分支。当前更适合采用轻量的主干开发流程：

```text
短分支 -> PR / MR -> main -> tag release
```

如果未来出现多人长期并行、固定测试环境、多个版本线同时维护等需求，再考虑引入 `develop` 或更完整的 GitFlow。

## 日常开发分支

### `feature/<name>`

用于新功能开发。

示例：

```text
feature/book-catalog
feature/simulated-test
feature/wrong-answer-review
```

适用场景：

- 新增用户可见功能。
- 新增业务能力。
- 新增较完整的交互流程。

### `fix/<name>`

用于普通缺陷修复。

示例：

```text
fix/quiz-scroll-layout
fix/question-bank-manifest
fix/test-timer-autosubmit
```

适用场景：

- 修复开发中发现的 bug。
- 修复测试暴露的问题。
- 修复尚未发布为正式版本的缺陷。

### `chore/<name>`

用于工程治理、依赖维护、构建脚本、CI、仓库规范等改动。

示例：

```text
chore/git-workflow
chore/add-ci
chore/update-question-bank-runtime
```

适用场景：

- 添加或调整 CI。
- 调整仓库结构。
- 更新依赖。
- 调整脚本、工具链或工程规范。

### `docs/<name>`

用于纯文档改动。

示例：

```text
docs/update-readme
docs/add-release-checklist
docs/refresh-changelog
```

适用场景：

- 修改 README。
- 更新开发文档。
- 补充架构、测试、发布说明。

如果文档改动是某个功能或修复的一部分，可以直接放在对应的 `feature/*` 或 `fix/*` 分支中，不需要额外拆 `docs/*` 分支。

## 发布相关分支

### `release/vX.Y.Z`

用于发布准备。

示例：

```text
release/v1.0.0
release/v1.1.0
```

适用场景：

- `main` 上的功能已经达到发布范围。
- 发布前需要集中更新版本号、补 changelog、跑构建验证。
- 发布前只允许小范围 bug 修复，不再加入新功能。

推荐流程：

```text
main
  ↓
release/v1.0.0
  ↓ 发布前修正
  ↓ PR / MR
main
  ↓ tag v1.0.0
```

如果某次发布很简单，可以跳过 `release/*` 分支，直接在 `main` 上打 tag。

### `hotfix/vX.Y.Z`

用于已发布版本的紧急修复。

示例：

```text
hotfix/v1.0.1
hotfix/v1.1.1
```

适用场景：

- 已经发布的版本出现必须快速修复的问题。
- 修复范围明确，不能等待下一轮正常功能迭代。

推荐流程：

```text
main
  ↓
hotfix/v1.0.1
  ↓ 紧急修复
  ↓ PR / MR
main
  ↓ tag v1.0.1
```

## 日常开发流程

从 `main` 创建分支：

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/example-name
```

开发完成后本地检查：

```bash
git diff --check
npm run lint
```

涉及题库运行态快照时追加：

```bash
find miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;
```

涉及小程序页面、组件、NPM 构建产物或云函数时，还应在微信开发者工具中完成对应的构建 npm、编译、预览或真机验证。

涉及题库 manifest、章节题库、`.js` 包装或上传忽略规则时，还应按 `docs/workflow/question-banks.md` 校验运行态统计和小程序读取合同。

提交前更新变更记录：

- 每次提交前都要在 `docs/changelog.md` 记录本次修改的概要。
- changelog 记录面向发布、维护和回溯的简洁摘要，不粘贴完整开发日志。
- 如果本次修改属于 bug 修复，还要在 `docs/archive/logs/` 新建一篇详细修复日志。
- bug 修复包括 `fix/*`、`hotfix/*` 分支，`fix:` 类型提交，或以修复异常、回归、兼容、数据错误、构建失败为主要目的的改动。
- 变更记录文件要和对应代码或文档改动放在同一次提交中，不要补记到无关提交。

changelog 使用现有格式：

```text
YYYY-MM-DD｜vX.Y.Z｜Release 或 No Release
当天更新概要

### Added

- 新增内容

### Changed

- 更新内容

### Fixed

- 修复内容

### Verified

- 验证内容
```

bug 修复日志命名格式：

```text
docs/archive/logs/YYYY-MM-DD-<bug-slug>.md
```

提交并推送分支：

```bash
git add .
git commit -m "feat: add example feature"
git push -u origin feature/example-name
```

然后创建 PR / MR，合并目标为 `main`。

## 并行开发与 Worktree

当当前分支已有未完成改动，但需要同时处理另一个任务、临时修复或代码评审时，优先使用 `git worktree` 保留两个独立工作目录，避免把不同任务混在同一个工作树里。

适用场景：

- 当前分支存在未提交改动，但需要从 `main` 开新分支。
- 需要同时维护两个分支的工作现场。
- 需要临时处理 `hotfix/*`、评审分支或实验性分支。
- 不希望使用 `git stash` 隐藏当前上下文。

统一把本地 worktree 放在仓库根目录的 `worktrees/` 下：

```text
worktrees/<task-name>
```

`worktrees/` 应加入 `.gitignore`，用于避免本地并行工作目录被误提交。

从最新远端 `main` 创建新的 worktree 分支：

```bash
git fetch origin
git worktree add worktrees/example-task -b feature/example-task origin/main
```

打开已有分支到新的 worktree：

```bash
git worktree add worktrees/example-task feature/example-task
```

查看和清理 worktree：

```bash
git worktree list
git worktree remove worktrees/example-task
git worktree prune
```

注意事项：

- 不要把 worktree 建在被 Git 跟踪的源码目录内。
- 删除 worktree 前确认其中没有未提交改动。
- 不要从父工作区执行会遍历忽略目录的全量格式化或清理命令。
- 如果只是短暂保存当前未提交改动，`git stash` 仍然可用；如果要并行推进两个任务，优先使用 `git worktree`。

## 提交信息约定

推荐使用接近 Conventional Commits 的提交前缀：

| 前缀 | 含义 | 示例 |
| --- | --- | --- |
| `feat` | 新功能 | `feat: add question overview sheet` |
| `fix` | 缺陷修复 | `fix: resolve quiz scroll layout` |
| `chore` | 工程治理 | `chore: add git workflow docs` |
| `docs` | 文档 | `docs: update readme` |
| `test` | 测试 | `test: cover quiz scoring` |
| `refactor` | 重构 | `refactor: split quiz action buttons` |
| `build` | 构建或依赖 | `build: update miniprogram dependencies` |
| `ci` | CI 配置 | `ci: run miniprogram checks on pull requests` |

## PR / MR 合并要求

每个 PR / MR 合并前至少确认：

- 分支从最新 `main` 创建，或已经同步最新 `main`。
- 改动范围和分支类型匹配。
- 没有把无关格式化、生成文件或临时文件混入提交。
- 已运行必要检查。
- 如果改动影响用户行为，已补充或更新测试，或记录人工验证方式。
- 如果改动影响架构、题库数据流、测试、发布或使用方式，已同步更新 `docs/` 中的相关文档。

必跑命令：

```bash
git diff --check
npm run lint
```

合并方式建议优先使用 Squash Merge，让 `main` 历史保持清晰。

## 版本 Tag 规则

正式发布使用语义化版本 tag：

```text
v主版本.次版本.修订版本
```

示例：

```text
v1.0.0
v1.1.0
v1.1.1
```

常用含义：

- 主版本：包含破坏性变化或重大产品阶段变化。
- 次版本：新增功能，保持兼容。
- 修订版本：bug 修复、热修复或小范围稳定性更新。

从 `main` 打 tag：

```bash
git switch main
git pull --ff-only origin main
git tag v1.0.0
git push origin v1.0.0
```

发布包、Release Notes 和归档记录应以 tag 为准。

## 推荐执行习惯

- 一个分支只解决一类问题。
- 分支名使用英文小写、数字和短横线。
- 分支保持短生命周期，完成后及时合并或删除。
- 发布前优先保证检查、构建和 changelog 可追溯。
- 对 `main` 开启保护规则时，应要求 PR / MR 和 CI 通过后才能合并。
- 除非用户明确要求，agent 不直接执行 `git add`、`git commit` 或 `git push`。
