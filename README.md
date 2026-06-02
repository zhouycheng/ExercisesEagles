# 题小鹰

题小鹰是一个微信小程序答题 MVP。当前项目以大学语文第 1 课题库练习为主入口，同时保留微信官方示例工程中的组件、接口、云开发和扩展能力分包，便于后续继续复用小程序能力样例。

## 项目分析

当前工程仍保留微信小程序示例项目的底座，但主业务已经切换到 `miniprogram/page/quiz/index`。应用启动后优先进入答题页，底部 tab 继续提供组件、扩展能力、接口和云开发示例入口。

答题业务目前是纯前端本地 MVP：题库从本地 `miniprogram/data/question-banks` 读取，答题记录、错题回顾和分数计算在页面状态中完成，历史最佳成绩按题库章节使用本地缓存保存。云开发能力已经初始化，并保留 `wxContext`、临时文件 URL、数据库读取和开放接口演示云函数，但答题主流程暂未依赖服务端。

## 功能

- 大学语文第 1 课《序二篇》29 道题练习，包含课后作业、课前测验和文学常识。
- 支持 A/B/C/D 单选，也兼容只有 A/B 的判断题选项。
- 答题后即时显示正确/错误状态和题目解析。
- 支持上一题、下一题、横向滑动切题和最后一题交卷。
- 支持试卷全览，可查看当前题、已答题和未答题，并直接跳转题目。
- 未答完交卷时弹出二次确认，可返回试卷全览或强制交卷。
- 交卷后展示成绩、正确题数、错误题数、历史最佳和逐题回顾。
- 支持重新开始答题。
- 支持收藏当前题，收藏入口为星标按钮，也支持页面三连点切换收藏状态。
- 自定义顶部导航栏适配微信胶囊按钮和安全区。
- 题干区域按需滚动，答案区域固定在底部，减少长题干挤压操作区的问题。
- 试卷全览支持底部弹层展示、遮罩关闭、关闭按钮关闭和下拉关闭。
- 保留组件示例、API 示例、云开发示例和扩展组件示例分包。

## 目录结构

```text
.
├── cloudfunctions/                 # 云函数示例
├── docs/                           # 项目文档
├── miniprogram/
│   ├── components/
│   │   ├── icon-action-button/      # 图标操作按钮
│   │   └── question-overview-sheet/ # 试卷全览底部弹层
│   ├── data/question-banks/          # 本地题库运行时快照
│   ├── image/icons/                 # 答题页图标资源
│   ├── page/quiz/                   # 题小鹰答题主流程
│   ├── page/                        # 示例主入口
│   ├── packageAPI/                  # 微信 API 示例分包
│   ├── packageCloud/                # 云开发示例分包
│   ├── packageComponent/            # 基础组件示例分包
│   └── packageExtend/               # 扩展能力示例分包
├── project.config.json              # 微信开发者工具项目配置
└── package.json                     # 根目录开发依赖和 lint 脚本
```

## 开发运行

安装根目录依赖：

```sh
npm install
```

安装小程序目录依赖：

```sh
cd miniprogram
npm install
```

然后使用微信开发者工具打开项目根目录，并执行“工具 -> 构建 npm”。项目配置中的小程序根目录是 `miniprogram/`，云函数根目录是 `cloudfunctions/`。

## 云开发

当前 `miniprogram/config.js` 配置了云开发环境 ID，并在 `miniprogram/app.js` 中初始化 `wx.cloud`。如果要在自己的环境运行，请替换 `envId` 和示例云存储文件 ID，并在微信开发者工具中上传或部署对应云函数。

现有云函数：

- `wxContext`：返回 openid、appid 和 unionid。
- `getTempFileURL`：根据云文件 ID 获取临时访问链接。
- `getServerDataDemo`：读取云数据库示例数据。
- `openapi`：演示订阅/模板消息和小程序码相关开放能力。

## 文档

- [更新日志](docs/changelog.md)
