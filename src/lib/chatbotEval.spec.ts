import { describe, expect, it } from "vitest";
import { buildChatbotCorpus } from "./chatbotCorpus";
import { searchPosts } from "./chatbotSearch";

interface EvalCase {
	query: string;
	expectedSlug: string;
	note?: string;
}

const EVAL_CASES: EvalCase[] = [
	{
		query: "新 NISA を始めるメリットは何ですか?",
		expectedSlug: "2023/11/25/why-should-you-start-a-new-nisa",
	},
	{
		query: "新 NISA に向けて何の準備をした?",
		expectedSlug: "2023/11/20/prepare-new-nisa",
	},
	{
		query: "投資で失敗した話",
		expectedSlug: "2024/04/28/when-investments-fail",
	},
	{
		query: "ギリシャ危機で先物取引をした失敗談",
		expectedSlug: "2024/04/28/when-investments-fail",
	},
	{
		query: "kzhrk さんの投資歴を教えて",
		expectedSlug: "2024/03/20/my-investment-history",
	},
	{
		query: "2024 年の NISA の運用結果",
		expectedSlug: "2024/12/31/result-nisa-2024",
	},
	{
		query: "2025 年の NISA はどうだった?",
		expectedSlug: "2025/12/31/result-nisa-2025",
	},
	{
		query: "ブログを Hugo から Nuxt に移行した理由は?",
		expectedSlug: "2024/05/05/replace-hugo-to-nuxt",
	},
	{
		query: "ブログを Next.js に移行した話",
		expectedSlug: "2026/01/02/blog-tech-update",
	},
	{
		query: "Panda CSS への移行について",
		expectedSlug: "2026/01/02/blog-tech-update",
	},
	{
		query: "自作キーボードについて",
		expectedSlug: "2025/02/08/myself-keyboard",
	},
	{
		query: "Lily58 Pro を組み立てた話",
		expectedSlug: "2025/02/08/myself-keyboard",
	},
	{
		query: "Ingress を再開した話",
		expectedSlug: "2026/01/25/ingress-weekend",
	},
	{
		query: "TSKaigi 2024 の参加レポート",
		expectedSlug: "2024/05/11/tskaigi-2024",
	},
	{
		query: "TSKaigi 2024 の After Talk について",
		expectedSlug: "2024/06/04/tskaigi-2024-after-talk",
	},
	{
		query: "v-tokyo 20 のレポート",
		expectedSlug: "2024/05/28/v-tokyo-20",
	},
	{
		query: "技術書典 5 で買った本",
		expectedSlug: "2018/10/09/techbookfest-5",
	},
	{
		query: "Atom エディタの使用感",
		expectedSlug: "2015/10/15/hello-atom",
	},
	{
		query: "Storybook v5 へのアップデート方法",
		expectedSlug: "2019/03/11/storybook-v5",
	},
	{
		query: "Vercel (now) へのデプロイ設定",
		expectedSlug: "2020/05/06/now-deploy",
	},
	{
		query: "IE6 の CSS バグの話",
		expectedSlug: "2015/12/11/css-ie-bug",
	},
	{
		query: "2025 年の振り返りと 2026 年の抱負",
		expectedSlug: "2026/01/01/review-2025",
	},
	{
		query: "HTML5 とか勉強会 60 回の参加レポート",
		expectedSlug: "2015/09/30/html5j-60",
	},
	{
		query: "nvm でグローバル npm を引き継ぎたい",
		expectedSlug: "2016/04/16/reinstall-npm",
	},
	{
		query: "IIJmio に乗り換えた手順",
		expectedSlug: "2016/08/13/iij-mio",
	},
	{
		query: "Jade のディレクトリ構造を維持して出力したい",
		expectedSlug: "2015/12/11/jade-hierarchy",
	},
	{
		query: "CSS Selector の登壇について",
		expectedSlug: "2014/03/26/creators-meet-up-11",
	},
];

describe("chatbotEval (検索精度)", () => {
	it("Hit@1 と Hit@3 を計測する", async () => {
		const corpus = await buildChatbotCorpus();

		let hit1 = 0;
		let hit3 = 0;
		const lines: string[] = [];

		for (const { query, expectedSlug } of EVAL_CASES) {
			const results = searchPosts(query, corpus, 3);
			const slugs = results.map((r) => r.slug);
			const rank = slugs.indexOf(expectedSlug);
			if (rank === 0) hit1++;
			if (rank >= 0) hit3++;

			const symbol = rank === 0 ? "✓1" : rank > 0 ? `✓${rank + 1}` : "✗";
			const got = slugs.length > 0 ? slugs.join(", ") : "(no hits)";
			lines.push(
				`  ${symbol}  ${query}\n      expected: ${expectedSlug}\n      got:      ${got}`,
			);
		}

		const total = EVAL_CASES.length;
		const hit1Rate = hit1 / total;
		const hit3Rate = hit3 / total;

		const summary = [
			"",
			`Hit@1: ${hit1}/${total} (${(hit1Rate * 100).toFixed(1)}%)`,
			`Hit@3: ${hit3}/${total} (${(hit3Rate * 100).toFixed(1)}%)`,
			"",
			...lines,
			"",
		].join("\n");

		console.log(summary);

		expect(hit3Rate).toBeGreaterThanOrEqual(0.9);
		expect(hit1Rate).toBeGreaterThanOrEqual(0.85);
	});
});
