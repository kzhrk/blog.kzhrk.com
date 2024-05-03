import { readdirSync } from "node:fs";

const posts = readdirSync("./posts");
const routes = posts.map((p) =>
	p.replace(/(\d+)-(\d+)-(\d+)-([\w|-]+)\.md/, "$1/$2/$3/$4"),
);

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: "ja",
			},
			script: [
				{
					type: "text/javascript",
					async: true,
					src: "https://platform.twitter.com/widgets.js",
					tagPosition: "bodyClose",
				},
			],
		},
	},
	ssr: true,
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/sitemap"],
	generate: {
		routes,
	},
	vite: {
		plugins: [
			{
				name: "markdown-loader",
				transform(code, id) {
					if (id.slice(-3) === ".md") {
						// For .md files, get the raw content
						return `export default ${JSON.stringify(code)};`;
					}
				},
			},
		],
	},
});
