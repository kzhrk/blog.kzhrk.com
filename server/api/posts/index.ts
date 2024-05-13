import { readFileSync, readdirSync, statSync } from "node:fs";
import parseMD from "parse-md";

export default defineEventHandler(() => {
	const posts = readdirSync("./posts").reverse();
	return posts
		.map((p) => {
			const path = p.replace(/(\d+)-(\d+)-(\d+)-([\w|-]+)\.md/, "/$1/$2/$3/$4");
			const file = readFileSync(`./posts/${p}`);
			const stat = statSync(`./posts/${p}`);
			const { metadata } = parseMD(file.toString()) as { metadata: Metadata };

			if (metadata.draft) return null;

			return {
				...metadata,
				createdAt: metadata.date,
				updatedAt: stat.mtime,		
				path,
			};
		})
		.filter((p) => p);
});
