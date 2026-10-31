import { getCollection } from "astro:content";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import sanitizeHtml from "sanitize-html";
import { safeMediaUrl } from "@/utils/media-url";
import { url } from "@/utils/url-utils";
import {
	dynamicSearchText,
	dynamicSlug,
	sortDynamics,
} from "@/utils/dynamic-utils";

const markdownImagePattern = /!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)/g;

export async function GET(): Promise<Response> {
	const processor = await createMarkdownProcessor();
	// 静态 API、动态页和侧栏共用此过滤，开发预览也不公开草稿。
	const dynamics = sortDynamics(
		await getCollection("dynamic", ({ data }) => !data.draft),
	);
	const data = await Promise.all(
		dynamics.map(async (entry) => {
			const images: Array<{ alt: string; src: string; title?: string }> =
				entry.data.images
					.map(safeMediaUrl)
					.filter(Boolean)
					.map((src, index) => ({
						alt: `${entry.data.title || "动态"} 配图 ${index + 1}`,
						src: url(src),
					}));
			const markdown = (entry.body || "").replace(
				markdownImagePattern,
				(_match, alt: string, src: string, title?: string) => {
					const safeSrc = safeMediaUrl(src);
					if (safeSrc)
						images.push({
							alt,
							src: url(safeSrc),
							...(title ? { title } : {}),
						});
					return "";
				},
			);
			const rendered = await processor.render(markdown);

			return {
				id: dynamicSlug(entry.id),
				published: entry.data.published.getTime(),
				html: sanitizeHtml(rendered.code),
				images,
				searchText: dynamicSearchText(entry),
				pinned: entry.data.pinned || false,
				location: entry.data.location.trim(),
			};
		}),
	);

	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
	});
}
