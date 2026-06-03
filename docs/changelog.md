# 更新日志

主要记录题小鹰的变化。

历史开发过程、阶段性实现细节和临时决策可继续放在 `docs/archive/logs/`；这里记录每次更新的概要。

## 记录格式

```text
YYYY-MM-DD｜vX.Y.Z｜Release 或 No Release
当天更新概要

### Added

- 新增内容

### Changed

- 更新内容

### Fixed

- 修复内容

### Verified

- 验证内容
```

同一天的多个提交会合并整理为简洁 bullet。

## 2026-06-04｜v1.2.1｜No Release

从仓库中移除所有微信官方 Demo 模板代码和配置文件，将项目元数据更新为 ExercisesEagles 品牌。

### Changed

- 根目录 `package.json`：name 改为 `exercises-eagles`，移除 Demo 仓库的 GitHub 元数据。
- `app.wxss`：移除全部仅 Demo 页面引用的样式类（page-head、page-foot、image-plus、demo-text 等），保留 reset、container 和 btn-area。
- `project.config.json`：精简 packOptions.ignore，移除已删除目录的上传忽略规则，cloudfunctionRoot 清空。
- `README.md`：移除已删除目录的引用、云函数和示例代码相关描述，目录结构同步为当前状态。
- `docs/changelog.md`：移除"项目当前仍保留微信官方示例工程的部分能力"描述。

### Removed

- 移除 Demo 分包：`packageAPI/`、`packageComponent/`、`packageExtend/`。
- 移除 Demo 页面：`page/API/`、`page/component/`、`page/extend/`。
- 移除 Demo 公共模板：`common/`（head.wxml、foot.wxml、index.wxss、weui.wxss）。
- 移除 Demo 页面模板：`page/common/head.wxml`、`foot.wxml`、`common.wxss`、`index.wxss`，保留 `page/common/lib/weui.wxss`。
- 移除 Demo 配置文件：`app-darkmode.json`、`demo.theme.json`、`config.js`。
- 移除 Demo Worker：`workers/`。
- 移除 `LICENSE`（版权人 wechat-miniprogram）。

### Verified

- 通过全局搜索确认业务页面（page/home、page/book-detail、page/my、page/quiz）无对已删除目录的引用。
- 通过 `git diff --check` 检查变更格式。
- 通过 `npm run lint` 检查代码规范。

## 2026-06-03｜v1.2.0｜No Release

这次将题小鹰从单章节答题 MVP 推进为多课本本地题库应用，并同步收敛小程序主导航、题库运行态和项目文档。

### Added

- 新增首页 `page/home/index`，展示“我的课本”入口，目前接入大学语文、大学生心理健康和大学英语。
- 新增课本详情页 `page/book-detail/index`，展示课本简介、章节数量、题目数量和章节目录。
- 新增“查看题目”“章节抽题”“整本抽题”和“模拟测试”入口。
- 新增模拟测试配置弹层，可选择题目数量和测试时长。
- 新增答题倒计时，测试模式时间结束后自动交卷。
- 新增多选题答题支持，多选题先勾选选项，再通过“确认答案”提交。
- 新增通用 `bottom-sheet`、`book-cover-card`、`book-summary-card`、`chapter-list-item` 和 `route-loading` 组件。
- 新增 `QuizSession`、页面 ViewModel、题库 repository 和题库 catalog 工具，拆分页面层与答题业务状态。
- 新增课本封面图和首页 / 我的 tabBar 图标资源。
- 新增大学语文 11 章、大学生心理健康 7 章、大学英语 3 单元的运行态题库快照，共 525 道题。
- 新增 `manifest.js`、`latest.js` 和各章节 `.js` 题库模块包装，供小程序 `require()` 读取。
- 新增 `docs/workflow/question-banks.md`，记录题库数据流、运行态快照、发布同步和校验规则。
- 新增 `question-bank-curator` 的导入流程、解析标准和校验清单引用文档。

### Changed

- 将小程序 active pages 从官方示例页和单一答题页，调整为首页、课本详情、我的和答题页。
- 将 tabBar 收敛为“首页 / 我的”，并从当前主流程移除组件、接口、云开发和扩展能力示例入口。
- 答题页从直接读取单个大学语文章节，改为根据 URL 参数读取章节题库、整本抽题或测试题目。
- 答题页逻辑从页面文件拆分到 `QuizViewModel` 和 `QuizSession`，页面层主要处理触摸、导航、计时器和微信存储。
- 试卷全览组件增加查看题目模式，在查看模式下隐藏已答 / 未答状态说明。
- 成绩历史缓存按章节、整本抽题数量和测试时长分开记录，避免不同模式互相覆盖。
- `project.config.json` 增加上传忽略规则，排除旧示例目录、运行态 JSON 审阅文件和本地依赖目录。
- `README.md` 按当前多课本题库应用状态重写。
- 题库维护技能从单一格式说明扩展为 Git-like workspaces / releases / latest-runtime 模型。
- `.codex/skills/tixiaoying-workflow` 重命名为 `ExercisesEaglesWorkflow`，并合并 `git-workflow` 技能内容后删除 `git-workflow`。

### Removed

- 从 active app config 中移除官方示例分包、示例 tabBar、云开发开关、深色主题、位置 / 音频后台能力和 worker 配置。
- 移除当前主应用对云开发初始化、openid 拉取和主题监听示例逻辑的依赖。

### Verified

- 通过 Node 读取 `miniprogram/data/question-banks/manifest.js`，确认当前运行态题库为 3 本书、21 个章节 / 单元、525 道题。
- 通过 `find miniprogram/data/question-banks -maxdepth 1 -name '*.js' -exec node --check {} \;` 检查运行态题库模块语法。
- 通过 Node 逐个读取运行态题库 `.js` 模块，确认 21 个章节 / 单元的题目数量与 manifest 统计一致。
- 通过静态阅读 `miniprogram/app.json`、`project.config.json`、`miniprogram/page/`、`miniprogram/viewmodels/`、`miniprogram/models/`、`miniprogram/repositories/` 和 `miniprogram/utils/` 核对当前页面、导航和数据流。

## 2026-06-02｜v1.1.0｜No Release

### Changed

- 将答题页当前测试题从内联数学 MVP 题切换为本地题库 `miniprogram/data/question-banks/college-chinese-ch001.json`。
- 当前测试章节为大学语文第 1 课《序二篇》，共 29 题，包含课后作业、课前测验和文学常识。
- 成绩改为按 100 分折算，并使用章节级历史最佳缓存键，避免沿用旧数学题成绩。

### Removed

- 移除答题页内联的 10 道数学 MVP 题。

### Verified

- 通过 `node --check miniprogram/page/quiz/index.js`。
- 通过 Node 数据映射检查确认 29 道题答案索引均有效，解析状态均为 `verified`。

## 2026-06-01｜v1.0.0｜No Release

今天完成题小鹰微信小程序 MVP，并在当前工作区继续补充答题页交互、试卷全览和项目文档。

### Added

- 新建微信小程序工程，保留组件、API、云开发和扩展能力示例分包。
- 新增题小鹰答题主入口 `miniprogram/page/quiz/index`，应用启动后优先进入数学题练习。
- 新增 10 道数学选择题，支持选项选择、答题进度、上一题、下一题和最后一题交卷。
- 新增答题即时反馈，答题后展示正确 / 错误状态、正确答案提示和题目解析。
- 新增试卷全览底部弹层，支持查看当前题、已答题、未答题并跳转到指定题目。
- 新增未答完交卷提醒，可进入试卷全览或强制交卷。
- 新增成绩页，展示本次分数、正确题数、错误题数、历史最佳和逐题回顾。
- 新增本地历史最佳成绩缓存，使用 `quizBestScore` 保存最高分。
- 新增题目收藏能力，支持星标按钮和页面三连点手势切换收藏状态。
- 新增 `icon-action-button` 图标操作按钮组件，统一试卷全览和收藏入口。
- 新增 `image/icons` 图标资源目录，收纳试卷全览、收藏和未收藏图标。
- 新增云开发示例函数，覆盖 openid 获取、临时文件 URL、数据库读取和开放接口演示。
- 新增 README 项目说明和本更新日志。
- 新增 `docs/workflow/git.md`，记录与 FrameLean 一致的 Git 分支、提交、changelog、worktree、PR 和 tag 规则。

### Changed

- 将小程序首页从官方示例页调整为题小鹰答题页，同时保留示例 tabBar 和分包。
- 答题页改为自定义导航栏，并根据微信胶囊按钮和状态栏动态计算内容顶部间距。
- 答题页支持横向滑动切换上一题 / 下一题。
- 题干区域改为按需滚动，答案和操作按钮固定在底部答题区。
- 题目解析从选项内部展开调整为独立解析卡片，选项内仅保留选择结果和正确答案提示。
- 试卷全览弹层增加下拉关闭交互，并优化拖拽回弹和关闭状态重置。
- 部分官方示例资源和引用被收敛，当前答题页图标迁移到 `miniprogram/image/icons/`。

### Fixed

- 修复长题干或解析内容较多时可能挤压底部答题操作区的问题。
- 修复自定义导航在不同设备状态栏和胶囊按钮尺寸下可能遮挡标题或内容的问题。
- 修复试卷全览关闭后拖拽状态可能残留的问题。
- 修复未答题直接交卷缺少明确二次确认和题目定位入口的问题。

### Verified

- 通过 `git log --oneline --date=short` 梳理 `create: 新建项目` 和 `add: 已完成MVP版本` 两次提交。
- 通过静态阅读 `miniprogram/app.json`、`miniprogram/page/quiz/`、`miniprogram/components/` 和 `cloudfunctions/` 确认当前功能范围。
- 通过 `git status --short` 确认当前工作区仍有答题页、题目全览组件和图标资源相关未提交改动。
- 通过 `git diff --check`。
