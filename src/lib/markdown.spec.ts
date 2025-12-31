import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./markdown";

describe("parseMarkdown", () => {
	describe("見出し", () => {
		it("h2見出しにidとアンカーリンクが追加される", async () => {
			const markdown = "## テスト見出し";

			const html = await parseMarkdown(markdown);

			expect(html).toContain('<h2 id="テスト見出し"');
			expect(html).toContain('class="heading"');
			expect(html).toContain('href="#テスト見出し"');
			expect(html).toContain('class="heading-anchor-icon"');
		});

		it("h3見出しも同様に変換される", async () => {
			const markdown = "### サブ見出し";

			const html = await parseMarkdown(markdown);

			expect(html).toContain('<h3 id="サブ見出し"');
			expect(html).toContain('class="heading"');
		});
	});

	describe("リンク", () => {
		it("リンクにlinkクラスが追加される", async () => {
			const markdown = "[テストリンク](https://example.com)";

			const html = await parseMarkdown(markdown);

			expect(html).toContain('href="https://example.com"');
			expect(html).toContain('class="link"');
			expect(html).toContain("テストリンク");
		});
	});

	describe("コードブロック", () => {
		it("言語指定のコードブロックがシンタックスハイライトされる", async () => {
			const markdown = "```typescript\nconst x: number = 1;\n```";

			const html = await parseMarkdown(markdown);

			expect(html).toContain("<pre><code");
			expect(html).toContain('class="hljs language-typescript"');
		});

		it("言語指定がない場合はplaintextとして処理される", async () => {
			const markdown = "```\nplain text\n```";

			const html = await parseMarkdown(markdown);

			expect(html).toContain('class="hljs language-plaintext"');
		});

		it("不正な言語指定の場合はplaintextとして処理される", async () => {
			const markdown = "```invalidlang123\nsome code\n```";

			const html = await parseMarkdown(markdown);

			expect(html).toContain('class="hljs language-plaintext"');
		});

		it("JavaScriptコードが正しくハイライトされる", async () => {
			const markdown = "```javascript\nfunction hello() { return 'world'; }\n```";

			const html = await parseMarkdown(markdown);

			expect(html).toContain('class="hljs language-javascript"');
			expect(html).toContain("function");
		});
	});

	describe("段落", () => {
		it("通常のテキストがp要素で囲まれる", async () => {
			const markdown = "これは段落です。";

			const html = await parseMarkdown(markdown);

			expect(html).toContain("<p>これは段落です。</p>");
		});
	});

	describe("リスト", () => {
		it("箇条書きリストが変換される", async () => {
			const markdown = "- アイテム1\n- アイテム2";

			const html = await parseMarkdown(markdown);

			expect(html).toContain("<ul>");
			expect(html).toContain("<li>アイテム1</li>");
			expect(html).toContain("<li>アイテム2</li>");
		});

		it("番号付きリストが変換される", async () => {
			const markdown = "1. 最初\n2. 次";

			const html = await parseMarkdown(markdown);

			expect(html).toContain("<ol>");
			expect(html).toContain("<li>最初</li>");
			expect(html).toContain("<li>次</li>");
		});
	});

	describe("インライン要素", () => {
		it("太字が変換される", async () => {
			const markdown = "**太字テキスト**";

			const html = await parseMarkdown(markdown);

			expect(html).toContain("<strong>太字テキスト</strong>");
		});

		it("インラインコードが変換される", async () => {
			const markdown = "`inline code`";

			const html = await parseMarkdown(markdown);

			expect(html).toContain("<code>inline code</code>");
		});
	});
});
