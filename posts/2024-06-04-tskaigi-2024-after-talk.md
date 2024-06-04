---
title: "TSKaigi 2024 After Talk に参加した"
date: 2024-06-04
tags: [イベント]
---

2024 年 6 月 4 日に東銀座の LayerX さんで開催された [TSKaigi 2024 After Talk](https://layerx.connpass.com/event/318123/) に参加してきた。  
以前[参加レポート](https://blog.kzhrk.com/posts/2024/05/11/tskaigi-2024)を書いた [TSKaigi 2024](https://tskaigi.org/) のスポンサー企業が開催しているイベントだ。
頭がフレッシュなうちに参加レポートを残す。

## TypeScripterに送るIaCの世界への招待〜AWS CDKと共に〜

クラスメソッドの [@tmk2154](https://x.com/tmk2154) さんのセッション。  
クラスメソッドでは Full Stack TypeScript の案件が増えてきて、フロント、バック、インフラも TypeScript で書いているらしい。

インフラで使われている [AWS CDK](https://aws.amazon.com/jp/cdk/) の紹介がされていた。  
Terraform のようにコードベースでインフラの定義ができる IaC。  
Terraform と異なるのは裏側で AWS の CloudFormation が利用されているので AWS 側の機能を利用できるというのがメリットのようだ。

TypeScript の型をドキュメンテーションとして活用して、コードベースでインフラ設定ができるのはとても体験がよさそうだった。

すでにインフラ構築している場合でも IaC Generator と CDK Migrate を使えば CDK に移行できるという話も紹介されていた。  
おそらく[この記事](https://aws.amazon.com/jp/blogs/news/announcing-cdk-migrate-a-single-command-to-migrate-to-the-aws-cdk/)のことを話している。

## TSKaigiで話しきれなかった事

スライド: https://docs.google.com/presentation/d/1z1ouyBtsNFgdJysGLAKyJXgt4pEHDN3kD555Mh2UiR0/edit#slide=id.g28f41076fda_0_0

TSKaigi のランチセッションで会社紹介に時間を使ったら技術の話ができなかったのでそれを話してもらったセッション。

All JavaScript で書かれた開発環境を JSDocs コメントアウトの型定義を活用して TypeScript の型の恩恵を受けるようにしたというお話だった。

JavaScript を TypeScript 化するには 2 つのアプローチがあって、ファイル単位で TypeScript に置き換える方法と、TypeScript の config で checkJS: true を設定して JavaScript に JSDocs コメントアウトで型を注入していく方法を上げていた。Helpfeel では後者を選択している。

メリットとしては既存コードに手を加えないのでデグレを起こさずに TypeScript の恩恵を受けられる点だ。  
低コストで TypeScript を導入するのであれば非常に良いアプローチだと思う。

## デッドコード撲滅のためにエンドポイントの棚卸し機能を作った話 \~ESLintカスタムルールとtypescript-estree利用のすすめ\~

スライド: https://speakerdeck.com/tarao1006/detudokodopu-mie-notameniendopointonopeng-xie-siji-neng-wozuo-tutahua-eslintkasutamururutotypescript-estreeli-yong-nosusume

API として利用している express のエンドポイントからデッドコードを洗い出すために eslint のカスタムルールを作成したという話。

デッドコードを洗い出す単純な方法としては、エンドポイントと呼び出し部分を洗い出してその差分を割り出せればよいだけだ。  
エンドポイントは express のルータを洗い出せば一覧化できるが、呼び出し部分は書き方が複数パターンあるので洗い出しが難しい。  
エンドポイントを生成する Path クラスを指定して呼び出されるエンドポイントを列挙できるようにしたが、第一引数にテンプレートリテラルを渡されて想定していないエンドポイントの呼び出しが発生する問題を、[@typescript-eslint/typescript-estree](https://typescript-eslint.io/packages/typescript-estree/) の AST を利用して eslint のカスタムルールを書いていた。

エンドポイントの列挙は express を立ち上げてエンドポイントを列挙していたためパフォーマンスに問題があったため、エンドポイントの列挙をしてから express に実装するという流れに変えたという話が最後に出ていた。  
スキーマ開発を導入したという話のように聞こえたが自分の理解がズレているような気もする。

## TypeScriptを活用したi18n化 ＜スプシの翻訳情報を用いた型付けと段階的i18n化に対応したカスタムESLint＞

スライド: https://speakerdeck.com/minako__ph/typescriptwohuo-yong-sitai18ndui-ying

サービスの多言語対応で [@nuxt/i18n](https://i18n.nuxtjs.org/) を利用していて、t の型定義をジェネレートして型安全に多言語対応を実現しているという話。

スプレッドシートで定義した各言語の対応表を JSON 化して型定義に変換しているらしい。コードだけではなく運用フローの構築によって問題を解決しているのがよかった。  

こちらのセッションでも eslint のカスタムルールの話が出てきた。多言語対応する必要があるページにのみ、日本語表示が紛れていないか確認するためのカスタムルールを作成している。  
対象ページを管理する JSON に Nuxt のページコンポーネントのパスを指定して、そのパスから再帰的にすべての Vue ファイルと TypeScript ファイルを検索していくというものだった。この手の検知は機械的にやるのが安全で低コスト（初期コストは高い）なので eslint は便利だなあと思った。

## Effectで作る堅牢でスケーラブルなAPIゲートウェイ（拡大版）

スライド: https://speakerdeck.com/yasaichi/en-robust-and-scalable-api-gateway-built-on-effect

[Effect](https://effect.website/) を利用して API ゲートウェイの実装をしたお話。

Effect ははじめて聞いたが、非同期をラップしてくれている賢い Promise のようなものだった。  
TSKaigi のセッションでも話題にあがっていた Result 型を提供してくれているライブラリでもあるようだ。

Effect のコードは慣れないと読みづらいような印象を受けたが、関数型っぽく非同期処理をシンプルにまとめるにはいいライブラリのように思えた。

## 社内 TSKaigi 実施を経た Full Stack TypeScript 強化の道

スライド: https://speakerdeck.com/niwatakeru/roadmap-to-the-next-generation-of-full-stack-typescript

TSKaigi でもセッションがいくつかあったアセンドさんのセッション。  
会社の生産性向上のために Full Stack TypeScript に舵を切って、TypeScript への投資のために TSConfJP の運営者とコンタクトをとって TSKaigi の立ち上げに動いたというのは熱意と戦略性があって非常によい話だった。

## Full TypeScriptな構成を支えるRemixの実態

スライド: https://speakerdeck.com/mackay_1503/full-typescriptnagou-cheng-wozhi-eruremixnoshi-tai

Remix を実践導入した事例。

- クラサバの見通しがよい
- Remix が提供する状態管理に乗っかれる
- 裏側は express だが、[アダプター](https://remix.run/docs/en/main/other-api/adapter#community-adapters)が用意されていて拡張性が高い

というのが強みのようだった。

## TSKaigi で `Type<Challenge[]>` を配ってみた

スライド: https://docs.google.com/presentation/d/e/2PACX-1vSXoHQSSU5CM0DkSbagdl3brw8W0CDixGPGipiNVyCJjhI-ueAjjPCZWksr2ufEU9vN80C3lOivIxvi/pub?start=false&loop=false&delayms=3000&slide=id.gc6f73a04f_0_0

型パズルの問題紹介。  
5 分で考えるには難しすぎた。

## 組み込み型から学ぶUnion Distributionの活用法

スライド: https://speakerdeck.com/suke/zu-miip-mixing-toraiburarinoxing-karaxue-buunion-distributionnohuo-yong-fa

こちらも型パズルのお話。Union 分配の罠っぽい挙動が解説されていた。  
型合成で頭を抱えることがあるのでこの辺りの説明は非常に助かる。

## 個別リポジトリからフルTypeScriptのモノレポ(Nx)に移行した話

スライド: https://speakerdeck.com/mokoshi/ge-bie-ripozitorikara-full-stack-typescript-no-monorepo-nx-niyi-xing-sitahua

複数リポジトリで管理されていたサービスのコードを [Nx](https://nx.dev/) でものレポ化したというお話。  
API サーバ、Web アプリ、React Native のモバイルアプリなどは TypeScript 化されていたのでモノレポ化する恩恵（共通コードの共有、型共有など）が大きいと判断してモノレポ化を決意したとのこと。

## 懇親会

Vue.js 日本ユーザーグループのふじたさんに挨拶できたのがよかった。

副業で酒販免許を取っているエンジニアさんに TypeScript ではなく永遠と酒販と音楽のお話を聞かせてもらった。
