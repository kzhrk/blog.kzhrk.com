import type { LanguageModelMessage } from "@/types/prompt-api";
import type { ChatbotCorpusEntry } from "./chatbotCorpus";

export const SYSTEM_PROMPT = `あなたは blog.kzhrk.com (kzhrk のブログ) のアシスタントです。
ユーザーから提供されたブログ記事の情報のみを根拠に、日本語で簡潔に回答してください。

ルール:
- 記事に書かれていない内容は推測せず、「その情報はブログ記事には見つかりませんでした」と答えてください。
- 回答は「結論 → 根拠 (記事の引用や要点)」の順で書いてください。出典は別途UI側で表示するため、本文には記事タイトルを列挙する必要はありません。
- 回答は400文字以内を目安に簡潔にまとめてください。
- 文体は丁寧語 (です・ます) で統一してください。`;

const FEW_SHOT_EXAMPLES: LanguageModelMessage[] = [
	{
		role: "user",
		content:
			"## 関連記事 (本文)\n### サンプル記事 (2024-01-01)\nslug: 2024/01/01/sample\ntags: test\n\n本文サンプル。これはテスト用の本文です。\n\n--- 質問: サンプル記事には何が書かれていますか?",
	},
	{
		role: "assistant",
		content:
			"テスト用の本文サンプルが書かれています。記事「サンプル記事」では、検証目的の短い文章が記載されているのみです。",
	},
	{
		role: "user",
		content:
			"## 関連記事 (本文)\n(関連しそうな記事は見つかりませんでした)\n\n--- 質問: 量子コンピューターについて教えてください",
	},
	{
		role: "assistant",
		content:
			"その情報はブログ記事には見つかりませんでした。ブログには量子コンピューターについて触れた記事がありません。",
	},
];

export function buildIndexBlock(corpus: ChatbotCorpusEntry[]): string {
	const lines = corpus.map((entry) => {
		const tags = entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : "";
		return `- ${entry.title} (${entry.date})${tags}: ${entry.description}`;
	});
	return `## 全記事インデックス\n${lines.join("\n")}`;
}

export function buildArticlesBlock(entries: ChatbotCorpusEntry[]): string {
	if (entries.length === 0) {
		return "## 関連記事\n(関連しそうな記事は見つかりませんでした)";
	}
	const blocks = entries.map((entry) => {
		return `### ${entry.title} (${entry.date})\nslug: ${entry.slug}\ntags: ${entry.tags.join(", ") || "(なし)"}\n\n${entry.body}`;
	});
	return `## 関連記事 (本文)\n${blocks.join("\n\n---\n\n")}`;
}

export function buildInitialPrompts(
	corpus: ChatbotCorpusEntry[],
	relatedEntries: ChatbotCorpusEntry[],
): LanguageModelMessage[] {
	const indexBlock = buildIndexBlock(corpus);
	const articlesBlock = buildArticlesBlock(relatedEntries);

	return [
		{ role: "system", content: SYSTEM_PROMPT },
		...FEW_SHOT_EXAMPLES,
		{
			role: "user",
			content: `以下はブログの記事情報です。次以降の質問にはこの情報のみを根拠に答えてください。\n\n${indexBlock}\n\n${articlesBlock}`,
		},
		{
			role: "assistant",
			content: "了解しました。記事の情報をもとに、ご質問にお答えします。",
		},
	];
}
