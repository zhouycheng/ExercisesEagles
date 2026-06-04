# 题库数据与运行态工作流

## 文档目的

这份文档记录题小鹰题库数据从源文件、可编辑工作区、发布版本到小程序运行态快照的关系，以及当前小程序如何读取题库数据。

Git 分支、提交、PR 和 tag 规则见 `docs/workflow/git.md`。题库导入、工单、解析和发布阻断的 agent 规则见 `.codex/skills/question-bank-curator/`。

## 当前运行态

当前小程序运行态题库版本：

```text
v4-college-english-units-001-to-003
```

当前运行态统计：

| 课本 | 章节 / 单元 | 题目数 |
| --- | ---: | ---: |
| 大学语文 | 11 | 310 |
| 大学生心理健康 | 7 | 139 |
| 大学英语 | 3 | 76 |
| 合计 | 21 | 525 |

统计来自 `miniprogram/data/question-banks/manifest.js`，不是手工维护值。

## 数据层级

题库数据按 Git-like 模型维护，流转分为四个阶段：

```text
data/source-files -> data/question-banks/workspaces -> data/question-banks/releases -> miniprogram/data/question-banks
```

含义：

- `/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/source-files`：原始资料，只读证据，不直接修改。
- `/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/workspaces`：可编辑导入工作区，用于持续整理题库。
- `/Users/leftzhou/WorkSpace.localized/题小鹰/project/data/question-banks/releases`：不可变发布版本，只能从已验证 ready workspace 生成。
- `/Users/leftzhou/WorkSpace.localized/题小鹰/project/miniprogram/data/question-banks`：小程序运行态快照。

只有发布成功后，才能更新 canonical latest 和小程序运行态快照。普通导入应先进入 workspace，不直接覆盖 runtime。

## 小程序读取合同

微信小程序运行时不直接依赖原始 `.json` 题库文件。当前主应用读取：

```text
miniprogram/data/question-banks/manifest.js
miniprogram/data/question-banks/<bookSlug>-ch###.js
```

同名 `.json` 文件保留用于检查、审阅、发布追踪和外部工具读取。发布同步时必须保证 `.json` 与 `.js` 包装内容一致。

项目根目录的 `data/` 是题库维护数据，不在 `miniprogramRoot` 下；主业务上传包依赖 `miniprogram/data/question-banks` 中的 `.js` 包装模块、页面、组件和图片资源。

## 应用数据流

当前题库进入页面的路径：

```text
manifest.js / chapter modules
  -> miniprogram/utils/question-bank-catalog.js
  -> miniprogram/repositories/question-bank-repository.js
  -> page viewmodels
  -> pages
```

职责：

- `question-bank-catalog.js`：读取 manifest，补充课本封面、课本描述、章节标签、题目数量、章节题库和整本抽题数据。
- `question-bank-repository.js`：对页面 ViewModel 暴露题库查询接口。
- `home-viewmodel.js`：生成首页课本列表和跳转命令。
- `book-detail-viewmodel.js`：生成课本详情、章节入口、抽题配置和测试配置。
- `quiz-viewmodel.js`：根据 URL 参数选择章节题库、整本抽题或测试题目，并接入本地存储。
- `quiz-session.js`：维护答题会话状态、单选 / 多选行为、查看模式、模拟测试倒计时、交卷、计分和结果回顾。

## 路由模式

答题页 `page/quiz/index` 支持以下入口：

| 场景 | 参数 | 行为 |
| --- | --- | --- |
| 章节练习 | `bookId`、`chapterId`、`mode=normal` | 按章节顺序答题并记录成绩 |
| 查看题目 | `bookId`、`chapterId`、`mode=view` | 直接展示答案和解析，不记录成绩 |
| 整本抽题 | `scope=book`、`bookId`、`count`、`seed` | 从整本书题库按 seed 抽取固定题量 |
| 模拟测试 | `scope=book`、`bookId`、`count`、`seed`、`mode=test`、`duration` | 整本抽题并开启倒计时，时间到自动交卷 |

当参数缺失或题库不可用时，答题 ViewModel 会回退到第一个可用章节题库。

## 题库内容规则

核心规则：

- 题干、选项、答案必须来自源文件，除非有用户确认的工单修正。
- 题库中不使用 app-facing `score` 字段；普通题用 `weight: 1`。
- 源系统分值只作为 `sourceMeta.rawScore` 保留，用于审阅追踪，不影响答题页计分。
- `chapter.name` 必须是纯标题，不带 `1-`、`第1课` 或 `第 X 章：` 这类组合前缀。
- 每道发布题必须有非空解析，且 `explanationStatus` 为 `verified`。
- 未解决工单会阻断 release、latest 和 runtime sync。

详细格式见 `.codex/skills/question-bank-curator/references/question-bank-format.md`。

## 发布同步要求

从 ready workspace 发布到运行态时，必须同步更新：

- release manifest；
- canonical `latest.json`；
- source ledger；
- runtime `manifest.json` 和 `manifest.js`；
- runtime `latest.json` 和 `latest.js`；
- 每个章节题库的 `.json` 和 `.js` 包装；
- 任何新增的 app-facing runtime index / catalog 文件。

不要只更新某个章节文件而不更新 manifest / latest，也不要只更新 JSON 而忘记生成同名 `.js` 包装。

## 校验命令

基础 Git 检查：

```sh
git diff --check
```

运行态 JS 包装语法检查：

```sh
find miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;
```

运行态统计检查：

```sh
node - <<'NODE'
const manifest = require('./miniprogram/data/question-banks/manifest.js')
const books = Array.isArray(manifest.books) ? manifest.books : []
const totals = books.reduce((acc, book) => {
  const chapters = Array.isArray(book.chapters) ? book.chapters : []
  acc.books += 1
  acc.chapters += chapters.length
  acc.questions += chapters.reduce((sum, chapter) => sum + (Number(chapter.questionCount) || 0), 0)
  return acc
}, { books: 0, chapters: 0, questions: 0 })
console.log(totals)
NODE
```

涉及页面、组件、运行态题库或 `project.config.json` 时，还需要在微信开发者工具中完成编译、预览或真机验证。

## 提交前文档同步

题库或答题流程变更提交前，至少检查：

- `README.md` 是否仍准确描述当前页面、题库规模和运行方式。
- `docs/changelog.md` 是否记录本次新增、变更、移除和验证。
- 本文档是否需要更新数据流、路由模式、校验命令或发布规则。
- `.codex/skills/question-bank-curator/` 是否仍和实际题库维护流程一致。
