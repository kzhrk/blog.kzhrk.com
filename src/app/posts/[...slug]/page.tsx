import { PostInfo } from "@/components/PostInfo";
import { getAllPosts, getDescription, getPost } from "@/lib/posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

	const title = `${post.metadata.title} | blog.kzhrk.com`;
	const description = getDescription(post.content);
	const url = `https://blog.kzhrk.com/posts/${slugPath}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url,
		},
		twitter: {
			title,
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

	const url = `https://blog.kzhrk.com/posts/${slugPath}`;

	return (
		<section className="px-10 py-12 sm:p-12">
			<h1 className="mb-4 text-3xl font-bold">{post.metadata.title}</h1>
			<div className="mb-10 flex items-center">
				<PostInfo
					date={post.metadata.date}
					tags={post.metadata.tags}
					formattedDate={post.formattedDate}
				/>
			</div>
			<div
				className="html"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is generated from markdown
				dangerouslySetInnerHTML={{ __html: post.html }}
			/>
			<div className="mt-8">
				<a
					className="twitter-share-button"
					href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.metadata.title)}`}
				>
					Tweet
				</a>
			</div>
		</section>
	);
}
