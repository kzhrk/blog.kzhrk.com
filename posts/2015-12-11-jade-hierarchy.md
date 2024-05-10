---
date: 2016-04-19T00:00:00+09:00
title: Jade(Pug)でディレクトリ構造を維持して出力する方法
tags: [技術]
---

最近、gulp を使わずに npm-scripts を使ってタスク管理していたら HTML テンプレートエンジンの Jade で少し躓いた。

gulp を使っていれば、下記のように書けば階層構造を維持したまま出力してくれる。

```
gulp = require 'gulp'
jade = require 'gulp-jade'
gulp.task 'jade', ->
  gulp
    .src('./src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./public'))
```

```
├── public
│   ├── hoge
│   │   └── index.html
│   └── index.html
└── src
    ├── hoge
    │   └── index.jade
    └── index.jade
```

しかし、jade コマンドで下記のように実行するとフラットな状態で出力されていた。

```
$ jade src --out public
```

```
├── public
│   └── index.html
└── src
    ├── hoge
    │   └── index.jade
    └── index.jade
```

オフィシャルのドキュメントを読んでもそれっぽいオプションがなかったので、[GitHub の issue](https://github.com/pugjs/pug/pull/1889)を漁ってたら hierarchy オプションが追加されてた…

```
$ jade src --hierarchy --out public
```

オフィシャルのドキュメントが信用ならないパターンもある。
