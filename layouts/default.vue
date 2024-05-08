<template>
  <header>
    <div class="px-6 py-4 sm:px-12 sm:py-8 bg-slate-800 bg-opacity-75">
      <div class="w-auto sm:w-10/12 mx-auto">
        <h1 class="text-xl sm:text-3xl font-bold">
          <nuxt-link class="font-normal" to="/">blog.kzhrk.com</nuxt-link>
        </h1>
      </div>
    </div>
  </header>
  <main class="w-auto sm:w-10/12 mx-auto">
    <nuxt-page />
  </main>
  <footer class="px-6 py-8 sm:px-12 sm:py-16 bg-gray-200 dark:bg-gray-800">
		<div class="w-auto sm:w-10/12 mx-auto">
			<h1 class="text-xl font-bold">Author</h1>
			<div class="mt-4 flex items-center">
				<p class="mr-2">kzhrk</p>
				<a href="https://twitter.com/kzhrk0430" class="twitter-follow-button" data-show-screen-name="true"></a>
			</div>
			<p class="mt-2">フロントエンドエンジニア。ブラウザというアプリケーションを使い倒して全ての人類に等しく情報を伝えることを生きがいにしている。</p>
		</div>
    <p class="mt-16 text-sm text-center">
      &copy; 2014
      <a class="link underline hover:no-underline" href="https://blog.kzhrk.com">kzhrk</a>
    </p>
  </footer>
</template>

<style scoped>
header {
  @apply text-white;
  text-shadow: 0 1px 5px black;
}
</style>