---
title: ブログを Next.js から TanStack Start に移行した
date: 2026-11-23
tags: [技術]
summary: ブログを Next.js 16 (OpenNext) から TanStack Start に移行し、全ページをプリレンダリングして Cloudflare Workers の静的アセットで配信するようにした。あわせて Panda CSS を CSS Modules に、Biome を oxlint と oxfmt に、TypeScript を 7 系に、Vitest を 5 系に切り替えた。
---

[今年の年始に Nuxt から Next.js に移行した](https://blog.kzhrk.com/posts/2026/01/02/blog-tech-update)このブログを、今度は TanStack Start に移行した。  
1 年も経たずにまた載せ替えたことになる。経緯と、やってみてわかったことをまとめる。

## なぜ移行したのか

きっかけは、ブログに Next.js を使うのはオーバーエンジニアリングではないかと思ったことだ。

このブログは Markdown で書いた記事があるだけのサイトで、ビルド時にすべての HTML を作れる。  
Cloudflare Workers で動かすために OpenNext を挟み、使ってもいないキャッシュのために KV の名前空間を 2 つ持っていた。  
前回の記事にも書いたとおり、OpenNext の対応待ちで Next.js のバージョンを上げられない時期もあった。

## 技術選定

移行先を決めるにあたって、次の 3 つを条件にした。

- 自前のビルドコードを持たない
- ページを遷移してもチャットボットの状態が残る
- 実験的と明記されている機能には頼らない

最初は Vite で静的ファイルを書き出し、チャットボットだけを React の island として載せる構成を考えた。  
この構成だと、Markdown を HTML にして書き出す処理を自分で書いて保守することになる。フレームワークを軽くしたいのであって、ビルドツールを自作したいわけではない。

もうひとつの条件がチャットボットだ。このブログには Prompt API で動くチャットボットを置いていて、記事を読みながら質問できる。  
会話の途中で別の記事を開いたら履歴が消える、というのはチャットの UI として成立しない。  
ページごとに HTML を読み込み直す構成では状態が消えるので、クライアント側でルーティングする必要がある。

この 2 つを満たすものとして TanStack Start を選んだ。  
プリレンダリングはフレームワークの機能として用意されていて、遷移は TanStack Router がクライアント側で処理する。  
記事ページはページ全体をハイドレーションすることになるが、これは Next.js のときと同じなので、失うものはない。

| 項目 | 移行前 | 移行後 |
|---|---|---|
| フレームワーク | Next.js 16 | TanStack Start 1.x |
| 配信 | OpenNext + KV 2 つ | Worker + 静的アセット |
| CSS | `globals.css` + Panda CSS | CSS Modules |
| Lint / Format | Biome | oxlint + oxfmt |
| 型チェック | TypeScript 5.9 | TypeScript 7 |
| テスト | Vitest 4 | Vitest 5 |

## プリレンダリングの設定

ビルドの設定は `vite.config.ts` に収まった。

```ts
export default defineConfig({
	resolve: { tsconfigPaths: true },
	css: { modules: { localsConvention: "camelCaseOnly" } },
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true,
				autoSubfolderIndex: false,
				filter: ({ path }) => !path.includes("?"),
			},
			pages: [{ path: "/sitemap.xml" }, { path: "/chatbot-context.json" }],
		}),
		viteReact(),
	],
});
```

`crawlLinks` を有効にすると、トップページからリンクをたどって全記事を書き出してくれる。Next.js の `generateStaticParams` にあたるものを書く必要がない。  
`sitemap.xml` とチャットボット用の JSON はコンポーネントを持たないサーバールートなので、リンクからは見つからない。`pages` に書いておくと静的ファイルとして出力される。

`wrangler.jsonc` からは KV の設定が消えて、エントリポイントを指定するだけになった。

```jsonc
{
	"name": "blog-kzhrk-com",
	"compatibility_date": "2026-11-23",
	"compatibility_flags": ["nodejs_compat"],
	"main": "@tanstack/react-start/server-entry"
}
```

## 記事の読み込み

TanStack Start の loader は、サーバーだけでなくクライアント遷移のときにブラウザでも実行される。Next.js の Server Components のつもりで `readFile` を書くと動かない。  
そもそも Worker にはファイルシステムがないので、Markdown は `import.meta.glob` でバンドルに含めることにした。

```ts
const files = import.meta.glob<string>("../../posts/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});
```

そのうえで、Markdown の解析はサーバー関数に閉じ込めて、loader からはそれを呼ぶ。

```ts
export const fetchPost = createServerFn({ method: "GET" })
	.validator((slug: string) => slug)
	.handler(({ data }) => getPost(data));

export const Route = createFileRoute("/posts/$")({
	loader: async ({ params }) => {
		const post = await fetchPost({ data: params._splat ?? "" });
		if (!post) throw notFound();
		return post;
	},
	component: PostPage,
});
```

こうしておくと gray-matter、marked、highlight.js と記事の Markdown はクライアントのバンドルに入らない。

URL を直接開いたときはプリレンダリング済みの HTML が静的アセットとして返るので、Worker は動かない。  
Worker が動くのは、クライアント遷移でサーバー関数が呼ばれたときと、存在しない URL に 404 を返すときだけだ。

## Panda CSS から CSS Modules へ

前回の記事で「今後も積極的に活用していきたい」と書いた Panda CSS は、1 年もたずにやめた。

実態として、スタイルのほとんどは 1,000 行近い `globals.css` に書いていて、Panda CSS を使っていたのは 404 ページとエラーページくらいだった。そのためにコード生成の仕組みを抱えているのは割に合わない。  
`globals.css` は、それを使うレイアウト、ページ、コンポーネントごとの CSS Modules に分割した。グローバルに残したのは CSS 変数とリセットの 2 ファイルだけだ。

分割するときに決めたことがいくつかある。

- CSS 側のクラス名は変えず、`localsConvention: "camelCaseOnly"` を指定して `styles.siteHeaderInner` のように参照する。ルールを移動するだけで済むので、差分を追いやすい。
- marked が出力する HTML のクラス名はハッシュ化できないので、`.body :global(.heading)` のように書く。
- Panda CSS の preflight が担っていたリセットは、`@layer reset` に書き起こした。

## 静的解析とテスト

Biome は oxlint と oxfmt に置き換えた。  
oxfmt の設定は `oxfmt --migrate=biome` で `biome.json` から生成できる。oxlint には移行手段がないので、correctness カテゴリを有効にして手で設定した。  
oxlint が見るのは JS と TS だけなので、Biome がやっていた CSS の lint はなくなった。

TypeScript は 7 系に上げた。7.1 を使いたかったが、まだ beta だったので 7.0 にしている。  
これまで型チェックは `next build` の中でしか走っていなかった。`tsc --noEmit` を CI に入れたので、PR の時点で型エラーに気づけるようになった。

Vitest は 5 系に上げた。`clearMocks` の既定値が `true` になったことと、`vite` が peer dependency になったことが影響した。

## ハマったところ

### タグの絞り込みがトップページを上書きした

トップページにはタグで絞り込む機能があって、URL は `/?tag=技術` のようになる。  
`crawlLinks` はこのリンクもたどるので、絞り込んだ状態の一覧が `index.html` として書き出され、絞り込みなしのトップページを上書きしてしまった。  
`prerender.filter` でクエリ付きの URL を除外して解決した。

### 組み込みの sitemap が使えなかった

TanStack Start には sitemap を出力する機能があるが、`lastmod` がビルドした日になり、タグ絞り込みの URL まで含まれた。  
記事の日付を `lastmod` に入れたかったので、サーバールートで自分で出力している。

## 進め方

今回の移行は、実装のほとんどを Claude Code に任せた。

最初に技術選定の相談をして、方針をリポジトリの `docs/` に Markdown で残してもらった。実装はその方針を見ながら進めてもらい、方針から変えた点や確認した結果も同じファイルに追記している。  
コミットは、フォーマットだけの変更、フレームワークの移行、CSS の分割というようにレビューしやすい単位に分けてもらった。全ファイルに差分が出るフォーマットの変更が別のコミットになっているだけで、読む負担はかなり違った。

## まとめ

Next.js をやめて、設定ファイルと依存パッケージがだいぶ減った。  
OpenNext と KV がなくなり、ビルドは `vite build`、デプロイは `wrangler deploy` だけになった。ブログの規模に対して、ちょうどいい大きさに収まったと思う。

次に載せ替えるのがいつになるかはわからないが、しばらくはこの構成で記事を書いていきたい。
