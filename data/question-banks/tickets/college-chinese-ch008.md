---
batchId: college-chinese-ch008
status: released
blocking: false
pendingDir: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch008
releaseVersion: v2-college-chinese-through-ch008
---

# college-chinese-ch008 导入工单

- 状态：released
- 阻断发布：false
- 待处理目录：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-ch008
- 目标版本：v2-college-chinese-through-ch008
- 章节：大学语文 / 8-北京大学月刊发刊词

## 已解决项

### issue-001-zero-score-homework-006：课后作业第6题源 score 为0

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-8-北京大学月刊发刊词.json
- 题目：q-cc-ch008-homework-006
- 字段：score
- 原文：`0`
- 原题：`《<北京大学月刊>发刊词》一文体裁是`
- 原因：旧规则曾把 source score 当作候选分值，因此创建了工单；新规则确认 source score 仅用于追溯。
- 处理策略：不修正为固定分值；生成题库使用 `weight: 1`，原始 `score: 0` 保留为 `sourceMeta.rawScore`。
- 用户选择：按新规则自动解除阻断，不修改题干、选项、答案；源 score 进入 sourceMeta.rawScore，weight 使用 1。
- 处理结果：已发布。score=0 不再作为题库阻断项，原始值保留在 sourceMeta.rawScore。

## 已确认沿用的处理

- 沿用 college-chinese-ch007 工单用户选择 A：`大学语文章节题-第7课-课前测验.json` 按内容映射为第8课课前测验；源文件不改名。
- 生成题库中将课前测验标签从 `7-课前小测试` 同步为 `8-课前小测试`；题干、选项、答案未修改。

## 处理日志

- 2026-06-02：生成 pending 题库和工单，等待用户在对话中选择。

## manualChanges

```json
[
  {
    "questionId": "q-cc-ch008-pretest-001..007",
    "field": "source-file-to-chapter/group mapping",
    "from": "source filename/tag says 第7课课前测验",
    "to": "map by confirmed content to ch008 pretest",
    "reason": "沿用 college-chinese-ch007 工单用户选择 A；源文件不改名，题干、选项、答案未修改。"
  },
  {
    "questionId": "q-cc-ch008-pretest-001..007",
    "field": "tags[0]",
    "from": "7-课前小测试",
    "to": "8-课前小测试",
    "reason": "源文件按内容归属第8课后，生成题库标签同步到第8课；题干、选项、答案未修改。"
  }
]
```

- 2026-06-02：根据更新后的题库规则，源 score 仅作为 sourceMeta.rawScore 追溯信息；q-cc-ch008-homework-006 使用 weight: 1，未修改题干、选项、答案，发布到 v2-college-chinese-through-ch008。

## schemaChanges

```json
[
  {
    "id": "score-to-weight-v1",
    "date": "2026-06-02",
    "description": "All released questions use weight for app scoring. Original source score is preserved as sourceMeta.rawScore.",
    "affectedQuestions": 250,
    "appBehavior": "Review modes ignore rawScore; simulated tests calculate displayed points from test total and selected question weights."
  },
  {
    "id": "ch008-zero-score-not-blocking",
    "date": "2026-06-02",
    "description": "Resolved ch008 source score=0 issue by policy: raw score is audit metadata, generated question weight remains 1.",
    "affectedQuestionIds": [
      "q-cc-ch008-homework-006"
    ]
  }
]
```

- 2026-06-02：根据 rawScore 默认 5 规则，q-cc-ch008-homework-006 的 sourceMeta.rawScore 从 0 归一化为 5；题干、选项、答案、weight 未修改，最新版本为 v2-college-chinese-through-ch008-rawscore-normalized。

## rawScoreNormalization

```json
{
  "id": "rawscore-default-5-v1",
  "date": "2026-06-02",
  "description": "sourceMeta.rawScore defaults to 5, converts 0 or <=5 to 5, and preserves source values greater than 5.",
  "beforeDistribution": [
    {
      "rawScore": 0,
      "count": 1
    },
    {
      "rawScore": 5,
      "count": 158
    },
    {
      "rawScore": 6.2,
      "count": 8
    },
    {
      "rawScore": 6.3,
      "count": 8
    },
    {
      "rawScore": 14.2,
      "count": 2
    },
    {
      "rawScore": 14.3,
      "count": 12
    },
    {
      "rawScore": 16.6,
      "count": 10
    },
    {
      "rawScore": 16.6666666667,
      "count": 6
    },
    {
      "rawScore": 16.7,
      "count": 20
    },
    {
      "rawScore": 20,
      "count": 10
    },
    {
      "rawScore": 33.3,
      "count": 13
    },
    {
      "rawScore": 33.4,
      "count": 2
    }
  ],
  "afterDistribution": [
    {
      "rawScore": 5,
      "count": 159
    },
    {
      "rawScore": 6.2,
      "count": 8
    },
    {
      "rawScore": 6.3,
      "count": 8
    },
    {
      "rawScore": 14.2,
      "count": 2
    },
    {
      "rawScore": 14.3,
      "count": 12
    },
    {
      "rawScore": 16.6,
      "count": 10
    },
    {
      "rawScore": 16.6666666667,
      "count": 6
    },
    {
      "rawScore": 16.7,
      "count": 20
    },
    {
      "rawScore": 20,
      "count": 10
    },
    {
      "rawScore": 33.3,
      "count": 13
    },
    {
      "rawScore": 33.4,
      "count": 2
    }
  ]
}
```
