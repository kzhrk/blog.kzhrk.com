import { postCache } from "~/server/utils/postCache";

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "slug");
	const post = await postCache.getPost(slug);

	if (!post) {
		throw createError({
			statusCode: 404,
			statusMessage: "Post not found",
		});
	}

	const description = `${post.content
		.replace(/##(#+)?\s/g, "")
		.replace(/```(\w+)?(\r\n|\n|\r)/g, "")
		.substring(0, 100)}...`;

	return {
		...post.metadata,
		html: post.html,
		description,
	};
});
