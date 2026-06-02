# 题小鹰

题小鹰是一个微信小程序本地题库练习应用。当前版本已经从单章节答题 MVP 演进为“首页课本列表 -> 课本详情 -> 章节练习 / 抽题练习 / 模拟测试”的完整本地题库流程。

应用主流程不依赖服务端：题库运行态快照放在 `miniprogram/data/question-banks/`，页面通过本地 CommonJS 模块读取题库 manifest 和章节题库。仓库中仍保留部分微信官方示例目录和云函数示例文件，但它们不再是当前小程序的 active navigation，也不会作为主业务路径使用。

## 当前题库

当前运行态题库版本为 `v4-college-english-units-001-to-003`，共 3 本书、21 个章节 / 单元、525 道题。

| 课本 | 章节 / 单元 | 题目数 |
| --- | ---: | ---: |
| 大学语文 | 11 | 310 |
| 大学生心理健康 | 7 | 139 |
| 大学英语 | 3 | 76 |

题库支持单选、多选和判断题。每道题包含题干、选项、答案、解析、题型、权重和来源追踪字段；小程序运行时使用 `.js` 模块包装后的题库文件，`.json` 文件保留给检查、审阅和发布追踪。

## 功能

- 首页展示课本封面入口，目前包含大学语文、大学生心理健康和大学英语。
- 课本详情页展示题库简介、章节 / 单元数量、题目数量和章节目录。
- 每个章节支持“查看题目”和“抽题”进入答题页。
- 整本书支持抽题练习，可选择题目数量。
- 支持模拟测试，可选择题目数量和测试时长，答题页显示倒计时并在时间结束后自动交卷。
- 答题页支持单选、多选、判断题、上一题 / 下一题、横向滑动切题、题目收藏和试卷全览。
- 查看题目模式会直接展示答案和解析，不记录成绩。
- 练习和测试模式交卷后展示得分、正确题数、错误题数、历史最佳和逐题回顾。
- 章节练习、整本抽题和模拟测试使用独立历史最佳缓存键，避免成绩互相覆盖。
- 首页、详情页和答题页使用独立 ViewModel / Model 承载状态和业务逻辑，页面层主要负责微信小程序 API 和事件桥接。

## 当前页面

`miniprogram/app.json` 当前只注册题小鹰主业务页面：

```text
page/home/index          # 首页：我的课本
page/book-detail/index   # 课本详情、章节入口、抽题/测试配置
page/my/index            # 我的页占位
page/quiz/index          # 答题、查看题目、抽题、模拟测试
```

tabBar 当前包含“首页”和“我的”。旧的官方示例页、示例分包和云开发演示目录仍保留在仓库中用于参考，但已从 active app config 和上传包中收敛。

## 目录结构

```text
.
├── cloudfunctions/                         # 保留的云函数示例，不是当前答题主流程依赖
├── docs/
│   ├── changelog.md                        # 更新日志
│   └── workflow/
│       ├── git.md                          # Git 分支、提交、PR、tag 规则
│       └── question-banks.md               # 题库数据流、运行态快照和校验规则
├── miniprogram/
│   ├── adapters/
│   │   └── wx-layout.js                    # 状态栏、胶囊按钮和导航栏布局适配
│   ├── components/
│   │   ├── book-cover-card/                # 首页课本封面卡片
│   │   ├── book-summary-card/              # 详情页课本概要和操作入口
│   │   ├── bottom-sheet/                   # 通用底部弹层
│   │   ├── chapter-list-item/              # 章节列表项
│   │   ├── icon-action-button/             # 图标操作按钮
│   │   ├── question-overview-sheet/        # 试卷全览弹层
│   │   └── route-loading/                  # 页面跳转加载层
│   ├── data/question-banks/                # 小程序运行态题库快照
│   ├── image/book-cover/                   # 课本封面图
│   ├── image/icons/                        # tabBar 和答题页图标
│   ├── models/
│   │   └── quiz-session.js                 # 答题会话、计分、测试倒计时、模式切换
│   ├── page/
│   │   ├── home/
│   │   ├── book-detail/
│   │   ├── my/
│   │   └── quiz/
│   ├── repositories/
│   │   └── question-bank-repository.js     # 题库读取仓储
│   ├── utils/
│   │   └── question-bank-catalog.js        # manifest 归一化、章节/整本抽题数据构造
│   └── viewmodels/                         # 页面 ViewModel
├── package.json                            # 根目录 lint 依赖和脚本
└── project.config.json                     # 微信开发者工具项目配置和上传忽略规则
```

## 题库数据流

题库有三层：

```text
source-files -> question-banks/workspaces -> question-banks/releases -> miniprogram/data/question-banks
```

- `source-files` 是原始资料，只作为证据读取，不直接修改。
- `question-banks/workspaces` 是可编辑导入工作区。
- `question-banks/releases` 是不可变发布版本。
- `miniprogram/data/question-banks` 是当前小程序运行态快照。

当前小程序运行时读取：

- `miniprogram/data/question-banks/manifest.js`
- `miniprogram/data/question-banks/<book>-ch###.js`

同名 `.json` 文件用于审阅和校验。微信开发者工具上传配置中会忽略运行态 JSON 和旧示例目录，避免把审阅数据和示例能力打进主业务上传包。

更多规则见 [题库工作流](docs/workflow/question-banks.md)。

## 开发运行

安装根目录依赖：

```sh
npm install
```

如需使用小程序内 npm 包，安装小程序目录依赖：

```sh
cd miniprogram
npm install
```

然后使用微信开发者工具打开项目根目录。项目配置中的小程序根目录是 `miniprogram/`，云函数根目录是 `cloudfunctions/`。

当前主业务不需要云开发环境才能运行。如果要调试保留的云函数示例，需要自行配置云开发环境并部署对应云函数。

## 常用检查

基础检查：

```sh
git diff --check
npm run lint
```

题库运行态模块检查：

```sh
find miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;
```

涉及页面、组件、题库快照或项目配置时，还应在微信开发者工具中执行编译、预览或真机验证。

## 文档

- [更新日志](docs/changelog.md)
- [Git 工作流](docs/workflow/git.md)
- [题库工作流](docs/workflow/question-banks.md)
