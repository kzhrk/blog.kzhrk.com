---
title: ブログの技術スタックを刷新した
date: 2026-01-02
tags: [技術]
---

年末年始を利用して、このブログの技術スタックを大幅に刷新した。主な変更点をまとめる。

## Nuxt から Next.js への移行

これまで Nuxt 3 で構築していたブログを Next.js 15 (App Router) に移行した。  
今年から業務で Next.js を触ることになるのでその素振りが目的だ。

### 移行で対応したこと

- App Router への対応（`generateStaticParams`、`generateMetadata` など）
- Cloudflare Workers へのデプロイ設定（`@opennextjs/cloudflare` を使用）
  - `@opennextjs/cloudflare` は Next.js 16 に対応できていないため、Next.js 15 を使っている
- sitemap.ts によるサイトマップ自動生成

## Tailwind CSS から Panda CSS への移行

スタイリングは Tailwind CSS から Panda CSS に移行した。  
Tailwind　CSS は便利であるけどマルチクラスパターンになって可読性が落ちたり設計がしにくかったりするため、何かに移行したいなあとずっと考えていた。  
Panda CSS は CSS-in-JS のアプローチを取りつつ、ビルド時に静的な CSS を生成するため、ランタイムのオーバーヘッドがない。  

### Panda CSS の特徴

- `css()` 関数でタイプセーフにスタイルを記述できる
- `_osDark` などの条件付きスタイルでダークモード対応が容易
- `panda codegen` でスタイルシステムを自動生成

```tsx
import { css } from "styled-system/css";

<div className={css({
  px: "6",
  py: "8",
  backgroundColor: "rgb(229 231 235)",
  _osDark: { backgroundColor: "rgb(31 41 55)" },
})}>
```

## テスト環境の整備

Nuxt でも Vitest を使ったユニットテストの環境は整えていたが、テストコードを書いていない状態だった。  
`@testing-library/react` を使ってコンポーネントテストを書くようにして GitHub Actions で PR 時にテストを自動実行するようにした。

## その他の改善

- 記事の見出しのアンカーリンクアイコンをダークモードに対応
- 404 ページとエラーバウンダリのデザインを改善

## まとめ

Nuxt から Next.js、Tailwind CSS から Panda CSS への移行を通じて、モダンな技術スタックに更新できた。  
特に Panda CSS のタイプセーフなスタイリングは開発体験が良く、今後も積極的に活用していきたい。
