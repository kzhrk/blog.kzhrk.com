import { describe, expect, it } from "vitest";
import { getAllPosts, getAllTags, getDescription, getPost } from "./posts";

describe("posts", () => {
	describe("getDescription", () => {
		it("コンテンツから説明文を生成できる", () => {
			const content = "これはテスト記事の本文です。";

			const description = getDescription(content);

			expect(description).toBe("これはテスト記事の本文です。...");
		});

		it("見出しのマークダウン記法を除去する", () => {
			const content = "## 見出し\n本文テキスト";

			const description = getDescription(content);

			expect(description).not.toContain("##");
			expect(description).toContain("見出し");
		});

		it("複数レベルの見出しを除去する", () => {
			const content = "### 見出し3\n#### 見出し4\n本文";

			const description = getDescription(content);

			expect(description).not.toContain("###");
			expect(description).not.toContain("####");
		});

		it("コードブロックの開始記法を除去する", () => {
			const content = "```typescript\nconst x = 1;\n```";

			const description = getDescription(content);

			expect(description).not.toContain("```typescript");
		});

		it("言語指定なしのコードブロックも処理する", () => {
			const content = "```\ncode\n```";

			const description = getDescription(content);

			expect(description).not.toContain("```\n");
		});

		it("100文字を超える場合は切り詰める", () => {
			const content = "あ".repeat(150);

			const description = getDescription(content);

			expect(description).toBe("あ".repeat(100) + "...");
		});

		it("ちょうど100文字の場合も省略記号が付く", () => {
			const content = "あ".repeat(100);

			const description = getDescription(content);

			expect(description).toBe("あ".repeat(100) + "...");
		});

		it("空文字列の場合は省略記号のみ返す", () => {
			const content = "";

			const description = getDescription(content);

			expect(description).toBe("...");
		});
	});

	describe("getPost (統合テスト)", () => {
		it("存在するスラッグで記事を取得できる", async () => {
			const post = await getPost("2024/05/05/replace-hugo-to-nuxt");

			expect(post).not.toBeNull();
			expect(post?.metadata.title).toBe("SSG を Hugo から Nuxt に置き換えた");
			expect(post?.slug).toBe("2024/05/05/replace-hugo-to-nuxt");
		});

		it("存在しないスラッグの場合はnullを返す", async () => {
			const post = await getPost("9999/99/99/not-exist");

			expect(post).toBeNull();
		});

		it("記事のHTMLが生成される", async () => {
			const post = await getPost("2024/05/05/replace-hugo-to-nuxt");

			expect(post?.html).toContain("<p>");
			expect(post?.html).toContain("</p>");
		});

		it("日付がフォーマットされる", async () => {
			const post = await getPost("2024/05/05/replace-hugo-to-nuxt");

			expect(post?.formattedDate).toBe("2024年5月5日");
		});
	});

	describe("getAllPosts (統合テスト)", () => {
		it("投稿一覧を取得できる", async () => {
			const posts = await getAllPosts();

			expect(posts.length).toBeGreaterThan(0);
		});

		it("各投稿に必須フィールドがある", async () => {
			const posts = await getAllPosts();
			const post = posts[0];

			expect(post.title).toBeDefined();
			expect(post.date).toBeDefined();
			expect(post.path).toBeDefined();
			expect(post.slug).toBeDefined();
			expect(post.formattedDate).toBeDefined();
		});

		it("下書き記事は含まれない", async () => {
			const posts = await getAllPosts();

			for (const post of posts) {
				expect(post.draft).not.toBe(true);
			}
		});

		it("パスが正しい形式である", async () => {
			const posts = await getAllPosts();

			for (const post of posts) {
				expect(post.path).toMatch(/^\/\d{4}\/\d{2}\/\d{2}\/[\w-]+$/);
			}
		});
	});

	describe("getAllTags (統合テスト)", () => {
		it("タグ一覧を取得できる", async () => {
			const tags = await getAllTags();

			expect(tags.length).toBeGreaterThan(0);
		});

		it("タグに重複がない", async () => {
			const tags = await getAllTags();
			const uniqueTags = [...new Set(tags)];

			expect(tags).toEqual(uniqueTags);
		});

		it("タグは文字列の配列である", async () => {
			const tags = await getAllTags();

			for (const tag of tags) {
				expect(typeof tag).toBe("string");
			}
		});
	});
});
