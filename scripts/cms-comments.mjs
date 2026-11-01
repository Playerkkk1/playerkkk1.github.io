import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPOSITORY = "Playerkkk1/playerkkk1.github.io";
export const CATEGORY_ID = "DIC_kwDOVcoxZs4DKJC0";
const DIRECTORY = "cms/comments";
const COMMENT_FIELDS =
	"id body createdAt updatedAt url author { login } deletedAt";

export function createGraphql(token, fetcher = fetch) {
	if (!token) throw new Error("A workflow GitHub token is required.");
	return async (query, variables) => {
		const response = await fetcher("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				authorization: `Bearer ${token}`,
				"content-type": "application/json",
				"user-agent": "Firefly-CMS-Comments",
			},
			body: JSON.stringify({ query, variables }),
			signal: AbortSignal.timeout(30000),
		});
		if (!response.ok)
			throw new Error(`GitHub API returned ${response.status}.`);
		const result = await response.json();
		if (result.errors?.length) {
			throw new Error(result.errors.map((error) => error.message).join("; "));
		}
		return result.data;
	};
}

async function connectionPages(load) {
	const nodes = [];
	let after = null;
	do {
		const page = await load(after);
		if (!page) throw new Error("GitHub returned an incomplete comment list.");
		nodes.push(...page.nodes);
		if (!page.pageInfo.hasNextPage) return nodes;
		const cursor = page.pageInfo.endCursor;
		if (!cursor || cursor === after)
			throw new Error("Invalid pagination cursor.");
		after = cursor;
	} while (after);
	return nodes;
}

export function commentFilename(id) {
	return `${Buffer.from(id).toString("base64url")}.json`;
}

export async function fetchComments(graphql) {
	const [owner, repo] = REPOSITORY.split("/");
	const discussions = await connectionPages(async (after) => {
		const data = await graphql(
			`query Threads($owner: String!, $repo: String!, $category: ID!, $after: String) {
        repository(owner: $owner, name: $repo) {
          discussions(first: 50, after: $after, categoryId: $category) {
            nodes { id number title url }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
			{ owner, repo, category: CATEGORY_ID, after },
		);
		return data.repository?.discussions;
	});
	const records = [];
	for (const discussion of discussions) {
		const comments = await connectionPages(async (after) => {
			const data = await graphql(
				`query Comments($id: ID!, $after: String) {
          node(id: $id) { ... on Discussion {
            comments(first: 100, after: $after) {
              nodes { ${COMMENT_FIELDS} replies { totalCount } }
              pageInfo { hasNextPage endCursor }
            }
          } }
        }`,
				{ id: discussion.id, after },
			);
			return data.node?.comments;
		});
		const add = (comment, parentId = "") => {
			// GitHub retains a deleted parent as a placeholder when it has replies.
			if (comment.deletedAt) return;
			records.push({
				id: comment.id,
				thread: discussion.title,
				discussionNumber: discussion.number,
				author: comment.author?.login || "已注销用户",
				body: comment.body,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
				url: comment.url,
				kind: parentId ? "回复" : "评论",
				parentId,
			});
		};
		for (const comment of comments) {
			add(comment);
			if (!comment.replies.totalCount) continue;
			const replies = await connectionPages(async (after) => {
				const data = await graphql(
					`query Replies($id: ID!, $after: String) {
            node(id: $id) { ... on DiscussionComment {
              replies(first: 100, after: $after) {
                nodes { ${COMMENT_FIELDS} }
                pageInfo { hasNextPage endCursor }
              }
            } }
          }`,
					{ id: comment.id, after },
				);
				return data.node?.replies;
			});
			for (const reply of replies) add(reply, comment.id);
		}
	}
	return records;
}

export async function syncComments(root, graphql) {
	// Finish every API page before changing files; a failed fetch preserves the old list.
	const records = await fetchComments(graphql);
	const directory = path.join(root, DIRECTORY);
	await mkdir(directory, { recursive: true });
	const keep = new Set();
	for (const record of records) {
		const filename = commentFilename(record.id);
		keep.add(filename);
		await writeFile(
			path.join(directory, filename),
			`${JSON.stringify(record, null, 2)}\n`,
		);
	}
	for (const filename of await readdir(directory)) {
		if (/^[A-Za-z0-9_-]+\.json$/.test(filename) && !keep.has(filename)) {
			await unlink(path.join(directory, filename));
		}
	}
	return records.length;
}

export async function deleteComment(root, payload, graphql) {
	if (
		payload.source !== "pages-cms" ||
		payload.action?.name !== "delete-comment" ||
		payload.context?.type !== "entry" ||
		payload.context.name !== "comments" ||
		payload.repository?.owner !== "Playerkkk1" ||
		payload.repository?.repo !== "playerkkk1.github.io" ||
		payload.repository?.ref !== "master" ||
		!/^cms\/comments\/[A-Za-z0-9_-]+\.json$/.test(payload.context.path)
	) {
		throw new Error("Invalid CMS comment deletion request.");
	}
	// Read the current checked-in record, never a submitted ID or editable form field.
	const record = JSON.parse(
		await readFile(path.join(root, payload.context.path), "utf8"),
	);
	if (commentFilename(record.id) !== path.basename(payload.context.path)) {
		throw new Error("The comment ID does not match its file.");
	}
	const selected = payload.context.data?.content;
	if (selected?.id !== record.id || selected.updatedAt !== record.updatedAt) {
		throw new Error("The CMS view is outdated. Refresh it before deleting.");
	}
	const { node } = await graphql(
		`query DeletionTarget($id: ID!) {
      node(id: $id) { ... on DiscussionComment {
        id url updatedAt deletedAt
        discussion { repository { nameWithOwner } category { id } }
      } }
    }`,
		{ id: record.id },
	);
	if (!node || node.deletedAt) return;
	if (
		node.id !== record.id ||
		node.url !== record.url ||
		node.discussion?.repository.nameWithOwner !== REPOSITORY ||
		node.discussion?.category.id !== CATEGORY_ID
	) {
		throw new Error("The selected comment is not in this blog's category.");
	}
	if (node.updatedAt !== record.updatedAt) {
		throw new Error(
			"The comment changed. Refresh the CMS list before deleting.",
		);
	}
	await graphql(
		`mutation DeleteComment($id: ID!) {
      deleteDiscussionComment(input: { id: $id }) { clientMutationId }
    }`,
		{ id: record.id },
	);
}

export async function run({ root, payload = "", graphql }) {
	const action = payload ? JSON.parse(payload) : null;
	if (action?.action?.name === "delete-comment") {
		await deleteComment(root, action, graphql);
	} else if (action && action.action?.name !== "refresh-comments") {
		throw new Error("Unknown CMS comments action.");
	}
	return syncComments(root, graphql);
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	try {
		const count = await run({
			root: fileURLToPath(new URL("../", import.meta.url)),
			payload: process.env.CMS_ACTION_PAYLOAD,
			graphql: createGraphql(process.env.GH_TOKEN),
		});
		console.log(`CMS comment list refreshed: ${count} comments and replies.`);
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
