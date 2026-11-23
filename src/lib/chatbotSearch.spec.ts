import { describe, expect, it } from "vitest";
import type { ChatbotCorpusEntry } from "./chatbotCorpus";
import {
	extractRoles,
	scorePosts,
	searchPosts,
	tokenize,
} from "./chatbotSearch";

function makeEntry(
	overrides: Partial<ChatbotCorpusEntry> = {},
): ChatbotCorpusEntry {
	return {
		slug: "2025/01/01/sample",
		path: "/2025/01/01/sample",
		title: "サンプル記事",
		date: "2025-01-01",
		formattedDate: "2025年1月1日",
		tags: [],
		description: "",
		body: "",
		...overrides,
	};
}

describe("chatbotSearch", () => {
	describe("tokenize", () => {
		it("英数字のトークンはそのまま保持される", () => {
			expect(tokenize("nuxt 3 react")).toEqual(
				expect.arrayContaining(["nuxt", "3", "react"]),
			);
		});

		it("日本語は2-gramに分割される", () => {
			const tokens = tokenize("投資信託");
			expect(tokens).toEqual(expect.arrayContaining(["投資", "資信", "信託"]));
		});

		it("3文字以下の日本語はそのまま保持される", () => {
			expect(tokenize("NISA")).toContain("nisa");
			expect(tokenize("投資")).toContain("投資");
		});

		it("空文字列は空配列を返す", () => {
			expect(tokenize("")).toEqual([]);
			expect(tokenize("   ")).toEqual([]);
		});

		it("句読点は除去される", () => {
			const tokens = tokenize("Hugo、Nuxtに置き換えた。");
			expect(tokens).toContain("hugo");
			expect(tokens).toContain("nuxt");
		});

		it("ストップワードは除外される", () => {
			expect(tokenize("the cat is")).not.toContain("the");
			expect(tokenize("the cat is")).not.toContain("is");
		});
	});

	describe("scorePosts", () => {
		it("タイトル一致が最も高いスコアを得る", () => {
			const corpus: ChatbotCorpusEntry[] = [
				makeEntry({ title: "NISA の話", body: "本文" }),
				makeEntry({ title: "他の記事", body: "本文に NISA が登場" }),
			];

			const scored = scorePosts("NISA", corpus);

			expect(scored[0].entry.title).toBe("NISA の話");
			expect(scored[0].score).toBeGreaterThan(scored[1].score);
		});

		it("タグ一致もスコアに加算される", () => {
			const corpus: ChatbotCorpusEntry[] = [
				makeEntry({ title: "別物", tags: ["nisa"], body: "" }),
				makeEntry({ title: "別物2", tags: [], body: "" }),
			];

			const scored = scorePosts("nisa", corpus);

			expect(scored).toHaveLength(1);
			expect(scored[0].entry.tags).toContain("nisa");
		});

		it("マッチがない記事は除外される", () => {
			const corpus: ChatbotCorpusEntry[] = [
				makeEntry({ title: "全然関係ない", body: "ぜんぜん関係ない内容" }),
			];

			const scored = scorePosts("react", corpus);
			expect(scored).toEqual([]);
		});
	});

	describe("extractRoles", () => {
		it("「から」の前を移行元、「に」「へ」の前を移行先として取り出す", () => {
			const roles = extractRoles("Hugo から Nuxt に置き換えた");

			expect(roles.get("hugo")).toEqual(new Set(["source"]));
			expect(roles.get("nuxt")).toEqual(new Set(["destination"]));
		});

		it("複数語の名前は各語に役割が付く", () => {
			const roles = extractRoles("Panda CSS への移行について");

			expect(roles.get("panda")).toEqual(new Set(["destination"]));
			expect(roles.get("css")).toEqual(new Set(["destination"]));
		});

		it("バージョン番号と補足の括弧は読み飛ばす", () => {
			const roles = extractRoles("Nuxt 3 から Next.js 15 (App Router) に移行");

			expect(roles.get("nuxt")).toEqual(new Set(["source"]));
			expect(roles.get("next")).toEqual(new Set(["destination"]));
			expect(roles.get("js")).toEqual(new Set(["destination"]));
			expect(roles.has("3")).toBe(false);
			expect(roles.has("15")).toBe(false);
			expect(roles.has("app")).toBe(false);
		});

		it("助詞が続かない語には役割が付かない", () => {
			expect(extractRoles("TSKaigi 2024 の参加レポート").size).toBe(0);
		});
	});

	describe("scorePosts の重み付け", () => {
		it("多くの記事に出てくる語より、少数の記事にしか出てこない語を重く見る", () => {
			const corpus: ChatbotCorpusEntry[] = [
				makeEntry({ slug: "common", title: "ブログ", body: "hugo" }),
				makeEntry({ slug: "rare", title: "hugo", body: "ブログ" }),
				makeEntry({ slug: "other-1", title: "ブログ" }),
				makeEntry({ slug: "other-2", title: "ブログ" }),
			];

			const scored = scorePosts("ブログ hugo", corpus);

			expect(scored[0].entry.slug).toBe("rare");
		});

		it("移行先を尋ねる質問では、その語が移行先の記事を上位にする", () => {
			const corpus: ChatbotCorpusEntry[] = [
				makeEntry({
					slug: "from-next",
					title: "ブログを Next.js から TanStack Start に移行した",
				}),
				makeEntry({
					slug: "to-next",
					title: "技術スタックの刷新",
					description: "Nuxt から Next.js に移行",
				}),
			];

			expect(
				scorePosts("ブログを Next.js に移行した話", corpus)[0].entry.slug,
			).toBe("to-next");
			expect(
				scorePosts("ブログを Next.js から移行した話", corpus)[0].entry.slug,
			).toBe("from-next");
		});
	});

	describe("searchPosts", () => {
		it("topN件まで返す", () => {
			const corpus: ChatbotCorpusEntry[] = [
				makeEntry({ slug: "a", title: "react fundamentals" }),
				makeEntry({ slug: "b", title: "react advanced" }),
				makeEntry({ slug: "c", title: "react patterns" }),
				makeEntry({ slug: "d", title: "react hooks" }),
			];

			const results = searchPosts("react", corpus, 2);
			expect(results).toHaveLength(2);
		});
	});
});
