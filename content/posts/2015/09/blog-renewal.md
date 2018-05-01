---
layout: post
date: 2015-09-25T10:53:28+09:00
title: hello world
---

GitHubにブログを移動しました。

### GitHubまでの経緯

kzhrk.comのドメインを取得してから、レンタルサーバにMovableTypeを入れたりWordPressを入れたりしたけど、ブログレベルのコンテンツをCMSで管理するのは冗長すぎた。

管理画面にログインするのもWYSIWYGの変な挙動に悩まされるのに疲れて、ローカルでページャー等のJSONを生成してJadeに食わせてビルドしていたのが以前のブログ。

Jadeのファイル郡からJSON生成する自前のNode.jsが見るに耐えないほど汚かったので、良さそうなジェネレーターないかなー、と思って探していたら[DocPad](http://docpad.org/)を見つけた。

でもメタ言語のextentionのデフォルトルールがindex.html.jadeとかapp.css.scssとかで気持ち悪かったり、ビルドが重たくて精神的負荷が高かった。で、レイアウトのマークアップだけやって放置してた。

DocPadのことググっていたら、[Hugo](http://gohugo.io/)がいいらしい、Hugoに移行したという記事がいくつか出てきたのでHugoの導入を検討しはじめたのが今年の春先。

Hugoの公式ドキュメントを読むと、[Wercker](http://wercker.com/)を使って自動デプロイしようぜって[項目](https://gohugo.io/tutorials/automated-deployments/)があったのでレンタルサーバからGitHub Pagesに移行した。

今まで更新頻度が上がらなかった理由としては、ネタがない（探していない）っていうのもあるけどそれ以前にデプロイがメンドイっていうのが一番のボトルネックだと思っているので、Werckerの導入で停滞は改善されるはず。はず。

### Hugo導入

Hugoの公式サイトのフッターにbrew install hugoって書かれてるけど、Homebrewだと古いバージョンしか落ちてこないトラップがある。[最新版のバイナリ](https://github.com/spf13/hugo/releases)を落としてくるのが吉。

最初にHomebrewでインストールしたら、partialの記法が現行のドキュメントと違ってビルド失敗してハマってた。

PATH通したら黒い画面で

```
$ hugo new site blog
$ cd blog
$ hugo new post/sample.md
$ hugo server -Dw
```

とかやれば、1313ポートに勝手にサーバ立ててくれます。livereloadもデフォルトでついてる親切仕様。

DocPadに比べると段違いにビルドが早い。Markdownファイル保存すると、1秒もかからずにlivereloadでブラウザが更新される。すごい快適。

Hugoにはオフィシャルのテーマが用意されていたけど、最新版（v0.14）に対応しておらずビルド失敗するものがいくつかあったので、自前でlayoutファイルを用意した。

イチからマークアップする気はなかったので、bootstrapを導入。HTMLは[Start Bootstrap](http://startbootstrap.com/)から拝借。

bootstrapやhighlight.jsなんかはnpmで落として、gulpのモジュールで必要なものだけ引っ張った。

よけいな作業をとことん省いたら、1,2時間くらいでlayoutファイル完成した。

ブログやドキュメント作成には申し分ない機能を備えていて、ドキュメントも充実しているのでHugoオススメです。今回はlayout自前で用意したけど、デフォルトテーマ使えばそれこそ1時間くらいで環境を整えて記事作成に着手できる感じ。
