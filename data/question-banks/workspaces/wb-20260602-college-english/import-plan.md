# 大学英语题库导入计划

- Workspace: wb-20260602-college-english
- 状态: blocked
- 基础发布版: v2-college-chinese-complete-chapter-title-normalized
- 书籍: 大学英语 (book-college-english)
- 目标: 先整理为 workspace，不发布，不同步 runtime。

## 章节

| 章节 ID | 章节名 | 顺序 | 源文件 | 题量 |
| --- | --- | ---: | --- | ---: |
| ch-001 | 第一单元 | 1 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第一单元.json | 20 |
| ch-002 | 第二单元 | 2 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第二单元.json | 20 |
| ch-003 | 第三单元 | 3 | /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第三单元.json | 36 |

## 分组规则

| groupType | groupId | 显示名 | 规则 |
| --- | --- | --- | --- |
| vocabulary | group-vocabulary | 词汇题 | 优先使用 source.typeLabel；第一单元 typeLabel 为空时使用 tags 中非单元名的 `词汇题`。 |
| singleChoice | group-single-choice | 单选题 | 优先使用 source.typeLabel；第一单元 typeLabel 为空时使用 tags 中非单元名的 `单选题`。 |

## Include / Exclude

- Include: `/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第一单元.json`
- Include: `/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第二单元.json`
- Include: `/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第三单元.json`
- Exclude: `/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语.json`，这是总表 aggregate，直接导入会和单元源文件重复。

## 阻断项

- issue-001-unit2-q013-malformed-blank: 第二单元第 13 题题干疑似缺少填空占位。
- issue-002-unit3-embedded-score-markers: 第三单元 12 道题题干包含 `(1.7分)` 或 `(3.9分)`。
- issue-003-unit3-q015-answer-explanation-conflict: 第三单元第 15 题源答案 A 与源解释词义不一致。

详情见工单: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/tickets/college-english-units-001-to-003.md

## 采样预设

- `college-english-full-units-001-to-003`: 第一至第三单元，包含词汇题与单选题。

## 当前校验结论

- JSON 已生成并可解析。
- 题干、选项、答案均按源文件原样复制。
- `sourceMeta.rawScore` 已按默认 5 规则规范化；源 `score: 0` 不作为质量阻断项。
- 存在未解决工单，workspace 不能进入 ready，也不能发布。


## 用户选择处理结果

- 2026-06-02：用户回复 `A A B`。
- issue-001：已按 A 修正生成题库题干，源文件不改。
- issue-002：已按 A 删除生成题库题干末尾分值标记，源文件不改。
- issue-003：已按 B 保留源答案 A；由于源解释和英语词义仍与 A 冲突，无法写入准确 verified 解析，workspace 保持 blocked。


## 最终阻断解除

- 2026-06-02：用户提供教材图片，图中将 `no exaggeration` 解释为 `no overstatement`，中文为“毫不夸张；并非言过其实”。
- 已将 `q-ce-ch003-vocabulary-015` 生成题库答案从 A 改为 B，并写入 verified 解析；源文件不改。
- 全部阻断项已解决，workspace 状态改为 ready。未发布，未同步 runtime。
