import type { ProfileConfig } from "../types/profileConfig";
import { cmsProfile } from "../utils/cms-data";

const legacyProfileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	avatar: "assets/images/avatar.avif",

	// 名字
	name: "Player",

	// 个人签名
	bio: "一名持续学习 Java 后端与 AI 应用开发的软件工程学生，记录技术学习、项目实践与问题解决过程。",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/Playerkkk1",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
		{
			name: "Atom",
			icon: "fa7-solid:atom",
			url: "/atom/",
			showName: false,
		},
	],
};

export const profileConfig: ProfileConfig = {
	...legacyProfileConfig,
	avatar: cmsProfile.avatar || legacyProfileConfig.avatar,
	name: cmsProfile.name?.trim() || legacyProfileConfig.name,
	// Pages CMS 保存时移除空字符串；缺失简介表示用户主动清空。
	bio: cmsProfile.bio ?? "",
	signature: cmsProfile.signature ?? "",
};
