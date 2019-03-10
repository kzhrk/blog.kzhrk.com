---
layout: post
title: "Migrate storybook v4 to v5"
date: 2019-03-11T00:00:00+09:00
---

###  Storybook v4.0からv5.0にアップデートした

Storybook v5がリリースされたので、v4からv5にアップデートした。  
[公式アナウンスのマイグレーション方法はこちら](https://github.com/storybooks/storybook/blob/next/MIGRATION.md#from-version-41x-to-50x)。

####  webpack.config.js

Storybookのwebpack.config.jsをfull-controll modeで使っている（functionをexportsするやつ）場合は、functionの引数をObjectに変更する必要がある。

```diff
- module.exports = (storybookBaseConfig, configType) => {
+ module.exports = ({config, mode}) => {
```

https://github.com/kzhrk-sandbox/storybook-for-styleguide/commit/26e0974708cef41d56627e95a3ea4a432effa4cc#diff-6da49b24efd584154cfb4ec759745192L3

今までは第一引数、第二引数にStorybookから値が投げ込まれていたが、引数がObjectになったことで変数名（key名）が決め打ちになった。

#### storiesOfの第一引数に日本語が使えない

storiesOfの第一引数のサニタイズに使われている関数が追加され下記リンクのような実装になっているので、storiesOfの第一引数にA-Za-z0-9以外の文字が使えなくなった。

https://github.com/storybooks/storybook/commit/54faca3793338cb521c8b1aaf5801c597f037cb8#diff-18efc3f2c976feeab3887b2fd2a58f7eR15

このサニタイズは、Storybookにカテゴリ名やストーリー名を登録する際に実行される。サニタイズの結果、カテゴリ名やストーリー名がカラになったときにエラーが返却されて登録が弾かれる。

https://github.com/storybooks/storybook/commit/54faca3793338cb521c8b1aaf5801c597f037cb8#diff-18efc3f2c976feeab3887b2fd2a58f7eR21

実際にサニタイズを実行してみると、下記のような結果になる。

```js
'ヘッドライン'
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '') // ''

'headline ヘッドライン'
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '') // 'headline'
```

頭に半角英数を入れればStorybookへの登録はできるが、サニタイズ後の名前が登録されてしまう。  
そのため、`icon: ログイン`や`icon: ログアウト`を登録すると、両方とも`icon`となるため最初に登録されたStoryしか有効にならない。

このサニタイズ部分を修正してテストを実行するといくつかのテストがコケたので、修正のPRを送るのには骨が折れそう。  
ひとまずフォークしてぐちゃぐちゃコードをいじってみようと思う。
