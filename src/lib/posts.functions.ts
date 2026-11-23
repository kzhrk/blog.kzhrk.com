import { createServerFn } from "@tanstack/react-start";
import { getAllPosts, getAllTags, getDescription, getPost } from "./posts";

// loader はクライアント遷移時にブラウザでも実行される。
// Markdown の解析（gray-matter / marked / highlight.js）をクライアントに含めないよう、
// 記事データの取得はサーバー関数に閉じ込める。

export const fetchPostIndex = createServerFn({ method: "GET" }).handler(
	async () => {
		const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
		return { posts, tags };
	},
);

export const fetchPost = createServerFn({ method: "GET" })
	.validator((slug: string) => slug)
	.handler(async ({ data: slug }) => {
		const post = await getPost(slug);
		if (!post) return null;

		const { content, ...rest } = post;
		return { ...rest, description: getDescription(content) };
	});

export type PostPageData = NonNullable<Awaited<ReturnType<typeof fetchPost>>>;
