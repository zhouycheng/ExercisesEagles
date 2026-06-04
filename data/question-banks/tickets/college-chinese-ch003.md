---
batchId: college-chinese-ch003
status: released
blocking: false
pendingDir: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch003
releaseVersion: v2-college-chinese-through-ch003
---

# college-chinese-ch003 导入工单

- 状态：released
- 阻断发布：false
- 待处理目录：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch003
- 发布版本：v2-college-chinese-through-ch003
- 章节：大学语文 / 3-讲故事的人

## 阻断项

### issue-001-source-id-tags：源 ID 与标签沿用旧章节

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-3-讲故事的人.json
- 字段：questions[].id / questions[].tags
- 原文：20 道课后作业题的 source id 为 `college-chinese-xu-er-pian-001..020`，tags 包含“序二篇”；文件名和 unit.name 为“3-讲故事的人”。
- 原因：源 ID 与标签沿用了第 1 课信息，不能作为稳定身份或准确标签发布。
- 用户选择：A
- 处理结果：使用内部 `questionId=q-cc-ch003-homework-###`；`sourceId` 保留原始值作为证据；生成题库 tags 改为第 3 课相关标签。

### issue-002-zero-score：课后作业单题分值为 0

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-3-讲故事的人.json
- 字段：questions[1].score
- 原文：`score: 0`
- 原因：同组其余课后作业分值为 5，单题 0 分疑似源数据异常。
- 用户选择：A
- 处理结果：生成题库中改为 5，并记录人工确认。

### issue-003-same-stem：同题干不同选项

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-3-讲故事的人.json
- 字段：questions[1].question / questions[7].question
- 原文：两题题干都是“根据文章内容，下列说法表述错误的一项是”，但选项和考点不同。
- 原因：同题干不同选项按规则属于潜在冲突，需要确认是两道独立题还是应合并/暂缓。
- 用户选择：A
- 处理结果：保留为两道独立题，因为选项不同且分别考查文章整体理解与莫言命名原因。

## 处理日志

- 2026-06-02：生成 pending 题库和工单，等待用户在对话中选择。
- 2026-06-02：用户回复 `A A A`，三个阻断项全部按建议处理。
- 2026-06-02：生成发布版本 v2-college-chinese-through-ch003，工单状态改为 released。
