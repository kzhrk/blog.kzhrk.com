<script lang="ts" setup>
import { format } from "date-fns";

const { data: allPosts } = await useFetch("/api/posts");

const tags = computed(() =>
	useRoute().query.tags ? [useRoute().query.tags].flat() : [],
);

const posts = computed(() => {
	if (tags.value.length > 0) {
		return allPosts.value.filter((p) => {
			return p.tags?.some((t) => {
				return tags.value.includes(t);
			});
		});
	}
	return allPosts.value;
});

function getFormatedDate(dateString: string) {
	return format(dateString, "yyyy年M月d日");
}

useHead(() => ({
	link: [
		{
			rel: "canonical",
			href: "https://blog.kzhrk.com",
		},
	],
}));
</script>

<template>
	<section v-if="tags.length > 0" class="flex gap-x-2 items-center px-6 sm:px-12 my-6">
		<h1 class="font-bold">絞り込みタグ:</h1>
		<ul class="flex gap-2">
			<li v-for="(tag, i) in tags" :key="i">
				<nuxt-link :to="`/?tags=${tag}`" class="text-sm block px-2 py-1 text-gray-700 bg-blue-100 hover:bg-blue-200">{{ tag }}</nuxt-link>
			</li>
		</ul>
	</section>
  <section class="px-6 sm:px-12 my-12" v-for="(post, i) in posts" :key="i">
    <h1 class="text-2xl">
      <nuxt-link class="link underline hover:no-underline" :to="`/posts${post.path}`">
        {{ post.title }}
      </nuxt-link>
    </h1>
		<div class="mt-2 flex items-center">
			<time class="text-sm" :datetime="post.date">{{ getFormatedDate(post.date) }}</time>
			<ul v-if="post.tags" v-for="(tag, i) in post.tags" :key="i" class="flex gap-4 items-center ml-4">
				<li>
					<nuxt-link :to="`/?tags=${tag}`" class="text-xs block px-2 py-1 text-gray-700 bg-blue-100 hover:bg-blue-200">{{ tag }}</nuxt-link>
				</li>
			</ul>
		</div>
  </section>
</template>
