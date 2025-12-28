"use client";

import { PostInfo } from "@/components/PostInfo";
import type { PostSummary } from "@/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface PostListProps {
	posts: PostSummary[];
	tags: string[];
}

export function PostList({ posts, tags }: PostListProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedTag = searchParams.get("tag") || "";

	const tagOptions = useMemo(
		() => [
			{ label: "未選択", value: "" },
			...tags.map((t) => ({ label: t, value: t })),
		],
		[tags],
	);

	const filteredPosts = useMemo(
		() =>
			selectedTag
				? posts.filter((post) => post.tags?.includes(selectedTag))
				: posts,
		[posts, selectedTag],
	);

	const onChangeTag = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const tag = e.target.value;
			const params = new URLSearchParams(searchParams);
			if (tag) {
				params.set("tag", tag);
			} else {
				params.delete("tag");
			}
			router.push(`/?${params.toString()}`);
		},
		[router, searchParams],
	);

	return (
		<>
			<div className="flex gap-x-2 items-center px-6 sm:px-12 my-6">
				<label htmlFor="category-select" className="font-bold">
					絞り込みタグ:
				</label>
				<select
					id="category-select"
					className="p-2 bg-gray-100 border border-gray-400 dark:text-gray-900"
					value={selectedTag}
					onChange={onChangeTag}
				>
					{tagOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
			{filteredPosts.map((post) => (
				<section key={post.slug} className="px-6 sm:px-12 my-12">
					<h2 className="text-2xl">
						<Link
							className="link underline hover:no-underline"
							href={`/posts${post.path}`}
						>
							{post.title}
						</Link>
					</h2>
					<div className="mt-2 flex items-center">
						<PostInfo
							date={post.date}
							tags={post.tags}
							formattedDate={post.formattedDate}
						/>
					</div>
				</section>
			))}
		</>
	);
}
