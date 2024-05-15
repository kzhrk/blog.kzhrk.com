<script lang="ts" setup>
import { format } from "date-fns";

const route = useRoute();
const router = useRouter();

const { data: allPosts } = await useFetch("/api/posts");
const { data: allTags } = await useFetch("/api/tags");

const tag = computed(() => route.query.tag);

const tagOptions = computed(
	(): { label: string; value: string; selected: boolean }[] =>
		[undefined, ...allTags.value].map((t) => ({
			label: t || "未選択",
			value: t || "",
			selected: t === tag.value,
		})),
);

const posts = computed(() => {
	if (tag.value) {
		return allPosts.value?.filter((p) => p?.tags?.includes(tag.value));
	}
	return allPosts.value;
});

function getFormatedDate(dateString: string) {
	return format(dateString, "yyyy年M月d日");
}

function onChangeTag(event: Event) {
	const value = event.target.value;
	router.push({
		query: {
			tag: value ? value : undefined,
		},
	});
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
	<div class="flex gap-x-2 items-center px-6 sm:px-12 my-6">
		<p class="font-bold">絞り込みタグ:</p>
		<select @change="onChangeTag" class="p-2 bg-gray-100 border border-gray-400 dark:text-gray-900">
			<option v-for="(option, i) in tagOptions" :key="i" :value="option.value" :selected="option.selected">{{ option.label }}</option>
		</select>
	</div>
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
					<nuxt-link :to="`/?tag=${tag}`" class="text-xs block px-2 py-1 text-gray-700 bg-blue-100 hover:bg-blue-200">{{ tag }}</nuxt-link>
				</li>
			</ul>
		</div>
  </section>
</template>
