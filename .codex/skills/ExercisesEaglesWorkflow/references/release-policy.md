# Release Policy

Release state is represented by tags on `main`.

## Version Format

Use semantic version tags:

```text
vMAJOR.MINOR.PATCH
```

## Release Branch

Use `release/vX.Y.Z` when release preparation needs a dedicated branch:

- version updates
- changelog updates
- Mini Program compile/preview verification
- question-bank release manifest or runtime sync checks
- final bug fixes
- release notes

If a release is small and already validated on `main`, the release branch may be skipped.

## Hotfix Branch

Use `hotfix/vX.Y.Z` for urgent fixes to already released versions. Keep scope narrow and merge back to `main` before tagging.

## Tagging

Tag from `main` after the release branch or hotfix branch has been merged:

```bash
git switch main
git pull --ff-only origin main
git tag v1.1.0
git push origin v1.1.0
```

Release artifacts and release notes should be traceable to the tag.

## Release Description Format

When a task involves a release branch, hotfix branch, tag, release notes,
release artifacts, release manifest, update manifest, or distribution workflow,
include release description copy in the final delivery package.

Use this exact release description template:

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

The headings above are mandatory and must remain in this order. Do not replace them with alternatives such as `Summary`, `概述`, or `Overview`.
