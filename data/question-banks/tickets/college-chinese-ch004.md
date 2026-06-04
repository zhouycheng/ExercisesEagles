---
batchId: college-chinese-ch004
status: released
blocking: false
pendingDir: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch004
releaseVersion: v2-college-chinese-through-ch004
---

# college-chinese-ch004 导入工单

- 状态：released
- 阻断发布：false
- 待处理目录：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch004
- 发布版本：v2-college-chinese-through-ch004
- 章节：大学语文 / 4-我的四个假想敌

## 阻断项

### issue-001-duplicate-source-id：同一 sourceId 对应不同题目

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-4-我的四个假想敌.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文章节题-第4课-课前测验.json
- 字段：questions[].id
- 原文：以下 sourceId 同时出现在课后作业和课前测验中，但题干、选项、答案不同：
  - subject-bmvcex-unit-4-001
  - subject-bmvcex-unit-4-002
  - subject-bmvcex-unit-4-003
  - subject-bmvcex-unit-4-004
  - subject-bmvcex-unit-4-005
- 原因：sourceId 重复且内容不同，不能作为稳定题目身份。
- 用户选择：A
- 处理结果：使用内部 `questionId` 区分两组题；`sourceId` 保留原文作为证据；导入时按文件和 `groupType` 归属。

## 处理日志

- 2026-06-02：生成 pending 题库和工单，等待用户在对话中选择。
- 2026-06-02：用户回复 `A`，阻断项按建议处理。
- 2026-06-02：生成发布版本 v2-college-chinese-through-ch004，工单状态改为 released。
