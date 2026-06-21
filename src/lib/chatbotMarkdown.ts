import { Marked } from "marked";

// チャットボットはクライアントコンポーネントのため、ハイライト処理 (highlight.js)
// を含む markdown.ts は読み込まず、marked のみで軽量に変換する。
const marked = new Marked({
	async: false,
	gfm: true,
	breaks: true,
});

marked.use({
	renderer: {
		link({ href, title, text }) {
			const titleAttr = title ? ` title="${title}"` : "";
			return `<a href="${href}"${titleAttr} class="chatbot-md__link" target="_blank" rel="noopener noreferrer">${text}</a>`;
		},
	},
});

export function renderChatbotMarkdown(content: string): string {
	return marked.parse(content) as string;
}
