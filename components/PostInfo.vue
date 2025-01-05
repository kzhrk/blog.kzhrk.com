<script setup lang="ts">
import { format } from "date-fns";

const props = defineProps<{
	tags: string[];
	date: string;
}>();

const formattedDate = computed(() => format(props.date, "yyyy年M月d日"));
</script>

<template>
	<time class="text-sm" :datetime="date">{{ formattedDate }}</time>
	<ul v-if="tags.length > 0" v-for="(tag, i) in tags" :key="i" class="flex gap-4 items-center ml-4">
		<li>
			<nuxt-link :to="`/?tag=${tag}`" class="text-xs block px-2 py-1 text-gray-700 bg-blue-100 hover:bg-blue-200">{{ tag }}</nuxt-link>
		</li>
	</ul>
</template>
