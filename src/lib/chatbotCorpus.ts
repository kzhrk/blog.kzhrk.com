import { readdir, readFile } from "node:fs/promises";
import { format, parseISO } from "date-fns";
import matter from "gray-matter";
import { cache } from "react";
import type { Metadata } from "@/types";

export interface ChatbotCorpusEntry {
	slug: string;
	path: string;
	title: string;
	date: string;
	formattedDate: string;
	tags: string[];
	description: string;
	body: string;
}

const MAX_BODY_LENGTH = 4000;

export function stripMarkdown(content: string): string {
	return content
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^\s*[-*+]\s+/gm, "")
		.replace(/^\s*\d+\.\s+/gm, "")
		.replace(/[*_~]+/g, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function buildDescription(body: string): string {
	if (body.length <= 120) return body;
	return `${body.slice(0, 120)}…`;
}

function filenameToSlug(filename: string): string {
	return filename
		.replace(/\.md$/, "")
		.replace(/(\d+)-(\d+)-(\d+)-([\w|-]+)/, "$1/$2/$3/$4");
}

function formatDate(value: string | Date): string {
	const date = typeof value === "string" ? parseISO(value) : value;
	return format(date, "yyyy年M月d日");
}

function toIsoDate(value: string | Date): string {
	const date = typeof value === "string" ? parseISO(value) : value;
	return format(date, "yyyy-MM-dd");
}

export const buildChatbotCorpus = cache(
	async (): Promise<ChatbotCorpusEntry[]> => {
		const files = await readdir("./posts");
		const entries: ChatbotCorpusEntry[] = [];

		for (const file of files) {
			if (!file.endsWith(".md")) continue;

			const fileContent = await readFile(`./posts/${file}`, "utf-8");
			const { data, content } = matter(fileContent);
			const metadata = data as Metadata;

			if (metadata.draft) continue;

			const slug = filenameToSlug(file);
			const stripped = stripMarkdown(content);
			const body =
				stripped.length > MAX_BODY_LENGTH
					? stripped.slice(0, MAX_BODY_LENGTH)
					: stripped;

			entries.push({
				slug,
				path: `/${slug}`,
				title: metadata.title,
				date: toIsoDate(metadata.date),
				formattedDate: formatDate(metadata.date),
				tags: metadata.tags ?? [],
				description: metadata.summary?.trim() || buildDescription(stripped),
				body,
			});
		}

		entries.sort((a, b) => (a.date < b.date ? 1 : -1));
		return entries;
	},
);
