# Pages CMS 文章管理

本项目使用 [Pages CMS 官方托管后台](https://app.pagescms.org/)，配置位于根目录 `.pages.yml`。文章和图片继续保存在 GitHub 仓库，不需要为博客添加数据库、后台服务器或运行时依赖。

目标仓库：`Playerkkk1/playerkkk1.github.io`；在 CMS 中选择发布分支 `master`。Pages CMS 按所选分支读取配置；仓库和分支通过后台选择，无需在 `.pages.yml` 中添加不受支持的仓库或分支键。

## 手动启用

1. 本次仅完成本地配置。你之后自行审核并将 `.pages.yml`、本说明及 `public/uploads/posts/.gitkeep` 同步到 GitHub 的 `master` 分支，后台才会读到配置。
2. 打开 [app.pagescms.org](https://app.pagescms.org/)，使用持有仓库写权限的 GitHub 账号登录。
3. 根据提示安装或配置官方 Pages CMS GitHub App，选择 **Only select repositories**，仅授权 `Playerkkk1/playerkkk1.github.io`。已有 App 安装时，在 GitHub 的 Settings → Applications → Installed GitHub Apps 中补充该仓库权限。
4. 回到 Pages CMS，打开该仓库并确认分支是 `master`，进入「Markdown 文章」。如果未看到配置，确认 `.pages.yml` 已存在于远程的这个分支，随后刷新后台。
5. 首次试用可创建草稿，检查字段、图片及源码，再关闭草稿开关发布。CMS 保存会向所选 GitHub 分支提交文件；当前项目监听 `master` 的 push，所以之后在 CMS 保存文章或上传图片可能触发现有 GitHub Actions 构建和部署。

本次配置工作不执行上述 GitHub 授权、远程提交或部署，不需要向聊天提供 token、App 私钥等凭据。

## 字段与 Firefly Schema

| 字段 | CMS 配置 | Firefly 接收类型 |
| --- | --- | --- |
| `title` | 必填 string | string |
| `published` | 必填 date，`yyyy-MM-dd`，无时间选择 | YAML 日期解析后的 Date |
| `description` | text | string |
| `category` | string | string 或 null |
| `tags` | string + `list: true` | string[] |
| `draft` | boolean，新文章默认 true | boolean |
| `pinned` | boolean，默认 false | boolean |
| `image` | 单张 image，可留空 | 图片路径 string |
| `body` | rich-text，输出 Markdown | Frontmatter 下方正文 |

发布日期不要手工加引号，标签不要写成逗号拼接的单个字符串。正确的文章形态如下（示例仅在文档中，不新增演示文章）：

````markdown
---
title: MySQL 索引实践
published: 2026-10-30
description: 记录索引的基础用法。
category: MySQL
tags:
  - MySQL
  - 数据库
draft: true
pinned: false
image: /uploads/posts/example.webp
---

## 示例

```sql
SELECT id FROM users WHERE id = 1;
```

![查询结果](/uploads/posts/example.webp)
````

新文章文件名默认为日期加标题，可在创建时改成容易维护的英文短名，例如 `2026-10-30-mysql-index.md`，保留 `.md` 后缀。嵌套目录已启用，已有 `mysql-notes/` 文章可以在后台管理；修改标题不会要求更改现有文件名或文章地址。

`settings.content.merge: true` 会保留未列在表单里的字段，例如 MySQL 系列的 `series`、`seriesOrder`、`author`、`lang`，以及 `updated`、评论和许可配置。它保护 Frontmatter 的额外键，不能保证特殊正文语法在富文本往返转换后逐字不变。

## 正文编辑与 MDX

- 普通 Markdown 使用 Editor 可视化模式，或通过切换按钮使用 Source 源码模式；正文保存为 Markdown，不转存为 HTML。
- 普通代码块、图片、链接、列表和表格可在 Markdown 中保留。Firefly 的自定义指令（例如 `:::`）、数学公式、复杂 HTML、图表等特殊语法请直接使用 Source；已有含此类语法的文章不要切换到 Editor 后保存。
- 可视化集合通过 `.md` 文件名模板限定扩展名，`.mdx` 文件不会进入这个集合，保留 Astro 原有 MDX 加载能力；MDX 的 `import`、JSX 组件与表达式继续在本地 VS Code 或 GitHub 源码编辑器维护。不要将 MDX 改名为 `.md` 后用富文本编辑。
- 当前发布文章均为 `.md`；存档 MDX 示例和 `src/content/spec/friends.mdx` 不在此集合中，本配置不改动它们。

### Redis 旧文的首行兼容

`src/content/posts/redis-01-introduction.md` 在开头的 `---` 前有一个空行。Firefly 当前可以加载它，但核对的 Pages CMS 官方解析器要求 Frontmatter 从文件开头开始，直接用结构化表单可能读不到标题、日期等字段。

因此这篇旧文按完整文件名从可视化集合中排除，并配置独立的「Redis 旧文（源码编辑）」入口：`type: file`、`format: code`、不定义结构化字段，完整保留其 Frontmatter 和正文。原文件未作任何修复或格式化。其余 10 篇 MySQL 文章和以后新建的标准 `.md` 使用普通可视化表单。

`exclude` 使用文件名或目录名的精确匹配，排除 `images` 图片目录以及上述 Redis 文件。若未来新增旧笔记，也应让 `---` 位于文件第一行，再进入可视化集合。

## 图片路径

- CMS 新上传的正文图和封面统一写入 `public/uploads/posts/`，内容中写成 `/uploads/posts/文件名.webp`，不包含 `public/` 前缀。
- 使用随机文件名减少同名覆盖，可上传 PNG、JPG、JPEG、WebP、AVIF、GIF。封面是单个路径字符串；正文可插入多张图。
- 当前 GitHub Pages 用户站点以 `/` 为 base，Astro 将 `public/` 原样复制到发布目录，因此 `/uploads/posts/...` 可从根路径访问。若未来改成带仓库子路径的站点，需要相应调整 CMS 输出路径。
- 已有 MySQL 文章仍使用 `./images/...` 相对链接，原图保持在 `src/content/posts/mysql-notes/images/`；本配置不搬动、重写或重新上传旧图。
- `/uploads/posts/example.webp` 仅用于上面的格式示例，不是已上传的实际图片。

## 本地验收与官方参考

本地使用官方配置 Schema 校验 `.pages.yml`，并核对 CMS YAML 序列化产生的日期、标签、布尔值和封面类型与项目的实际文章 Schema 兼容。现有文件通过修改前后 SHA-256 比对，确保文章、图片、主题与部署配置不变。

2026-10-30 本地验收结果：

- 官方配置 Schema 与归一化校验通过；Markdown 集合归一化后的扩展名为 `md`，MDX 不进入此集合。
- 通过官方 YAML 序列化器与本项目实际文章 Schema 验证 4 组新文章数据（空 / 非空标签数组，草稿 / 发布布尔值）。
- 10 篇 MySQL 文章的 Frontmatter 额外字段与正文源码往返校验通过；Redis 旧文使用原始源码入口。
- `pnpm check` 通过（260 个文件，0 errors / 0 warnings / 0 hints）；`pnpm type-check`、`pnpm build` 均以退出码 0 完成。
- 595 个既有文件 SHA-256 比对一致，文章、原图、主题、导航和部署工作流保持原样。本次仅新增 3 个文件，无依赖或锁文件变化。
- 构建仍有已有的 Redis 语言高亮回退、清理后空内容集合、较大 JS 分包与中文搜索词干提示，无新增构建错误。

尚未授权 GitHub，因此登录、实际在线保存和上传操作需在手动启用后验收；本地校验不能替代这部分远程操作。本次未提交、推送或部署。

- [官方快速开始与 GitHub 授权](https://pagescms.org/docs/quick-start/)
- [集合与子目录配置](https://pagescms.org/docs/configuration/content/)
- [富文本 Editor / Source 切换](https://pagescms.org/docs/configuration/fields/rich-text/)
- [日期输出格式](https://pagescms.org/docs/configuration/fields/date/)
- [媒体输入与输出路径](https://pagescms.org/docs/configuration/media/)
- [保留额外字段的 merge 设置](https://pagescms.org/docs/configuration/settings/)
