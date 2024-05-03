<script lang="ts" setup>
import { format } from "date-fns";
import hljs from "highlight.js";
import 'highlight.js/styles/github.css';

const route = useRoute();
const slug = route.params.slug as string[];

const apiParam = slug.join("-");
const res = await useFetch(`/api/posts/${apiParam}`);

if (res.error.value) {
	await navigateTo("/404");
}

const title = res.data.value.title;
const html = res.data.value.html;
const date = res.data.value.date;
const formatedDate = format(date, "yyyy年M月d日");
const url = `https://blog.kzhrk.com/posts/${slug.join("/")}`;

onMounted(() => {
	hljs.highlightAll();
});

useHead(() => ({
	title,
	meta: [
		{
			name: "twitter:title",
			content: title,
		},
		{
			property: "og:url",
			content: url,
		},
	],
}));

onMounted(() => {
	window.twttr.widgets.load();
});
</script>

<template>
  <section class="px-6 py-12 sm:p-12">
		<h1 class="mb-4 text-3xl font-bold">{{ title }}</h1>
		<div class="mb-10">
			<time :datetime="date" class="text-sm text-gray-600">{{ formatedDate }}</time>
		</div>
		<div v-html="html" class="html" />
    <div class="mt-8">
      <a class="twitter-share-button" :href="`https://twitter.com/intent/tweet?url=${url}&text=${title} | blog.kzhrk.com`">
        Tweet
      </a>
    </div>
  </section>
</template>

<style>
.html p {
	@apply my-4;
}
.html h2 {
  @apply text-2xl mt-8 mb-4;
}
.html h3 {
  @apply text-xl mt-8 mb-4;
}
.html ul,
.html ol {
  @apply pl-4 my-4;
}
.html ul li {
  @apply mt-2 list-disc;
}
.html ul li::marker {
  @apply text-gray-700;
}
.html a {
  @apply text-link underline hover:no-underline;
}
.html pre {
	@apply my-8;
}
.html code {
	@apply bg-gray-100;
}
</style>