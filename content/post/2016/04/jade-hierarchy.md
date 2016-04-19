+++
date = "2016-04-19T00:00:00+09:00"
title = "Jade(Pug)でディレクトリ構造を維持して出力する方法"

+++

最近、gulpを使わずにnpm-scriptsを使ってタスク管理していたらHTMLテンプレートエンジンのJadeで少し躓いた。

gulpを使っていれば、下記のように書けば階層構造を維持したまま出力してくれる。

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

しかし、jadeコマンドで下記のように実行するとフラットな状態で出力されていた。

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

オフィシャルのドキュメントを読んでもそれっぽいオプションがなかったので、[GitHubのissue](https://github.com/pugjs/pug/pull/1889)を漁ってたらhierarchyオプションが追加されてた…

```
$ jade src --hierarchy --out public
```

オフィシャルのドキュメントが信用ならないパターンもある。
