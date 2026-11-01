import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
	setTimeout as delay,
	setImmediate as tick,
} from "node:timers/promises";
import ts from "typescript";

const compiled = ts.transpileModule(
	readFileSync(
		new URL("../../src/utils/page-views.ts", import.meta.url),
		"utf8",
	),
	{
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2022,
		},
	},
).outputText;

function harness({
	preview = false,
	ignoreAbort = false,
	timeout = 5000,
} = {}) {
	const origin = "https://playerkkk1.github.io";
	const listeners = new Map();
	const requests = [];
	const location = {
		origin: preview ? "http://localhost:4321" : origin,
		pathname: "/posts/a/",
	};
	const element = (path) => ({
		dataset: {
			pagePath: path,
			siteOrigin: origin,
			endpoint: "https://cdn.busuanzi.cc/api.php",
			timeout: String(timeout),
			loading: "加载中...",
			error: "统计不可用",
		},
		textContent: "加载中...",
	});
	let elements = [element(location.pathname)];
	const document = {
		referrer: "https://example.com/private?token=hidden#secret",
		querySelectorAll: () => elements,
		addEventListener: (name, fn) => listeners.set(name, fn),
	};
	const fetch = (endpoint, options) =>
		new Promise((resolve, reject) => {
			requests.push({ endpoint, options, resolve, reject });
			if (!ignoreAbort)
				options.signal.addEventListener(
					"abort",
					() => reject(new DOMException("Aborted", "AbortError")),
					{ once: true },
				);
		});
	const runtimeWindow = { location, setTimeout, clearTimeout };
	const loadModule = () => {
		const exports = {};
		new Function("exports", "window", "document", "fetch", compiled)(
			exports,
			runtimeWindow,
			document,
			fetch,
		);
		return exports;
	};
	const exports = loadModule();
	exports.initPageViews();
	return {
		requests,
		init: exports.initPageViews,
		reloadModule() {
			loadModule().initPageViews();
		},
		get elements() {
			return elements;
		},
		emit() {
			listeners.get("astro:page-load")?.();
		},
		navigate(path) {
			location.pathname = path;
			elements = path.startsWith("/posts/") ? [element(path)] : [];
			this.emit();
		},
		replaceElements() {
			elements = [element(location.pathname)];
			this.emit();
		},
		resolve(index, value) {
			requests[index].resolve({
				ok: true,
				json: async () => ({ busuanzi_page_pv: value }),
			});
		},
		stop() {
			this.navigate("/");
		},
	};
}

test("canonical article URL and minimal request data; zero remains a real count", async () => {
	const h = harness();
	try {
		assert.equal(h.requests.length, 1);
		const { options } = h.requests[0];
		assert.deepEqual(JSON.parse(options.body), {
			url: "https://playerkkk1.github.io/posts/a/",
			referrer: "https://example.com",
		});
		assert.equal(options.credentials, "omit");
		assert.equal(options.referrerPolicy, "no-referrer");
		h.resolve(0, 0);
		await tick();
		assert.equal(h.elements[0].textContent, "0");
	} finally {
		h.stop();
	}
});

test("repeated initialization and page-load events do not count twice", async () => {
	const h = harness();
	try {
		h.init();
		h.emit();
		h.emit();
		assert.equal(h.requests.length, 1);
		h.resolve(0, 12);
		await tick();
		h.emit();
		assert.equal(h.requests.length, 1);
		assert.equal(h.elements[0].textContent, "12");
	} finally {
		h.stop();
	}
});

test("Swup re-executing a fresh module instance keeps the original singleton", async () => {
	const h = harness();
	try {
		h.reloadModule();
		h.reloadModule();
		assert.equal(h.requests.length, 1);
		h.resolve(0, 2);
		await tick();
		h.navigate("/posts/b/");
		h.reloadModule();
		h.emit();
		assert.equal(h.requests.length, 2);
		h.resolve(1, 7);
		await tick();
		assert.equal(h.elements[0].textContent, "7");
	} finally {
		h.stop();
	}
});

test("replacement DOM for the same article receives the in-flight response", async () => {
	const h = harness();
	try {
		h.replaceElements();
		assert.equal(h.requests.length, 1);
		h.resolve(0, 24);
		await tick();
		assert.equal(h.elements[0].textContent, "24");
	} finally {
		h.stop();
	}
});

test("Swup navigation counts each article and ignores stale responses", async () => {
	const h = harness({ ignoreAbort: true });
	try {
		h.navigate("/posts/b/");
		assert.equal(h.requests[0].options.signal.aborted, true);
		h.resolve(1, 8);
		await tick();
		h.resolve(0, 99);
		await tick();
		assert.equal(h.elements[0].textContent, "8");
		h.navigate("/");
		assert.equal(h.requests.length, 2);
		h.navigate("/posts/b/");
		assert.equal(h.requests.length, 3);
		h.resolve(2, 9);
		await tick();
		assert.equal(h.elements[0].textContent, "9");
	} finally {
		h.stop();
	}
});

test("preview origins never call the public counting service", () => {
	const h = harness({ preview: true });
	try {
		assert.equal(h.requests.length, 0);
		assert.equal(h.elements[0].textContent, "—");
	} finally {
		h.stop();
	}
});

test("invalid or failed responses show unavailable instead of inventing zero", async () => {
	for (const bad of [-1, "12", null, "<script>bad</script>", 1.5]) {
		const h = harness();
		try {
			h.resolve(0, bad);
			await tick();
			assert.equal(h.elements[0].textContent, "统计不可用");
		} finally {
			h.stop();
		}
	}
	const h = harness();
	try {
		h.requests[0].resolve({ ok: false });
		await tick();
		assert.equal(h.elements[0].textContent, "统计不可用");
	} finally {
		h.stop();
	}
});

test("timeout leaves an explicit unavailable state", async () => {
	const h = harness({ timeout: 5 });
	try {
		await delay(15);
		assert.equal(h.elements[0].textContent, "统计不可用");
	} finally {
		h.stop();
	}
});
