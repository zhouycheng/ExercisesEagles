---
batchId: college-chinese-remaining
status: released
blocking: false
pendingDir: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-remaining
releaseVersion: v2-college-chinese-complete
---

# college-chinese-remaining 导入工单

- 状态：released
- 阻断发布：false
- 待处理目录：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v2-pending-college-chinese-remaining
- 目标版本：v2-college-chinese-complete
- 范围：大学语文剩余章节

## 阻断项

### issue-001-ch010-homework-content-mismatch：第10课课后作业文件名与内容不一致

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-10-西湖七月半.json
- 字段：source-file-to-chapter/group mapping
- 原文：文件名和 unit.name 为 `10-西湖七月半`；第一题 id 为 `subject-bmvcex-unit-9-001`，tags 为 `9-专家与通人`，题干为 `下列读音正确一项是。`。
- 原因：题目内容属于第9课，不能直接作为第10课课后作业发布。
- 建议：不把该文件发布为第10课课后作业；第10课先发布已有课前测验和文学常识。
- 用户选择：A
- 处理结果：已确认不把该文件发布为第10课课后作业；第10课只发布已有课前测验和文学常识。

### issue-002-ch011-homework-source-missing：未发现第11课课后作业源文件

- 源文件：未发现匹配的第11课课后作业源文件
- 已发现：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文章节题-第11课-课前测验.json
- 已发现：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文章节题-第11课-文学常识.json
- 字段：chapter group availability
- 原因：第11课目前只有课前测验和文学常识；若强行补课后作业会违反“源文件只做证据、不凭空造题”。
- 建议：第11课仅发布已有课前测验和文学常识，并在 manifest/ledger 记录未发现课后作业源文件。
- 用户选择：A
- 处理结果：已确认第11课只发布已有课前测验和文学常识，并记录缺少课后作业源文件。

## 处理日志

- 2026-06-02：发现第10课课后作业文件内容疑似错放、第11课课后作业源文件缺失，生成工单等待用户选择。

## 新增阻断项

### issue-003-ch009-homework-q001-option-d-spacing

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-9-专家与通人.json
- 题目：q-cc-ch009-homework-001
- 字段：options.D.text
- 原文：`隔 阂gé hé ;隔膜gé mó`
- 原因：“隔 阂”中间有空格，分号前也有异常空格；疑似源文本格式错乱。
- 建议：`隔阂gé hé;隔膜gé mó`
- 用户选择：A
- 处理结果：已按建议修正生成题库：`隔阂gé hé;隔膜gé mó`；源文件不改。

### issue-004-ch009-homework-q003-stem-punctuation

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-9-专家与通人.json
- 题目：q-cc-ch009-homework-003
- 字段：stem
- 原文：`结合课文内容，下列说法不正确一项是、`
- 原因：题干末尾为顿号，疑似标点错乱。
- 建议：`结合课文内容，下列说法不正确一项是。`
- 用户选择：A
- 处理结果：已按建议修正生成题库：题干末尾改为句号；源文件不改。

### issue-005-ch009-homework-q006-option-b-mojibake

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-9-专家与通人.json
- 题目：q-cc-ch009-homework-006
- 字段：options.B.text
- 原文：`学校pei'y培养的人才大多不合格，不能满足社会需要。`
- 原因：选项中出现拼音残片 `pei'y`，疑似“培养”前的输入/转码残留。
- 建议：`学校培养的人才大多不合格，不能满足社会需要。`
- 用户选择：A
- 处理结果：已按建议修正生成题库：删除 `pei'y` 残片；源文件不改。

### issue-006-ch009-homework-q020-stem-typo

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-9-专家与通人.json
- 题目：q-cc-ch009-homework-020
- 字段：stem
- 原文：`本位作者雷海宗先生是一个历史学家，但是他对其他领域包括教育领域也都深有研究。`
- 原因：“本位作者”疑似“本文作者”错字。
- 建议：`本文作者雷海宗先生是一个历史学家，但是他对其他领域包括教育领域也都深有研究。`
- 用户选择：A
- 处理结果：已按建议修正生成题库：`本位作者` 改为 `本文作者`；源文件不改。

## 追加处理日志

- 2026-06-02：用户回复 A A，已确认第10课/第11课发布范围；继续解析时发现第9课课后作业源文本疑似错乱，新增阻断项等待用户选择。

### issue-007-ch010-pretest-q010-answer-dispute

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文章节题-第10课-课前测验.json
- 题目：q-cc-ch010-pretest-010
- 字段：answerKeys / explanation
- 原文题干：`下列对文中五类看月之人的分析，不正确的一项是( )`
- 源答案：`B`
- 争议选项：`“看月而人不见其看月之态，亦不作意看月者”，这是作者最欣赏的一类人，他们是作者自己和好友佳人，他们看月是真正的享受，不刻意做作。`
- 原因：B 的核心内容与原文相近，但“他们是作者自己和好友佳人”存在表述过度；需要确认是否按源答案发布。
- 建议：保留源答案 B，并把解析限定为 B 把该类人直接等同为作者自己，表述过度。
- 用户选择：A
- 处理结果：已保留源答案 B，并将解析限定为“B 把该类人直接等同为作者自己，表述过度”；题干、选项、答案未修改。

- 2026-06-02：用户回复 A A A A，已确认第9课四处源文本修正；继续核对第10课时发现 q-cc-ch010-pretest-010 答案解释存在争议，新增阻断项等待选择。

## 发布记录

- 2026-06-02：全部阻断项已按用户选择处理，发布到 v2-college-chinese-complete；新增第9课、第10课、第11课，排除错位的第10课课后作业源文件。

## manualChanges

```json
[
  {
    "questionId": "q-cc-ch009-homework-001",
    "field": "options.D.text",
    "from": "隔 阂gé hé ;隔膜gé mó",
    "to": "隔阂gé hé;隔膜gé mó",
    "reason": "用户选择 A，确认修正生成题库中的空格/标点异常；源文件不改。"
  },
  {
    "questionId": "q-cc-ch009-homework-003",
    "field": "stem",
    "from": "结合课文内容，下列说法不正确一项是、",
    "to": "结合课文内容，下列说法不正确一项是。",
    "reason": "用户选择 A，确认修正生成题库中的题干标点；源文件不改。"
  },
  {
    "questionId": "q-cc-ch009-homework-006",
    "field": "options.B.text",
    "from": "学校pei'y培养的人才大多不合格，不能满足社会需要。",
    "to": "学校培养的人才大多不合格，不能满足社会需要。",
    "reason": "用户选择 A，确认删除生成题库中的拼音残片；源文件不改。"
  },
  {
    "questionId": "q-cc-ch009-homework-020",
    "field": "stem",
    "from": "本位作者雷海宗先生是一个历史学家，但是他对其他领域包括教育领域也都深有研究。",
    "to": "本文作者雷海宗先生是一个历史学家，但是他对其他领域包括教育领域也都深有研究。",
    "reason": "用户选择 A，确认修正生成题库中的疑似错字；源文件不改。"
  }
]
```

## importDecisions

```json
[
  {
    "id": "issue-001-ch010-homework-content-mismatch",
    "userChoice": "A",
    "result": "Do not publish 大学语文-10-西湖七月半.json as ch010 homework because its 20 questions duplicate ch009 homework content."
  },
  {
    "id": "issue-002-ch011-homework-source-missing",
    "userChoice": "A",
    "result": "Publish ch011 with pretest and literary common-sense groups only; record missing homework source."
  },
  {
    "id": "issue-007-ch010-pretest-q010-answer-dispute",
    "userChoice": "A",
    "result": "Keep source answer B and explain that the option overstates the identity of this class of moon viewers."
  }
]
```

## 章节名修正

- 2026-06-02：用户确认第11课章节名为《别赋》，已将第11课章节名修正为 `11-别赋`，发布到 v2-college-chinese-complete-ch011-title-fix；题干、选项、答案未修改。
