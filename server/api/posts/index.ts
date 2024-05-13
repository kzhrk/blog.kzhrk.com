import { readFileSync, readdirSync } from "node:fs";
import parseMD from "parse-md";
import { execSync } from "node:child_process"

export default defineEventHandler(() => {
	const posts = readdirSync("./posts").reverse();
	return posts
		.map((p) => {
			const path = p.replace(/(\d+)-(\d+)-(\d+)-([\w|-]+)\.md/, "/$1/$2/$3/$4");
			const file = readFileSync(`./posts/${p}`);
			const { metadata } = parseMD(file.toString()) as { metadata: Metadata };

			const gitLog = execSync(`git log --no-merges --pretty=format:"%ad" --date=format:"%Y/%m/%d %H:%M:%S" posts/${p}`);
			const updatedAt = gitLog.toString().split('\n')[0]; 

			if (metadata.draft) return null;

			return {
				...metadata,
				createdAt: metadata.date,
				updatedAt,	
				path,
			};
		})
		.filter((p) => p);
});
