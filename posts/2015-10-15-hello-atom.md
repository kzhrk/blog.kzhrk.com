---
date: 2015-10-15T12:00:00+09:00
title: Hello Atom!!
tags: [技術]
---

今まで[恋に落ちるという触れ込みの Sublime Text2](http://www.sublimetext.com/)を使っていたけど、最近になって[Atom](https://atom.io/)に乗り換えた。

## イケてるところ

コマンドパネルに Close Other Tabs がある。

Settings から Packages のステータスがひと目で分かる（Install 済、Enable, Disable）。

Packages の設定画面がある。Sublime だと JSON ファイルを編集していたのが途端に理解しやすくなった。Sublime は設定ファイルをコメント行が書けない JSON なんかにするんじゃなくて yaml にでもするべきだったんじゃ…。

Git の Repository を置いておけば、サイドナビと行数表示部分に更新状況が表示される。

## イケてないところ

`⌘+Shift+F`の複数行検索、置換の挙動が怪しい。うまくいったりいかなかったりする。

Preferred Line の表示/非表示がコマンドパネルから操作できない。Settings から Preferred Line Length を 0 に設定するか、Core Packages の wrap-guide を Disable にするしかない。Toggle Preferred Line 的なのが欲しい。

## つかってる Packages

まだ Packages の調査を全然行っていないのでオススメのものがあれば Twitter などでリプください。

### convert-to-utf8

https://atom.io/packages/convert-to-utf8
Atom で文字化けする Shift_JIS なんかを UTF-8 に変換してくれる。古いコードの運用つらい。

### emmet

https://atom.io/packages/emmet  
マークアップには必須。

### japanese-wrap

https://atom.io/packages/japanese-wrap  
マルチバイト文字の折り返しがバグいのを解消してくれる。

### jshint

https://atom.io/packages/jshint  
JSHint。ESLint の Package はまだ見当たらない。

### split-diff

https://atom.io/packages/split-diff  
ファイルの差分表示。左右の画面に表示した状態で同時スクロールをしてくれるので便利。
