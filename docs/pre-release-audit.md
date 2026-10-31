# Player's DevLog 上线前自检报告

审计日期：2026-10-31（Asia/Shanghai）  
项目：`D:\Blog\Firefly`  
基线提交：`0a8daa9417aa71144557c069bde5b76870564a71`  
技术栈：Astro 7.3.3 / Firefly / Pages CMS / GitHub Pages（A09 修补前为 7.3.2）

## 1. 结论

**修复后可以部署。** 2026-10-31 完成 A09 受控依赖修补和逐公告风险判断；官方命中由 78 条降至 27 条，High 32 → 9、Moderate 34 → 12、Low 12 → 6、Critical 仍为 0。剩余 9 项 High 为未调用的 Swup 附带工具链及未启用的 Miniflare 分支，当前配置未发现已知可达的高危路径；不等同于依赖审计全绿。全部 52 项去重记录、21 项 High 的条件与兼容处理见第 8 节。

三项检查、22 项 CMS 保存兼容检查、6 项动态 API 检查和 18 项重点生产浏览器回归通过；原有全量自检证据保留复用。视频页首次 Swup 进入时的脚本遗漏已最小修复，部署安装改为冻结锁文件。建议仅按当前静态配置部署；改变 Cloudflare/网络客户端/不可信构建输入边界需重审。

Pages CMS 在线授权和真实保存、GitHub Linux runner 与正式部署效果仍为“待线上验收”。本次未 Commit、Push、触发工作流或部署。

## 2. 检查范围与证据

- 审计开始时 Git 工作区干净，记录了 652 个受跟踪文件的 SHA-256 基线。
- 检查上次 CMS 改造涉及的配置、JSON、内容 Schema、页面、资料/壁纸组件、动态静态 API 和音乐管理器；同时核对相关类型与消费者。
- 检查 `.pages.yml` 全部内容入口、媒体库、文件名、默认值、必填项、删除权限和 `settings.content.merge`。
- 核对首页、导航、文章详情、分类、标签、归档、Series、搜索、RSS/Atom、Favicon、主题与响应式布局。
- 检查 Actions 的构建/部署触发条件、Node/pnpm、输出目录、权限、静态资源和生成 API。
- 执行生产依赖审计、常见密钥模式扫描、生成 HTML 内部引用检查、媒体大小与前端 JS 体积检查。

本地证据位于忽略目录 `temp/pre-release-audit/`：

| 证据 | 内容 |
| --- | --- |
| `baseline.json` | 初始提交与 652 个文件哈希 |
| `cms-report.json` | 官方 CMS 保存链路测试 |
| `browser-report.json` | 新功能 36 项浏览器检查 |
| `production-report.json` | 正式生产页面 20 项回归、控制台与异常记录 |
| `edit-report.json` / `empty-report.json` | 编辑、删除、清空与关闭开关后的浏览器检查 |
| `static-report.json` | 内部引用、原内容保护、密钥模式、媒体与体积 |
| `check.log` / `type-check.log` / `build.log` | 三项命令日志 |
| `dependency-audit-official.json` | 官方 npm 审计原始结果 |
| `external-links.json` | 外部链接 HEAD 检查 |
| `production-*.png` | 正式页面四种视口/主题截图 |
| `desktop-*.png` / `mobile-*.png` | 隔离样本的动态与视频截图 |

测试数据使用隔离副本，未写入正式 `src/content/` 或 `src/data/`。截图中出现“审计”文字、13 篇文章等情况属于隔离样本；正式项目仍是原有 12 篇文章。测试脚本、下载的官方测试源码及日志不需要上传到仓库。

## 3. 已通过的项目

### 3.1 Pages CMS 配置与真实保存格式

核对官方当前提交 `6f4e860a35d934406580287e7042e5e111e207a1`，在本地执行其字段 Schema、字段 `read`/`write`、`deepMap`、`sanitizeObject`、序列化及数组替换合并逻辑。未调用 GitHub 写入 API。

这次测试包含完整链路：**模拟表单输入 → 官方服务端 Schema 校验 → 字段路径/日期转换 → 合并原字段 → 清理空值 → 保存 JSON/YAML → 项目实际 Schema/构建 → 浏览器读取**。不是只对原有 JSON 做 stringify/parse。

| CMS 入口 | 保存位置 | 结果 |
| --- | --- | --- |
| Markdown 文章 | `src/content/posts/**/*.md` | 11 篇普通 Markdown 实际往返保存后通过文章 Schema；额外 Series 等字段保留 |
| Redis 旧文 | 独立 `format: code` 文件入口 | 保留原始前导换行与源码编辑方式；原文未修改 |
| MDX | Astro 的 `**/*.{md,mdx}` 加载规则 | 可视化集合仍限定 `.md`；隔离 MDX 表达式构建和渲染通过 |
| 个人资料 | `src/data/profile.json` | 头像转换、昵称、签名和简介清空通过；整份文件禁止删除 |
| 博客外观 | `src/data/appearance.json` | 多图、数字转换、模式和开关通过；整份文件禁止删除 |
| 动态 | `src/content/dynamic/*.md` | 时间带偏移、多图、草稿、编辑/删除通过，不进入文章归档 |
| 视频 | `src/content/videos/*.json` | 标题/简介/封面/HTTPS 链接和日期通过，非法协议及带账号密码 URL 被拒绝 |
| 音乐 | `src/data/music.json` | 音频路径、封面、排序、默认音量、清空歌单通过；整份文件禁止删除 |

数字输入例如字符串 `"0.4"` 会先由官方服务端 Schema 转为 JSON 数值，因此未对项目的严格数字校验做无依据的放宽。日期输入 `2026-10-31T10:00` 在中国时区保存为 `2026-10-31T10:00:00+08:00`，动态和视频读取正确。

草稿用于控制网站展示，文件仍在公开仓库中。发布日期用于显示与排序，不提供定时发布；未来日期的公开条目也会随构建展示。CMS 特殊 Markdown 正文仍应使用 Source，`merge: true` 保护额外 Frontmatter，不保证富文本编辑器保留所有特殊正文语法。

### 3.2 媒体路径

| 媒体库 | 仓库存储目录 | 网站公开前缀 |
| --- | --- | --- |
| 文章图片 | `public/uploads/posts` | `/uploads/posts` |
| 头像与壁纸 | `public/uploads/site` | `/uploads/site` |
| 动态图片 | `public/uploads/dynamics` | `/uploads/dynamics` |
| 视频封面 | `public/uploads/videos` | `/uploads/videos` |
| 音乐文件 | `public/assets/music` | `/assets/music` |
| 音乐封面 | `public/assets/music/cover` | `/assets/music/cover` |

全部映射与实际目录一致，输出 URL 不重复添加最外层 `public`。确实存在历史目录 `public/uploads/posts/public/uploads/posts/`，其中是 `.gitkeep` 占位；本次没有移动、删除它，也没有因此重写旧链接。当前文章实际引用的已上传图片位于正确的文章媒体根目录并能访问。

### 3.3 原内容、资源和安全边界

- 当前有 12 篇文章：原有 MySQL 10 篇、Redis 1 篇，以及之前在线创建的一篇公开 CMS 测试文章，全部保留。
- 对内容、数据、原图、公开资源、主题样式和依赖清单等 **264 个受保护文件**逐一校验，哈希未改变。
- Dusty Lily、烛台图标、现有卡片、明暗主题及响应式布局保留。
- 生产输出为静态网站。`dist/api/` 只有 `allPostMeta.json` 和 `dynamic.json`，没有内容写入接口、数据库或常驻后端。
- 源代码运行配置中未发现依赖 `D:\Blog`、Windows 用户目录等本地绝对路径的新增功能。
- 对受跟踪文本及可扫描的构建文本检查 GitHub/OpenAI/AWS 密钥和 PEM 私钥模式，未检出命中。此结果不是对所有可能形式秘密的穷尽证明。
- 36 个生产 HTML 页面共检查 **3,367 处内部引用**，没有非预期缺失目标。13 处 `/404/` 引用来自错误页 canonical 和主动停用页面跳转，单独列为预期错误入口。
- 六个页面外链及原有背景视频源 HEAD 检查均为 200；这只是当前连通快照，不保证未来持续可用，也没有下载外部大视频。

## 4. 发现的问题及修复

| 编号 | 级别 | 已确认的问题 | 修复及验证 |
| --- | --- | --- | --- |
| A01 | P1 | CMS 会移除空字符串/空数组。清空简介后被误判为缺失并显示旧简介；清空歌单后会回退到不存在的 `song.mp3` 示例 | 缺失简介按空白读取；缺失歌单按空数组读取；移除无效示例引用。官方保存链路与空歌单按钮测试通过 |
| A02 | P1 | 官方 `file` 默认允许删除；整份资料/外观/音乐 JSON 被删除后，静态导入会令构建失败 | 三个入口增加官方 `operations.delete: false`；官方 Schema 及权限函数确认禁止整文件删除，条目操作保留 |
| A03 | P1 | CMS 可返回含空格等字符的已有文件路径，原过滤函数会直接丢弃；`#` 也可能被 URL 当成片段 | 站内文件逐段编码并在通用图片、动态、封面与本地音乐路径中使用；含中文、空格、井号样本经标准只读静态服务器实际加载通过。预览器限制另见第 9 节 |
| A04 | P1 | 动态 ID 的非 ASCII 字符全部替换成 `-`，不同中文文件可能产生同一锚点；侧栏链接也未使用同一规则 | 共用可区分的 URI 编码锚点，并一致编码链接片段；两条不同中文 ID 唯一，侧栏链接能定位正确 DOM |
| A05 | P1 | 音频错误会持续自动跳过/重试；空歌单上下首会触发读取 undefined；非法缓存音量会写入 NaN | 自动恢复只尝试尚未失败的曲目，全部失败后停止并提示；空歌单保护；缓存音量有限数检查及限幅；异步播放结果增加版本/暂停保护。真实两首 404 各请求一次后停止，恢复后可重试，空列表按钮无异常 |
| A06 | P2 | 视频直链加载失败时没有明确提示 | 在现有视频块内增加失败状态及源站链接引导，绑定视频/source error，元素移除时解绑；受控 WebM 实际解码与真实 404 提示均通过 |
| A07 | P2 | 导航 Logo 为 `/favicon/firefly-128.png` 时，结构化数据按 `src` 图片查找，构建出现资源未找到提示 | 改用已有绝对图片解析器，兼容 public 与 src 路径；正式构建不再出现该 Logo 查找错误，Favicon HTTP 检查通过 |
| A08 | P2 | Build and Check 仍测试已停止维护的 Node 23 | 两处矩阵移除 23，沿用当前部署的 Node 22；未改变部署触发、权限及正式部署步骤 |
| A09 | 原 P1，发布阻断已关闭；剩余告警跟踪 | 官方 npm 生产依赖审计有高危命中 | 受控修补 78 → 27 条，逐项评估 52 个组合/21 项 High；当前无已知可达 High，细节与非零审计结果见第 8 节 |

没有删除未使用的旧组件或个人资源。`DynamicItem.astro` 是现有备用渲染组件，当前动态页面走模板和 Svelte feed；保留它并同步修正链接规则。六次实际 Swup 换页后，每种 `fm:*` 监听器仍为 2 个（导航与侧栏各一份），音频对象仍为 1 个，因此没有对正常工作的组件清理结构做重构。

## 5. 实际修改文件

| 文件 | 修改用途 |
| --- | --- |
| `.pages.yml` | 三个关键单文件入口禁止整文件删除 |
| `.github/workflows/build.yml` | 检查/构建矩阵移除 Node 23 |
| `src/config/profileConfig.ts` | 兼容 CMS 清空简介后的字段省略 |
| `src/config/musicConfig.ts` | 空歌单保持为空，清除不存在的示例路径 |
| `src/components/features/MusicManager.astro` | 有界失败恢复、空列表/音量/异步状态保护及本地媒体编码 |
| `src/utils/media-url.ts` | 站内媒体路径逐段编码 |
| `src/components/common/ImageWrapper.astro` | 使用规范化后的 public 图片 URL |
| `src/utils/dynamic-utils.ts` | 中文 ID 可区分的统一锚点 |
| `src/components/pages/dynamic/DynamicFeed.svelte` | 共用锚点、链接与恢复定位规则 |
| `src/components/pages/dynamic/DynamicItem.astro` | 备用渲染器链接编码一致 |
| `src/components/widget/DynamicSidebar.svelte` | 侧栏中文动态链接编码一致 |
| `src/pages/videos.astro` | 视频错误提示与事件解绑 |
| `src/utils/schema-image.ts` | public Logo 解析修正 |
| `src/constants/lqips.json` | 完整构建自动补充此前合并的真实文章上传图记录；没有测试资源记录 |
| `docs/pages-cms.md` | 更正旧歌单回退说明、补充整文件删除保护和本报告入口 |
| `docs/pre-release-audit.md` | 本报告 |

以上为初次自检修改。A09 后续另更新 package.json、pnpm-lock.yaml、部署冻结安装及视频页脚本位置，详见 8.7；原始文章、src/data、原图、Favicon 和主题样式保持不变。没有 Git 提交、推送、远程删除或部署。

## 6. 自动化检查结果

| 命令/检查 | 结果 |
| --- | --- |
| `pnpm check` | 退出码 0；263 files，0 errors / 0 warnings / 0 hints |
| `pnpm type-check` | 退出码 0 |
| `pnpm build` | 退出码 0；36 个页面，12 篇文章；完整 LQIP、裁剪、内联压缩、Pagefind 流程完成 |
| 官方 Pages CMS 配置 Schema | 通过 |
| 官方保存链路 | 20 项通过，另有三个关键文件的删除权限检查通过 |
| Git diff 空白检查 | `git diff --check` 通过 |
| 仓库已有测试脚本 | `package.json` 没有独立 unit/e2e 测试任务；没有运行会写入全仓的 lint/format |
| 依赖审计 | A09 复审后仍非全绿；27 条命中已分类，无当前已知可达 High，结果见第 8 节 |

保留的非阻断提示包括：Redis 代码块语言退回 txt、当前空的动态/视频/项目集合、编译阶段分包大小提示，以及 Pagefind 对中文词干和主动停用页面的提示。原有 Logo 错误已消失。没有为消除提示而删除内容或更换主题。

## 7. 浏览器回归结果

本节记录初次全量自检；本轮 A09 仅增量验证，第 8.7 节列出本轮实际执行范围。

使用独立无头 Chrome，未访问个人浏览器会话。正式构建使用 Astro preview；含特殊文件名的隔离样本另使用读取同一 dist 的一次解码只读静态服务器。所有测试服务器只监听本机，不作为博客新增后端。

| 场景 | 浅色 | 深色 | 检查重点 |
| --- | --- | --- | --- |
| 桌面 1440×1000 | 通过 | 通过 | 正式归档、资料、卡片、新动态多图与视频布局 |
| 手机尺寸 390×844 | 通过 | 通过 | 无横向溢出、图片正常、播放器不固定覆盖正文 |

- 新功能浏览器检查 **36 项通过**：草稿过滤、排序/上海时区、资料清空、中文锚点、多图和特殊字符图片、音频实际解码及按钮、上下首、音量、换页连续播放、监听器数量、失败停止与恢复、视频注入/解码/失败提示、MDX 等。
- 正式构建回归 **20 项通过**：首页导航、四种组合、原有技术文章、分类标签、Series 展开和 10 篇 MySQL 系列链接、Markdown 高亮、正文图、Redis、生产 Pagefind、表单搜索、空动态/视频、Favicon 和原始音乐。
- 正式搜索 `MySQL` 返回 12 个实际结果，页面表单也展示结果；没有使用开发搜索模拟结果。
- CMS 编辑/删除/清空/Banner 场景 **4 项通过**；全部删除/关闭音乐/关闭壁纸场景 **5 项通过**。
- 新功能与正式回归均未发现非预期运行时异常；正式回归控制台 error 为 0。音视频 404 测试产生的错误请求是刻意制造并单独计数的恢复测试，不混作正常页面错误。

## 8. A09 依赖安全审计：受控修补与剩余风险

### 8.1 结论、口径和证据

**A09 的发布阻断项已关闭，结论为“修复后可以部署”；剩余依赖告警继续登记，不等于 npm audit 全绿。** 范围仅为当前 GitHub Pages 静态产物、当前工作流、本地开发和现有配置；在此范围内没有发现已知可达的 High 攻击路径。不能据此推断启用 Cloudflare、任意第三方插件或不可信内容处理服务后仍安全。

复用初次自检的官方原始结果，未重新执行已经通过的整套功能测试。去重键为“模块名 + 公告 URL”：原始 **78 条记录 → 52 项公告/模块组合（18 个模块）**，其中 **21 项 High**。同一公告在多个版本、peer 依赖和引入路径中出现，不重复算成不同漏洞。最终 **27 条记录 = 27 项组合（8 个模块），其中 9 项 High**。

| 官方生产依赖审计 | 修补前 | 修补后 |
| --- | ---: | ---: |
| Critical | 0 | 0 |
| High | 32 | 9 |
| Moderate | 34 | 12 |
| Low | 12 | 6 |
| 命中记录总数 | 78 | 27 |
| 去重公告/模块项数 | 52 | 27 |

共清除 **25 项独立公告命中（其中 12 项 High）**；另有 undici / PostCSS 等公告的可兼容副本已修补，但旧精确固定副本仍保留。这里的“清除”指最终锁文件不再被本次官方审计命中，未用顶层版本代替全树检查。

最终实际执行命令（JSON 和文本两种输出均保留）：

```powershell
pnpm audit --prod --registry=https://registry.npmjs.org --json
pnpm audit --prod --registry=https://registry.npmjs.org
```

两种结果一致；文本命令退出码 **1**，含义是仍有告警，不能标为“审计通过”。没有改全局 registry。证据保存在本地忽略目录：原始 `temp/pre-release-audit/dependency-audit-official.json`；本轮 `temp/a09/assessment-before.json`、`audit-final.json`、`audit-final.txt`、`grouped-after.json` 和各命令日志。逐项判断核对了公告正文、锁文件、已安装包调用点和当前源码；完整原始依赖链保存在 assessment-before.json，下面列主要链并将 peer 重复合并。

### 8.2 模块分类及引入链（覆盖全部 52 项）

“浏览器运行”“Actions 构建”“本地开发”“可选/未调用”不是互斥分类。`--prod` 只按 package.json 依赖字段筛选，项目把许多构建工具也列在 dependencies，因此不等于这些包都进入浏览器。当前浏览器相关命中包括静态配置验证的 Zod、框架 View Transitions 代码；已修补。Swup 本身会在浏览器运行，但它附带的 microbundle CLI 不会因此自动运行。

| 模块 / 去重公告数 | 所处阶段 | 主要依赖链 | 触发条件、当前情况与处理 |
| --- | --- | --- | --- |
| `serialize-javascript`（2 项） | 可选/未调用 | Swup → parallel-plugin / route-name-plugin → @swup/plugin@3 → microbundle → rollup-plugin-terser | Swup 浏览器基类会运行；其附带的 microbundle 压缩 CLI 未被本项目脚本调用，@swup/astro 使用自有序列化器。父包仅接受 ^4，修复需 >=7，不能强盖；等待上游清理工具依赖。 |
| `colord`（1 项） | 可选/未调用 | Swup → @swup/plugin → microbundle → cssnano → colord | 仅附带的旧 CSS 压缩链，博客不调用；可在 ^2 内修补。 |
| `sharp`（2 项） | 可选/未启用 | @astrojs/cloudflare / wrangler → miniflare → sharp | 命中的 0.35.2/0.35.4 被 Miniflare 精确锁定；当前 CF_WORKERS 未启用。实际 Astro 图片/LQIP 路径是安全的 0.35.5。保留旧可选链并等待上游，不覆盖原生依赖。 |
| `js-yaml`（1 项） | Actions 构建/本地工具 | gray-matter → js-yaml@3.15.1 | remark-wiki-link 构建读取仓库文章 Frontmatter，quarantine 本地工具也使用。CMS 有授权的作者可提交 YAML，采用 3.x 安全补丁。 |
| `svgo`（2 项） | Actions 构建 + 未调用工具链 | astro / astro-icon → @iconify/tools → svgo@4；microbundle → postcss-svgo → svgo@2 | 构建优化可信图标；公告要求 removeScripts 当作清洗器处理恶意 SVG，当前未配置此模式，CMS 图片上传不允许 SVG。两个既有主版本内修补。 |
| `undici`（19 项） | 条件式构建网络 + 未启用 Cloudflare | astro → unifont → undici@8；@astrojs/cloudflare / wrangler → miniflare → undici@7 | 当前选用本地字体，unifont 网络 provider 未使用；全局 fetch 使用 Node 内置 undici 6.29.1，与 npm 包独立。修补 ^8，精确固定的 7.29.0/7.29.1 等待上游；未来启用 Cloudflare/远程字体须重新评估。 |
| `brace-expansion`（3 项） | Actions 构建/本地工具 + 未调用工具链 | vite → stylus → glob → minimatch；microbundle / shelljs → glob → minimatch → brace-expansion | 构建 glob 的模式为代码中的常量，没有公开输入模式接口；仍在 1/2/5 各主版本内修补。 |
| `devalue`（7 项） | Actions 构建（框架也提供可选服务端 API） | astro / svelte → devalue | 实际用于内容缓存/模块生成；没有 Actions/session 端点，不处理访客反序列化输入；CMS 数据仍有可信作者边界，采用 5.x 补丁。 |
| `smol-toml`（1 项） | Actions 构建/本地配置 | astro / @astrojs/internal-helpers → smol-toml | 可信仓库 TOML，非公开解析服务；范围内修补。 |
| `katex`（1 项） | Actions 构建的 Markdown 数学渲染 | rehype-katex / remark-math → katex@0.16.47 | 本项要求已存在原型污染才能绕过 trust；当前未发现该前置污染链，不允许不可信 trust。根 katex 为 0.19.1，但不能据此忽略插件自带 0.16。修复 >=0.18.2 超出 ^0.16，保留低风险并等待插件兼容升级。 |
| `source-map-js`（1 项） | Actions 构建/本地开发 | astro → magicast / svgo → css-tree；@tailwindcss/node → source-map-js | 处理构建生成的可信 map，无上传外来 sourcemap 接口；补丁 1.2.2。 |
| `vite`（6 项） | 本地开发服务器 + Actions 构建 | astro / @astrojs/svelte → vite（Cloudflare 也有副本） | 高危发生于 Windows 开发服务器编辑器路由；本机环境符合平台条件，仍需恶意请求触发，不能以静态部署排除。构建 build 本身不启动编辑器路由；更新既有 ^8 范围。 |
| `astro`（1 项） | 构建 + 浏览器框架代码 | 根 astro 与各集成的 peer 链 | 7.3.2 的 View Transitions CSS 注入以允许攻击者控制页面输入为条件；更新最低 7.3.3，不做主版本迁移。 |
| `zod`（1 项） | 浏览器实际运行 + Actions 构建 | astro → zod；@astrojs/rss / sitemap → zod | CMS 配置模块被浏览器引入，实际输入为打包的静态 JSON；没有访客提交大型数组的验证接口。授权 CMS 输入仍会触发构建验证；^4 内修补。 |
| `postcss-selector-parser`（1 项） | Actions 构建 + 未调用工具链 | @tailwindcss/typography → postcss-selector-parser@6.0.10；microbundle → cssnano → 多个 PostCSS 插件 → @6.1.4 | 工具链中 ^6 可更新 6.1.5，但 typography 0.5.20 精确依赖 6.0.10，残留是真实构建路径。漏洞需要超长恶意 CSS selector，当前主题/typography selector 均为可信常量，CMS 不提供 CSS 配置字段。不为了清零覆盖精确依赖。 |
| `deepmerge`（1 项） | Actions 构建 + 未调用工具链 | @astrojs/svelte → @sveltejs/vite-plugin-svelte → deepmerge；microbundle → plugin-node-resolve | 仅合并可信 Vite 配置，未提供对象合并 API；npm 审计指向 >=4.3.2，但官方注册表尚未发布、GitHub 公告无修复版本，保留并跟踪上游。 |
| `minimatch`（1 项） | Actions 构建/本地工具 | vite → stylus → glob → minimatch（亦有其他 glob 链） | 恶意 glob 模式造成 CPU/内存耗尽；项目使用固定匹配模式，不接受访客模式。公告仅 >=11，现有 3/5/9/10 父范围不能兼容替换，记录剩余风险。 |
| `glob`（1 项） | Actions 构建/本地工具 | 根 glob@13.0.6；vite → stylus → glob@10.5.0 | 公告针对 AbortSignal 超时取消失效后持续遍历；没有安全边界依赖这种超时隔离的接口，脚本是固定仓库范围。修复 >=14.0.2 超出现有 ^13 / ^10，保留。 |

实际核对点：`src/utils/cms-data.ts`、`src/content.config.ts`、`src/plugins/remark-wiki-link.js`、构建 scripts、`astro.config.mjs`、`@swup/astro/dist/serialise.js`、`@swup/plugin/dist` 和对应包的 package.json。Cloudflare 包会被配置模块导入，但 **导入不代表执行 Miniflare 的媒体解码、WebSocket 或自定义 TLS 功能**；当前未设置 CF_WORKERS，adapter 不实例化。字体配置选择本地 provider；项目自己的 fetch 使用 Node 内置 undici（本机 Node 22.23.4 内置 6.29.1），不是 npm 的旧 7.x/8.x 包。

### 8.3 全部 21 项 High 的逐公告判断

每行的引入链见 8.2 对应模块；版本为修补前真实命中版本，修复后版本见 8.4。条件成立与否基于当前消费者，未做破坏性 RCE/内存耗尽实验。对未启用分支的结论是当前配置不可达，**不是证明包无漏洞**。

| 编号 / 官方公告 | 受影响模块及版本 | 漏洞成立条件 / 当前项目是否满足 | 兼容修复与处理结果 |
| --- | --- | --- | --- |
| H01 [GHSA-5c6j-r48x-rmvq](https://github.com/advisories/GHSA-5c6j-r48x-rmvq) | `serialize-javascript` 4.0.0 | 攻击者能构造伪造 RegExp.flags 或 Date.toISOString 的 JS 对象，serialize 输出再被 eval/Function/script 执行；本项目未调用该 CLI/包，不是 JSON 字符串即能触发。 | 公告修复 >=7.0.3；保留，见风险判断。父工具仅接受 ^4；>=7 是跨主版本，等待上游修复。 |
| H02 [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) | `sharp` 0.35.2 | Linux 等受影响 libheif 构建解码恶意 AVIF，可能本地代码执行；唯一命中副本在未启用的 Miniflare，活跃 sharp 安全。 | 公告修复 >=0.35.4；保留，见风险判断。Miniflare 精确固定，不能仅在根安装新 sharp 消除旧副本。 |
| H03 [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) | `js-yaml` 3.15.1 | 大量空 YAML merge 来源绕过 maxTotalMergeKeys 导致 CPU 耗尽；授权文章输入可到构建解析器，存在条件性构建 DoS，优先修补。 | 公告修复 >=3.15.2；已清除。现有父范围内更新，无主版本覆盖。 |
| H04 [GHSA-rfgv-xxqx-mfg5](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) | `undici` 8.10.1 / 7.29.0 | 连接恶意 WebSocket 服务返回未请求的子协议导致未捕获异常；项目没有调用 npm undici WebSocket。 | 公告修复 >=8.10.2 / >=7.29.1；部分修补，仍有 7.29.0。^8 已更新 8.12.3；CF 的 7.x 被精确固定。 |
| H05 [GHSA-w293-vg96-wgc3](https://github.com/advisories/GHSA-w293-vg96-wgc3) | `undici` 8.10.1 / 7.29.0 | BalancedPool 的 connect 选项含自定义证书校验回调，复制选项时丢失回调；未使用该 API。 | 公告修复 >=8.10.2 / >=7.29.1；部分修补，仍有 7.29.0。^8 已更新 8.12.3；CF 的 7.x 被精确固定。 |
| H06 [GHSA-vp8m-p9jh-q5pm](https://github.com/advisories/GHSA-vp8m-p9jh-q5pm) | `undici` 8.10.1 | 多个 origin 共用无 origin 隔离的缓存/去重拦截器产生缓存投毒；未配置这些拦截器。 | 公告修复 >=8.10.2；已清除。^8 已更新 8.12.3；CF 的 7.x 被精确固定。 |
| H07 [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | `brace-expansion` 1.1.18 / 2.1.4 / 5.0.9 | 恶意深层嵌套花括号模式耗尽调用栈；当前 glob 模式固定，不接收外部模式，仍修补。 | 公告修复 >=1.1.20 / >=2.1.6 / >=5.0.11；已清除。现有父范围内更新，无主版本覆盖。 |
| H08 [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | `brace-expansion` 1.1.18 / 2.1.4 / 5.0.9 | 逗号组解析递归/超大展开导致栈耗尽；当前模式固定，仍修补。 | 公告修复 >=1.1.19 / >=2.1.5 / >=5.0.10；已清除。现有父范围内更新，无主版本覆盖。 |
| H09 [GHSA-j22f-vq7h-c4qm](https://github.com/advisories/GHSA-j22f-vq7h-c4qm) | `devalue` 5.9.2 | 序列化 Buffer/TypedArray 时暴露共享 backing store 中额外内存；当前 CMS/文章数据为普通对象/字符串/日期，没有池化 Buffer。 | 公告修复 >=5.9.3；已清除。现有父范围内更新，无主版本覆盖。 |
| H10 [GHSA-mcm9-63f2-9j32](https://github.com/advisories/GHSA-mcm9-63f2-9j32) | `devalue` 5.9.2 | 大量重复原始字符串经 uneval 二次膨胀造成内存/CPU 耗尽；内容模块生成是实际路径，授权内容异常巨大时有构建风险，修补。 | 公告修复 >=5.9.3；已清除。现有父范围内更新，无主版本覆盖。 |
| H11 [GHSA-x5rw-q4pp-hg5g](https://github.com/advisories/GHSA-x5rw-q4pp-hg5g) | `devalue` 5.9.2 | stringifyAsync 序列化多个拒绝 Promise 时出现未处理拒绝；当前 CMS 数据无 Promise，也没有此 API 调用。 | 公告修复 >=5.9.3；已清除。现有父范围内更新，无主版本覆盖。 |
| H12 [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | `source-map-js` 1.2.1 | 恶意 indexed sourcemap section 巨大偏移导致事件循环耗尽；无外来 sourcemap 上传入口，但实际构建使用该库，修补。 | 公告修复 >=1.2.2；已清除。现有父范围内更新，无主版本覆盖。 |
| H13 [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | `sharp` 0.35.2 / 0.35.4 | 旧 librsvg 解码特制 SVG 导致内存安全问题；活跃 sharp 已为 0.35.5，旧副本仅未启用的 Miniflare。 | 公告修复 >=0.35.5；保留，见风险判断。Miniflare 精确固定，不能仅在根安装新 sharp 消除旧副本。 |
| H14 [GHSA-r9w8-h9r3-54w4](https://github.com/advisories/GHSA-r9w8-h9r3-54w4) | `devalue` 5.9.2 | parse/unflatten 处理攻击者序列化数据和自定义 ArrayBuffer reviver 绕过分配校验；项目无公开 parse 接口或自定义 reviver。 | 公告修复 >=5.9.3；已清除。现有父范围内更新，无主版本覆盖。 |
| H15 [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) | `vite` 8.2.2 / 8.2.1 | Windows 开发服务器 /__open-in-editor 接受带特殊路径/行列与 shell 元字符的 filename，绕过存在检查后启动命令；当前 Windows 开发场景相关，补丁优先。 | 公告修复 >=8.2.4；已清除。现有父范围内更新，无主版本覆盖。 |
| H16 [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | `zod` 4.5.4 / 4.4.3 | 超大受约束集合即使 max 检查失败仍逐元素创建问题导致 OOM；静态 JSON 和授权仓库内容，无访客输入接口，但真实构建验证可达，修补。 | 公告修复 >=4.6.6；已清除。现有父范围内更新，无主版本覆盖。 |
| H17 [GHSA-xjj6-f33q-929c](https://github.com/advisories/GHSA-xjj6-f33q-929c) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | 恶意服务器响应堆叠过多 Content-Encoding 导致未处理异常；当前 npm undici 网络分支未启用，Node 内置版本独立安全；仍修补可兼容 ^8。 | 公告修复 >=8.12.2 / >=7.30.1；部分修补，仍有 7.29.0 / 7.29.1。^8 已更新 8.12.3；CF 的 7.x 被精确固定。 |
| H18 [GHSA-w27v-7q3p-w38r](https://github.com/advisories/GHSA-w27v-7q3p-w38r) | `svgo` 4.0.2 / 2.8.3 | 把 removeScripts 当 SVG 安全清洗器时，命名空间/控制字符链接绕过清理且产物在活跃浏览器上下文打开；当前图标可信、CMS 禁 SVG、未配置该清洗模式，兼容修补。 | 公告修复 >=4.1.0 / >=2.8.4；已清除。现有父范围内更新，无主版本覆盖。 |
| H19 [GHSA-4w7w-5xrc-9h26](https://github.com/advisories/GHSA-4w7w-5xrc-9h26) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | 共享缓存与 redirect 拦截器跨 origin 时缓存投毒/跨用户披露；项目未启用缓存/redirect 拦截器组合。 | 公告修复 >=8.12.2 / >=7.30.1；部分修补，仍有 7.29.0 / 7.29.1。^8 已更新 8.12.3；CF 的 7.x 被精确固定。 |
| H20 [GHSA-2m5v-pch6-74hx](https://github.com/advisories/GHSA-2m5v-pch6-74hx) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | Agent tls 选项有自定义证书身份校验函数时该函数丢失，导致绕过自定义校验；无此自定义 Agent 配置。 | 公告修复 >=8.12.2 / >=7.30.1；部分修补，仍有 7.29.0 / 7.29.1。^8 已更新 8.12.3；CF 的 7.x 被精确固定。 |
| H21 [GHSA-qrxm-fqhp-jwvm](https://github.com/advisories/GHSA-qrxm-fqhp-jwvm) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | 恶意 TLS1.2 服务器重协商并改变证书身份导致进程崩溃；当前 npm8 网络字体及 CF7 分支不执行，其他全局 fetch 使用独立 Node 内置版本。 | 公告修复 >=8.12.2 / >=7.30.1；部分修补，仍有 7.29.0 / 7.29.1。^8 已更新 8.12.3；CF 的 7.x 被精确固定。 |

### 8.4 实际兼容更新与范围控制

仅 package.json 中 Astro 固定版本 **7.3.2 → 7.3.3**；其余为原父包声明范围内的传递依赖更新/去重，没有新增直接依赖、改 Firefly、升级 Astro 主版本或设置 overrides。使用 pnpm 的指定包名更新和锁文件审阅，未执行 audit fix / --force。

| 模块 | 原锁文件全部版本 | 最终锁文件全部版本 |
| --- | --- | --- |
| `astro` | 7.3.2 | 7.3.3 |
| `vite` | 8.2.1 / 8.2.2 | 8.3.5 |
| `devalue` | 5.9.2 / 5.9.4 | 5.9.4 |
| `zod` | 4.4.3 / 4.5.4 | 4.6.7 |
| `js-yaml` | 3.15.1 / 4.3.2 | 3.15.2 / 4.3.2 |
| `brace-expansion` | 1.1.18 / 2.1.4 / 5.0.9 | 1.1.21 / 2.1.7 / 5.0.12 |
| `source-map-js` | 1.2.1 / 1.2.2 | 1.2.2 |
| `svgo` | 2.8.3 / 4.0.2 / 4.1.0 | 2.8.4 / 4.1.0 |
| `undici` | 7.29.0 / 7.29.1 / 8.10.1 | 7.29.0 / 7.29.1 / 8.12.3 |
| `colord` | 2.9.3 | 2.10.0 |
| `smol-toml` | 1.8.0 / 1.9.1 | 1.9.1 |
| `postcss-selector-parser` | 6.0.10 / 6.1.4 / 7.1.7 | 6.0.10 / 6.1.5 / 7.1.7 |

随父包正常更新的必要依赖包括 Vite 的 rolldown/binding、@oxc-project/types，以及 Astro 的 find-proc/verkit；Shiki 旧副本去重到原树已有的 4.5.0。没有手动编辑 node_modules。`pnpm install --frozen-lockfile --registry=https://registry.npmjs.org` 退出码 0，锁文件和包清单一致。

兼容性核对：Astro 官方 7.3.3 为补丁，无主题/数据迁移；Node engine 不变。Vite 更新为各父包原有 ^8 范围允许的 8.3.5，官方 8.3 说明为增量功能和修复，当前未使用新的可选 bundled-dev 配置。它带来构建器补丁变化，因此执行了生产浏览器重点回归。Zod 保持 ^4 且保留 CMS 官方测试代码需要的 v3 子入口；devalue 仍为 5.x；js-yaml 保持 3.x 与 4.x 双线；SVGO 保持 2.x 与 4.x 双线。其余补丁/次版本没有要求消费者迁移；三项检查和真实输入往返为本项目兼容性提供验证，不能当作对库所有 API 的证明。

检查过程中，受限子进程环境两次报配置加载的 `require is not defined`，另有 esbuild `spawn EPERM`。8.2.4 和 8.3.5 在允许子进程后均能正常检查；因此撤销了临时 Vite 补丁线约束，**最终 pnpm-workspace.yaml 未变，不把环境错误作为版本不兼容结论**。官方网络下载曾短暂 ECONNRESET，pnpm 重试后成功，没有关闭完整性校验。

### 8.5 剩余 27 项的具体风险与处置

- **serialize-javascript@4.0.0：1 High + 1 Low。** 完整链为 Swup → parallel-plugin / route-name-plugin → @swup/plugin@3.0.1 → microbundle → rollup-plugin-terser。工具压缩 CLI 未在博客 build / check / 浏览器中调用，Astro 集成的配置序列化也不使用此包。官方安全修复 >=7.0.3 / >=7.1.3，父包只接受 ^4；当前最新 parallel/route-name 仍要求 plugin ^3。强推 plugin 4 或 serialize 7 不属于已证明兼容的修复，保留并跟踪上游。未来调用 swup-plugin/microbundle 编译不可信 JS 对象时必须先重审。
- **sharp@0.35.2 / 0.35.4：2 High。** Miniflare 精确固定的 native 依赖；攻击需要其旧 libheif/librsvg 解码恶意 AVIF/SVG，不能把“目录中有一张图片”直接等同于已触发。当前活跃的 Astro 图片/LQIP 解码器为 0.35.5，Miniflare 未运行。修复包 0.35.4/0.35.5 已发布，但父精确约束不允许单独替换；当前未为闲置 Cloudflare 分支引入新的 beta 运行时。以后启用该分支，先升级适配器/Miniflare 并验收，不可沿用本结论。
- **undici@7.29.0 / 7.29.1：18 项（6 High、9 Moderate、3 Low）。** 均来自未启用的 Miniflare，^8 的 unifont 副本已更新 8.12.3。风险包括恶意服务器造成进程 DoS、特殊 Agent/BalancedPool 证书回调丢失，以及共享缓存/重定向导致跨 origin/跨用户数据混用；高危具体前置条件见 8.3。项目没有运行这些旧网络客户端或配置上述拦截器。安全 7.30.1 已发布，但 Miniflare 固定旧版，禁止用根包新版本假装替代旧副本。
- **postcss-selector-parser@6.0.10：1 Moderate，真实构建依赖。** `@tailwindcss/typography@0.5.20` 精确指定此版本；可兼容的其他 6.x 副本已更新 6.1.5，7.1.7 原已安全。漏洞需要攻击者提供大量平铺 class/id 的 selector 同步解析；当前主题/CSS selector 为可信代码，CMS 没有 CSS selector 字段或在线 CSS 解析接口。保留该精确副本；后续有上游安全补丁时单独升级和比较 typography 样式，当前不强盖或改变主题。
- **minimatch@3.1.5 / 5.1.9 / 9.0.9 / 10.2.6：1 Moderate。** 实际构建 glob 路径，攻击要求控制模式；公告描述的 globParts 放大还涉及 optimizationLevel >=2。项目没有访客模式输入，脚本/加载器为固定模式。公告列 >=11.0.1 修复，超出现有父主版本范围，暂不强制全树升 11。
- **glob@10.5.0 / 13.0.6：1 Moderate。** AbortSignal 取消后仍继续 I/O，可能使以超时为预算的恶意目录遍历失控。当前构建遍历仓库已知目录，不以访客提供的模式/树和 AbortSignal 作为隔离边界。>=14.0.2 修复跨出当前 ^10/^13；本次不为清零升级到 14。
- **katex@0.16.47：1 Low，文章构建路径。** rehype-katex / remark-math 引入，根 0.19.1 不替代其副本。需要已有原型污染 + 可控公式 + 输出进入页面，才能绕过默认 trust；未发现当前配置的该前置污染路径，CMS 不编辑渲染配置。修复 >=0.18.2 超出插件 ^0.16（0.x 次版本可能不兼容），不强盖。
- **deepmerge@4.3.1：1 Low，真实 Svelte/Vite 配置合并路径。** 需要不可信对象键进入合并并消费继承属性；当前仅可信静态构建配置，无访客对象合并 API，也不将任意 CMS 对象交给 Vite 配置合并。npm 审计给出 >=4.3.2，但核对官方 registry 未发布该版本，GitHub 公告显示 Patched versions: None；不能声称存在可安装的补丁。等待上游或有独立必要性时做兼容迁移。

上述风险判断不能代替仓库/Actions 权限边界。如果以后开放不可信 PR 构建、执行外部插件、添加 CSS/配置对象输入接口、远程字体或启用 CF_WORKERS，应重新核查对应入口。这里没有用“静态站点”排除已经实际运行的 YAML、Zod、devalue、source-map、CSS 和 glob 构建消费者。

### 8.6 全部公告登记（包括已修复、部分修复及保留）

| # | 官方公告 | 原命中模块/版本 | 严重程度 | 最终状态 |
| --- | --- | --- | --- | --- |
| 01 | [GHSA-5c6j-r48x-rmvq](https://github.com/advisories/GHSA-5c6j-r48x-rmvq) | `serialize-javascript` 4.0.0 | high | 保留，见风险判断 |
| 02 | [GHSA-2wm5-q62r-hmrv](https://github.com/advisories/GHSA-2wm5-q62r-hmrv) | `colord` 2.9.3 | moderate | 已清除 |
| 03 | [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) | `sharp` 0.35.2 | high | 保留，见风险判断 |
| 04 | [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) | `js-yaml` 3.15.1 | high | 已清除 |
| 05 | [GHSA-4vpr-x523-8j87](https://github.com/advisories/GHSA-4vpr-x523-8j87) | `svgo` 4.0.2 / 2.8.3 | moderate | 已清除 |
| 06 | [GHSA-3wwx-pv8p-q78v](https://github.com/advisories/GHSA-3wwx-pv8p-q78v) | `undici` 8.10.1 / 7.29.0 | moderate | 部分修补，仍有 7.29.0 |
| 07 | [GHSA-pmjh-fq2x-6v4x](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x) | `undici` 8.10.1 / 7.29.0 | moderate | 部分修补，仍有 7.29.0 |
| 08 | [GHSA-r53p-7pc4-xj5r](https://github.com/advisories/GHSA-r53p-7pc4-xj5r) | `undici` 8.10.1 / 7.29.0 | low | 部分修补，仍有 7.29.0 |
| 09 | [GHSA-rfgv-xxqx-mfg5](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) | `undici` 8.10.1 / 7.29.0 | high | 部分修补，仍有 7.29.0 |
| 10 | [GHSA-3xpg-4rpp-hhhm](https://github.com/advisories/GHSA-3xpg-4rpp-hhhm) | `undici` 8.10.1 / 7.29.0 | moderate | 部分修补，仍有 7.29.0 |
| 11 | [GHSA-2jfj-6hjv-fm6j](https://github.com/advisories/GHSA-2jfj-6hjv-fm6j) | `undici` 8.10.1 / 7.29.0 | moderate | 部分修补，仍有 7.29.0 |
| 12 | [GHSA-2gqq-gqf2-x968](https://github.com/advisories/GHSA-2gqq-gqf2-x968) | `undici` 8.10.1 / 7.29.0 | low | 部分修补，仍有 7.29.0 |
| 13 | [GHSA-w293-vg96-wgc3](https://github.com/advisories/GHSA-w293-vg96-wgc3) | `undici` 8.10.1 / 7.29.0 | high | 部分修补，仍有 7.29.0 |
| 14 | [GHSA-8436-99hf-9mmv](https://github.com/advisories/GHSA-8436-99hf-9mmv) | `undici` 8.10.1 / 7.29.0 | low | 部分修补，仍有 7.29.0 |
| 15 | [GHSA-vp8m-p9jh-q5pm](https://github.com/advisories/GHSA-vp8m-p9jh-q5pm) | `undici` 8.10.1 | high | 已清除 |
| 16 | [GHSA-rx4f-c7p8-82vq](https://github.com/advisories/GHSA-rx4f-c7p8-82vq) | `undici` 8.10.1 / 7.29.0 | moderate | 部分修补，仍有 7.29.0 |
| 17 | [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) | `brace-expansion` 1.1.18 / 2.1.4 / 5.0.9 | moderate | 已清除 |
| 18 | [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | `brace-expansion` 1.1.18 / 2.1.4 / 5.0.9 | high | 已清除 |
| 19 | [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | `brace-expansion` 1.1.18 / 2.1.4 / 5.0.9 | high | 已清除 |
| 20 | [GHSA-j22f-vq7h-c4qm](https://github.com/advisories/GHSA-j22f-vq7h-c4qm) | `devalue` 5.9.2 | high | 已清除 |
| 21 | [GHSA-hx4r-w6wj-j8fg](https://github.com/advisories/GHSA-hx4r-w6wj-j8fg) | `devalue` 5.9.2 | moderate | 已清除 |
| 22 | [GHSA-mcm9-63f2-9j32](https://github.com/advisories/GHSA-mcm9-63f2-9j32) | `devalue` 5.9.2 | high | 已清除 |
| 23 | [GHSA-wf3x-273g-mvxv](https://github.com/advisories/GHSA-wf3x-273g-mvxv) | `devalue` 5.9.2 | low | 已清除 |
| 24 | [GHSA-x5rw-q4pp-hg5g](https://github.com/advisories/GHSA-x5rw-q4pp-hg5g) | `devalue` 5.9.2 | high | 已清除 |
| 25 | [GHSA-4q55-j62x-fr9h](https://github.com/advisories/GHSA-4q55-j62x-fr9h) | `devalue` 5.9.2 | moderate | 已清除 |
| 26 | [GHSA-r4xh-jqrq-34v2](https://github.com/advisories/GHSA-r4xh-jqrq-34v2) | `smol-toml` 1.8.0 | moderate | 已清除 |
| 27 | [GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7) | `katex` 0.16.47 | low | 保留，见风险判断 |
| 28 | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | `source-map-js` 1.2.1 | high | 已清除 |
| 29 | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | `sharp` 0.35.2 / 0.35.4 | high | 保留，见风险判断 |
| 30 | [GHSA-r9w8-h9r3-54w4](https://github.com/advisories/GHSA-r9w8-h9r3-54w4) | `devalue` 5.9.2 | high | 已清除 |
| 31 | [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) | `vite` 8.2.2 / 8.2.1 | moderate | 已清除 |
| 32 | [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) | `vite` 8.2.2 / 8.2.1 | moderate | 已清除 |
| 33 | [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) | `vite` 8.2.2 / 8.2.1 | high | 已清除 |
| 34 | [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) | `vite` 8.2.2 / 8.2.1 | low | 已清除 |
| 35 | [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) | `vite` 8.2.2 / 8.2.1 | moderate | 已清除 |
| 36 | [GHSA-vfpm-58rq-9qcg](https://github.com/advisories/GHSA-vfpm-58rq-9qcg) | `vite` 8.2.2 / 8.2.1 | moderate | 已清除 |
| 37 | [GHSA-mpr7-6m5w-76rw](https://github.com/advisories/GHSA-mpr7-6m5w-76rw) | `astro` 7.3.2 | low | 已清除 |
| 38 | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | `zod` 4.5.4 / 4.4.3 | high | 已清除 |
| 39 | [GHSA-4qv8-2p9j-2685](https://github.com/advisories/GHSA-4qv8-2p9j-2685) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | moderate | 部分修补，仍有 7.29.0 / 7.29.1 |
| 40 | [GHSA-f72v-6w45-q472](https://github.com/advisories/GHSA-f72v-6w45-q472) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | moderate | 部分修补，仍有 7.29.0 / 7.29.1 |
| 41 | [GHSA-m5mm-p8h7-m29v](https://github.com/advisories/GHSA-m5mm-p8h7-m29v) | `serialize-javascript` 4.0.0 | low | 保留，见风险判断 |
| 42 | [GHSA-xjj6-f33q-929c](https://github.com/advisories/GHSA-xjj6-f33q-929c) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | high | 部分修补，仍有 7.29.0 / 7.29.1 |
| 43 | [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) | `postcss-selector-parser` 6.1.4 / 6.0.10 | moderate | 部分修补，仍有 6.0.10 |
| 44 | [GHSA-w27v-7q3p-w38r](https://github.com/advisories/GHSA-w27v-7q3p-w38r) | `svgo` 4.0.2 / 2.8.3 | high | 已清除 |
| 45 | [GHSA-4w7w-5xrc-9h26](https://github.com/advisories/GHSA-4w7w-5xrc-9h26) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | high | 部分修补，仍有 7.29.0 / 7.29.1 |
| 46 | [GHSA-2m5v-pch6-74hx](https://github.com/advisories/GHSA-2m5v-pch6-74hx) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | high | 部分修补，仍有 7.29.0 / 7.29.1 |
| 47 | [GHSA-qrxm-fqhp-jwvm](https://github.com/advisories/GHSA-qrxm-fqhp-jwvm) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | high | 部分修补，仍有 7.29.0 / 7.29.1 |
| 48 | [GHSA-9fm3-97px-rjf6](https://github.com/advisories/GHSA-9fm3-97px-rjf6) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | moderate | 部分修补，仍有 7.29.0 / 7.29.1 |
| 49 | [GHSA-55wc-3pg8-jfw6](https://github.com/advisories/GHSA-55wc-3pg8-jfw6) | `undici` 8.10.1 / 7.29.0 / 7.29.1 | moderate | 部分修补，仍有 7.29.0 / 7.29.1 |
| 50 | [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) | `deepmerge` 4.3.1 | low | 保留，见风险判断 |
| 51 | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) | `minimatch` 9.0.9 / 3.1.5 / 5.1.9 / 10.2.6 | moderate | 保留，见风险判断 |
| 52 | [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) | `glob` 10.5.0 / 13.0.6 | moderate | 保留，见风险判断 |

### 8.7 本轮修改与回归证据

相对于 A09 开始时的工作区，仅新增/改变 **5 个正式文件**：

| 文件 | 本轮变化 |
| --- | --- |
| `package.json` | Astro 7.3.3 补丁固定版本 |
| `pnpm-lock.yaml` | 上述兼容安全更新、必要传递更新与去重 |
| `.github/workflows/deploy.yml` | --no-frozen-lockfile 改为 --frozen-lockfile，部署安装经过审阅的锁树；触发/权限/部署步骤未变 |
| `src/pages/videos.astro` | 重点回归确认：首次 Swup 进入视频页时，原错误提示注册脚本在替换区域之外未加载；只把现有 script 移入 MainGridLayout 的内容区域，逻辑/样式不变 |
| `docs/pre-release-audit.md` | A09 分类、逐公告处理、测试与发布结论 |

上次正常修复全部保留。以 A09 开始时的哈希比较，**230 个内容/数据/图片与 public 文件无变化**，其余非上述文件也未变化；原有 11 篇技术文章及现有第 12 篇 CMS 文章保留。未写测试数据到正式目录，所有样本仅内存/CDP/忽略目录。pnpm-workspace.yaml 最终与基线一致。

| 检查 | 本轮实际结果 |
| --- | --- |
| pnpm check | 退出 0；263 files，0 errors / 0 warnings / 0 hints |
| pnpm type-check | 退出 0（最终视频页修复后再次执行） |
| pnpm build | 退出 0；36 页，完整 LQIP、后处理、Pagefind 完成；输出模式 static |
| pnpm audit --prod --registry=https://registry.npmjs.org | 退出 1；27 条（9 High / 12 Moderate / 6 Low），不是全绿 |
| 冻结安装 | 退出 0，锁文件/清单一致，没有 override |
| CMS 保存/读取兼容 | **22 项通过**；复用已核对的官方保存源码，覆盖资料清空、图片映射、数值/布尔、空歌单及顺序、动态多图/时间、视频 URL、全部适用旧 Markdown 往返/Series、Redis 源码入口 |
| 实际动态 API | **6 项通过**；仅 mock getCollection 输入，实际 Schema/Markdown/排序/清洗代码，覆盖草稿、倒序、多图、脚本过滤与空集 |
| 重点生产浏览器 | **18 项通过**；首页/导航/头像、Markdown 高亮、原 11 篇技术文章、音乐不自动播放/实际解码/暂停/音量/上下首及 Swup 单例、视频空态/脚本注册/内存 WebM 解码、多图 Svelte 渲染、手机深色布局；控制台 error 0，异常 0 |
| 视觉抽查 | 独立 Chrome 桌面浅色首页和手机深色动态截图已查看，原风格、图片、布局保留；其余模式复用第 7 节已通过结果，没有冒称本轮重测四种组合 |
| 静态客户端体积 | _astro JS 55 文件，746659 字节；前次 742599 字节，增加 4060 字节（约 0.55%），没有明显体积退化 |
| 工作区检查 | git diff --check 通过；无提交/推送/部署；没有敏感配置、新依赖后端或意外资源改动 |

视频浏览器验证包含从首页 Swup 进入页面的脚本加载，以及实际注册元素的受控 WebM 解码；正式视频集合仍为空，未假称已有用户真实外部视频可验收。动态有内容场景使用上述真实 API 测试输出做浏览器响应拦截，未混入正式内容。音乐使用原有公开 MP3 实际解码。前次全量功能回归记录保持原样，不把新冒烟检查算作重跑全部功能。

**当前部署建议的依据：** 可兼容的活跃高危依赖已修补；剩余 9 项 High 均落在未调用的 Swup 工具 CLI 或未启用的 Miniflare 功能，未发现当前浏览器、静态构建或本地开发的已知可达 High 路径；三项检查、CMS 往返和重点浏览器通过；CI 已冻结锁文件。因此这些已逐项限定的剩余命中不阻碍当前 GitHub Pages 静态部署。真实 Pages CMS 授权/线上 Save、Linux Actions 和 Pages 部署仍按第 9 节待线上验收，不能用本地结果冒充线上通过。

## 9. 无法在本地确认与剩余限制

**待线上验收：**

1. Pages CMS GitHub 授权、仓库/分支权限和线上实际运行版本。
2. 真正 Upload / Save / Delete、列表拖动排序及其提交内容。
3. GitHub Actions Linux runner、Pages 环境权限、实际部署、CDN 更新与缓存。
4. 自己真实的视频平台链接、外部直链的跨域/地区/登录/防盗链要求及长期可用性。
5. iOS Safari、Android 真机上的音量限制和媒体兼容性；本次是 Chrome 手机尺寸模拟。

**已确认但未改写现有内容的限制：**

- 官方文件名生成器对不同纯中文标题可能生成相同的 `2026-10-31-.md`。保留创建时可编辑文件名；新建前应填写不同英文短名。当前已有的 `2026-10-30-.md` 是用户文章，不重命名它。冲突风险不应被当作内容已经丢失。
- 原 Astro preview 对含 `#` 的本地文件名请求返回 404。前端现在输出规范 `%23`，同一产物经一次解码静态服务器可加载；GitHub Pages 上该类文件仍待验收。当前正式资源没有这种名称，新上传继续使用随机名，避免主动创建带 `#` 的资源名。
- 草稿不是私密存储；日期不是定时发布。上传但未引用的资源不会自动展示；删除条目也不会自动删除资源。
- 旧特殊 Markdown 的富文本往返保真、MDX 源码编辑及 Redis 源码入口需要继续遵循操作手册。
- 常见密钥模式扫描不能覆盖所有秘密格式；依赖审计的结果也是当前数据库快照，不保证未来不新增公告。

## 10. 发布前门槛与后续验收

**修复后可以部署，A09 不再阻断当前 GitHub Pages 静态发布。** npm audit 仍有 27 条记录且退出 1；残留依赖、适用条件与后续处理见第 8 节，不宣称安全告警全部修复。

本地已完成必要三项检查和增量 CMS/动态/浏览器验证，无需为本次再次重跑第 7 节的全部功能测试。用户后续自行同步代码后，仍需核验线上 CMS 授权、真实 Save/Upload、Linux Actions 冻结安装及 Pages 发布。启用 CF_WORKERS、远程字体、旧附带 CLI 或引入不可信构建输入时先重审风险，不直接沿用当前可达性结论。

本次没有提交、推送或触发部署，保留正常功能、文章、个人资源与主题设计。

## 参考

- [Pages CMS 字段、文件与集合](https://pagescms.org/docs/configuration/content/)
- [Pages CMS 媒体映射](https://pagescms.org/docs/configuration/media/)
- [Pages CMS 内容合并设置](https://pagescms.org/docs/configuration/settings/)
- [实际核对的官方保存代码](https://github.com/hunvreus/pagescms/blob/6f4e860a35d934406580287e7042e5e111e207a1/app/api/%5Bowner%5D/%5Brepo%5D/%5Bbranch%5D/files/%5Bpath%5D/route.ts)
- [官方 Node 版本维护计划：Node 23 于 2025-06-01 结束维护，Node 22 至 2027-04-30](https://github.com/nodejs/Release/blob/main/schedule.json)

- [Astro 7.3.3 官方补丁记录](https://github.com/withastro/astro/blob/astro%407.3.3/packages/astro/CHANGELOG.md)
- [Vite 8.3.5 官方变更记录（含 8.3.0）](https://github.com/vitejs/vite/blob/v8.3.5/packages/vite/CHANGELOG.md)
- [pnpm 指定依赖更新与深度](https://pnpm.io/cli/update)
- [官方 npm 注册表：deepmerge（核实 4.3.2 未发布）](https://registry.npmjs.org/deepmerge)
