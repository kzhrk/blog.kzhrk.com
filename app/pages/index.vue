<script lang="ts" setup>
import PostInfo from "@/components/PostInfo.vue";

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
		<label for="category-select" class="font-bold">絞り込みタグ:</label>
		<select id="category-select" class="p-2 bg-gray-100 border border-gray-400 dark:text-gray-900" @change="onChangeTag">
			<option v-for="(option, i) in tagOptions" :key="i" :value="option.value" :selected="option.selected">{{ option.label }}</option>
		</select>
	</div>
	<template v-for="(post, i) in allPosts" :key="i">
		<section v-if="tag === undefined || post?.tags?.includes(tag)" class="px-6 sm:px-12 my-12">
			<h1 class="text-2xl">
				<nuxt-link class="link underline hover:no-underline" :to="`/posts${post.path}`">
					{{ post.title }}
				</nuxt-link>
			</h1>
			<div class="mt-2 flex items-center">
				<PostInfo :date="post.date" :tags="post.tags" />
			</div>
		</section>
	</template>
</template>
