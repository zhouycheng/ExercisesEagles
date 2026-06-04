---
batchId: college-chinese-ch005
status: released
blocking: false
pendingDir: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch005
releaseVersion: v2-college-chinese-through-ch005
---

# college-chinese-ch005 导入工单

- 状态：released
- 阻断发布：false
- 待处理目录：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch005
- 目标版本：v2-college-chinese-through-ch005
- 章节：大学语文 / 5-下棋

## 阻断项

### issue-001-duplicate-source-id：同一 sourceId 对应不同题目

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-5-下棋.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文章节题-第5课-课前测验.json
- 字段：questions[].id
- 原文：以下 sourceId 同时出现在课后作业和课前测验中，但题干、选项、答案不同：
  - subject-bmvcex-unit-5-001
  - subject-bmvcex-unit-5-002
  - subject-bmvcex-unit-5-003
- 原因：sourceId 重复且内容不同，不能作为稳定题目身份。
- 建议：使用内部 `questionId` 区分两组题；`sourceId` 保留原文作为证据；导入时按文件和 `groupType` 归属。
- 用户选择：A
- 处理结果：已使用内部 `questionId` 作为题目身份，原 `sourceId` 只作来源证据；课后作业和课前测验按各自文件与 `groupType` 归属发布。

## 处理日志

- 2026-06-02：生成 pending 题库和工单，等待用户在对话中选择。
- 2026-06-02：用户在对话中选择 A，确认重复 sourceId 不作为题目身份。
- 2026-06-02：补齐并核验 30 条解析，发布到 v2-college-chinese-through-ch005。

## manualChanges

```json
[
  {
    "questionId": "q-cc-ch005-homework-001..003 / q-cc-ch005-pretest-001..003",
    "field": "sourceIdIdentityPolicy",
    "from": "same sourceId used for different content across groups",
    "to": "use internal questionId as identity; keep sourceId as evidence only",
    "reason": "用户选择 A，确认重复 sourceId 不作为题目身份，按文件和 groupType 归属导入。"
  }
]
```
