---
date: 2015-09-25T10:53:28+09:00
title: hello world
tags: [技術]
---

GitHub にブログを移動しました。

## GitHub までの経緯

kzhrk.com のドメインを取得してから、レンタルサーバに MovableType を入れたり WordPress を入れたりしたけど、ブログレベルのコンテンツを CMS で管理するのは冗長すぎた。

管理画面にログインするのも WYSIWYG の変な挙動に悩まされるのに疲れて、ローカルでページャー等の JSON を生成して Jade に食わせてビルドしていたのが以前のブログ。

Jade のファイル郡から JSON 生成する自前の Node.js が見るに耐えないほど汚かったので、良さそうなジェネレーターないかなー、と思って探していたら[DocPad](http://docpad.org/)を見つけた。

でもメタ言語の extention のデフォルトルールが index.html.jade とか app.css.scss とかで気持ち悪かったり、ビルドが重たくて精神的負荷が高かった。で、レイアウトのマークアップだけやって放置してた。

DocPad のことググっていたら、[Hugo](http://gohugo.io/)がいいらしい、Hugo に移行したという記事がいくつか出てきたので Hugo の導入を検討しはじめたのが今年の春先。

Hugo の公式ドキュメントを読むと、[Wercker](http://wercker.com/)を使って自動デプロイしようぜって[項目](https://gohugo.io/tutorials/automated-deployments/)があったのでレンタルサーバから GitHub Pages に移行した。

今まで更新頻度が上がらなかった理由としては、ネタがない（探していない）っていうのもあるけどそれ以前にデプロイがメンドイっていうのが一番のボトルネックだと思っているので、Wercker の導入で停滞は改善されるはず。はず。

## Hugo 導入

Hugo の公式サイトのフッターに brew install hugo って書かれてるけど、Homebrew だと古いバージョンしか落ちてこないトラップがある。[最新版のバイナリ](https://github.com/spf13/hugo/releases)を落としてくるのが吉。

最初に Homebrew でインストールしたら、partial の記法が現行のドキュメントと違ってビルド失敗してハマってた。

PATH 通したら黒い画面で

```
$ hugo new site blog
$ cd blog
$ hugo new post/sample.md
$ hugo server -Dw
```

とかやれば、1313 ポートに勝手にサーバ立ててくれます。livereload もデフォルトでついてる親切仕様。

DocPad に比べると段違いにビルドが早い。Markdown ファイル保存すると、1 秒もかからずに livereload でブラウザが更新される。すごい快適。

Hugo にはオフィシャルのテーマが用意されていたけど、最新版（v0.14）に対応しておらずビルド失敗するものがいくつかあったので、自前で layout ファイルを用意した。

イチからマークアップする気はなかったので、bootstrap を導入。HTML は[Start Bootstrap](http://startbootstrap.com/)から拝借。

bootstrap や highlight.js なんかは npm で落として、gulp のモジュールで必要なものだけ引っ張った。

よけいな作業をとことん省いたら、1,2 時間くらいで layout ファイル完成した。

ブログやドキュメント作成には申し分ない機能を備えていて、ドキュメントも充実しているので Hugo オススメです。今回は layout 自前で用意したけど、デフォルトテーマ使えばそれこそ 1 時間くらいで環境を整えて記事作成に着手できる感じ。
