---
batchId: college-chinese-ch007
status: released
blocking: false
pendingDir: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch007
releaseVersion: v2-college-chinese-through-ch007
---

# college-chinese-ch007 导入工单

- 状态：released
- 阻断发布：false
- 待处理目录：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch007
- 目标版本：v2-college-chinese-through-ch007
- 章节：大学语文 / 7-国立西南联合大学纪念碑碑文

## 阻断项

### issue-001-pretest-file-content-swapped：第7/8课课前测验文件名与内容疑似对调

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文章节题-第7课-课前测验.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文章节题-第8课-课前测验.json
- 字段：source-file-to-chapter/group mapping
- 原文：
  - `大学语文章节题-第7课-课前测验.json` 的 7 道题均围绕《<北京大学月刊>发刊词》、蔡元培和北京大学。
  - `大学语文章节题-第8课-课前测验.json` 的 3 道题围绕西南联合大学、冯友兰和《贞元六书》。
- 原因：第7/8课课前测验文件名与题目内容疑似对调，不能只按文件名发布。
- 建议：按题目内容对调课前测验映射；第7课使用 `大学语文章节题-第8课-课前测验.json`，第8课后续使用 `大学语文章节题-第7课-课前测验.json`；源文件不改名，仅在 release/ledger 记录。
- 用户选择：A
- 处理结果：已按内容对调映射发布第7课；第8课课前测验源文件已记录为第8课后续待导入。

## 处理日志

- 2026-06-02：生成 pending 题库和工单，等待用户在对话中选择。
- 2026-06-02：用户选择 A，确认按内容对调第7/8课课前测验映射。
- 2026-06-02：补齐并核验第7课 39 条解析，发布到 v2-college-chinese-through-ch007。

## manualChanges

```json
[
  {
    "questionId": "q-cc-ch007-pretest-001..003 / future q-cc-ch008-pretest-001..007",
    "field": "source-file-to-chapter/group mapping",
    "from": "source filenames map 第7课课前测验 to ch007 and 第8课课前测验 to ch008",
    "to": "map by content: 第8课课前测验 -> ch007 pretest; 第7课课前测验 -> future ch008 pretest",
    "reason": "用户选择 A，确认第7/8课课前测验文件名与内容对调，按题目内容归属导入。"
  },
  {
    "questionId": "q-cc-ch007-pretest-001..003",
    "field": "tags[0]",
    "from": "8-课前测试题",
    "to": "7-课前测试题",
    "reason": "用户选择 A 确认源文件按内容归属第7课，生成题库标签同步到第7课；题干、选项、答案未修改。"
  }
]
```
