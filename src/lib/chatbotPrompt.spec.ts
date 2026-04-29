import { describe, expect, it } from "vitest";
import type { ChatbotCorpusEntry } from "./chatbotCorpus";
import {
	buildArticlesBlock,
	buildIndexBlock,
	buildInitialPrompts,
	SYSTEM_PROMPT,
} from "./chatbotPrompt";

function makeEntry(
	overrides: Partial<ChatbotCorpusEntry> = {},
): ChatbotCorpusEntry {
	return {
		slug: "2025/01/01/sample",
		path: "/2025/01/01/sample",
		title: "サンプル",
		date: "2025-01-01",
		formattedDate: "2025年1月1日",
		tags: ["test"],
		description: "概要文",
		body: "本文",
		...overrides,
	};
}

describe("chatbotPrompt", () => {
	describe("buildIndexBlock", () => {
		it("全記事の見出し情報を1行ずつ返す", () => {
			const corpus = [
				makeEntry({ title: "A", date: "2025-01-01", tags: ["x"] }),
				makeEntry({ title: "B", date: "2024-12-31", tags: [] }),
			];
			const result = buildIndexBlock(corpus);
			expect(result).toContain("A (2025-01-01)");
			expect(result).toContain("B (2024-12-31)");
			expect(result).toContain("[x]");
		});
	});

	describe("buildArticlesBlock", () => {
		it("関連記事の本文を含むブロックを生成する", () => {
			const result = buildArticlesBlock([
				makeEntry({ title: "サンプル", body: "本文だよ" }),
			]);
			expect(result).toContain("サンプル");
			expect(result).toContain("本文だよ");
		});

		it("空の場合はヒット無しメッセージを返す", () => {
			const result = buildArticlesBlock([]);
			expect(result).toContain("見つかりませんでした");
		});
	});

	describe("buildInitialPrompts", () => {
		it("system → user → assistant の順で構成される", () => {
			const corpus = [makeEntry()];
			const result = buildInitialPrompts(corpus, corpus);
			expect(result[0].role).toBe("system");
			expect(result[0].content).toBe(SYSTEM_PROMPT);
			expect(result[1].role).toBe("user");
			expect(result[2].role).toBe("assistant");
		});

		it("user メッセージに index と関連記事の両方が含まれる", () => {
			const corpus = [makeEntry({ title: "全件タイトル" })];
			const related = [makeEntry({ title: "関連タイトル", body: "関連本文" })];
			const result = buildInitialPrompts(corpus, related);
			expect(result[1].content).toContain("全件タイトル");
			expect(result[1].content).toContain("関連タイトル");
			expect(result[1].content).toContain("関連本文");
		});
	});
});
