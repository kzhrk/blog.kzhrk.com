+++
layout = "post"
date = "2015-09-30T12:00:00+09:00"
title = "HTML5とか勉強会 第60回に参加してきた"
+++

2015/09/29にMicrosoft本社で開催された[HTML5とか勉強会](https://html5j.doorkeeper.jp/events/31943)に参加してきた。

ES2015（ES6）とES7のお話。

### これからのJavaScriptの話 ~そしてES7へ~
- 登壇者：[1000ch](https://twitter.com/1000ch)
- [スライド](https://speakerdeck.com/1000ch/javascript-in-future)

ECMA ScriptとJavaScriptとの関係性と、ES2015(ES6)で実装された主なSyntax、Global Objectについて。結構ざっくりな説明とサンプルコード。

ES7の進捗状態（Proposal）と主な仕様の説明。

### Babel で今すぐ使える ES6 体験
- 登壇者：[takesako](https://twitter.com/takesako)

Template Literalを使って新言語ゼクシィをつくってみたというネタ話。

Babel.jsに関しては、inline mapingでデバッグが楽になるくらいしか触れていなかった。

### ES7 Decorators
- 登壇者：[armorik83](https://twitter.com/armorik83)
- [スライド](http://sssslide.com/speakerdeck.com/armorik83/es7-decorators)
- [JavaScript Decorators - Qiita](http://qiita.com/armorik83/items/e3a0ce67f569ddc4b432)
- [Wrasse](https://www.npmjs.com/package/wrasse)

Angular.jsとMicrosoftが協力するニュース、TypeScript1.5やBabel.jsでdecoratorsが採用された経緯から、ES7でdecoratorが実装されるであろうという説明がわかりやすかった。

あとで調べたら83さんのQiitaの記事を読めば大体書いてあった。

他にはdecoratorsを活用した、npmで公開しているwrasseの説明とか。

リンク貼ろうとしてWrasseでググったら魚のベラが出てきた。83さんが所属するChatWork社内ではプロジェクト名が魚で統一されているからWrasseにしたらしい。ベラの別名であるクサビ（楔）を意味するとか。

### ES7 WebAssembly+SIMD	@_furoshiki (ピクシブ株式会社)
- 登壇者：[_furoshiki](https://twitter.com/_furoshiki)
- [スライド](http://www.slideshare.net/kawada_hiroshi/simdjsecmascript-7)

[WebAssembly](https://brendaneich.com/2015/06/from-asm-js-to-webassembly/)のお話は時間の関係上割愛されていた。

JavaScriptでベクトル演算ができるAPIのSIMD.jsについて。効率化、高速化のアプローチとしていいんじゃないかという話。

SIMDはCPUの機能。SIMDはJSからCPUを操作するAPI。

[waifu2x](https://github.com/nagadomi/waifu2x)にSIMD.jsを適応して処理を高速化するサンプルが用意されていたけど、別に早くなっていなかった…。

JavaScriptでベクトル演算ができるAPIのSIMD.jsについて。効率化、高速化のアプローチとしていいんじゃないかという話。

[waifu2x](https://github.com/nagadomi/waifu2x)にSIMD.jsを適応して処理を高速化するサンプルが用意されていたけど、別に早くなっていなかった…。

SIMB.Float32x4.extractLaneがボトルネックなんじゃないかと漏らしていた。

まだFirefox NightlyやMicrosoft Edgeあたりでしか実装されていないので、こんなのあるんだレベルの認識に留めておく。
