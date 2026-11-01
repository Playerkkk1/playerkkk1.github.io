export function initPageViews(): void {
	// Swup 会重新执行模块脚本；单例标记必须跨模块实例保留。
	const runtime = window as Window & {
		__fireflyPageViewsInitialized?: boolean;
	};
	if (runtime.__fireflyPageViewsInitialized) return;
	runtime.__fireflyPageViewsInitialized = true;

	let activePath = "";
	let activeRequest: AbortController | undefined;
	let displayValue: string | undefined;
	let failed = false;

	const update = async () => {
		const elements = Array.from(
			document.querySelectorAll<HTMLElement>("[data-page-view-count]"),
		);
		const element = elements[0];
		const render = () => {
			for (const target of document.querySelectorAll<HTMLElement>(
				"[data-page-view-count]",
			)) {
				if (target.dataset.pagePath !== element?.dataset.pagePath) continue;
				target.textContent = failed
					? target.dataset.error || "—"
					: (displayValue ?? target.dataset.loading ?? "—");
			}
		};

		if (!element) {
			activeRequest?.abort();
			activeRequest = undefined;
			activePath = "";
			return;
		}

		// 只统计正式域名。预览、localhost 和分支部署不污染线上计数。
		if (element.dataset.siteOrigin !== window.location.origin) {
			for (const target of elements) target.textContent = "—";
			return;
		}

		const page = new URL(
			element.dataset.pagePath || "/",
			window.location.origin,
		);
		if (page.pathname !== window.location.pathname) return;
		if (page.href === activePath) {
			render();
			return;
		}

		activeRequest?.abort();
		const request = new AbortController();
		activeRequest = request;
		activePath = page.href;
		displayValue = undefined;
		failed = false;
		render();
		const timer = window.setTimeout(
			() => request.abort(),
			Number(element.dataset.timeout) || 8000,
		);

		try {
			const response = await fetch(element.dataset.endpoint || "", {
				method: "POST",
				credentials: "omit",
				referrerPolicy: "no-referrer",
				body: JSON.stringify({
					url: page.href,
					referrer: document.referrer ? new URL(document.referrer).origin : "",
				}),
				signal: request.signal,
			});
			if (!response.ok) throw new Error("Page view service unavailable");
			const result: unknown = await response.json();
			const count =
				typeof result === "object" &&
				result !== null &&
				"busuanzi_page_pv" in result
					? result.busuanzi_page_pv
					: undefined;
			if (
				typeof count !== "number" ||
				!Number.isSafeInteger(count) ||
				count < 0
			) {
				throw new Error("Invalid page view count");
			}
			if (activeRequest !== request) return;
			displayValue = count.toLocaleString();
			render();
		} catch {
			if (activeRequest !== request) return;
			failed = true;
			render();
		} finally {
			window.clearTimeout(timer);
		}
	};

	void update();
	document.addEventListener("astro:page-load", () => void update());
}
