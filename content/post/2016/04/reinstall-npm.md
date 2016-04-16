+++
date = "2016-04-16T00:00:00+09:00"
title = "nvmで他バージョンのNode.jsのnpmを引き継ぐ"

+++

PCのNode.jsのバージョンが古くなっていたのでバージョンを上げてみた。

Node.jsのバージョン管理ツールのnvmを使っているけど、いままで新しいバージョンをインストールする度にグローバルにインストールしたnpmをインストールしなおしていた。

グローバルのnpmも大した数がなかったので今まで気にしてこなかったけど、これ何かコマンドあるんじゃないかと思ったらちゃんとオプションがあった。

```
$ nvm install v5.0 --reinstall-packages-from=4.2
```

[GithubのREADME.md](https://github.com/creationix/nvm#usage)にもちゃんと書いてある。

ドキュメントはちゃんと読もうな…。
