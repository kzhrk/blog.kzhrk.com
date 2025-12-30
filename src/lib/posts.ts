import { readdir, readFile } from "node:fs/promises";
import { format, parseISO } from "date-fns";
import matter from "gray-matter";
import { cache } from "react";
import type { Metadata, Post, PostSummary } from "@/types";
import { parseMarkdown } from "./markdown";

function filenameToSlug(filename: string): string {
	return filename
		.replace(/\.md$/, "")
		.replace(/(\d+)-(\d+)-(\d+)-([\w|-]+)/, "$1/$2/$3/$4");
}

function slugToFilename(slug: string): string {
	return slug.replace(/\//g, "-");
}

function formatDate(dateValue: string | Date): string {
	const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;
	return format(date, "yyyy年M月d日");
}

export const getPost = cache(async (slug: string): Promise<Post | null> => {
	const filename = slugToFilename(slug);
	const filePath = `./posts/${filename}.md`;

	try {
		const file = await readFile(filePath, "utf-8");
		const { data, content } = matter(file);
		const metadata = data as Metadata;

		const html = await parseMarkdown(content);
		const path = `/${slug}`;

		return {
			metadata,
			content,
			html,
			path,
			slug,
			formattedDate: formatDate(metadata.date),
		};
	} catch {
		return null;
	}
});

export const getAllPosts = cache(async (): Promise<PostSummary[]> => {
	try {
		const files = await readdir("./posts");
		const posts: PostSummary[] = [];

		for (const file of files.reverse()) {
			if (!file.endsWith(".md")) continue;

			const filePath = `./posts/${file}`;
			const fileContent = await readFile(filePath, "utf-8");
			const { data } = matter(fileContent);
			const metadata = data as Metadata;

			if (metadata.draft) continue;

			const slug = filenameToSlug(file);
			posts.push({
				...metadata,
				path: `/${slug}`,
				slug,
				formattedDate: formatDate(metadata.date),
			});
		}

		return posts;
	} catch (error) {
		console.error("Error reading posts directory:", error);
		return [];
	}
});

export const getAllTags = cache(async (): Promise<string[]> => {
	const posts = await getAllPosts();
	const tagSet = new Set<string>();

	for (const post of posts) {
		if (post.tags) {
			for (const tag of post.tags) {
				tagSet.add(tag);
			}
		}
	}

	return Array.from(tagSet);
});

export function getDescription(content: string): string {
	return `${content
		.replace(/##(#+)?\s/g, "")
		.replace(/```(\w+)?(\r\n|\n|\r)/g, "")
		.substring(0, 100)}...`;
}
