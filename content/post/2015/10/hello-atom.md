+++
date = "2015-10-15T12:00:00+09:00"
title = "Hello Atom!!"
+++

今まで[恋に落ちるという触れ込みのSublime Text2](http://www.sublimetext.com/)を使っていたけど、最近になって[Atom](https://atom.io/)に乗り換えた。

### イケてるところ

コマンドパネルにClose Other Tabsがある。

SettingsからPackagesのステータスがひと目で分かる（Install済、Enable, Disable）。

Packagesの設定画面がある。SublimeだとJSONファイルを編集していたのが途端に理解しやすくなった。Sublimeは設定ファイルをコメント行が書けないJSONなんかにするんじゃなくてyamlにでもするべきだったんじゃ…。

GitのRepositoryを置いておけば、サイドナビと行数表示部分に更新状況が表示される。

### イケてないところ

`⌘+Shift+F`の複数行検索、置換の挙動が怪しい。うまくいったりいかなかったりする。

Preferred Lineの表示/非表示がコマンドパネルから操作できない。SettingsからPreferred Line Lengthを0に設定するか、Core Packagesのwrap-guideをDisableにするしかない。Toggle Preferred Line的なのが欲しい。

### つかってるPackages

まだPackagesの調査を全然行っていないのでオススメのものがあればTwitterなどでリプください。

#### [convert-to-utf8](https://atom.io/packages/convert-to-utf8)

Atomで文字化けするShift_JISなんかをUTF-8に変換してくれる。古いコードの運用つらい。

#### [emmet](https://atom.io/packages/emmet)

マークアップには必須。

#### [japanese-wrap](https://atom.io/packages/japanese-wrap)

マルチバイト文字の折り返しがバグいのを解消してくれる。

#### [jshint](https://atom.io/packages/jshint)

JSHint。ESLintのPackageはまだ見当たらない。

#### [split-diff](https://atom.io/packages/split-diff)

ファイルの差分表示。左右の画面に表示した状態で同時スクロールをしてくれるので便利。
