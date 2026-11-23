import { Link } from "@tanstack/react-router";
import { TweetButton } from "@/components/TweetButton";
import { SITE_URL } from "@/lib/constants";
import type { PostPageData } from "@/lib/posts.functions";

export function PostPage({ post }: { post: PostPageData }) {
	const url = `${SITE_URL}/posts/${post.slug}`;
	const dateTimeValue =
		typeof post.metadata.date === "string"
			? post.metadata.date
			: post.metadata.date.toISOString().split("T")[0];

	return (
		<article className="post">
			<Link className="post__back" to="/">
				← 一覧へ戻る
			</Link>

			<header className="post__head">
				<div className="post__meta">
					<time className="meta-en" dateTime={dateTimeValue}>
						{post.formattedDate}
					</time>
				</div>
				<h1 className="post__title">{post.metadata.title}</h1>
				{post.metadata.tags && post.metadata.tags.length > 0 && (
					<div className="post__tags">
						{post.metadata.tags.map((tag) => (
							<Link key={tag} to="/" search={{ tag }} className="tag-chip">
								<span className="tag-chip__hash">#</span>
								{tag}
							</Link>
						))}
					</div>
				)}
			</header>

			<div
				className="post__body html"
				// HTML is generated from markdown
				dangerouslySetInnerHTML={{ __html: post.html }}
			/>

			<div className="post__footer">
				<TweetButton url={url} text={post.metadata.title} />
			</div>
		</article>
	);
}
