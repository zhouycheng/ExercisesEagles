# 导入工单 college-chinese-ch001

状态：已处理
阻断发布：否
处理日期：2026-06-02
发布版本：v1-college-chinese-ch001

## 导入信息

- 源目录：`/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files`
- 待处理目录：`/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/staging/v1-pending-college-chinese-ch001`
- 发布目录：`/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/releases/v1-college-chinese-ch001`
- 处理范围：大学语文 / 第1课 / 课后作业、课前测验、文学常识

## 阻断项处理结果

### 1. 缺少正式 manifest

处理结果：已处理。第1课 source file -> book/chapter/group 映射已写入发布 manifest。

用户确认：A，采用当前推导映射作为正式规则。

### 2. 解析需要重新检索验证

处理结果：已处理。29 道题已逐题生成 2 行内短解析，展示解析均标记为 `verified`。

用户确认：A，生成已验证解析。

### 3. 章节题与课后作业合并规则需固化

处理结果：已处理。本批按同一本《大学语文》第1课处理，保留课后作业、课前测验、文学常识三个题组；抽题时按 `questionId` 去重。

用户确认：A，合并并发布 clean release。

### 4. 源选项疑似错字，不能自动修复

- 文件：`/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files/大学语文-1-序二篇.json`
- 题目：`“究天人之际，通古今之变，成一家之言”语出哪里，并是哪部作品的创作宗旨？`
- 字段：`options.B.text`
- 原文：`《报仁安书》；《史记》`
- 处理结果：已按用户选择 A 修正为 `《报任安书》；《史记》`。

用户确认：A，修正选项。

## 修改日志

- `q-cc-ch001-homework-013.options.B.text`：`《报仁安书》；《史记》` -> `《报任安书》；《史记》`。原因：用户确认源文件为疑似错字，允许修正。
- 29 道题新增经检索/核对后的展示解析，均为 2 行内短解析。
- 发布 manifest 固化本批 source file -> chapter/group 映射与合并规则。

## 处理记录

- [x] 补充正式 manifest
- [x] 逐题生成已验证的 2 行内解析
- [x] 确认 `《报仁安书》` 是否修正为 `《报任安书》`
- [x] 重新生成可发布版本
