"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { PostInfo } from "@/components/PostInfo";
import { css } from "@/styled-system/css";
import type { PostSummary } from "@/types";

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
			<div
				className={css({
					display: "flex",
					gap: "2",
					alignItems: "center",
					px: "6",
					sm: { px: "12" },
					my: "6",
				})}
			>
				<label
					htmlFor="category-select"
					className={css({ fontWeight: "bold" })}
				>
					絞り込みタグ:
				</label>
				<select
					id="category-select"
					className={css({
						p: "2",
						bg: "gray.100",
						color: "black",
						border: "1px solid",
						borderColor: "gray.400",
					})}
					style={{ colorScheme: "light" }}
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
				<section
					key={post.slug}
					className={css({ px: "6", sm: { px: "12" }, my: "12" })}
				>
					<h2 className={css({ fontSize: "2xl" })}>
						<Link className="link" href={`/posts${post.path}`}>
							{post.title}
						</Link>
					</h2>
					<div
						className={css({ mt: "2", display: "flex", alignItems: "center" })}
					>
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
