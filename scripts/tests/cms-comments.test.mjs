import assert from "node:assert/strict";
import {
	mkdir,
	mkdtemp,
	readdir,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import {
	CATEGORY_ID,
	commentFilename,
	createGraphql,
	deleteComment,
	fetchComments,
	REPOSITORY,
	run,
	syncComments,
} from "../cms-comments.mjs";

const stamp = "2026-11-01T08:00:00Z";
const thread = {
	id: "D_one",
	number: 1,
	title: "/guestbook",
	url: "thread-url",
};
const comment = {
	id: "DC_one",
	body: "一条公开评论\n<script>alert('data only')</script>",
	author: { login: "reader" },
	createdAt: stamp,
	updatedAt: stamp,
	deletedAt: null,
	url: "https://github.com/Playerkkk1/playerkkk1.github.io/discussions/1#discussioncomment-1",
	replies: { totalCount: 1 },
};
const reply = {
	...comment,
	id: "DC_reply",
	body: "回复",
	author: null,
	url: `${thread.url}#reply`,
};
const page = (nodes, endCursor = null) => ({
	nodes,
	pageInfo: { hasNextPage: endCursor !== null, endCursor },
});

async function workspace(t) {
	const base = path.resolve("temp");
	await mkdir(base, { recursive: true });
	const root = await mkdtemp(path.join(base, "cms-comments-test-"));
	t.after(async () => {
		assert.ok(root.startsWith(`${base}${path.sep}cms-comments-test-`));
		await rm(root, { recursive: true, force: true });
	});
	await mkdir(path.join(root, "cms/comments"), { recursive: true });
	return root;
}

function apiFixture({ deleted = false } = {}) {
	return async (query, variables) => {
		if (query.includes("query Threads")) {
			assert.equal(variables.category, CATEGORY_ID);
			return { repository: { discussions: page([thread]) } };
		}
		if (query.includes("query Comments")) {
			return {
				node: {
					comments: page([{ ...comment, deletedAt: deleted ? stamp : null }]),
				},
			};
		}
		if (query.includes("query Replies")) {
			return { node: { replies: page([reply]) } };
		}
		throw new Error(`Unexpected query: ${query}`);
	};
}

async function deletionFixture(t) {
	const root = await workspace(t);
	const filename = commentFilename(comment.id);
	await writeFile(
		path.join(root, "cms/comments", filename),
		JSON.stringify(comment),
	);
	const payload = {
		source: "pages-cms",
		action: { name: "delete-comment" },
		repository: {
			owner: "Playerkkk1",
			repo: "playerkkk1.github.io",
			ref: "master",
		},
		context: {
			type: "entry",
			name: "comments",
			path: `cms/comments/${filename}`,
			data: { content: { id: comment.id, updatedAt: comment.updatedAt } },
		},
	};
	const target = {
		...comment,
		discussion: {
			repository: { nameWithOwner: REPOSITORY },
			category: { id: CATEGORY_ID },
		},
	};
	return { root, payload, target };
}

test("sync shows comments and replies as plain text; prunes removed records, preserves keep file", async (t) => {
	const root = await workspace(t);
	const directory = path.join(root, "cms/comments");
	await writeFile(path.join(directory, ".gitkeep"), "");
	await writeFile(path.join(directory, "stale.json"), "{}");
	assert.equal(await syncComments(root, apiFixture()), 2);
	const files = await readdir(directory);
	assert.ok(!files.includes("stale.json"));
	assert.ok(files.includes(".gitkeep"));
	const top = JSON.parse(
		await readFile(path.join(directory, commentFilename(comment.id)), "utf8"),
	);
	assert.equal(top.body, comment.body);
	assert.equal(top.thread, "/guestbook");
	const child = JSON.parse(
		await readFile(path.join(directory, commentFilename(reply.id)), "utf8"),
	);
	assert.equal(child.parentId, comment.id);
	assert.equal(child.kind, "回复");
	assert.equal(child.author, "已注销用户");
});

test("sync retains replies when GitHub wipes a deleted parent", async () => {
	const records = await fetchComments(apiFixture({ deleted: true }));
	assert.deepEqual(
		records.map((entry) => entry.id),
		[reply.id],
	);
});

test("sync follows discussion, comment and reply pagination", async () => {
	const visits = [];
	const records = await fetchComments(async (query, variables) => {
		const kind = /query (\w+)/.exec(query)[1];
		visits.push([kind, variables.after]);
		if (kind === "Threads") {
			return {
				repository: {
					discussions: variables.after
						? page([thread])
						: page([], "next-thread"),
				},
			};
		}
		if (kind === "Comments") {
			return {
				node: {
					comments: variables.after
						? page([comment])
						: page([], "next-comment"),
				},
			};
		}
		return {
			node: {
				replies: variables.after ? page([reply]) : page([], "next-reply"),
			},
		};
	});
	assert.equal(records.length, 2);
	assert.deepEqual(visits, [
		["Threads", null],
		["Threads", "next-thread"],
		["Comments", null],
		["Comments", "next-comment"],
		["Replies", null],
		["Replies", "next-reply"],
	]);
});

test("API errors leave the previous CMS snapshot intact", async (t) => {
	const root = await workspace(t);
	const saved = path.join(root, "cms/comments/saved.json");
	await writeFile(saved, '{"body":"previous"}');
	await assert.rejects(
		syncComments(root, async () => {
			throw new Error("offline");
		}),
		/offline/,
	);
	assert.equal(await readFile(saved, "utf8"), '{"body":"previous"}');
});

test("delete verifies the current GitHub record then deletes only its selected ID", async (t) => {
	const { root, payload, target } = await deletionFixture(t);
	const calls = [];
	await deleteComment(root, payload, async (query, variables) => {
		calls.push({ query, variables });
		return { node: target };
	});
	assert.equal(calls.length, 2);
	assert.ok(calls[1].query.includes("deleteDiscussionComment"));
	assert.deepEqual(calls[1].variables, { id: comment.id });
});

test("delete rejects forged paths, other CMS entries and other branches before any API call", async (t) => {
	const { root, payload } = await deletionFixture(t);
	for (const invalid of [
		{
			...payload,
			context: { ...payload.context, path: "cms/comments/../../secret" },
		},
		{ ...payload, context: { ...payload.context, name: "posts" } },
		{ ...payload, repository: { ...payload.repository, ref: "other" } },
		{ ...payload, source: "unknown" },
	]) {
		await assert.rejects(
			deleteComment(root, invalid, () => assert.fail("No API call allowed")),
			/Invalid CMS/,
		);
	}
});

test("delete rejects a different repo, category, URL or an edited comment", async (t) => {
	const { root, payload, target } = await deletionFixture(t);
	for (const invalid of [
		{
			...target,
			discussion: {
				...target.discussion,
				repository: { nameWithOwner: "other/repo" },
			},
		},
		{
			...target,
			discussion: { ...target.discussion, category: { id: "other" } },
		},
		{ ...target, url: "other-url" },
		{ ...target, updatedAt: "later" },
	]) {
		let calls = 0;
		await assert.rejects(
			deleteComment(root, payload, async () => {
				assert.equal(++calls, 1);
				return { node: invalid };
			}),
		);
		assert.equal(calls, 1);
	}
});

test("an old CMS view cannot delete a newer synced version", async (t) => {
	const { root, payload } = await deletionFixture(t);
	payload.context.data.content.updatedAt = "older";
	await assert.rejects(
		deleteComment(root, payload, () =>
			assert.fail("No mutation from a stale view"),
		),
		/CMS view is outdated/,
	);
});

test("already deleted comments are idempotent and unknown actions cannot mutate", async (t) => {
	const { root, payload } = await deletionFixture(t);
	let calls = 0;
	await deleteComment(root, payload, async () => {
		calls++;
		return { node: null };
	});
	assert.equal(calls, 1);
	await assert.rejects(
		run({
			root,
			payload: '{"action":{"name":"unknown"}}',
			graphql: () => assert.fail(),
		}),
		/Unknown/,
	);
});

test("GitHub HTTP and GraphQL errors are not interpreted as an empty list", async () => {
	await assert.rejects(
		createGraphql("test", async () => ({ ok: false, status: 403 }))(
			"query",
			{},
		),
		/403/,
	);
	await assert.rejects(
		createGraphql("test", async () => ({
			ok: true,
			json: async () => ({ errors: [{ message: "denied" }] }),
		}))("query", {}),
		/denied/,
	);
});
