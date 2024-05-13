import { readFileSync, statSync } from "node:fs";
import { parse, Renderer } from "marked";
import parseMD from "parse-md";

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "slug");
	const path = `./posts/${slug}.md`;
	const file = readFileSync(path);
	const stat = statSync(path);

	const { metadata, content } = parseMD(file.toString()) as {
		metadata: Metadata;
		content: string;
	};
	const renderer = new Renderer();
	renderer.heading = (text, level) => {
		const tag = `h${level}`;
		return `<${tag} id="${text}" class="heading">${text}<a href="#${text}" class="heading-anchor-icon" aria-hidden="true">アンカーリンク</a></${tag}>`;
	};
	renderer.link = (href, _title, text) => {
		return `<a href="${href}" class="link">${text}</a>`;
	};
	const html = parse(content, {
		renderer,
	});
	const description = `${content
		.replace(/##(#+)?\s/g, "")
		.replace(/```(\w+)?(\r\n|\n|\r)/g, "")
		.substring(0, 100)}...`;
	return {
		...metadata,
		createdAt: metadata.date,
		updatedAt: stat.mtime,
		html,
		description,
	};
});
