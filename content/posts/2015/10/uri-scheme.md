---
layout: post
date: 2015-10-27T10:51:43+09:00
title: URI Scheme
draft: true
---

Qiitaで[URI SchemeでTwitterアプリを開く記事](http://qiita.com/kzhrk/items/842c046265e4e50914c6)が最近よくストックされているのでこちらのブログでもまとめてみた。

ついでにGoogme MapsのURI Schemeについても調べた。

### URI Schemeとは

インターネット上のデータの所在を表すURI(URL)の先頭部分で、データにアクセスするための手段を表したもの。
URIスキームには通信プロトコル名などが用いられ、Webにアクセスするための"http"、SSL/TLSで暗号化されたWebアクセスを意味する"https"、FTPでファイルを送受信するための"ftp"、ローカルファイルにアクセスするための"file"、メールの送信先を指定する"mailto"などが有名。

### Twitter URI Scheme

TwitterアプリがインストールされたiOS, Androidで下記URIにアクセスするとURIで指定した画面のTwitterアプリが起動する。

#### 新規ツイート画面に固定文字列を挿入

[twitter://post?message=hello%20world](twitter://post?message=hello%20world)

<div id="js-qr-message"></div>

#### ツイート表示

[twitter://status?id=1](twitter://status?id=1)

<div id="js-qr-tweet"></div>

#### スクリーンネームから特定ユーザーのタイムライン表示

[twitter://user?screen_name=kzhrk0430](twitter://user?screen_name=kzhrk0430)

<div id="js-qr-timeline"></div>

#### ツイッターIDから特定ユーザーのタイムライン表示

[twitter://user?id=80150657](twitter://user?id=80150657)

<div id="js-qr-profile"></div>

#### ユーザーのタイムライン表示

[twitter://timeline](twitter://timeline)

<div id="js-qr-my-timeline"></div>

#### ユーザーの通知表示

[twitter://mentions](twitter://mentions)

<div id="js-qr-mentions"></div>

#### ユーザーのダイレクトメッセージ表示

[twitter://messages](twitter://messages)

<div id="js-qr-dm"></div>

### アプリが無いときの対策

#### iOS

```javascript
var iframe = document.createElement('iframe');
var start = new Date().getTime();
iframe.style.border = 'none';
iframe.style.width = '1px';
iframe.style.height = '1px';

iframe.src = 'twitter://post?message=' + encodeURIComponent('ほげほげ #ふがふが');
document.body.appendChild(iframe);

setTimeout(function() {
  var diff = new Date().getTime() - start;

  if (diff < 510) {
    window.location.href = 'http://itunes.com/apps/twitter';
    iframe.parentNode.removeChild(iframe);
  }
}, 500);
```

#### Android

```javascript
var iframe = document.createElement('iframe');
iframe.style.border = 'none';
iframe.style.width = '1px';
iframe.style.height = '1px';

iframe.src = 'twitter://post?message=' + encodeURIComponent('ほげほげ #ふがふが');
document.body.appendChild(iframe);

iframe.onload = function() {
  window.location.href = 'market://details?id=com.twitter.android';
  iframe.parentNode.removeChild(iframe);
};
```

#### Android(Chrome)

```javascript
window.location.href = 'intent://post?message=' + encodeURIComponent('ほげほげ #ふがふが') + '#Intent;scheme=twitter;package=com.twitter.android;end;';
```

### Google Maps URI Scheme

Google Maps APIのパラメータを参考に。

<comgooglemaps://?q=37.759748,-122.427135&center=37.759748,-122.427135>

<div id="js-qr-gmap"></div>

### 代わりにApple Mapを開く

### Sample Code

aタグのURI Schemeを判定してアプリ起動。

<script src="/js/post/2015/10/uri-scheme/qrcode.min.js"></script>
<script>
  (function () {
    [
      {id: 'js-qr-message',     uri: 'twitter://post?message=hello%20world'},
      {id: 'js-qr-tweet',       uri: 'twitter://status?id=1'},
      {id: 'js-qr-timeline',    uri: 'twitter://user?screen_name=kzhrk0430'},
      {id: 'js-qr-profile',     uri: 'twitter://user?id=80150657'},
      {id: 'js-qr-my-timeline', uri: 'twitter://timeline'},
      {id: 'js-qr-mentions',    uri: 'twitter://mentions'},
      {id: 'js-qr-dm',          uri: 'twitter://messages'},
      {id: 'js-qr-gmap',        uri: 'comgooglemaps://?q=37.759748,-122.427135&center=37.759748,-122.427135'}
    ]
    .forEach(function (data) {
      new QRCode(document.getElementById(data.id), {
          text: data.uri,
          width: 100,
          height: 100,
          correctLevel : QRCode.CorrectLevel.H
      });
    });
  })();
</script>
