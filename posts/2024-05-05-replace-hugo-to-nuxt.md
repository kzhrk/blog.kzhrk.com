---
title: "SSG を Hugo から Nuxt に置き換えた"
date: 2024-05-05T00:00:00+09:00
---

kzhrk.com のドメインは大学生か新卒のときに取得したドメインで、最初はレンタルサーバ上の PHP で [Movable Type](https://www.movabletype.org/) を動かしていた。  
たしか新卒の頃の業務で構築していたコーポレートサイトの CMS が Movable Type でその習作としてブログを構築しはじめたと記憶している。  
結局、Movable Type の理解を深めることはなく、業務でよく使っていた WordPress を導入し、その後 Node.js のタスクランナーの [Grunt](https://gruntjs.com/) を利用して自前で SSG (Static Site Generate) をしていた。

[hello world](https://blog.kzhrk.com/posts/2015/09/25/blog-renewal) というポストを 2015 年 9 月 25 日に投稿している。  
このポストを投稿したタイミングで、自前の SSG を Go 言語で書かれた SSG フレームワークの [HUGO](https://gohugo.io/) に乗り換えた。

そして今回、HUGO を Nuxt に載せ替えることにした。

HUGO は HTML ファイル内に独自のテンプレートタグをいくつか記述する必要がある。  
CSS や TypeScript を HUGO 上で利用しようとすると HTML の中身がカオスになりがちだった。  
参考に HUGO 内の JavaScript、PostCSS のビルド設定のドキュメントのリンクを掲載しておく。

- [js.Build | Hugo](https://gohugo.io/functions/js/build/#import-js-code-from-assets)
- [PostCSS | Hugo](https://gohugo.io/hugo-pipes/postcss/)

VSCode Extention で [Hugo Language and Syntax Support](https://marketplace.visualstudio.com/items?itemName=budparr.language-hugo-vscode) があるので Syntax は効くようになるが、公式が出しているものではないという点とメンテナンスが滞っているという点で利用するにはやや不安が残る。

Nuxt は今の業務で常に利用しているもので、Vue コミュニティが出している VSCode Extention は不安なく使えるので、このブログを Hugo から Nuxt に置き換えた。  
ページャーやタグのような機能はまだ実装していないが、細々とメンテナンスして機能やらデザインやらを盆栽的に更新していこうと思う。
