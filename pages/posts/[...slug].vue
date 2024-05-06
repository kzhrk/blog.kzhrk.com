<script lang="ts" setup>
import { format } from "date-fns";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const route = useRoute();
const slug = route.params.slug as string[];

const apiParam = slug.join("-");
const { data } = await useFetch(`/api/posts/${apiParam}`, {
	onResponseError() {
		return navigateTo("/404");
	},
});

const title = data.value.title;
const metaTitle = `${title} | blog.kzhrk.com`;
const html = data.value.html;
const date = data.value.date;
const description = data.value.description;
const tags = data.value.tags as string[] | undefined;
const formatedDate = format(date, "yyyy年M月d日");
const url = `https://blog.kzhrk.com/posts/${slug.join("/")}`;

useHead(() => ({
	title: metaTitle,
	meta: [
		{
			name: "description",
			content: description,
		},
		{
			name: "twitter:title",
			content: metaTitle,
		},
		{
			property: "og:description",
			content: description,
		},
		{
			property: "og:url",
			content: url,
		},
	],
}));

onMounted(() => {
	hljs.highlightAll();
	window.twttr.widgets.load();
});
</script>

<template>
  <section class="px-6 py-12 sm:p-12">
		<h1 class="mb-4 text-3xl font-bold">{{ title }}</h1>
		<div class="mb-10 flex items-center">
			<time :datetime="date" class="text-sm text-gray-600">{{ formatedDate }}</time>
			<ul v-if="tags" v-for="(tag, i) in tags" :key="i" class="flex gap-4 items-center ml-4">
				<li>
					<nuxt-link :to="`/?tags=${tag}`" class="text-sm block px-2 py-1 text-gray-700 bg-blue-100 hover:bg-blue-200">{{ tag }}</nuxt-link>
				</li>
			</ul>
		</div>
		<div v-html="html" class="html" />
    <div class="mt-8">
      <a class="twitter-share-button" :href="`https://twitter.com/intent/tweet?url=${url}&text=${title}`">
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