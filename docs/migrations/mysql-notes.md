# MySQL 笔记迁入记录

来源：本地 `MySQL/MySQL.md`；迁入日期：2026-10-30。原笔记及原图片保持不变。

按原文 10 个二级标题拆分为 `MySQL 学习笔记` 系列，分类为 `MySQL`，标签为 `MySQL`、`SQL`、`数据库`。`published` 为博客迁入日期。

| 顺序 | 原章节 | 博客文件 |
| --- | --- | --- |
| 1 | 启动MySQL（命令行） | [01-getting-started.md](../../src/content/posts/mysql-notes/01-getting-started.md) |
| 2 | SQL基础语句 | [02-databases-and-tables.md](../../src/content/posts/mysql-notes/02-databases-and-tables.md) |
| 3 | 数据操纵语句(DML) | [03-dml.md](../../src/content/posts/mysql-notes/03-dml.md) |
| 4 | 数据操作语句DQL(单表) | [04-single-table-query.md](../../src/content/posts/mysql-notes/04-single-table-query.md) |
| 5 | 数据库约束 | [05-constraints.md](../../src/content/posts/mysql-notes/05-constraints.md) |
| 6 | 数据库多表关系 | [06-table-relationships.md](../../src/content/posts/mysql-notes/06-table-relationships.md) |
| 7 | 数据查询语言DQL（多表） | [07-multi-table-query.md](../../src/content/posts/mysql-notes/07-multi-table-query.md) |
| 8 | 数据库事务 | [08-transactions.md](../../src/content/posts/mysql-notes/08-transactions.md) |
| 9 | 用户权限控制管理 | [09-users-and-privileges.md](../../src/content/posts/mysql-notes/09-users-and-privileges.md) |
| 10 | 数据备份和还原 | [10-backup-and-recovery.md](../../src/content/posts/mysql-notes/10-backup-and-recovery.md) |

转换范围：

- 保留原笔记正文、表格、示例顺序及全部 45 个代码块内容，不进行 SQL 纠错或执行验证。
- 移除重复总标题，将原章节标题作为文章标题；收紧跳级的 Markdown 标题层级。
- MySQL / MYSQL / SQL 代码块统一标记为 `sql`；启动命令标记为 `bash`。
- Typora `==高亮==` 转换为普通 Markdown 强调；转义表格中行内代码的竖线，避免表格错列。
- 31 处图片引用对应 31 张本地 PNG，复制到 `src/content/posts/mysql-notes/images/`，使用相对链接。图片逐张比对 SHA-256，内容未变。
- 自动生成的文件名式图片说明改用所在小节标题，适配博客现有图片说明及放大预览。

未迁入：课件、PPT、安装手册、练习代码目录，以及主笔记未引用的两张图片。

未修改博客组件、样式、头像、Favicon、壁纸或其他笔记；保留此前未提交的示例内容清理。未提交、推送或部署。

对应文件和校验值见 [迁移清单](mysql-notes-manifest.json)。

验收结果（2026-10-30）：

- `pnpm check`：通过，260 个文件，0 errors / 0 warnings / 0 hints。
- `pnpm type-check`：通过。
- `pnpm build`：通过，34 个页面生成完成，Pagefind 索引正常生成。
- 10 篇文章路由及 31 张配图均可加载；系列顺序为 01–10，分类筛选显示 10 篇，站内搜索可检索 MySQL。
- 桌面端 1440×1000：浅色检查全部 10 篇，深色检查启动、长篇查询及备份章节。
- 手机端 390×844：深浅色检查配图与长表格；页面无横向溢出，宽表格可以在自身容器内横向滚动。
- 实际操作确认图片放大、代码折叠、代码复制及系列文章跳转正常；浏览器未发现页面脚本错误或本地资源加载失败。
- SHA-256 复核确认原 Markdown 和 31 张原图未改变；全部 45 个代码块内容一致。
- 与迁移前工作区快照相比，原有文件仅构建生成的 `src/constants/lqips.json` 增加 31 条图片占位数据；此前配色、图片和示例清理成果保持不变。

浏览器检查使用本地生产构建，隔离第三方网络请求；未测试外部评论、统计等远程服务，也未执行笔记中的 SQL。构建保留原有 Redis 语言高亮回退、空内容集合及中文搜索分词相关提示。
