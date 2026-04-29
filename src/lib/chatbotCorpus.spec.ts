import { describe, expect, it } from "vitest";
import { buildChatbotCorpus, stripMarkdown } from "./chatbotCorpus";

describe("chatbotCorpus", () => {
	describe("stripMarkdown", () => {
		it("コードブロックを除去する", () => {
			const input = "本文\n```ts\nconst x = 1;\n```\n続き";
			const result = stripMarkdown(input);
			expect(result).not.toContain("const");
			expect(result).toContain("本文");
			expect(result).toContain("続き");
		});

		it("画像記法を除去する", () => {
			const input = "前 ![alt](https://example.com/x.png) 後";
			const result = stripMarkdown(input);
			expect(result).not.toContain("example.com");
			expect(result).toContain("前");
			expect(result).toContain("後");
		});

		it("リンクはテキスト部分だけ残す", () => {
			const input = "[ブログ](https://blog.kzhrk.com)を見る";
			const result = stripMarkdown(input);
			expect(result).toContain("ブログ");
			expect(result).not.toContain("https://");
		});

		it("見出しの#記号を除去する", () => {
			const input = "# タイトル\n## 見出し2";
			const result = stripMarkdown(input);
			expect(result).not.toContain("#");
			expect(result).toContain("タイトル");
			expect(result).toContain("見出し2");
		});

		it("インラインコードを除去する", () => {
			const input = "値は `foo` です";
			const result = stripMarkdown(input);
			expect(result).not.toContain("foo");
			expect(result).toContain("値は");
		});
	});

	describe("buildChatbotCorpus (統合テスト)", () => {
		it("記事を読み込めて、必須フィールドが揃う", async () => {
			const corpus = await buildChatbotCorpus();

			expect(corpus.length).toBeGreaterThan(0);
			const entry = corpus[0];
			expect(entry.slug).toBeDefined();
			expect(entry.title).toBeDefined();
			expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			expect(entry.formattedDate).toBeDefined();
			expect(Array.isArray(entry.tags)).toBe(true);
			expect(entry.body).toBeDefined();
		});

		it("本文に markdown 記号が残らない", async () => {
			const corpus = await buildChatbotCorpus();
			for (const entry of corpus) {
				expect(entry.body).not.toContain("```");
			}
		});

		it("日付の降順で並ぶ", async () => {
			const corpus = await buildChatbotCorpus();
			for (let i = 0; i < corpus.length - 1; i++) {
				expect(corpus[i].date >= corpus[i + 1].date).toBe(true);
			}
		});
	});
});
