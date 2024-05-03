<script lang="ts" setup>
const title = "blog.kzhrk.com";

useHead(() => ({
	title,
	meta: [
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		// {
		// 	name: "twitter:image",
		// 	content: "https://blog.kzhrk.com/images/logo.png",
		// },
		{
			name: "twitter:title",
			content: title,
		},
		// {
		// 	property: "og:image",
		// 	content: "https://blog.kzhrk.com/images/logo.png",
		// },
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
	script: [
		{
			src: "https://www.googletagmanager.com/gtag/js?id=G-E9G5KSJ28F",
			async: true,
		},
		{
			innerHTML: `
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'G-E9G5KSJ28F');
			`,
		},
	],
}));
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Hiragino Kaku Gothic ProN, meiryo, sans-serif;
}
</style>