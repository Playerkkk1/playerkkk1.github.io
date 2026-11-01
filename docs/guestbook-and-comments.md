# 留言板与文章评论

本博客按 Firefly 原有评论接口接入 Giscus。原主题支持 Twikoo、Waline、Artalk、Giscus、Disqus；前三者需要实际后端地址，原配置只是示例。Giscus 由 GitHub Discussions 保存留言，适合目前的 GitHub Pages 静态站点，无需另行部署评论数据库或服务器。

依据：[Firefly 评论系统文档](https://docs-firefly.cuteleaf.cn/zh/guide/comment.html)、[Giscus 官方配置](https://giscus.app/zh-CN)、[官方组件说明](https://github.com/giscus/giscus-component)。

## 管理员的一次性开通

1. 在博客仓库 **Settings → General → Features** 勾选 **Discussions**。
2. 打开 [Giscus GitHub App](https://github.com/apps/giscus)，安装时选择 **Only select repositories**，仅授权 `Playerkkk1/playerkkk1.github.io`。
3. 打开 [Giscus 配置页](https://giscus.app/zh-CN)，填写上述仓库，选择 **Announcements** 或其他公告类型分类。
4. 将生成的仓库 ID、分类名称和分类 ID 填入 `src/config/commentConfig.ts`。这些是公开配置，不是访问令牌。分类 ID 未配置前不加载留言组件，避免连接主题作者的示例仓库。

也可以读取 Giscus 配置页使用的公开分类接口来核对配置：

```text
https://giscus.app/api/discussions/categories?repo=Playerkkk1%2Fplayerkkk1.github.io
```

接口需要先安装 Giscus App 并开启 Discussions。安装授权由仓库管理员在 GitHub 页面完成，不需要在博客或仓库里保存个人访问令牌。

## 访客怎么留言

- 导航「社交 → 留言」进入 `/guestbook/`，在下方登录 GitHub 后留言。
- 文章底部可对该篇文章留言；文章 Frontmatter 的 `comment: false` 可关闭单篇评论，已有加密文章继续不显示公开评论框。
- 友链页可进行交流；申请交换友链仍使用独立的 GitHub Issues 申请表。
- 动态原有的评论开关与每条动态的独立评论入口继续适用。
- 留言公开保存在博客仓库的 Discussions，站长可在那里回复、编辑管理或锁定讨论。访客也可通过组件下方的链接直接进入 GitHub 讨论区。

## 在 Pages CMS 查看和删除评论

左侧「评论管理」显示从 Giscus 对应的 GitHub Discussions 同步的真实评论和回复，按发布时间倒序排列，可搜索内容、评论者或所属页面。正文以纯文本显示，不执行评论中的 HTML。

1. 打开 Pages CMS，选择本博客仓库和 **master** 分支，进入「评论管理」。
2. 新增、编辑、删除评论会自动触发同步。需要手动更新时，使用集合页上方的 **刷新评论列表**，等待 `CMS comments` 工作流成功后重新载入列表；不是点击后立即更新。
3. 点击某条评论，查看完整内容、作者、所属文章或页面、发布时间和 GitHub 原评论地址。
4. 删除时使用上方 **删除这条评论**，核对后点击 **确认删除**。这个操作调用 GitHub API 删除实际评论，再更新 CMS 列表。GitHub 对有回复的父评论会保留已删除占位，已有回复继续显示。
5. 工作流成功后刷新 CMS 和博客，即可看到结果。没有评论时列表为空，不会生成演示评论。

若 CMS 暂未出现 Actions 按钮，先刷新后台；如果提示权限不足，按 Pages CMS 提示为它的 GitHub App 批准 Actions 权限。也可随时到 [GitHub Discussions](https://github.com/Playerkkk1/playerkkk1.github.io/discussions/categories/announcements) 直接管理。

评论字段只读，集合的普通新建、改名和删除文件操作已关闭；直接删除同步文件不会删除 GitHub 评论。同步使用 GitHub Actions 的临时令牌，无需配置个人访问令牌或额外后端。只处理本站 `Announcements` 分类，删除前会核对仓库、分类、评论 ID 和最后更新时间。

`cms/comments/` 是公开评论的 CMS 副本，删除会移除 GitHub 现有评论和当前同步文件，已经提交的副本仍可能出现在 Git 历史中；它不适合作为需要彻底抹除历史的私密留言系统。

实现依据：[Pages CMS Actions](https://pagescms.org/docs/configuration/actions/)、[GitHub Discussion 评论 API](https://docs.github.com/en/graphql/reference/discussions)、[GitHub 评论事件](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#discussion_comment)。

首次有人留言或回应时，Giscus 会自动建立对应讨论；没有历史留言时显示空讨论是正常状态。开通功能不代表已经代替站长发表了测试留言。

## 关联与主题

留言板固定关联 `/guestbook`，文章按 `/posts/文章路径` 关联，去掉末尾 `/`，忽略查询参数与页内锚点。映射使用 `specific` 和严格匹配；修改文章标题不会新建讨论，修改文件名或文章 URL 则需要考虑旧讨论迁移。

动态评论共享 `/dynamic/comments/` 嵌入页，由该页 `path` 参数区分动态条目；普通文章和留言板不会接受这个参数覆盖讨论路径。

Giscus 官方 Web Component 作为固定版本依赖随博客构建，避免运行时依赖未锁版本的第三方打包 CDN。初次进入有评论的页面时才加载组件。组件在无刷新切换后重新绑定当前讨论，深浅主题跟随博客切换；公共浏览量继续由独立统计服务处理。

布局采用「评论数量与评论列表在前，输入框在后」，对应 Giscus 的 `inputPosition: "bottom"`。参考 [Writing an OS in Rust 的文章评论区](https://os.phil-opp.com/async-await/#comments) 的独立评论区与 GitHub 讨论入口，保持博客现有卡片样式；手机端缩小左右内边距，让评论内容和输入框有更多空间。

## 验证与故障排查

```powershell
node --test scripts/tests/giscus-runtime.test.mjs
node --test scripts/tests/cms-comments.test.mjs
pnpm check
pnpm type-check
pnpm build
```

上线后检查留言板、两篇不同文章、主题切换、无刷新切换和手机布局。需要验证实际发表时，由你登录 GitHub 手动发布一条可公开的留言。

如果没有出现留言框，先检查仓库是否公开、Discussions 是否启用、Giscus App 是否获准访问此仓库，以及分类 ID 是否与分类名称一致。组件加载失败时页面保留 GitHub 讨论区入口；GitHub 或 Giscus 服务不可达时，博客静态正文仍可阅读。
