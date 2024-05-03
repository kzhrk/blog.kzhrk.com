---
date: 2014-03-26T12:54:10+09:00
title: Creators Meet Up 11で登壇しました
---

2013 年 12 月 21 日に開催された[DSLAB さん](http://lab.designsatellites.jp/)主催の勉強会、Creators MeetUP 11 で登壇させていただきました。

- [第 11 回 Creators MeetUP 開催しました](http://lab.designsatellites.jp/?p=2212)

## 資料

- [スライド](http://kzhrk.github.io/css-selector/slide/)
- [サンプルコード](http://kzhrk.github.io/css-selector/sample/)

## 概要

「CSS Selector を書こう」というタイトルで、IE6 をサポートしないときに使える CSS Selector を紹介しました。

[来月 9 日にサポートが切れる](https://www.microsoft.com/ja-jp/windows/lifecycle/xp_eos.aspx)とはいえ、日本マイクロソフト株式会社様が協賛しているにも関わらず、IE6 のサポートをしない CSS のお話をしてしまったのは、配慮が足りていなかったですね…

## IE6 でサポートが切れている CSS Selector

- E > F
- E + F
- E ~ F
- E:first-child
- E[attribute=value]

たとえば、IE6 のサポートが切れると E[attribute=value]が使えるので、a(target="\_blank")のように新規ウィンドウ表示の target プロパティをもつ a タグにわざわざ class を付ける必要ななく、下記のように CSS を書けば事足ります。

```css
a[target="blank"] {
	padding-right: 18px;
	background: url("/images/i_blank.gif") no-repeat right center;
}
```

要素間の兄弟関係でスタイルを当て込む、E > F、E + F、E ~ F は影響範囲を絞り込んでくれるので、コンポーネント化が叫ばれる昨今では積極的に使っていくべき CSS Selector だと思います。

## スマートフォンサイトでの CSS Selector

登壇時間が 15 分と短かったので省きましたが、IE6 サポートを切っているサイトだけではなく、スマートフォンサイトのコーディングでも CSS Selector が適切に使われていないコーディングをしているケースがよく見受けられます。

下記のセレクターくらいは積極的に使っていきましょう。

- E:last-child
- E:nth-child(n)
- E:first-of-type
- E:last-of-type

## 登壇を終えて

人生初の登壇ということで当日はかなり緊張していて、話したかったことがちゃんと伝わったか不安でしたが、Twitter の#cmu_jp のハッシュを見返してみたらレスポンスがちゃんと返って来ていたので安心しました。

また機会があれば、登壇したいです。
