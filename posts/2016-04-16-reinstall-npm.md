---
date: 2016-04-16T00:00:00+09:00
title: nvmで他バージョンのNode.jsのnpmを引き継ぐ
tags: [技術]
---

PC の Node.js のバージョンが古くなっていたのでバージョンを上げてみた。

Node.js のバージョン管理ツールの nvm を使っているけど、いままで新しいバージョンをインストールする度にグローバルにインストールした npm をインストールしなおしていた。

グローバルの npm も大した数がなかったので今まで気にしてこなかったけど、これ何かコマンドあるんじゃないかと思ったらちゃんとオプションがあった。

```
$ nvm install v5.0 --reinstall-packages-from=4.2
```

[Github の README.md](https://github.com/creationix/nvm#usage)にもちゃんと書いてある。

ドキュメントはちゃんと読もうな…。
