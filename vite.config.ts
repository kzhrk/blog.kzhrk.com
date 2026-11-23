import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 3000,
	},
	resolve: {
		tsconfigPaths: true,
	},
	css: {
		modules: {
			// CSS 側のクラス名（site-header__inner）を styles.siteHeaderInner として参照する
			localsConvention: "camelCaseOnly",
		},
	},
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true,
				// 末尾スラッシュなしの URL を保つため /posts/…/slug.html として出力する
				autoSubfolderIndex: false,
				// タグ絞り込み（/?tag=…）はクライアント側で処理する。
				// プリレンダリングすると index.html を上書きしてしまうため除外する
				filter: ({ path }) => !path.includes("?"),
			},
			// コンポーネントを持たないサーバールートは自動検出されないため明示する
			pages: [{ path: "/sitemap.xml" }, { path: "/chatbot-context.json" }],
		}),
		viteReact(),
	],
});
