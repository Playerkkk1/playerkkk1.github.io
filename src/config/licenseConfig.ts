import type { LicenseConfig } from "../types/licenseConfig";

export const licenseConfig: LicenseConfig = {
	// 是否启用文章末尾的许可信息
	enable: true,

	// 许可证名称及链接
	name: "CC BY-NC-SA 4.0（署名—非商业性使用—相同方式共享）",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans",
	description:
		"除另有标注外，本文中由作者享有著作权的原创文字与自制图表采用上述协议。转载或改编请署名、附原文与协议链接并注明修改；仅限非商业性使用，改编后须以相同协议共享。",
	notice:
		"课程截图、教材、真题、引用文字及第三方代码等不属于作者的上述授权范围，其使用须遵循原权利人的授权或适用的法律规定。代码示例的软件许可另行标注，未标注时不视为获得 MIT 等软件许可。",

	// 可选：自定义许可证图标（iconify 图标名）
	// 留空时根据许可证名称自动匹配，匹配规则如下：
	//   CC BY / CC BY-SA / CC BY-NC / CC BY-NC-SA / CC BY-ND / CC BY-NC-ND 等 CC 系列
	//   → fa7-brands:creative-commons
	//   CC0 1.0
	//   → fa7-brands:creative-commons-zero
	//   Public Domain / 公共领域
	//   → fa7-brands:creative-commons-pd
	//   MIT / Apache / BSD / ISC / MPL / GPL / LGPL / AGPL / MulanPSL / Unlicense
	//   → fa7-brands:osi
	//   其余未匹配的许可证（如 All Rights Reserved、WTFPL 等）
	//   → fa7-regular:copyright
	icon: "",
};
