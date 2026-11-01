/** Use a stable page path instead of the page title to identify each discussion. */
export function resolveGiscusPath(path: string, currentUrl: string): string {
	const page = new URL(currentUrl);
	let target = path;
	// Dynamic comments share an embed page, with one discussion per dynamic item.
	if (page.pathname.endsWith("/dynamic/comments/")) {
		const requested = page.searchParams.get("path");
		if (requested?.startsWith("/dynamic/") && !requested.startsWith("//")) {
			const dynamic = new URL(requested, page.origin);
			if (
				dynamic.origin === page.origin &&
				dynamic.pathname.startsWith("/dynamic/")
			) {
				target = dynamic.pathname;
			}
		}
	}
	const resolved = new URL(target, page.origin);
	if (resolved.origin !== page.origin) return path;
	return resolved.pathname.replace(/\/+$/, "") || "/";
}

export function initGiscus(
	loadWidget: () => Promise<unknown> = () => import("giscus"),
): void {
	const runtime = window as Window & { __fireflyGiscusInitialized?: boolean };
	if (runtime.__fireflyGiscusInitialized) return;
	runtime.__fireflyGiscusInitialized = true;
	let loading: Promise<unknown> | undefined;

	const update = () => {
		const widgets = document.querySelectorAll<HTMLElement>(
			"giscus-widget[data-thread-path]",
		);
		if (!widgets.length) return;
		const theme = document.documentElement.classList.contains("dark")
			? "dark"
			: "light";
		for (const widget of widgets) {
			const path = resolveGiscusPath(
				widget.dataset.threadPath || "/",
				window.location.href,
			);
			if (widget.getAttribute("term") !== path)
				widget.setAttribute("term", path);
			if (widget.getAttribute("theme") !== theme)
				widget.setAttribute("theme", theme);
		}
		if (customElements.get("giscus-widget")) return;
		if (!loading) {
			loading = loadWidget()
				.then(() => {
					for (const status of document.querySelectorAll<HTMLElement>(
						"[data-giscus-error]",
					)) {
						status.hidden = true;
					}
				})
				.catch(() => {
					loading = undefined;
					for (const status of document.querySelectorAll<HTMLElement>(
						"[data-giscus-error]",
					)) {
						status.hidden = false;
					}
				});
		}
	};

	// Register listeners before loading the component so navigation during loading is safe.
	document.addEventListener("astro:page-load", update);
	new MutationObserver(update).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
	update();
}
