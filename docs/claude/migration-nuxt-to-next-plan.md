# Nuxt から Next.js への移行計画

## 概要

本ドキュメントは、blog.kzhrk.com を Nuxt 3 (Vue) から Next.js (React) へ移行し、Cloudflare Workers + Cloudflare Pages でホスティングするための詳細な実装方針を記載する。

## 技術スタックの変更

| 項目 | 現行 (Nuxt 3) | 移行後 (Next.js) |
|------|--------------|------------------|
| フレームワーク | Nuxt 3.15.4 | Next.js 15.x |
| UI ライブラリ | Vue 3.5.13 | React 19.x |
| ルーティング | vue-router | Next.js App Router |
| スタイリング | Tailwind CSS | Tailwind CSS (継続) |
| Markdown 処理 | marked + parse-md | marked + gray-matter |
| コードハイライト | highlight.js | highlight.js (継続) |
| 日付処理 | date-fns | date-fns (継続) |
| ホスティング | GitHub Pages (静的) | Cloudflare Workers (SSR) |
| 静的アセット | GitHub Pages | Cloudflare Pages |
| ビルドツール | Vite | Next.js (Turbopack) |
| テスト | Vitest | Vitest (継続) |
| リント | Biome | Biome (継続) |

## アーキテクチャ

### Cloudflare 構成

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare CDN                          │
│                   (blog.kzhrk.com)                          │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   Cloudflare Workers    │     │    Cloudflare Pages     │
│   (Next.js SSR)         │     │    (静的アセット)        │
│                         │     │                         │
│ - Server Components     │     │ - /images/*             │
│ - API Routes            │     │ - /favicon.png          │
│ - Dynamic Rendering     │     │ - /_next/static/*       │
└─────────────────────────┘     └─────────────────────────┘
```

### デプロイ方式

**OpenNext (@opennextjs/cloudflare)** を使用する。

- Cloudflare が公式に推奨する Next.js デプロイ方式
- Node.js ランタイムをサポート（Edge ランタイムではなく）
- App Router、ISR、Image Optimization などの機能をフルサポート
- `@cloudflare/next-on-pages` は Edge ランタイムのみで機能制限があるため非推奨

## ディレクトリ構造

### 現行 (Nuxt 3)

```
/
├── app/
│   ├── app.vue
│   ├── pages/
│   │   ├── index.vue
│   │   ├── posts/[...slug].vue
│   │   └── [...slug].vue
│   ├── components/
│   │   └── PostInfo.vue
│   ├── layouts/
│   │   └── default.vue
│   └── server/
│       └── utils/
│           └── postCache.ts
├── server/
│   └── api/
│       ├── posts/
│       │   ├── index.ts
│       │   └── [...slug].ts
│       └── tags/
│           └── index.ts
├── posts/
│   └── *.md
├── public/
├── types/
├── nuxt.config.ts
└── package.json
```

### 移行後 (Next.js)

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # ルートレイアウト (default.vue 相当)
│   │   ├── page.tsx                # トップページ (index.vue 相当)
│   │   ├── globals.css             # グローバルスタイル
│   │   ├── posts/
│   │   │   └── [...slug]/
│   │   │       └── page.tsx        # 記事詳細ページ
│   │   └── not-found.tsx           # 404 ページ
│   ├── components/
│   │   ├── PostInfo.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── posts.ts                # 記事取得ロジック (postCache.ts 相当)
│       └── markdown.ts             # Markdown 処理
├── posts/
│   └── *.md
├── public/
│   ├── images/
│   └── favicon.png
├── types/
│   └── index.ts
├── next.config.ts
├── wrangler.jsonc                  # Cloudflare Workers 設定
├── tailwind.config.ts
└── package.json
```

## ファイル移行マッピング

### ページコンポーネント

| Nuxt (現行) | Next.js (移行後) | 備考 |
|-------------|------------------|------|
| `app/app.vue` | `src/app/layout.tsx` | ルートレイアウト、メタタグ、GTM |
| `app/pages/index.vue` | `src/app/page.tsx` | Server Component として実装 |
| `app/pages/posts/[...slug].vue` | `src/app/posts/[...slug]/page.tsx` | 動的ルート |
| `app/pages/[...slug].vue` | `src/app/not-found.tsx` | 404 ページ |
| `app/layouts/default.vue` | `src/app/layout.tsx` | Header/Footer を統合 |

### コンポーネント

| Nuxt (現行) | Next.js (移行後) | 備考 |
|-------------|------------------|------|
| `app/components/PostInfo.vue` | `src/components/PostInfo.tsx` | Vue → React 変換 |

### サーバーロジック

| Nuxt (現行) | Next.js (移行後) | 備考 |
|-------------|------------------|------|
| `app/server/utils/postCache.ts` | `src/lib/posts.ts` | Server-only ユーティリティ |
| `server/api/posts/index.ts` | 不要 | Server Component で直接呼び出し |
| `server/api/posts/[...slug].ts` | 不要 | Server Component で直接呼び出し |
| `server/api/tags/index.ts` | 不要 | Server Component で直接呼び出し |

### 設定ファイル

| Nuxt (現行) | Next.js (移行後) | 備考 |
|-------------|------------------|------|
| `nuxt.config.ts` | `next.config.ts` | フレームワーク設定 |
| `tailwind.config.js` | `tailwind.config.ts` | TypeScript 化 |
| - | `wrangler.jsonc` | Cloudflare Workers 設定 |

## 主要な変更点

### 1. Vue → React コンポーネント変換

#### PostInfo コンポーネント

**現行 (Vue)**
```vue
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
```

**移行後 (React)**
```tsx
import { format } from "date-fns";
import Link from "next/link";

interface PostInfoProps {
  tags?: string[];
  date: string;
}

export function PostInfo({ tags, date }: PostInfoProps) {
  const formattedDate = format(date, "yyyy年M月d日");

  return (
    <>
      <time className="text-sm" dateTime={date}>
        {formattedDate}
      </time>
      {tags && tags.length > 0 && (
        <ul className="flex gap-4 items-center ml-4">
          {tags.map((tag, i) => (
            <li key={i}>
              <Link
                href={`/?tag=${tag}`}
                className="text-xs block px-2 py-1 text-gray-700 bg-blue-100 hover:bg-blue-200"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
```

### 2. データフェッチング

**現行 (Nuxt useFetch)**
```vue
<script lang="ts" setup>
const { data: allPosts } = await useFetch("/api/posts");
const { data: allTags } = await useFetch("/api/tags");
</script>
```

**移行後 (Next.js Server Component)**
```tsx
// Server Component (デフォルト)
import { getAllPosts, getAllTags } from "@/lib/posts";

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();

  return <PostList posts={allPosts} tags={allTags} />;
}
```

### 3. クライアントサイドロジック (タグフィルタリング)

**現行 (Vue)**
```vue
<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const selectedTag = ref(route.query.tag || "");

function onChangeTag() {
  router.push({
    query: { tag: selectedTag.value ? selectedTag.value : undefined },
  });
}
</script>
```

**移行後 (React Client Component)**
```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function TagFilter({ tags, posts }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");

  function onChangeTag(tag: string) {
    setSelectedTag(tag);
    const params = new URLSearchParams(searchParams);
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    router.push(`/?${params.toString()}`);
  }

  // ...
}
```

### 4. メタタグ / Head 管理

**現行 (Nuxt useHead)**
```vue
<script lang="ts" setup>
useHead(() => ({
  title: metaTitle,
  meta: [
    { name: "description", content: description },
    { name: "twitter:title", content: metaTitle },
  ],
}));
</script>
```

**移行後 (Next.js Metadata API)**
```tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: `${post.title} | blog.kzhrk.com`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://blog.kzhrk.com/posts/${params.slug.join("/")}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
    },
  };
}
```

### 5. 記事取得ロジック

**現行 (postCache.ts)**
```typescript
import { readFile, readdir } from "node:fs/promises";
import { marked } from "marked";
import parseMD from "parse-md";

class PostCache {
  private cache = new Map<string, CachedPost>();
  // ...
}

export const postCache = new PostCache();
```

**移行後 (posts.ts)**
```typescript
import { readFile, readdir } from "node:fs/promises";
import { marked } from "marked";
import matter from "gray-matter";
import { cache } from "react";

// React の cache() を使用してリクエスト単位でメモ化
export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const filename = slug.replace(/\//g, "-");
  const filePath = `./posts/${filename}.md`;

  try {
    const file = await readFile(filePath, "utf-8");
    const { data: metadata, content } = matter(file);

    const html = await marked.parse(content);

    return {
      metadata: metadata as Metadata,
      content,
      html,
      path: `/${slug}`,
    };
  } catch {
    return null;
  }
});

export const getAllPosts = cache(async (): Promise<PostSummary[]> => {
  const files = await readdir("./posts");
  // ...
});
```

### 6. コードハイライト

**現行 (クライアントサイド)**
```vue
<script lang="ts" setup>
import hljs from "highlight.js";

onMounted(() => {
  hljs.highlightAll();
});
</script>
```

**移行後 (サーバーサイド)**
```typescript
// src/lib/markdown.ts
import { marked } from "marked";
import hljs from "highlight.js";

marked.use({
  renderer: {
    code({ text, lang }) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    },
  },
});

export async function parseMarkdown(content: string): Promise<string> {
  return marked.parse(content);
}
```

### 7. GTM (Google Tag Manager)

**現行 (Nuxt config)**
```typescript
// nuxt.config.ts
app: {
  head: {
    script: [
      {
        innerHTML: `(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-5WPKT2H7');`,
      },
    ],
  },
}
```

**移行後 (Next.js)**
```tsx
// src/app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-5WPKT2H7');`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5WPKT2H7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
```

## Cloudflare 設定

### wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "blog-kzhrk-com",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-04-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  // KV バインディング（ISR キャッシュ用、必要に応じて）
  "kv_namespaces": [
    {
      "binding": "NEXT_CACHE",
      "id": "<KV_NAMESPACE_ID>"
    }
  ]
}
```

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Workers 向け設定
  output: "standalone",

  // 画像最適化（Cloudflare Images または外部サービス使用時）
  images: {
    unoptimized: true, // または Cloudflare Images を設定
  },

  // 環境変数
  env: {
    SITE_URL: "https://blog.kzhrk.com",
  },
};

export default nextConfig;
```

### open-next.config.ts

```typescript
import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
    },
  },
};

export default config;
```

## package.json

```json
{
  "name": "blog.kzhrk.com",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@9.4.0",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "preview": "opennextjs-cloudflare && wrangler dev",
    "deploy": "opennextjs-cloudflare && wrangler deploy",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "date-fns": "^4.1.0",
    "gray-matter": "^4.0.3",
    "highlight.js": "^11.11.1",
    "marked": "^15.0.7",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "@opennextjs/cloudflare": "^0.5.0",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.6",
    "wrangler": "^3.99.0"
  }
}
```

## GitHub Actions (CI/CD)

### .github/workflows/deploy.yml

```yaml
name: deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.4.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build and Deploy to Cloudflare
        run: pnpm deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

## 移行手順

### フェーズ 1: 環境構築

1. [ ] Cloudflare アカウントの準備
   - Workers サブスクリプション確認（Free プランでも可、ただし 3 MiB 制限あり）
   - API トークン発行
   - カスタムドメイン設定

2. [ ] プロジェクト初期化
   - `npx create-next-app@latest` で新規プロジェクト作成
   - または既存ディレクトリで Next.js 依存関係追加

3. [ ] 開発環境設定
   - TypeScript 設定
   - Tailwind CSS 設定
   - Biome 設定移行
   - Vitest 設定

### フェーズ 2: コア機能移行

4. [ ] 型定義移行
   - `types/index.d.ts` → `types/index.ts`

5. [ ] 記事取得ロジック移行
   - `postCache.ts` → `src/lib/posts.ts`
   - `parse-md` → `gray-matter` への移行

6. [ ] Markdown 処理移行
   - `src/lib/markdown.ts` 作成
   - カスタム renderer 移行（見出しアンカー、リンク class）
   - サーバーサイドコードハイライト実装

### フェーズ 3: ページ・コンポーネント移行

7. [ ] レイアウト移行
   - `src/app/layout.tsx` 作成
   - Header / Footer コンポーネント分離
   - GTM 統合

8. [ ] トップページ移行
   - `src/app/page.tsx` (Server Component)
   - タグフィルター (Client Component)

9. [ ] 記事詳細ページ移行
   - `src/app/posts/[...slug]/page.tsx`
   - `generateMetadata` 実装
   - Twitter 共有ボタン

10. [ ] 共通コンポーネント移行
    - `PostInfo.tsx`

### フェーズ 4: Cloudflare 設定

11. [ ] Cloudflare Workers 設定
    - `wrangler.jsonc` 作成
    - `open-next.config.ts` 作成

12. [ ] ローカル動作確認
    - `pnpm preview` でローカル Workers 環境テスト

### フェーズ 5: デプロイ・移行

13. [ ] CI/CD 設定
    - GitHub Actions ワークフロー更新
    - シークレット設定 (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)

14. [ ] ステージング環境デプロイ
    - プレビュー URL で動作確認

15. [ ] 本番移行
    - DNS 設定変更（GitHub Pages → Cloudflare）
    - 本番デプロイ

16. [ ] 後片付け
    - 古い Nuxt コード削除
    - GitHub Pages 設定削除

## サイトマップ対応

### 現行 (@nuxtjs/sitemap)

Nuxt モジュールで自動生成。

### 移行後

Next.js の `sitemap.ts` を使用：

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postUrls = posts.map((post) => ({
    url: `https://blog.kzhrk.com/posts${post.path}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://blog.kzhrk.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postUrls,
  ];
}
```

## 注意点とリスク

### 1. Worker サイズ制限

- Free プラン: 3 MiB
- Paid プラン: 10 MiB
- 対策: 依存関係の最小化、必要に応じて Paid プランへアップグレード

### 2. Node.js API 互換性

- Cloudflare Workers の Node.js 互換性は完全ではない
- `fs` モジュールはビルド時のみ使用可能（静的生成）
- 対策: 記事データをビルド時に生成するか、KV/R2 に保存

### 3. ISR (Incremental Static Regeneration)

- Cloudflare Workers で ISR を使用する場合、KV バインディングが必要
- 代替案: ビルド時に全記事を静的生成（現行と同様）

### 4. 画像最適化

- Next.js の Image Optimization は Workers でネイティブサポートされていない
- 対策: `unoptimized: true` または Cloudflare Images を使用

### 5. posts/ ディレクトリの扱い

Cloudflare Workers ではファイルシステムアクセスが制限される。以下のいずれかの方法で対応：

**方法 A: ビルド時に記事を埋め込む (推奨)**
```typescript
// next.config.ts
import { readdirSync, readFileSync } from "node:fs";

// ビルド時に記事データを生成
const posts = readdirSync("./posts").map((file) => ({
  filename: file,
  content: readFileSync(`./posts/${file}`, "utf-8"),
}));

// 環境変数または静的インポートで渡す
```

**方法 B: Cloudflare R2/KV に記事を保存**
```typescript
// ビルドスクリプトで記事を R2 にアップロード
// ランタイムで R2 から取得
```

**方法 C: 完全な静的生成 (SSG)**
```typescript
// 全ページをビルド時に生成
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.path.split("/").filter(Boolean),
  }));
}
```

## 参考資料

- [Next.js on Cloudflare Workers (公式ドキュメント)](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Cloudflare Workers Node.js 互換性](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)
