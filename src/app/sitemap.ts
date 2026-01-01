import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();

	const postUrls = posts.map((post) => ({
		url: `${SITE_URL}/posts${post.path}`,
		lastModified: new Date(post.date),
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}));

	return [
		{
			url: SITE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...postUrls,
	];
}
