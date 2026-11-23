import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import type { PostSummary } from "@/types";
import typography from "@/styles/typography.module.css";
import styles from "./PostList.module.css";
import tagChip from "./TagChip.module.css";

interface PostListProps {
	posts: PostSummary[];
	tags: string[];
	/** 選択中のタグ。未選択は空文字 */
	selectedTag: string;
	/** タグの切り替え。空文字で選択解除 */
	onSelectTag: (tag: string) => void;
}

type YearGroup = [string, PostSummary[]];

function getDateParts(date: string | Date) {
	const d = typeof date === "string" ? new Date(date) : date;
	const year = String(d.getFullYear());
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return { year, month, day };
}

// frontmatter の date は YAML の解析結果として Date で渡ってくる。
// String(Date) は "Sat Nov 07 2026 …" になり文字列比較では日付順にならないため、時刻で比較する。
function toTime(date: string | Date): number {
	return new Date(date).getTime();
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

export function PostList({
	posts,
	tags,
	selectedTag,
	onSelectTag,
}: PostListProps) {
	const sortedPosts = useMemo(
		() => posts.toSorted((a, b) => toTime(b.date) - toTime(a.date)),
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

	return (
		<main className={styles.page}>
			<div className={styles.filterbar}>
				<div className={styles.filterbarRow}>
					<div className={styles.filterbarLabel}>
						<span className={typography.metaEn}>Filter</span>
					</div>
					<div className={styles.filterbarTags}>
						<button
							type="button"
							className={`${tagChip.tagChip} ${!selectedTag ? tagChip.isActive : ""}`}
							onClick={() => onSelectTag("")}
						>
							All{" "}
							<span className={tagChip.tagChipCount}>{sortedPosts.length}</span>
						</button>
						{tags.map((t) => {
							const active = selectedTag === t;
							return (
								<button
									type="button"
									key={t}
									className={`${tagChip.tagChip} ${active ? tagChip.isActive : ""}`}
									onClick={() => onSelectTag(active ? "" : t)}
								>
									<span className={tagChip.tagChipHash}>#</span>
									{t}
									<span className={tagChip.tagChipCount}>
										{tagCounts.get(t) ?? 0}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{filteredPosts.length === 0 ? (
				<div className={styles.empty}>No entries.</div>
			) : (
				<div className={styles.homeA}>
					{yearGroups.map(([year, items]) => (
						<section key={year}>
							<div className={styles.yearBlockHead}>
								<h2 className={styles.yearBlockY}>{year}</h2>
								<span
									className={`${styles.yearBlockCount} ${typography.metaEn}`}
								>
									{items.length} {items.length === 1 ? "entry" : "entries"}
								</span>
								<div className={styles.yearBlockLine} />
							</div>
							<div>
								{items.map((p) => {
									const { year: y, month, day } = getDateParts(p.date);
									return (
										<Link
											key={p.slug}
											className={styles.rowA}
											to="/posts/$"
											params={{ _splat: p.slug }}
										>
											<div className={styles.rowADate}>
												<span className={styles.rowADay}>{day}</span>
												<span className={styles.rowAMo}>
													{y}/{month}
												</span>
											</div>
											<div className={styles.rowABody}>
												<h3 className={styles.rowATitle}>{p.title}</h3>
												<div className={styles.rowAMeta}>
													{p.tags && p.tags.length > 0 && (
														<span className={styles.rowATags}>
															{p.tags.map((t) => (
																<span key={t} className={styles.rowATag}>
																	#{t}
																</span>
															))}
														</span>
													)}
												</div>
											</div>
											<div className={styles.rowAArrow} aria-hidden>
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
