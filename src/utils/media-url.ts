// CMS 公开资源只接受站内绝对路径或 HTTPS URL，避免把任意协议传给媒体元素。
export function safeMediaUrl(value: string): string {
	const path = value.trim();
	if (
		path.startsWith("/") &&
		!path.startsWith("//") &&
		!/[\\\u0000-\u0020]/.test(path)
	)
		return path;
	try {
		const target = new URL(path);
		return target.protocol === "https:" && !target.username && !target.password
			? target.href
			: "";
	} catch {
		return "";
	}
}
