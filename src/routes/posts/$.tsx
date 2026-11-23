import { createFileRoute, notFound } from "@tanstack/react-router";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { fetchPost } from "@/lib/posts.functions";
import { PostPage } from "@/pages/PostPage";

const OGP_IMAGE = `${SITE_URL}/images/ogp.png`;

export const Route = createFileRoute("/posts/$")({
	loader: async ({ params }) => {
		const post = await fetchPost({ data: params._splat ?? "" });
		if (!post) throw notFound();
		return post;
	},
	head: ({ loaderData: post }) => {
		if (!post) return {};

		const title = `${post.metadata.title} | ${SITE_NAME}`;
		const url = `${SITE_URL}/posts/${post.slug}`;

		return {
			meta: [
				{ title },
				{ name: "description", content: post.description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: post.description },
				{ property: "og:url", content: url },
				{ property: "og:image", content: OGP_IMAGE },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:image", content: OGP_IMAGE },
			],
			links: [{ rel: "canonical", href: url }],
		};
	},
	component: PostRoute,
});

function PostRoute() {
	const post = Route.useLoaderData();
	return <PostPage post={post} />;
}
