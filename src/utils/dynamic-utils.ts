import type { CollectionEntry } from "astro:content";

export const sortDynamics = (
	entries: CollectionEntry<"dynamic">[],
): CollectionEntry<"dynamic">[] =>
	entries.sort((a, b) => {
		// 动态始终按发布时间倒序；旧置顶字段仍保留作展示标识。
		return b.data.published.getTime() - a.data.published.getTime();
	});

export const dynamicSlug = (id: string): string =>
	id.replace(/\.(md|mdx)$/i, "");

export const dynamicAnchor = (id: string): string =>
	`dynamic-${encodeURIComponent(dynamicSlug(id))}`;

export const dynamicPlainText = (entry: CollectionEntry<"dynamic">): string =>
	(entry.body || "")
		.replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[#>*_`~[\]()-]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

export const dynamicSearchText = (entry: CollectionEntry<"dynamic">): string =>
	[dynamicPlainText(entry), entry.data.location]
		.filter(Boolean)
		.join(" ")
		.toLocaleLowerCase();
