---
workspaceId: wb-20260602-mental-health
status: released
blocking: false
workspaceDir: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/workspaces/wb-20260602-mental-health
releaseVersion: v3-mental-health-ch001-to-ch007
---

# mental-health-ch001-to-ch007 导入工单

- 状态：released
- 阻断发布：false
- 发布版本：v3-mental-health-ch001-to-ch007
- 工作区：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/workspaces/wb-20260602-mental-health
- 范围：大学生心理健康 ch-001 至 ch-007 课后作业

## 阻断项

### issue-001-chapter-title-missing：源文件缺少纯章节标题

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第一章-课后作业.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第二章-课后作业.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第三章-课后作业.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第四章-课后作业.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第五章-课后作业.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第六章-课后作业.json
- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第七章-课后作业.json
- 字段：chapter.name
- 原文：源目录和 index 只提供 `第一章-课后作业`、`第二章-课后作业` 等顺序/分组标签。
- 原因：格式规范要求 `chapter.name` 是纯标题，不能写 `第一章`、`第 X 章：标题` 或 `第一章-课后作业`。
- 用户选择：B
- 处理结果：使用用户提供的 7 个章节标题，并在生成题库中去掉章节序号，只保存纯标题。

### issue-002-ch006-duplicate-judge-questions：第六章存在两组完全重复判断题

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第六章-课后作业.json
- 字段：question duplicate handling
- 原文：
  - `psych-ch6-hw-011`：每一种婚姻形态都是和当时的社会生产力水平相匹配的，家庭观也是。( )
  - `psych-ch6-hw-016`：每一种婚姻形态都是和当时的社会生产力水平相匹配的，家庭观也是。
  - `psych-ch6-hw-014`：家庭生命周期理论认为，所有家庭都必然按照固定顺序经历相同的阶段。( )
  - `psych-ch6-hw-017`：家庭生命周期理论认为，所有家庭都必然按照固定顺序经历相同的阶段。
- 原因：两组题的题干规范化后相同，选项和答案也相同；静态题库不能重复存同一题。
- 用户选择：A
- 处理结果：已合并两组重复题，保留 `psych-ch6-hw-011` 和 `psych-ch6-hw-014` 为主要来源，记录 `psych-ch6-hw-016` 和 `psych-ch6-hw-017` 为重复来源。

## 处理日志

- 2026-06-02：创建 blocked workspace 和导入计划，等待用户选择。
- 2026-06-02：用户回复 issue-001 选 B，并提供 7 个章节标题；issue-002 选 A，确认合并重复题。
- 2026-06-02：生成 7 个 workspace bank JSON，工作区校验通过，状态改为 ready；未发布 release，未更新 latest/runtime。

## metadataChanges

```json
[
  {
    "field": "ch-001.name",
    "from": "第一章-课后作业",
    "to": "导论",
    "reason": "用户选择 B，提供章节标题“第一章 导论”；生成题库只保存纯标题。"
  },
  {
    "field": "ch-002.name",
    "from": "第二章-课后作业",
    "to": "从被动适应到主动掌舵：构建属于你的大学导航系统",
    "reason": "用户选择 B，提供章节标题“第二章 从被动适应到主动掌舵：构建属于你的大学导航系统”；生成题库只保存纯标题。"
  },
  {
    "field": "ch-003.name",
    "from": "第三章-课后作业",
    "to": "遇见完整的自己：从认知到接纳的自我整合之旅",
    "reason": "用户选择 B，提供章节标题“第三章 遇见完整的自己：从认知到接纳的自我整合之旅”；生成题库只保存纯标题。"
  },
  {
    "field": "ch-004.name",
    "from": "第四章-课后作业",
    "to": "构建内在的情绪生态系统：从辨识到转化的智慧",
    "reason": "用户选择 B，提供章节标题“第四章 构建内在的情绪生态系统：从辨识到转化的智慧”；生成题库只保存纯标题。"
  },
  {
    "field": "ch-005.name",
    "from": "第五章-课后作业",
    "to": "人际关系的构建与优化：从基础搭建到深度互动",
    "reason": "用户选择 B，提供章节标题“第五章 人际关系的构建与优化：从基础搭建到深度互动”；生成题库只保存纯标题。"
  },
  {
    "field": "ch-006.name",
    "from": "第六章-课后作业",
    "to": "亲密关系的建构与演变：从个体到共同体的生命旅程",
    "reason": "用户选择 B，提供章节标题“第六章 亲密关系的建构与演变：从个体到共同体的生命旅程”；生成题库只保存纯标题。"
  },
  {
    "field": "ch-007.name",
    "from": "第七章-课后作业",
    "to": "积极心理的建构：从识别美好到实践幸福",
    "reason": "用户选择 B，提供章节标题“第七章 积极心理的建构：从识别美好到实践幸福”；生成题库只保存纯标题。"
  }
]
```

## importDecisions

```json
[
  {
    "id": "issue-001-chapter-title-missing",
    "userChoice": "B",
    "result": "Use user-provided chapter titles and strip chapter-order prefixes from chapter.name.",
    "titles": [
      {
        "chapterId": "ch-001",
        "userProvidedLabel": "第一章 导论",
        "chapterName": "导论"
      },
      {
        "chapterId": "ch-002",
        "userProvidedLabel": "第二章 从被动适应到主动掌舵：构建属于你的大学导航系统",
        "chapterName": "从被动适应到主动掌舵：构建属于你的大学导航系统"
      },
      {
        "chapterId": "ch-003",
        "userProvidedLabel": "第三章 遇见完整的自己：从认知到接纳的自我整合之旅",
        "chapterName": "遇见完整的自己：从认知到接纳的自我整合之旅"
      },
      {
        "chapterId": "ch-004",
        "userProvidedLabel": "第四章 构建内在的情绪生态系统：从辨识到转化的智慧",
        "chapterName": "构建内在的情绪生态系统：从辨识到转化的智慧"
      },
      {
        "chapterId": "ch-005",
        "userProvidedLabel": "第五章 人际关系的构建与优化：从基础搭建到深度互动",
        "chapterName": "人际关系的构建与优化：从基础搭建到深度互动"
      },
      {
        "chapterId": "ch-006",
        "userProvidedLabel": "第六章 亲密关系的建构与演变：从个体到共同体的生命旅程",
        "chapterName": "亲密关系的建构与演变：从个体到共同体的生命旅程"
      },
      {
        "chapterId": "ch-007",
        "userProvidedLabel": "第七章 积极心理的建构：从识别美好到实践幸福",
        "chapterName": "积极心理的建构：从识别美好到实践幸福"
      }
    ]
  },
  {
    "id": "issue-002-ch006-duplicate-judge-questions",
    "userChoice": "A",
    "result": "Merge exact duplicate chapter 6 rows into the earlier source row and record duplicate sourceIds in placements/sourceMeta.",
    "duplicateDecisions": [
      {
        "primaryQuestionId": "q-mh-ch006-homework-011",
        "primarySourceId": "psych-ch6-hw-011",
        "duplicateSourceId": "psych-ch6-hw-016",
        "sourceFile": "/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第六章-课后作业.json",
        "reason": "User choice A: exact duplicate content merged into the earlier source row."
      },
      {
        "primaryQuestionId": "q-mh-ch006-homework-014",
        "primarySourceId": "psych-ch6-hw-014",
        "duplicateSourceId": "psych-ch6-hw-017",
        "sourceFile": "/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第六章-课后作业.json",
        "reason": "User choice A: exact duplicate content merged into the earlier source row."
      }
    ]
  }
]
```

## 发布记录

- 2026-06-02：发布到 v3-mental-health-ch001-to-ch007，同步 canonical latest 与小程序 runtime。
