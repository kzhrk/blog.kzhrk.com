import { readFileSync, readdirSync } from "node:fs";
import parseMD from "parse-md";

export default defineEventHandler(async () => {
	const posts = readdirSync("./posts").reverse();
	const result = new Set();

	for (const post of posts) {
		const file = readFileSync(`./posts/${post}`);
		const { metadata } = parseMD(file.toString()) as { metadata: Metadata };
		const tags = metadata.tags;

		if (tags) {
			for (const tag of tags) {
				result.add(tag);
			}
		}
	}
	return [...result];
});
