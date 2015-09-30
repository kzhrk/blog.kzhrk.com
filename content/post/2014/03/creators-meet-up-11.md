+++
layout = "post"
date = "2014-03-26T12:54:10+09:00"
title = "Creators Meet Up 11で登壇しました"
keywords = "JavaScript, HTML, CSS, Grunt, Node, フロントエンドエンジニア, kzhrk, Creators Meet Up, CMU"
description = "Creators Meet Up 11で登壇しました。登壇内容とスライドを公開します。"

+++

2013年12月21日に開催された[DSLABさん](http://lab.designsatellites.jp/)主催の勉強会、Creators MeetUP 11で登壇させていただきました。

- [第11回Creators MeetUP開催しました](http://lab.designsatellites.jp/?p=2212)

### 資料

- [スライド](http://kzhrk.github.io/css-selector/slide/)
- [サンプルコード](http://kzhrk.github.io/css-selector/sample/)

### 概要

「CSS Selectorを書こう」というタイトルで、IE6をサポートしないときに使えるCSS Selectorを紹介しました。

[来月9日にサポートが切れる](https://www.microsoft.com/ja-jp/windows/lifecycle/xp_eos.aspx)とはいえ、日本マイクロソフト株式会社様が協賛しているにも関わらず、IE6のサポートをしないCSSのお話をしてしまったのは、配慮が足りていなかったですね…

### IE6でサポートが切れているCSS Selector

- E > F
- E + F
- E ~ F
- E:first-child
- E[attribute=value]

たとえば、IE6のサポートが切れるとE[attribute=value]が使えるので、a(target="\_blank")のように新規ウィンドウ表示のtargetプロパティをもつaタグにわざわざclassを付ける必要ななく、下記のようにCSSを書けば事足ります。

```css
a[target=blank] {
  padding-right: 18px;
  background: url("/images/i_blank.gif") no-repeat right center;
}
```

要素間の兄弟関係でスタイルを当て込む、E > F、E + F、E ~ Fは影響範囲を絞り込んでくれるので、コンポーネント化が叫ばれる昨今では積極的に使っていくべきCSS Selectorだと思います。

### スマートフォンサイトでのCSS Selector

登壇時間が15分と短かったので省きましたが、IE6サポートを切っているサイトだけではなく、スマートフォンサイトのコーディングでもCSS Selectorが適切に使われていないコーディングをしているケースがよく見受けられます。

下記のセレクターくらいは積極的に使っていきましょう。

- E:last-child
- E:nth-child(n)
- E:first-of-type
- E:last-of-type

### 登壇を終えて

人生初の登壇ということで当日はかなり緊張していて、話したかったことがちゃんと伝わったか不安でしたが、Twitterの#cmu_jpのハッシュを見返してみたらレスポンスがちゃんと返って来ていたので安心しました。

また機会があれば、登壇したいです。
