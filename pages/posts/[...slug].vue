<script lang="ts" setup>
import { format } from "date-fns";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const route = useRoute();
const slug = route.params.slug as string[];

const apiParam = slug.join("-");
const { data: post } = await useFetch(`/api/posts/${apiParam}`, {
	onResponseError() {
		return navigateTo("/404");
	},
});

const title = post.value.title;
const metaTitle = `${title} | blog.kzhrk.com`;
const html = post.value.html;
const description = post.value.description;
const tags = post.value.tags as string[] | undefined;
const url = `https://blog.kzhrk.com/posts/${slug.join("/")}`;

function getFormatedDate(dateString: string) {
	return format(dateString, "yyyy年M月d日");
}

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
	link: [
		{
			rel: "canonical",
			href: `https://blog.kzhrk.com${route.path}`,
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
			<ul class="flex flex-col gap-y-1">
				<li class="text-sm">作成日: <time :datetime="post.createdAt">{{ getFormatedDate(post.createdAt) }}</time></li>
				<li class="text-sm">更新日: <time :datetime="post.updatedAt">{{ getFormatedDate(post.updatedAt) }}</time></li>
				<li>
					<ul v-if="post.tags" v-for="(tag, i) in post.tags" :key="i" class="flex gap-4 items-center">
						<li>
							<nuxt-link :to="`/?tags=${tag}`" class="text-xs block px-2 py-1 text-gray-700 bg-blue-100 hover:bg-blue-200">{{ tag }}</nuxt-link>
						</li>
					</ul>
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
.html .heading {
	@apply flex items-center gap-2;
}
.html .heading:hover .heading-anchor-icon {
	@apply block;
}
.html .heading-anchor-icon {
	@apply hidden size-4;
	font-size: 0;
	background-image: url('data:image/png;base64,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');
	background-size: contain;
}
.html ul,
.html ol {
  @apply pl-4 my-4;
}
.html ul li {
  @apply mt-2 list-disc;
}
.html ul li::marker {
  @apply text-gray-700 dark:text-gray-200;
}
.html a {
  @apply underline hover:no-underline;
}
.html pre {
	@apply my-8;
}
.html code {
	@apply bg-gray-100 dark:bg-gray-500;
}
.html pre code {
	@apply bg-gray-700;
}
</style>