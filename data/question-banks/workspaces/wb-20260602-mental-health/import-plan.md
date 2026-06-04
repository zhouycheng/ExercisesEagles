# 大学生心理健康导入计划

- Workspace: wb-20260602-mental-health
- 状态: ready
- 基准 release: v2-college-chinese-complete-chapter-title-normalized
- 输出范围: workspace only，不发布，不更新 latest.json，不同步小程序运行快照
- Book ID: book-mental-health
- Book name: 大学生心理健康
- Allowed group types: homework / 课后作业

## Source Scope

纳入直接导入的源文件：

| Chapter | Pure title | Source unit | Source file | Group | Source rows | Generated questions |
| --- | --- | --- | --- | --- | ---: | ---: |
| ch-001 | 导论 | 第一章-课后作业 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第一章-课后作业.json | homework / 课后作业 | 34 | 34 |
| ch-002 | 从被动适应到主动掌舵：构建属于你的大学导航系统 | 第二章-课后作业 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第二章-课后作业.json | homework / 课后作业 | 27 | 27 |
| ch-003 | 遇见完整的自己：从认知到接纳的自我整合之旅 | 第三章-课后作业 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第三章-课后作业.json | homework / 课后作业 | 8 | 8 |
| ch-004 | 构建内在的情绪生态系统：从辨识到转化的智慧 | 第四章-课后作业 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第四章-课后作业.json | homework / 课后作业 | 8 | 8 |
| ch-005 | 人际关系的构建与优化：从基础搭建到深度互动 | 第五章-课后作业 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第五章-课后作业.json | homework / 课后作业 | 8 | 8 |
| ch-006 | 亲密关系的建构与演变：从个体到共同体的生命旅程 | 第六章-课后作业 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第六章-课后作业.json | homework / 课后作业 | 31 | 29 |
| ch-007 | 积极心理的建构：从识别美好到实践幸福 | 第七章-课后作业 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康-第七章-课后作业.json | homework / 课后作业 | 25 | 25 |

排除直接导入的源文件：

- /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学生心理健康.json：aggregate subject file，仅作目录/一致性佐证；直接导入使用 7 个章节拆分文件，避免重复内容。

## Confirmed Chapter Mapping

用户选择 B 后，章节标题按纯标题入库，顺序写入 `order`：

| Chapter ID | Order | User label | Stored chapter.name |
| --- | ---: | --- | --- |
| ch-001 | 1 | 第一章 导论 | 导论 |
| ch-002 | 2 | 第二章 从被动适应到主动掌舵：构建属于你的大学导航系统 | 从被动适应到主动掌舵：构建属于你的大学导航系统 |
| ch-003 | 3 | 第三章 遇见完整的自己：从认知到接纳的自我整合之旅 | 遇见完整的自己：从认知到接纳的自我整合之旅 |
| ch-004 | 4 | 第四章 构建内在的情绪生态系统：从辨识到转化的智慧 | 构建内在的情绪生态系统：从辨识到转化的智慧 |
| ch-005 | 5 | 第五章 人际关系的构建与优化：从基础搭建到深度互动 | 人际关系的构建与优化：从基础搭建到深度互动 |
| ch-006 | 6 | 第六章 亲密关系的建构与演变：从个体到共同体的生命旅程 | 亲密关系的建构与演变：从个体到共同体的生命旅程 |
| ch-007 | 7 | 第七章 积极心理的建构：从识别美好到实践幸福 | 积极心理的建构：从识别美好到实践幸福 |

## Duplicate Decisions

用户选择 A：第六章两组完全重复判断题合并，保留较早 sourceId，重复来源记录在 `placements` 和 `sourceMeta.duplicateSourceIds`。

- psych-ch6-hw-011 <- psych-ch6-hw-016 (q-mh-ch006-homework-011)
- psych-ch6-hw-014 <- psych-ch6-hw-017 (q-mh-ch006-homework-014)

## Include / Exclude Rules

- Include: 7 个 `大学生心理健康-第X章-课后作业.json` 拆分源文件。
- Exclude: aggregate/catalog/support files, including `大学生心理健康.json` and `index.json` as direct question sources.
- Do not silently import any psychology source outside the 7 mapped homework files.
- Do not create release/latest/runtime output until the workspace is ready and the user explicitly asks to publish.

## Sampling Presets

- chapter-review: one selected chapter, homework group only.
- full-book-review: ch-001 through ch-007, homework group only, deduplicate by questionId.
- homework-range: configurable contiguous chapter range, homework group only.

## Validation

- Workspace validation passed on 2026-06-02.
- Generated bank files: mental-health-ch001.json, mental-health-ch002.json, mental-health-ch003.json, mental-health-ch004.json, mental-health-ch005.json, mental-health-ch006.json, mental-health-ch007.json
- Source rows: 141
- Generated unique questions: 139
- Resolved ticket: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/tickets/mental-health-ch001-to-ch007.md
