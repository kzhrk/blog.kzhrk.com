import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TweetButton } from "@/components/TweetButton";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getAllPosts, getDescription, getPost } from "@/lib/posts";

interface PageProps {
	params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
	const posts = await getAllPosts();
	return posts.map((post) => ({
		slug: post.slug.split("/"),
	}));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const slugPath = slug.join("/");
	const post = await getPost(slugPath);

	if (!post) {
		return {};
	}

	const title = `${post.metadata.title} | ${SITE_NAME}`;
	const description = getDescription(post.content);
	const url = `${SITE_URL}/posts/${slugPath}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url,
			images: [{ url: "https://blog.kzhrk.com/images/ogp.png" }],
		},
		twitter: {
			card: "summary_large_image",
			title,
			images: ["https://blog.kzhrk.com/images/ogp.png"],
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function PostPage({ params }: PageProps) {
	const { slug } = await params;
	const slugPath = slug.join("/");
	const post = await getPost(slugPath);

	if (!post) {
		notFound();
	}

	const url = `${SITE_URL}/posts/${slugPath}`;
	const dateTimeValue =
		typeof post.metadata.date === "string"
			? post.metadata.date
			: post.metadata.date.toISOString().split("T")[0];

	return (
		<article className="post">
			<Link className="post__back" href="/">
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
							<Link
								key={tag}
								href={`/?tag=${encodeURIComponent(tag)}`}
								className="tag-chip"
							>
								<span className="tag-chip__hash">#</span>
								{tag}
							</Link>
						))}
					</div>
				)}
			</header>

			<div
				className="post__body html"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is generated from markdown
				dangerouslySetInnerHTML={{ __html: post.html }}
			/>

			<div className="post__footer">
				<TweetButton url={url} text={post.metadata.title} />
			</div>
		</article>
	);
}
