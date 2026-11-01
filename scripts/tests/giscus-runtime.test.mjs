import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { setImmediate as tick } from "node:timers/promises";
import ts from "typescript";

const compiled = ts.transpileModule(
	readFileSync(
		new URL("../../src/utils/giscus-runtime.ts", import.meta.url),
		"utf8",
	),
	{
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2022,
		},
	},
).outputText;

function createHarness() {
	const events = new Map();
	const observers = [];
	let widgets = [];
	let dark = false;
	let registered = false;
	let loads = 0;
	let rejectLoad = false;
	const errors = [{ hidden: true }];
	const runtimeWindow = { location: { href: "https://playerkkk1.github.io/" } };
	const document = {
		documentElement: { classList: { contains: () => dark } },
		querySelectorAll: (selector) =>
			selector === "[data-giscus-error]" ? errors : widgets,
		addEventListener: (name, fn) => events.set(name, fn),
	};
	const customElements = { get: () => registered };
	class MutationObserver {
		constructor(callback) {
			observers.push(callback);
		}
		observe() {}
	}
	const loadWidget = async () => {
		loads++;
		if (rejectLoad) throw new Error("offline");
		registered = true;
	};
	const module = () => {
		const exports = {};
		new Function(
			"exports",
			"window",
			"document",
			"customElements",
			"MutationObserver",
			compiled,
		)(exports, runtimeWindow, document, customElements, MutationObserver);
		return exports;
	};
	const api = module();
	return {
		api,
		errors,
		get loads() {
			return loads;
		},
		get widgets() {
			return widgets;
		},
		get observerCount() {
			return observers.length;
		},
		init() {
			api.initGiscus(loadWidget);
		},
		reload() {
			module().initGiscus(loadWidget);
		},
		failLoading() {
			rejectLoad = true;
		},
		retryLoading() {
			rejectLoad = false;
		},
		navigate(path, threadPath) {
			runtimeWindow.location.href = `https://playerkkk1.github.io${path}`;
			widgets = threadPath
				? [
						{
							dataset: { threadPath },
							attrs: {},
							getAttribute(name) {
								return this.attrs[name];
							},
							setAttribute(name, value) {
								this.attrs[name] = value;
							},
						},
					]
				: [];
			events.get("astro:page-load")?.();
		},
		theme(value) {
			dark = value;
			for (const fn of observers) fn();
		},
	};
}

test("stable paths keep guestbook and article threads separate regardless of query or hash", () => {
	const { resolveGiscusPath } = createHarness().api;
	assert.equal(
		resolveGiscusPath(
			"/guestbook/",
			"https://example.com/guestbook/?path=/posts/other/#x",
		),
		"/guestbook",
	);
	assert.equal(
		resolveGiscusPath(
			"/posts/example/",
			"https://example.com/posts/example/?utm_source=test",
		),
		"/posts/example",
	);
	assert.equal(
		resolveGiscusPath("/friends/", "https://example.com/friends/"),
		"/friends",
	);
});

test("dynamic embed maps each dynamic item and rejects unrelated query targets", () => {
	const { resolveGiscusPath } = createHarness().api;
	assert.equal(
		resolveGiscusPath(
			"/dynamic/",
			"https://example.com/dynamic/comments/?path=%2Fdynamic%2Fnote-one",
		),
		"/dynamic/note-one",
	);
	assert.equal(
		resolveGiscusPath(
			"/dynamic/",
			"https://example.com/dynamic/comments/?path=https%3A%2F%2Fevil.invalid",
		),
		"/dynamic",
	);
	assert.equal(
		resolveGiscusPath(
			"/dynamic/",
			"https://example.com/dynamic/comments/?path=%2Fdynamic%2F..%2Fposts%2Fother",
		),
		"/dynamic",
	);
});

test("home page does not load widget until first Swup visit to a comment page", async () => {
	const h = createHarness();
	h.init();
	assert.equal(h.loads, 0);
	h.navigate("/guestbook/", "/guestbook/");
	await tick();
	assert.equal(h.loads, 1);
	assert.equal(h.widgets[0].attrs.term, "/guestbook");
	assert.equal(h.widgets[0].attrs.theme, "light");
});

test("theme updates target current widget after navigation, with one shared observer", async () => {
	const h = createHarness();
	h.init();
	h.reload();
	h.theme(true);
	h.navigate("/guestbook/", "/guestbook/");
	await tick();
	assert.equal(h.widgets[0].attrs.theme, "dark");
	h.navigate("/posts/example/", "/posts/example");
	h.reload();
	assert.equal(h.widgets[0].attrs.term, "/posts/example");
	h.theme(false);
	assert.equal(h.widgets[0].attrs.theme, "light");
	assert.equal(h.loads, 1);
	assert.equal(h.observerCount, 1);
});

test("failed component download is visible and can retry on next page", async () => {
	const h = createHarness();
	h.failLoading();
	h.init();
	h.navigate("/guestbook/", "/guestbook/");
	await tick();
	assert.equal(h.errors[0].hidden, false);
	h.retryLoading();
	h.navigate("/posts/example/", "/posts/example");
	await tick();
	assert.equal(h.loads, 2);
	assert.equal(h.errors[0].hidden, true);
});
