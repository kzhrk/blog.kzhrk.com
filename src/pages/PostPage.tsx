import { Link } from "@tanstack/react-router";
import { TweetButton } from "@/components/TweetButton";
import { SITE_URL } from "@/lib/constants";
import type { PostPageData } from "@/lib/posts.functions";
import "highlight.js/styles/github-dark.css";
import tagChip from "@/components/TagChip.module.css";
import typography from "@/styles/typography.module.css";
import styles from "./PostPage.module.css";

export function PostPage({ post }: { post: PostPageData }) {
	const url = `${SITE_URL}/posts/${post.slug}`;
	const dateTimeValue =
		typeof post.metadata.date === "string"
			? post.metadata.date
			: post.metadata.date.toISOString().split("T")[0];

	return (
		<article className={styles.post}>
			<Link className={styles.postBack} to="/">
				← 一覧へ戻る
			</Link>

			<header className={styles.postHead}>
				<div className={styles.postMeta}>
					<time className={typography.metaEn} dateTime={dateTimeValue}>
						{post.formattedDate}
					</time>
				</div>
				<h1 className={styles.postTitle}>{post.metadata.title}</h1>
				{post.metadata.tags && post.metadata.tags.length > 0 && (
					<div className={styles.postTags}>
						{post.metadata.tags.map((tag) => (
							<Link
								key={tag}
								to="/"
								search={{ tag }}
								className={tagChip.tagChip}
							>
								<span className={tagChip.tagChipHash}>#</span>
								{tag}
							</Link>
						))}
					</div>
				)}
			</header>

			<div
				className={`${styles.postBody} ${styles.html}`}
				// HTML is generated from markdown
				dangerouslySetInnerHTML={{ __html: post.html }}
			/>

			<div className={styles.postFooter}>
				<TweetButton url={url} text={post.metadata.title} />
			</div>
		</article>
	);
}
