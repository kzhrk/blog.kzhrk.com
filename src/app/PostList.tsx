"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { PostSummary } from "@/types";

interface PostListProps {
	posts: PostSummary[];
	tags: string[];
}

type YearGroup = [string, PostSummary[]];

function getDateParts(date: string | Date) {
	const d = typeof date === "string" ? new Date(date) : date;
	const year = String(d.getFullYear());
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return { year, month, day };
}

function groupByYear(posts: PostSummary[]): YearGroup[] {
	const groups = new Map<string, PostSummary[]>();
	for (const p of posts) {
		const { year } = getDateParts(p.date);
		if (!groups.has(year)) groups.set(year, []);
		groups.get(year)?.push(p);
	}
	return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

function getTagCounts(posts: PostSummary[]): Map<string, number> {
	const counts = new Map<string, number>();
	for (const p of posts) {
		if (!p.tags) continue;
		for (const t of p.tags) {
			counts.set(t, (counts.get(t) ?? 0) + 1);
		}
	}
	return counts;
}

export function PostList({ posts, tags }: PostListProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedTag = searchParams.get("tag") || "";

	const sortedPosts = useMemo(
		() =>
			posts
				.slice()
				.sort((a, b) => String(b.date).localeCompare(String(a.date))),
		[posts],
	);

	const filteredPosts = useMemo(
		() =>
			selectedTag
				? sortedPosts.filter((post) => post.tags?.includes(selectedTag))
				: sortedPosts,
		[sortedPosts, selectedTag],
	);

	const yearGroups = useMemo(() => groupByYear(filteredPosts), [filteredPosts]);
	const tagCounts = useMemo(() => getTagCounts(sortedPosts), [sortedPosts]);

	const setTag = useCallback(
		(tag: string) => {
			const params = new URLSearchParams(searchParams);
			if (tag) params.set("tag", tag);
			else params.delete("tag");
			const qs = params.toString();
			router.push(qs ? `/?${qs}` : "/");
		},
		[router, searchParams],
	);

	return (
		<main className="page">
			<div className="filterbar">
				<div className="filterbar__row">
					<div className="filterbar__label">
						<span className="meta-en">Filter</span>
					</div>
					<div className="filterbar__tags">
						<button
							type="button"
							className={`tag-chip ${!selectedTag ? "is-active" : ""}`}
							onClick={() => setTag("")}
						>
							All <span className="tag-chip__count">{sortedPosts.length}</span>
						</button>
						{tags.map((t) => {
							const active = selectedTag === t;
							return (
								<button
									type="button"
									key={t}
									className={`tag-chip ${active ? "is-active" : ""}`}
									onClick={() => setTag(active ? "" : t)}
								>
									<span className="tag-chip__hash">#</span>
									{t}
									<span className="tag-chip__count">
										{tagCounts.get(t) ?? 0}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{filteredPosts.length === 0 ? (
				<div className="empty">No entries.</div>
			) : (
				<div className="home-a">
					{yearGroups.map(([year, items]) => (
						<section className="year-block" key={year}>
							<div className="year-block__head">
								<h2 className="year-block__y">{year}</h2>
								<span className="year-block__count meta-en">
									{items.length} {items.length === 1 ? "entry" : "entries"}
								</span>
								<div className="year-block__line" />
							</div>
							<div className="year-block__items">
								{items.map((p) => {
									const { year: y, month, day } = getDateParts(p.date);
									return (
										<Link
											key={p.slug}
											className="row-a"
											href={`/posts${p.path}`}
										>
											<div className="row-a__date">
												<span className="row-a__day">{day}</span>
												<span className="row-a__mo">
													{y}/{month}
												</span>
											</div>
											<div className="row-a__body">
												<h3 className="row-a__title">{p.title}</h3>
												<div className="row-a__meta">
													{p.tags && p.tags.length > 0 && (
														<span className="row-a__tags">
															{p.tags.map((t) => (
																<span key={t} className="row-a__tag">
																	#{t}
																</span>
															))}
														</span>
													)}
												</div>
											</div>
											<div className="row-a__arrow" aria-hidden>
												→
											</div>
										</Link>
									);
								})}
							</div>
						</section>
					))}
				</div>
			)}
		</main>
	);
}
