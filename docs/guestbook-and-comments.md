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

首次有人留言或回应时，Giscus 会自动建立对应讨论；没有历史留言时显示空讨论是正常状态。开通功能不代表已经代替站长发表了测试留言。

## 关联与主题

留言板固定关联 `/guestbook`，文章按 `/posts/文章路径` 关联，去掉末尾 `/`，忽略查询参数与页内锚点。映射使用 `specific` 和严格匹配；修改文章标题不会新建讨论，修改文件名或文章 URL 则需要考虑旧讨论迁移。

动态评论共享 `/dynamic/comments/` 嵌入页，由该页 `path` 参数区分动态条目；普通文章和留言板不会接受这个参数覆盖讨论路径。

Giscus 官方 Web Component 作为固定版本依赖随博客构建，避免运行时依赖未锁版本的第三方打包 CDN。初次进入有评论的页面时才加载组件。组件在无刷新切换后重新绑定当前讨论，深浅主题跟随博客切换；公共浏览量继续由独立统计服务处理。

## 验证与故障排查

```powershell
node --test scripts/tests/giscus-runtime.test.mjs
pnpm check
pnpm type-check
pnpm build
```

上线后检查留言板、两篇不同文章、主题切换、无刷新切换和手机布局。需要验证实际发表时，由你登录 GitHub 手动发布一条可公开的留言。

如果没有出现留言框，先检查仓库是否公开、Discussions 是否启用、Giscus App 是否获准访问此仓库，以及分类 ID 是否与分类名称一致。组件加载失败时页面保留 GitHub 讨论区入口；GitHub 或 Giscus 服务不可达时，博客静态正文仍可阅读。
