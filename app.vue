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
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Hiragino Kaku Gothic ProN, meiryo, sans-serif;
}
</style>