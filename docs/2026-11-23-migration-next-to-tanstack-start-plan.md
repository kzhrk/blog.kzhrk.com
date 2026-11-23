# Next.js から TanStack Start への移行方針

作成日: 2026-11-23

## 概要

全ページをビルド時にプリレンダリングし、Cloudflare Workers の静的アセットとして配信します。OpenNext と KV を外し、ビルドの仕組みは TanStack Start に任せます。チャットボットの状態はページ遷移をまたいで維持します。あわせて CSS を CSS Modules に、静的解析を oxlint・oxfmt・TypeScript 7 に、テストを Vitest 5 に切り替えます。

## 変わること

| 項目 | 現在 | 移行後 |
|---|---|---|
| フレームワーク | Next.js 16 | TanStack Start 1.x |
| 配信 | OpenNext + KV 2つ | Worker + 静的アセット |
| ハイドレーション | 全体 | 全体（現行と同じ） |
| URL | `/posts/YYYY/MM/DD/slug` | 維持 |
| CSS | `globals.css` + Panda CSS | CSS Modules |
| Lint / Format | Biome | oxlint + oxfmt |
| 型チェック | TypeScript 5.9 | TypeScript 7 系 |
| テスト | Vitest 4 | Vitest 5 |

### 前提にした要件

- 自前のビルドコードは持たない。
- ページ遷移してもチャットボットの会話と開閉状態が残る。
- 実験的と明記された機能（Server Components、Static Server Functions）には依存しない。

### 確認済みの事実

- 公式の概要ページに「TanStack Start is stable」とあり、最新は 1.169.7（2026-11-19 公開）です。
- Vite 8 以上と Node 22.12 以上が必要です。このリポジトリは Vite 8.0.16、Node 26.3.1、React 19 で、要件を満たしています。
- Cloudflare の公式ガイドに、プリレンダリングした HTML を静的アセットとして配信する手順があります。
- Start は静的に import した CSS と CSS Modules をビルド時に検出し、サーバー描画時にそのルートの stylesheet リンクを出力します。
- npm の最新版は oxlint 1.94.0、oxfmt 0.79.0、Vitest 5.1.1、TypeScript 7.0.2 です。TypeScript 7.1 は beta（7.1.0-beta）です。

## ディレクトリ構成

```
├── posts/                          # 変更なし
├── public/                         # 変更なし
├── vite.config.ts                  # 新規
├── wrangler.jsonc                  # KV を外し、main を Start のエントリに変更
├── src/
│   ├── router.tsx                  # 新規: getRouter()
│   ├── routeTree.gen.ts            # 自動生成（lint / format の対象から外す）
│   ├── routes/
│   │   ├── __root.tsx              # layout.tsx を移植。ChatBot はここに置く
│   │   ├── index.tsx               # トップページ（page.tsx）
│   │   ├── posts/$.tsx             # 記事ページ（posts/[...slug]/page.tsx）
│   │   └── chatbot-context[.]json.ts   # サーバールート
│   ├── pages/                      # 新規: ページ本体と同名の .module.css（route から呼ぶ）
│   ├── components/                 # 各コンポーネントと同名の .module.css を並べる
│   ├── lib/
│   │   ├── posts.ts                # Markdown の読み込み方を変更
│   │   ├── posts.functions.ts      # 新規: サーバー関数
│   │   └── …                       # ほかは変更なし
│   └── styles/
│       ├── tokens.css              # CSS 変数（配色・書体・余白）
│       └── base.css                # リセットと要素の基本スタイル
├── postcss.config.mjs              # autoprefixer のみ
├── .oxlintrc.json                  # 新規（biome.json を置き換え）
├── .oxfmtrc.json                   # 新規
└── vitest.config.ts                # Vitest 5 に更新
```

`src/app/`、`next.config.ts`、`open-next.config.ts`、`next-env.d.ts`、`biome.json`、`panda.config.ts`、Panda の生成物（`src/styled-system/` とルート直下の `styled-system/`）は削除します。

## ビルドとデプロイの設定

```ts
// vite.config.ts
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true,
				autoSubfolderIndex: false, // /posts/…/slug.html として出力
			},
			sitemap: { enabled: true, host: "https://blog.kzhrk.com" },
		}),
		viteReact(),
	],
});
```

```jsonc
// wrangler.jsonc
{
	"$schema": "node_modules/wrangler/config-schema.json",
	"name": "blog-kzhrk-com",
	"compatibility_date": "2026-11-23",
	"compatibility_flags": ["nodejs_compat"],
	"main": "@tanstack/react-start/server-entry"
}
```

```jsonc
// package.json
"dev": "vite dev",
"build": "vite build",
"preview": "pnpm build && vite preview",
"deploy": "pnpm build && wrangler deploy",
"lint": "oxlint",
"format": "oxfmt",
"format:check": "oxfmt --check",
"typecheck": "tsc --noEmit",
"test": "vitest run"
```

- 追加するパッケージは `@tanstack/react-start`、`@tanstack/react-router`、`@cloudflare/vite-plugin`、`vite`、`oxlint`、`oxfmt` です。
- 更新するパッケージは `typescript`（7 系）と `vitest`（5 系）です。
- 削除するパッケージは `next`、`@opennextjs/cloudflare`、`@biomejs/biome`、`@pandacss/dev` です。
- GitHub Actions は `pnpm run deploy` のままで動きます。
- `prepare` スクリプト（`panda codegen`）は削除します。

## 記事データの読み込み

ここが現行実装からいちばん変わる部分です。Start の loader はサーバーだけでなく、クライアント遷移時にブラウザでも実行されます。現行の `readFile("./posts/…")` はそのままでは使えません。

### 方針

1. **Markdown をバンドルに含める。** `posts.ts` の `readdir` / `readFile` を `import.meta.glob` に置き換えます。Worker 上にはファイルシステムがないので、実行環境に依存しない読み方にします。
2. **サーバー関数で包む。** `getAllPosts` と `getPost` を `createServerFn` で公開し、loader からはそれを呼びます。gray-matter、marked、highlight.js はクライアントのバンドルに入りません。

```ts
// src/lib/posts.ts
const files = import.meta.glob<string>("../../posts/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

// src/lib/posts.functions.ts
export const fetchPost = createServerFn({ method: "GET" })
	.inputValidator((slug: string) => slug)
	.handler(({ data }) => getPost(data));

// src/routes/posts/$.tsx
export const Route = createFileRoute("/posts/$")({
	loader: async ({ params }) => {
		const post = await fetchPost({ data: params._splat ?? "" });
		if (!post) throw notFound();
		return post;
	},
	head: ({ loaderData }) => ({ /* title / OGP / canonical */ }),
	component: PostPage,
});
```

### 実行時の動き

| 場面 | データの出どころ | Worker の実行 |
|---|---|---|
| URL を直接開く、リロード | プリレンダリング済みの HTML に埋め込み済み | なし（静的アセット） |
| クライアント遷移 | サーバー関数へのリクエスト | あり |
| 存在しない URL | Worker が 404 ページを描画 | あり |

クライアント遷移のたびに Worker が1回動きます。Static Server Functions を使えばこれを静的な JSON に置き換えられますが、公式に実験的と明記されているので、今回は使いません。

## チャットボットの状態維持

`ChatBot` は `__root.tsx` の `<Outlet />` の外に置きます。ルートルートはクライアント遷移で再マウントされないので、`useState` で持っている会話と開閉状態はそのまま残ります。`ChatBot.tsx` の状態管理は変更しません。

| 操作 | 状態 | 現行との差 |
|---|---|---|
| 一覧 ⇄ 記事、タグのリンク、ヘッダーのロゴ | 維持 | 同じ |
| チャットボットの参照記事リンク | 元のタブで維持（別タブで開く） | 同じ |
| 記事本文中のブログ内リンク | 失われる（フルロード） | 同じ |
| リロード、URL の直接入力 | 失われる | 同じ |

下の2行も維持したい場合は、会話を `sessionStorage` に保存する対応が別途必要です。今回の移行範囲には含めていません。

## CSS

Panda CSS と `globals.css`（997 行）をやめ、CSS Modules に分割します。各ファイルは、それを使うレイアウト、ページ、コンポーネントが import します。PostCSS は autoprefixer だけを残します。

| 現在の場所 | 移動先 | import する場所 |
|---|---|---|
| `:root` の CSS 変数 | `styles/tokens.css` | `__root.tsx` |
| リセット、要素の基本スタイル | `styles/base.css` | `__root.tsx` |
| Header / Footer | `Header.module.css` / `Footer.module.css` | 各コンポーネント |
| Filter bar、年別タイムライン | `PostList.module.css` | `PostList.tsx` |
| Post detail、Article prose | `PostPage.module.css` | `pages/PostPage.tsx` |
| ChatBot | `ChatBot.module.css` | `ChatBot.tsx` |
| Responsive | 各 module に分配 | |
| highlight.js のテーマ | 変更なし | `pages/PostPage.tsx` |
| Panda の `css()`（エラー、404） | `ErrorPage.module.css` / `NotFoundPage.module.css` | 各ページ |

### グローバルに残すもの

CSS 変数とリセットは性質上グローバルなので、`tokens.css` と `base.css` の 2 ファイルだけ通常の CSS として `__root.tsx` から import します。リセットは現在 Panda の preflight が担っているので、`base.css` に書き起こします。

### 分割時の決めごと

- **Markdown 由来のクラス:** `heading`、`link`、`hljs`、`chatbot-md__link` は marked が文字列として出力するので、ハッシュ化できません。module の中で `.body :global(.heading)` のように書きます。
- **共有しているクラス:** `tag-chip` は一覧と記事ページの両方で使っています。`TagChip` コンポーネントに切り出します。`meta-en` は `composes` で共有します。
- **import の方法:** すべて静的 import にします。`?url` と `head()` の組み合わせや遅延 import した部品の CSS は、サーバー描画時のリンクに入りません。
- **型:** `tsconfig.json` の `types` に `vite/client` を追加します。

## 静的解析とテスト

| 役割 | 現在 | 移行後 | 補足 |
|---|---|---|---|
| Lint | Biome 2.3.11 | oxlint 1.94 | react、jsx-a11y、typescript、vitest のプラグインを有効にします |
| Format | Biome 2.3.11 | oxfmt 0.79 | TS、JSON、CSS が対象。`posts/` の Markdown は対象外にします |
| 型チェック | `next build` の中でのみ実行 | `tsc --noEmit`（TypeScript 7 系） | スクリプトと CI に追加します |
| テスト | Vitest 4.1 | Vitest 5.1 | Testing Library と happy-dom は継続 |

TypeScript 7.1 はまだ beta です。安定版の 7.0.2 を `^7.0.2` で入れ、7.1 の正式版が出たら上げる方針にしています。beta を今すぐ使う場合は指定を変えます。

### CI

`lint.yml` で `pnpm lint`、`pnpm format:check`、`pnpm typecheck` を実行します。PR の時点で型エラーを検出できるようになります。

### Biome から変わる点

- oxlint が対象にするのは JS と TS です。Biome が行っていた CSS の lint はなくなります。
- Biome からの移行ツールは公式ドキュメントにありません。ルールは recommended 相当を手で設定します。
- フォーマッタが変わるので、初回は全ファイルに差分が出ます。フォーマットだけのコミットに分けます。
- インデントは `.editorconfig` と同じタブに揃えます。

### Vitest 5 で影響する変更

- `clearMocks` の既定値が `true` になります。テスト間でモックの呼び出し履歴が消えます。
- `vi.mock` はトップレベルでしか呼べなくなります。
- `vite` が peer dependency になるので、明示的に追加します。

## Next.js 依存の置き換え

| 現在 | 置き換え先 | 補足 |
|---|---|---|
| `layout.tsx` | `__root.tsx` | `HeadContent` と `Scripts` を使う HTML の骨組み |
| `metadata` / `generateMetadata` | 各ルートの `head()` | 出力するタグは現行と同じにします |
| `generateStaticParams` | `prerender.crawlLinks` | トップページが全記事にリンクしているので、たどって書き出されます |
| `next/link` | `@tanstack/react-router` の `Link` | Header、PostList、記事ページ、404 |
| `useSearchParams` / `useRouter` | `validateSearch` + `Route.useSearch()` + `useNavigate` | `?tag=` が型付きになります |
| `next/script` | `head()` の `scripts` | GTM と Twitter ウィジェット |
| `sitemap.ts` | プラグインの `sitemap` オプション | 出力が現行と合わなければサーバールートで書きます |
| `chatbot-context.json/route.ts` | サーバールート | URL は同じ |
| `not-found.tsx` | `notFoundComponent` | loader からは `notFound()` を投げます |
| `error.tsx` | `errorComponent` | |
| `loading.tsx` | 削除 | プリレンダリング済みなので初回表示では不要 |

### PostList の扱い

`PostList` は選択中のタグと切り替え関数を props で受け取る形にし、ルーターへの依存を `routes/index.tsx` に寄せます。`PostList.spec.tsx` の `next/navigation` と `next/link` のモックは不要になります。

### そのまま使うもの

`ChatBot.tsx` の状態管理、`src/lib/` のチャットボット関連と Markdown 変換は変更しません。`posts.spec.ts` は読み込み方の変更に合わせて書き直します。

## 実装の順序

1. **Lint・Format・テストの入れ替え**
   - Biome を oxlint と oxfmt に置き換え、Vitest を 5 に上げます。フレームワークの移行とは独立しているので、先に済ませます。
   - 確認: `pnpm lint`、`pnpm format:check`、`pnpm test` が通る
2. **検証: 記事 1 本をプリレンダリングする**
   - Start と Cloudflare プラグインを入れ、`__root.tsx` と `posts/$.tsx` だけで `vite build` を通します。Markdown は `import.meta.glob` で読みます。
   - 確認: 記事の HTML が出力され、`vite preview` で表示できる。ここが通らなければ方針を見直します
3. **HTML の骨組み**
   - `__root.tsx` に head、フォント、GTM、CSS、Header、Footer を移植します。
   - 確認: 記事ページの見た目と `<head>` が現行と一致する
4. **トップページとタグ絞り込み**
   - `routes/index.tsx` と `PostList` を移植し、`?tag=` を `validateSearch` で扱います。
   - 確認: 絞り込み、戻る・進む、`/?tag=…` への直接アクセス、全 27 記事の HTML 出力
5. **チャットボット**
   - `ChatBot` をルートに置き、`chatbot-context.json` のサーバールートを作ります。
   - 確認: 会話した状態で一覧 ⇄ 記事を行き来し、会話と開閉状態が残る
6. **sitemap・404・エラー表示**
   - sitemap を有効にし、`notFoundComponent` と `errorComponent` を移植します。
   - 確認: sitemap の URL 一覧を現行と比較、存在しない URL で 404 が返る
7. **Next.js の撤去**
   - パッケージと設定ファイルを削除し、`tsconfig.json`、テスト、README を更新します。TypeScript を 7 系に上げ、`typecheck` を CI に追加します。Next.js のビルドが TypeScript 7 で動くかは未確認なので、Next.js を外すこの段階で上げます。
   - 確認: `pnpm lint`、`pnpm typecheck`、`pnpm test` が通る
8. **CSS Modules への分割**
   - ここまでは `globals.css` を `__root.tsx` から import しておき、この段階で分割します。Panda CSS も同時に外します。
   - 確認: 一覧、記事、404、チャットボットの見た目が分割前と一致する。`vite preview` で初回表示時にスタイルが当たっている
9. **デプロイの切り替え**
   - `wrangler.jsonc` を更新し、`wrangler deploy --dry-run` とローカルのプレビューで確認してからマージします。
   - 確認: 全記事の URL が 200、クライアント遷移時のサーバー関数が応答する

KV の名前空間 2 つは、切り替え後に問題がないことを確認してから手動で削除します。

## 実装時に確認すること

- **Cloudflare プラグイン併用でのプリレンダリング:** 実行環境まわりは過去に不具合報告があります。検証ステップ（手順 2）で確かめます。
- **末尾スラッシュ:** `autoSubfolderIndex: false` の出力と Workers の静的アセットの配信ルールの組み合わせで、現行の URL がリダイレクトなしで返ることを確認します。
- **タグの search params:** TanStack Router は search params を JSON として解釈します。`2024` のような数字だけのタグが数値にならないよう、`validateSearch` で文字列に揃えます。
- **sitemap の内容:** 組み込みの sitemap が現行と同じ URL を出すか比較します。`lastmod` などが必要ならサーバールートに切り替えます。
- **サーバールートのプリレンダリング:** `chatbot-context.json` を静的ファイルとして書き出せるかは公式ドキュメントに記載がありません。書き出せない場合は Worker が応答します。
- **クライアントのバンドル:** gray-matter、highlight.js、記事の Markdown がクライアント側に入っていないことをビルド出力で確認します。
- **gray-matter の動作:** Worker の実行環境で frontmatter の解析が動くことを確認します。
- **CSS のリンク出力:** プリレンダリングした HTML に各ルートの stylesheet リンクが入っていることを確認します。CSS Modules がハイドレーション後にしか当たらないという過去の報告があります。
- **テストでのクラス名:** CSS Modules にするとクラス名が変わります。クラス名で要素を探しているテストがあれば書き換えます。
- **TypeScript 7 での型チェック:** 現在の `tsconfig.json` と TanStack Router の生成する型が `tsc --noEmit` で通ることを確認します。
- **oxfmt の設定:** タブインデントの指定方法と、`posts/` と `routeTree.gen.ts` の除外方法を設定リファレンスで確認します。

### 引き受けるコスト

- Worker は残ります。静的アセットだけの構成にはなりません。
- 記事ページは全体ハイドレーションで、本文は描画済みの HTML とハイドレーション用データの両方に入ります。現行の Next.js と同じ性質です。
- クライアント遷移のたびにサーバー関数へのリクエストが 1 回発生します。
- oxfmt は 0.x 系です。バージョンアップでフォーマット結果が変わる可能性があります。
- CSS の lint はなくなります。

## 参照した公式ドキュメント

- [TanStack Start: Overview](https://tanstack.com/start/latest/docs/framework/react/overview)
- [TanStack Start: Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch)
- [TanStack Start: Static Prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)
- [TanStack Start: Execution Model](https://tanstack.com/start/latest/docs/framework/react/guide/execution-model)
- [TanStack Start: Server Routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes)
- [TanStack Start: SEO](https://tanstack.com/start/latest/docs/framework/react/guide/seo)
- [TanStack Start: Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [TanStack Start: CSS Styling](https://tanstack.com/start/latest/docs/framework/react/guide/css-styling)
- [Cloudflare Workers: TanStack Start](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- [Vitest: Migration Guide](https://vitest.dev/guide/migration.html)
