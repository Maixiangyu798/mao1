# 奶蛙 Python 学习平台

面向零基础学习者的 Python 学习平台前端原型。项目依据产品需求文档（PRD）和 Figma 原型实现，覆盖「发现课程 → 学习 → 练习 → 成就 / 记录」的完整闭环。

当前版本是纯前端演示：课程、题库、排行、消息等数据来自本地 mock，账号与学习进度保存在浏览器 `localStorage` 中，不需要后端服务即可体验。

## 快速开始

环境要求：Node.js 18+，推荐使用最新的 LTS 版本。

```bash
npm install
npm run dev       # 本地开发，默认 http://localhost:5173
npm run build     # 类型检查 + 生产构建，产物位于 dist/
npm run preview   # 预览生产构建
```

在登录页点击「第一次来？使用演示账号体验」即可进入预置的「小林同学」账号，直接体验已有学习进度、收藏、成就和消息。

## 推荐体验路径

1. 以游客身份浏览首页、课程列表、题库和排行榜。
2. 在课程详情点击「开始学习」，体验登录拦截与登录后返回原页面。
3. 进入「Python 零基础入门 → 3.2 用字符串拼接出一句问候」，运行并提交代码，解锁下一课时。
4. 打开题目详情，查看提示、提交判题、收藏题目。
5. 在个人中心查看学习记录、成就墙、收藏与设置，并尝试退出登录。

## 功能概览

- **首页**：游客与登录双态，继续学习、每日一题、学习统计、课程推荐和学习路线。
- **课程**：难度 / 方向 / 状态筛选、课程详情、章节大纲、课时状态与学习进度。
- **学习工作台**：三栏布局、课程目录、图文教程、可运行代码编辑器、控制台、提示、草稿自动保存与判题。
- **题库**：列表 / 闯关地图双视图、知识点与难度筛选、分页、题目详情、提示解锁、提交记录与题解解锁。
- **排行榜**：周榜领奖台与完整排名，区分游客与登录态。
- **个人中心**：概览、学习记录、成就墙、课程 / 题目收藏、账号与偏好设置。
- **消息中心**：分类筛选、未读状态、单条已读与全部已读。
- **新手引导**：学习基础与目标选择、路线推荐。
- **完整路由与状态页**：登录 / 注册 / 找回密码、404、500、空状态、加载状态与确认弹窗。
- **响应式**：桌面、平板与移动端布局，包含移动端导航与学习工作台堆叠布局。

## 路由

| 路径 | 页面 | 访问权限 |
| --- | --- | --- |
| `/` | 首页 | 公开 |
| `/courses` | 课程列表 | 公开 |
| `/course/:courseId` | 课程详情 | 公开 |
| `/practice` | 题库（列表 / 闯关地图） | 公开 |
| `/practice/:problemId` | 题目详情 | 公开（提交判题需登录） |
| `/ranking` | 排行榜 | 公开 |
| `/login` / `/register` / `/forget` | 登录、注册、找回密码 | 仅游客 |
| `/learn/:courseId/:lessonId` | 学习工作台 | 需登录 |
| `/onboarding` | 新手引导 | 需登录 |
| `/messages` | 消息中心 | 需登录 |
| `/profile` | 个人中心概览 | 需登录 |
| `/profile/records` | 学习记录 | 需登录 |
| `/profile/achievements` | 我的成就 | 需登录 |
| `/profile/favorites` | 我的收藏 | 需登录 |
| `/profile/settings` | 设置 | 需登录 |
| `/404` / `/500` / `*` | 状态页与兜底路由 | 公开 |

需要登录的页面会跳转到 `/login?returnUrl=...`，登录成功后回到原地址。路由守卫会校验 `returnUrl` 仅允许站内路径，避免开放重定向。

## 项目结构

```text
.
├─ docs/
│  ├─ design/figma-prototype/     # Figma 导出的原型页面 PNG
│  ├─ prd/                        # PRD、配图与素材处理脚本
│  └─ README.md                   # 文档索引
├─ public/
│  └─ frog/                       # 页面使用的奶蛙插画
├─ src/
│  ├─ app/                        # 路由、鉴权守卫、Auth、滚动复位
│  ├─ layouts/                    # 站点布局与个人中心布局
│  ├─ pages/                      # 按业务域拆分的页面
│  │  ├─ auth/  courses/  learn/  practice/
│  │  ├─ profile/  messages/  ranking/  onboarding/  errors/
│  │  └─ HomePage.tsx
│  ├─ components/
│  │  ├─ ui/                      # Button、Modal、Field、Toast 等通用组件
│  │  ├─ layout/                  # 页头与页脚
│  │  ├─ course/                  # 课程卡片与封面
│  │  ├─ practice/                # 代码编辑器
│  │  └─ profile/                 # 成就徽章
│  ├─ data/                       # 课程、题库、教程内容、种子用户与 mock 数据
│  ├─ styles/
│  │  ├─ tokens.css               # 颜色、间距、圆角、阴影等设计变量
│  │  ├─ base.css                 # 全局重置与基础排版
│  │  ├─ layout.css               # 站点骨架与响应式布局
│  │  ├─ components.css           # 通用组件样式
│  │  └─ pages/                   # 按页面域拆分的样式
│  ├─ utils/                      # 课程进度、Python 模拟执行、存储、日期、className
│  ├─ types.ts                    # 领域类型
│  └─ main.tsx                    # 应用入口
├─ index.html
├─ package.json
├─ vite.config.ts
└─ tsconfig*.json
```

### 分层约定

- **页面只负责组合**：业务数据来自 `src/data`，状态与进度逻辑集中在 `src/app`、`src/utils`，展示交给组件。
- **样式分层**：设计变量 → 基础样式 → 布局 → 通用组件 → 页面样式，页面 CSS 不重复定义基础控件。
- **单一数据源**：课程、题目与种子用户分别维护在 `src/data`，页面通过查询函数获取，避免跨页面复制数据。
- **可复盘的状态**：所有持久状态都通过 `src/utils/storage.ts` 的 `STORAGE_KEYS` 管理，便于排查和清理。

## 状态与数据

`localStorage` 键：

| 键 | 内容 |
| --- | --- |
| `naiwa_token` | 登录标记 |
| `naiwa_user_v2` | 用户资料、学习进度、收藏、成就、消息已读状态与偏好 |
| `naiwa_editor_font` | 编辑器字号偏好 |
| `naiwa_draft_{lessonId}` | 学习工作台代码草稿 |
| `naiwa_problem_draft_{problemId}` | 题目代码草稿 |

说明：

- 演示账号与所有业务数据都是前端 mock，不连接真实服务。
- `src/utils/pythonSimulator.ts` 是一个面向内置任务的轻量模拟器，用于演示运行 / 判题交互，不执行任意 Python 代码。
- 注册、改密、换绑手机号等操作只展示交互流程，不会传输或持久化真实凭据。

## 设计系统

- 主色 `#FFC93C`，悬浮 `#EFA900`，按下 `#C98F00`，深色文字 `#8A5A00`。
- 柔和底色 `#FFF4CC` / `#FFFBEB`，页面背景 `#FFFDF7`，边框 `#EFE7D6`。
- 正文 `#3A3226`，次要文字 `#7A6F5C`；成功、警告、错误、信息色与 PRD 一致。
- 页头高度 64px，内容最大宽度 1200px，圆角 12–22px，整体采用温暖奶油色表面。
- 字体与尺寸均通过 `src/styles/tokens.css` 管理；响应式断点覆盖 1240 / 1100 / 1040 / 960 / 900 / 768 / 600 / 420px。
- 代码编辑器支持行号、语法高亮、自动保存、`Ctrl / ⌘ + Enter` 运行与 `Ctrl / ⌘ + S` 保存。

## 文档

- [文档索引](docs/README.md)
- [产品需求文档](docs/prd/奶蛙Python学习平台-PRD.md)
- [Figma 原型页面](docs/design/figma-prototype/)
