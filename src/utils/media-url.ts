// CMS 公开资源只接受站内绝对路径或 HTTPS URL，避免把任意协议传给媒体元素。
export function safeMediaUrl(value: string): string {
	const path = value.trim();
	if (
		path.startsWith("/") &&
		!path.startsWith("//") &&
		!/[\\\u0000-\u001f]/.test(path)
	) {
		// CMS 返回文件路径，不一定已编码。逐段编码避免空格、#、中文被当成 URL 语法。
		return path
			.split("/")
			.map((segment) => {
				try {
					return encodeURIComponent(decodeURIComponent(segment));
				} catch {
					return encodeURIComponent(segment);
				}
			})
			.join("/");
	}
	try {
		const target = new URL(path);
		return target.protocol === "https:" && !target.username && !target.password
			? target.href
			: "";
	} catch {
		return "";
	}
}
