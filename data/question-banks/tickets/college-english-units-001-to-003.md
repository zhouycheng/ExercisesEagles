---
workspaceId: wb-20260602-college-english
status: released
blocking: false
workspaceDir: /Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/workspaces/wb-20260602-college-english
releaseVersion: v4-college-english-units-001-to-003
---

# college-english-units-001-to-003 导入工单

- 状态：released
- 阻断发布：false
- Workspace：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/workspaces/wb-20260602-college-english
- 范围：大学英语第一至第三单元

## 阻断项

### issue-001-unit2-q013-malformed-blank：第二单元第 13 题题干疑似缺少填空占位

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第二单元.json
- 源 ID：subject-bmu0zf-unit-x8ggao-013
- 生成题目：q-ce-ch002-single-choice-003
- 字段：stem
- 原文：`The tourists were awestruck at the of the Great Wall, the building of which started as early as the seventh century B.C.E.`
- 原因：句中 `at the of` 不符合英语结构，结合选项与答案 D `magnificence`，疑似漏了填空占位。
- 建议：生成题库中题干修正为 `The tourists were awestruck at the ______ of the Great Wall, the building of which started as early as the seventh century B.C.E.`；源文件不改。

A. 按建议修正生成题库题干，源文件不改
B. 保留源题干原样
C. 暂不发布，保留待处理

- 用户选择：A
- 处理结果：已按建议修正生成题库题干；源文件不改。

### issue-002-unit3-embedded-score-markers：第三单元 12 道题题干包含分值标记

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第三单元.json
- 字段：stem
- 原文：
- subject-bmu0zf-unit-x8j5fn-008: `recruit(1.7分)`
- subject-bmu0zf-unit-x8j5fn-009: `stunning(1.7分)`
- subject-bmu0zf-unit-x8j5fn-010: `vigorous(1.7分)`
- subject-bmu0zf-unit-x8j5fn-011: `be accustomed to(1.7分)`
- subject-bmu0zf-unit-x8j5fn-012: `be based on(1.7分)`
- subject-bmu0zf-unit-x8j5fn-013: `for the sake of(1.7分)`
- subject-bmu0zf-unit-x8j5fn-014: `have a passion for(1.7分)`
- subject-bmu0zf-unit-x8j5fn-015: `no exaggeration(1.7分)`
- subject-bmu0zf-unit-x8j5fn-016: `strive for(1.7分)`
- subject-bmu0zf-unit-x8j5fn-026: `I've ______ hardships throughout my life, so I think I can handle the stress and achieve my full potential in this company.(3.9分)`
- subject-bmu0zf-unit-x8j5fn-027: `Many people believe that ______ exercise and outdoor sports could better help people stay healthy and strong.(3.9分)`
- subject-bmu0zf-unit-x8j5fn-035: `The situation between us is very challenging, but we have to learn how to handle the difficult situation ______ improving our relations.(3.9分)`
- 原因：`(1.7分)` 和 `(3.9分)` 看起来像源系统分值残留，不像题干本身；自动删除会改变源题干，必须确认。
- 建议：生成题库中删除这些题干末尾的分值标记；源文件不改。

A. 按建议删除生成题库题干中的分值标记，源文件不改
B. 保留源题干原样
C. 暂不发布，保留待处理

- 用户选择：A
- 处理结果：已删除生成题库题干中的分值标记；源文件不改。

### issue-003-unit3-q015-answer-explanation-conflict：第三单元第 15 题答案与解释冲突

- 源文件：/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学英语-第三单元.json
- 源 ID：subject-bmu0zf-unit-x8j5fn-015
- 生成题目：q-ce-ch003-vocabulary-015
- 字段：answerKeys / explanation
- 原文题干：`no exaggeration(1.7分)`
- 源答案：`A`
- 选项 A：`夸张地说`
- 选项 B：`毫不夸张`
- 源解释：`正确答案：A. 夸张地说。之所以选A，是因为no exaggeration 表示“毫不夸张”。题干考查该词或短语的基本含义，其他选项与它的词义不一致。`
- 原因：源解释说明 `no exaggeration` 是“毫不夸张”，但源答案指向 A“夸张地说”，与选项 B 冲突。
- 建议：生成题库答案改为 B，并写入解析 `本题考查 no exaggeration 的词义。正确答案是 B，因为它表示“毫不夸张”。`；源文件不改。

A. 按建议将生成题库答案改为 B，源文件不改
B. 保留源答案 A，并确认按 A 发布
C. 暂不发布，保留待处理

- 用户选择：B
- 处理结果：用户随后提供教材图片，图中确认 no exaggeration 为 no overstatement / “毫不夸张；并非言过其实”。已将生成题库答案改为 B，并写入 verified 解析；源文件不改。

## 处理日志

- 2026-06-02：创建大学英语 workspace；发现以上阻断项，等待用户选择。


## 追加处理日志

- 2026-06-02：用户回复 `A A B`。前两项已应用；第三项保留源答案 A，但因解释无法按准确性规则验证，workspace 仍为 blocked。


## 结案记录

- 2026-06-02：用户提供教材图片作为依据：/Users/leftzhou/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_58wr89h4czls22_9888/temp/RWTemp/2026-06/8fd2ae725818d9d055a484c5950c2441/9e5f70fa26734fd782d203a0733e3324.jpg
- 结论：`no exaggeration` 表示 `no overstatement`，中文为“毫不夸张；并非言过其实”。
- 处理：`q-ce-ch003-vocabulary-015` 生成题库答案改为 B，解析改为 verified。
- 状态：resolved，blocking=false。


## 发布记录

- 2026-06-02：发布到 v4-college-english-units-001-to-003；同步 canonical latest 和小程序 runtime。
