# Java 与后端学习笔记迁入记录

来源目录：`D:\02_学习笔记`；迁入日期：2026-11-01。原始 Markdown 与图片保留，迁入副本位于 `D:\Blog\Firefly`。

Java 按知识主题整理为 21 篇；后端按原笔记的 13 个学习日期整理为 13 篇。分类分别为 `Java` 和 `后端开发`，系列分别为 `Java 学习笔记` 和 `后端学习笔记`，使用 `seriesOrder` 保持顺序。所有文章的 `published` 为博客迁入日期；后端原始学习日期在正文开头保留。

图片按“系列 → images → 章节 → 序号”分层，文章使用相对路径引用。例如：

```text
src/content/posts/
├── java-notes/
│   ├── 01-principles-and-environment.md
│   ├── 02-basic-syntax.md
│   └── images/
│       ├── 01-principles-and-environment/
│       │   ├── 01.png
│       │   ├── 02.png
│       │   └── 03.png
│       └── 02-basic-syntax/
│           ├── 01.png
│           └── …
└── backend-notes/
    ├── 01-spring-ioc-and-mybatis.md
    └── images/
        └── 01-spring-ioc-and-mybatis/
            ├── 01.png
            ├── 02.png
            └── 03.png
```

图片编号按该篇文章中的出现顺序生成，保留原 PNG/JPG 格式与原始字节。原文件名与新路径的对应关系及 SHA-256 见两个 JSON 清单。无图片的章节不创建空图片目录。后续 Pages CMS 上传仍可使用现有 `/uploads/posts/` 媒体库；本次迁入图片与文章一同保存在源码目录。

## Java 学习笔记

原笔记：`java笔记/java笔记.md`。共 21 篇、49 张配图、387 个代码块。[迁移清单](java-notes-manifest.json)。

| 顺序 | 文章 | 原文行号 | 配图数 |
| --- | --- | --- | --- |
| 1 | [Java 学习笔记 01：运行原理与环境变量](../../src/content/posts/java-notes/01-principles-and-environment.md) | 7–48 | 3 |
| 2 | [Java 学习笔记 02：基础语法](../../src/content/posts/java-notes/02-basic-syntax.md) | 49–300 | 5 |
| 3 | [Java 学习笔记 03：运算符、取位数与内存分配](../../src/content/posts/java-notes/03-operators-and-memory.md) | 301–464 | 4 |
| 4 | [Java 学习笔记 04：判断与循环](../../src/content/posts/java-notes/04-control-flow.md) | 465–622 | 0 |
| 5 | [Java 学习笔记 05：数组基础](../../src/content/posts/java-notes/05-arrays.md) | 623–712 | 3 |
| 6 | [Java 学习笔记 06：方法](../../src/content/posts/java-notes/06-methods.md) | 713–750 | 1 |
| 7 | [Java 学习笔记 07：面向对象基础](../../src/content/posts/java-notes/07-object-oriented-basics.md) | 751–1053 | 7 |
| 8 | [Java 学习笔记 08：字符串](../../src/content/posts/java-notes/08-strings.md) | 1054–1325 | 1 |
| 9 | [Java 学习笔记 09：集合](../../src/content/posts/java-notes/09-collections.md) | 1326–2086 | 3 |
| 10 | [Java 学习笔记 10：面向对象进阶](../../src/content/posts/java-notes/10-advanced-object-oriented.md) | 2087–2479 | 22 |
| 11 | [Java 学习笔记 11：Runtime API](../../src/content/posts/java-notes/11-runtime-api.md) | 2480–2610 | 0 |
| 12 | [Java 学习笔记 12：Object 与 equals](../../src/content/posts/java-notes/12-object-api.md) | 2611–2978 | 0 |
| 13 | [Java 学习笔记 13：StringJoiner API](../../src/content/posts/java-notes/13-string-joiner-api.md) | 2979–3118 | 0 |
| 14 | [Java 学习笔记 14：对象克隆](../../src/content/posts/java-notes/14-object-cloning.md) | 3119–3560 | 0 |
| 15 | [Java 学习笔记 15：Objects 工具类](../../src/content/posts/java-notes/15-objects-api.md) | 3561–3807 | 0 |
| 16 | [Java 学习笔记 16：BigInteger](../../src/content/posts/java-notes/16-big-integer.md) | 3808–3990 | 0 |
| 17 | [Java 学习笔记 17：BigDecimal](../../src/content/posts/java-notes/17-big-decimal.md) | 3991–4311 | 0 |
| 18 | [Java 学习笔记 18：包装类](../../src/content/posts/java-notes/18-wrapper-classes.md) | 4312–4467 | 0 |
| 19 | [Java 学习笔记 19：Arrays 工具类](../../src/content/posts/java-notes/19-arrays-api.md) | 4468–4566 | 0 |
| 20 | [Java 学习笔记 20：Lambda 表达式](../../src/content/posts/java-notes/20-lambda.md) | 4567–4655 | 0 |
| 21 | [Java 学习笔记 21：异常处理](../../src/content/posts/java-notes/21-exceptions.md) | 4656–4770 | 0 |

## 后端学习笔记

原笔记：`后端学习笔记.md`。共 13 篇、17 张配图、36 个代码块。[迁移清单](backend-notes-manifest.json)。

| 顺序 | 文章 | 原文行号 | 配图数 |
| --- | --- | --- | --- |
| 1 | [后端学习笔记 01：Spring IoC、业务分层与 MyBatis XML](../../src/content/posts/backend-notes/01-spring-ioc-and-mybatis.md) | 1–316 | 3 |
| 2 | [后端学习笔记 02：配置文件与项目跟练](../../src/content/posts/backend-notes/02-configuration-files.md) | 317–330 | 2 |
| 3 | [后端学习笔记 03：驼峰映射与请求参数](../../src/content/posts/backend-notes/03-request-parameters.md) | 331–373 | 0 |
| 4 | [后端学习笔记 04：JSON 请求体](../../src/content/posts/backend-notes/04-json-request-body.md) | 374–393 | 0 |
| 5 | [后端学习笔记 05：路径参数、请求映射与日志](../../src/content/posts/backend-notes/05-path-variables-and-logging.md) | 394–435 | 2 |
| 6 | [后端学习笔记 06：动态 SQL](../../src/content/posts/backend-notes/06-dynamic-sql.md) | 436–441 | 1 |
| 7 | [后端学习笔记 07：事务基础](../../src/content/posts/backend-notes/07-transactions.md) | 442–447 | 1 |
| 8 | [后端学习笔记 08：HttpClient 与 Jackson](../../src/content/posts/backend-notes/08-http-client-and-jackson.md) | 448–504 | 0 |
| 9 | [后端学习笔记 09：AI 接口异常处理与文件上传](../../src/content/posts/backend-notes/09-ai-errors-and-file-upload.md) | 505–521 | 1 |
| 10 | [后端学习笔记 10：事务注解、foreach 与登录会话](../../src/content/posts/backend-notes/10-transactional-and-sessions.md) | 522–607 | 4 |
| 11 | [后端学习笔记 11：Spring AOP](../../src/content/posts/backend-notes/11-spring-aop.md) | 608–694 | 0 |
| 12 | [后端学习笔记 12：Linux 与 JavaWeb 部署基础](../../src/content/posts/backend-notes/12-linux-deployment-basics.md) | 695–744 | 0 |
| 13 | [后端学习笔记 13：Nginx 与后端部署](../../src/content/posts/backend-notes/13-nginx-and-backend-deployment.md) | 745–810 | 3 |

## 转换范围

- 保留原文段落、示例、表格及学习顺序；Java 将较长的 API 部分拆成 Runtime、Object、StringJoiner、克隆、Objects、BigInteger、BigDecimal 等主题。
- 删除重复文章根标题及 Typora 的 `[TOC]` 占位符，使用博客自带目录；正文标题从二级开始，并收紧跳级层级。
- 将 Typora `==高亮==` 转为 Markdown 强调；行内代码中的比较运算符保持原样；转义表格行内代码中的竖线，避免错列。
- 统一 JAVA/Java、yml、linux 围栏语言标签；保留全部 423 个代码块内容，包括原笔记中的拼写或示例问题，本次不进行代码执行与技术纠错。
- 迁入全部 66 处图片引用，包括 Java 原文中 1 个 HTML `<img>`；将 HTML 图片转换为 Markdown，移除 Typora 专用 zoom 样式，让图片适应博客宽度。
- 将自动文件名式或空图片说明替换为所在章节的说明文字，以适配现有图片说明与放大组件。
- 未迁入 API_17 下的 CHM/CHW 离线文档，以及任何未被这两份正文引用的其他文件；其他学习目录不在本次范围。
- 未修改博客组件、样式、CMS 配置或其他文章。LQIP 文件只增加本次 66 张迁入图片的占位数据。

## 验证

验收日期：2026-11-01。

- Markdown 解析后逐项比对：Java 387 个代码块、后端 36 个代码块，合计 423 个，内容及顺序均一致；原文除重复根标题和 TOC 之外的非空行均纳入迁移范围。
- 原始两份 Markdown 及 66 张被引用的原图 SHA-256 复核通过；迁入配图与原图逐张字节一致。两个 JSON 清单记录文章源行号、图片路径对应及文件哈希。
- `pnpm check`：退出 0，263 个文件，0 errors / 0 warnings / 1 hint；提示来自现有 Footer.astro 中未使用的 url 导入。
- `pnpm type-check`：通过。
- `pnpm build`：通过，生成 72 个页面，Pagefind 索引 48 页；保留既有空集合、Redis 高亮回退、MDX 指令及较大构建块等提示。
- 本地生产构建浏览器逐篇检查 34 个新文章路由，66 张配图全部加载；423 个代码块均已渲染；各篇系列条目分别为 Java 21 篇、后端 13 篇；所有表格列数一致，桌面页面没有横向溢出。
- Chrome 桌面 1440×1000、手机模拟 390×844 抽查深浅色，共 4 张截图；正文、代码、配图、表格与目录显示正常，手机抽查无页面横向溢出。
- 后端系列目录实际点击展开成功；Pagefind 实际搜索 BigDecimal 与 HttpClient 可分别返回对应新文章；浏览器未捕获到脚本异常。
- 浏览器验证隔离了第三方网络请求，不包含外部评论、统计等服务或线上部署验收。
- `git -c core.whitespace=-blank-at-eol diff --cached --check`：通过；保留原始代码与 Markdown 硬换行中的行尾空白。后续发布状态以 Git 提交记录及 GitHub Actions 为准。
