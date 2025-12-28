import hljs from "highlight.js";
import { Marked } from "marked";

const marked = new Marked();

marked.use({
	renderer: {
		heading({ depth, text }) {
			const tag = `h${depth}`;
			return `<${tag} id="${text}" class="heading">${text}<a href="#${text}" class="heading-anchor-icon" aria-hidden="true">アンカーリンク</a></${tag}>`;
		},
		link({ text, href }) {
			return `<a href="${href}" class="link">${text}</a>`;
		},
		code({ text, lang }) {
			const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
			const highlighted = hljs.highlight(text, { language }).value;
			return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
		},
	},
});

export async function parseMarkdown(content: string): Promise<string> {
	return marked.parse(content);
}
