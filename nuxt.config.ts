import { readdirSync } from "node:fs";

const posts = readdirSync("./posts");
const routes = posts.map((p) =>
	p.replace(/(\d+)-(\d+)-(\d+)-([\w|-]+)\.md/, "/posts/$1/$2/$3/$4"),
);

export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},

	dir: {
		app: "app",
	},

	app: {
		head: {
			htmlAttrs: {
				lang: "ja",
			},
			script: [
				{
					innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
																	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
																	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
																	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
																	})(window,document,'script','dataLayer','GTM-5WPKT2H7');`,
				},
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

	modules: [
		"@nuxtjs/tailwindcss",
		"@nuxtjs/sitemap",
		"@nuxt/test-utils/module",
	],

	generate: {
		routes,
	},

	site: {
		url: "https://blog.kzhrk.com",
		trailingSlash: false,
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

	compatibilityDate: "2025-01-19",
});
