import { getAllPosts, getAllTags } from "@/lib/posts";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PostList } from "./PostList";

export const dynamic = "force-static";

export const metadata: Metadata = {
	alternates: {
		canonical: "https://blog.kzhrk.com",
	},
};

export default async function HomePage() {
	const [allPosts, allTags] = await Promise.all([getAllPosts(), getAllTags()]);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PostList posts={allPosts} tags={allTags} />
		</Suspense>
	);
}
