import { getAllPosts } from "@/lib/posts";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();

	const postUrls = posts.map((post) => ({
		url: `https://blog.kzhrk.com/posts${post.path}`,
		lastModified: new Date(post.date),
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}));

	return [
		{
			url: "https://blog.kzhrk.com",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...postUrls,
	];
}
