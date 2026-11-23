// posts/*.md をビルド時にバンドルへ含める。
// Cloudflare Workers にはファイルシステムがないため、実行時に fs で読むことはできない。
const modules = import.meta.glob<string>("../../posts/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

/** ファイル名（例: 2024-05-05-replace-hugo-to-nuxt.md）をキーにした Markdown の本文 */
export const postFiles: Record<string, string> = Object.fromEntries(
	Object.entries(modules).map(([path, raw]) => [
		path.slice(path.lastIndexOf("/") + 1),
		raw,
	]),
);

/** ファイル名の昇順（＝日付の古い順） */
export const postFilenames: string[] = Object.keys(postFiles).sort();
