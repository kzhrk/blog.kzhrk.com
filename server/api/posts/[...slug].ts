import { readFileSync } from "node:fs";
import { parse } from "marked";
import parseMD from "parse-md";

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "slug");
	const path = `./posts/${slug}.md`;
	const file = readFileSync(path);
	const { metadata, content } = parseMD(file.toString()) as {
		metadata: Metadata;
		content: string;
	};
	const html = parse(content);
	return {
		...metadata,
		html,
	};
});
