<script lang="ts" setup>
import { format } from "date-fns";

const { data } = await useFetch("/api/posts");

function getFormatedDate(dateString: string) {
	return format(dateString, "yyyy年M月d日");
}
</script>

<template>
  <section class="px-6 sm:px-12 my-12" v-for="(post, i) in data" :key="i">
    <h1 class="text-2xl">
      <nuxt-link class="text-link underline hover:no-underline" :to="`/posts${post.path}`">
        {{ post.title }}
      </nuxt-link>
    </h1>
    <time class="text-sm" :datetime="post.date">{{ getFormatedDate(post.date) }}</time>
  </section>
</template>
