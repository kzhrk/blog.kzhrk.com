import { existsSync } from "node:fs";
import { readFile, readdir, watch } from "node:fs/promises";
import { marked } from "marked";
import parseMD from "parse-md";

interface CachedPost {
	metadata: Metadata;
	content: string;
	html: string;
	path: string;
}

interface PostSummary extends Metadata {
	path: string;
}

class PostCache {
	private cache = new Map<string, CachedPost>();
	private tagsCache: string[] | null = null;
	private postsCache: PostSummary[] | null = null;
	private isWatching = false;

	private async initializeWatcher() {
		if (this.isWatching) return;
		this.isWatching = true;

		try {
			const watcher = watch("./posts");
			for await (const event of watcher) {
				this.invalidateCache();
			}
		} catch (error) {
			console.warn("Could not watch posts directory:", error);
		}
	}

	private invalidateCache() {
		this.cache.clear();
		this.tagsCache = null;
		this.postsCache = null;
	}

	async getPost(filename: string): Promise<CachedPost | null> {
		if (this.cache.has(filename)) {
			const cachedPost = this.cache.get(filename);
			return cachedPost || null;
		}

		try {
			const filePath = `./posts/${filename}.md`;
			if (!existsSync(filePath)) return null;

			const file = await readFile(filePath, "utf-8");
			const { metadata, content } = parseMD(file) as {
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

			const html = await marked.parse(content);
			const path = `${filename}.md`.replace(
				/(\d+)-(\d+)-(\d+)-([\w|-]+)\.md/,
				"/$1/$2/$3/$4",
			);

			const cachedPost: CachedPost = {
				metadata,
				content,
				html,
				path,
			};

			this.cache.set(filename, cachedPost);
			this.initializeWatcher();
			return cachedPost;
		} catch (error) {
			console.error(`Error reading post ${filename}:`, error);
			return null;
		}
	}

	async getAllPosts(): Promise<PostSummary[]> {
		if (this.postsCache) {
			return this.postsCache;
		}

		try {
			const files = await readdir("./posts");
			const posts = [];

			for (const file of files.reverse()) {
				if (!file.endsWith(".md")) continue;

				const filename = file.replace(".md", "");
				const post = await this.getPost(filename);

				if (post && !post.metadata.draft) {
					posts.push({
						...post.metadata,
						path: post.path,
					});
				}
			}

			this.postsCache = posts;
			return posts;
		} catch (error) {
			console.error("Error reading posts directory:", error);
			return [];
		}
	}

	async getAllTags(): Promise<string[]> {
		if (this.tagsCache) {
			return this.tagsCache;
		}

		const posts = await this.getAllPosts();
		const tagSet = new Set<string>();

		for (const post of posts) {
			if (post.tags) {
				for (const tag of post.tags) {
					tagSet.add(tag);
				}
			}
		}

		this.tagsCache = Array.from(tagSet);
		return this.tagsCache;
	}
}

export const postCache = new PostCache();
