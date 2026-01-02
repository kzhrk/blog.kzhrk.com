import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/constants";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostList } from "./PostList";

export const dynamic = "force-static";

export const metadata: Metadata = {
	alternates: {
		canonical: SITE_URL,
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
