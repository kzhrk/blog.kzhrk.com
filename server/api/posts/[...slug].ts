import { readFileSync } from "node:fs";
import { marked } from "marked";
import parseMD from "parse-md";

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "slug");
	const path = `./posts/${slug}.md`;
	const file = readFileSync(path);
	const { metadata, content } = parseMD(file.toString()) as {
		metadata: Metadata;
		content: string;
	};

	marked.use({
		renderer: {
			heading({ depth, text }) {
				const tag = `h${depth}`;
				return `<${tag} id="${text}" class="heading">${text}<a href="#${text}" class="heading-anchor-icon" aria-hidden="true">アンカーリンク</a></${tag}>`;
			},
			link({ text, href }) {
				return `<a href="${href}" class="link">${text}</a>`;
			},
		},
	});

	const description = `${content
		.replace(/##(#+)?\s/g, "")
		.replace(/```(\w+)?(\r\n|\n|\r)/g, "")
		.substring(0, 100)}...`;

	return {
		...metadata,
		html: marked.parse(content),
		description,
	};
});
