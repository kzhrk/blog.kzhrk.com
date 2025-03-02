<script lang="ts" setup>
const title = "blog.kzhrk.com";
const description = "kzhrk のブログ。プログラミングとか料理とか映像作品とか。";

useHead(() => ({
	title,
	meta: [
		{
			name: "description",
			content: description,
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://blog.kzhrk.com/images/ogp.png",
		},
		{
			name: "twitter:title",
			content: title,
		},
		{
			property: "og:description",
			content: description,
		},
		{
			property: "og:image",
			content: "https://blog.kzhrk.com/images/ogp.png",
		},
		{
			property: "og:site_name",
			content: "blog.kzhrk.com",
		},
		{
			property: "og:type",
			content: "blog",
		},
		{
			property: "og:url",
			content: "https://blog.kzhrk.com/",
		},
	],
	link: [
		{
			rel: "icon",
			href: "/favicon.png",
		},
		{
			rel: "shortcut icon",
			href: "/favicon.png",
		},
		{
			rel: "preconnect",
			href: "https://www.googletagmanager.com",
		},
	],
}));
</script>

<template>
	<!-- Google Tag Manager (noscript) -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5WPKT2H7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<!-- End Google Tag Manager (noscript) -->
	<nuxt-layout>
		<nuxt-page />
	</nuxt-layout>
</template>

<style>
body {
	@apply dark:text-white dark:bg-gray-900;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Hiragino Kaku Gothic ProN, meiryo, sans-serif;
}
.link {
	@apply text-blue-700 dark:text-blue-200;
}
</style>