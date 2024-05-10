---
title: "Deploy Next.js project to now"
date: 2020-05-06T00:00:00+09:00
tags: [技術]
---

Next.js でつくったプロジェクトを、CircleCI から[Vercel](https://vercel.com/)(旧 now)にデプロイするときに躓いたので忘備録として記事を残しておく。

## Next.js で TODO をつくった

Next.js の習作として TODO をつくってみた。  
VSCode の Command Palette の操作感が好きなのでキーボード操作でタスクの追加と削除ができる UI になっている。  
Next.js + Material UI + TypeScript + VSCode で開発すると、型が UI のドキュメンテーションとして機能していて、開発体験が非常によかった。

[CTODO](https://ctodo.now.sh/)

## Vercel へのデプロイ

Vercel へデプロイする場合、最も簡単な方法は[Git Intergration](https://vercel.com/docs/v2/git-integrations/vercel-for-github)で GitHub のリポジトリを Vercel プロジェクトに結びつける方法だ。

この方法だと、GitHub に Push したら必ずデプロイが実行されるようになる。  
テストや lint をパスした状態でデプロイ実行したかったので CircleCI で Workflow を定義した。

## Vercel の Token の設定

CircleCI から Vercel へデプロイする場合、まず[Account Settings > Tokens](https://vercel.com/account/tokens)の Create ボタンを押下して、Create Token モーダルで適当な Token 名を設定して Token を作成する。

次に、CircleCI の環境変数に Vercel の Token を定義する。  
Project Settings > Environment Variables に NOW_TOKEN という名前で先ほどの Token を設定する。

## デプロイコマンド

npm で提供されているデプロイに使う now をインストールする。

```
$ yarn add -D now
```

npm-scripts にデプロイ用のコマンドを追記する。このとき、先ほど作成した CircleCI の環境変数を`token`オプションとして渡す。  
`prod`オプションをつけないとプロジェクト名+ランダム文字列の URL のプレビュー URL が発行されるので、production 用と preview 用のコマンドを用意した。

```json
{
	"scripts": {
		"deploy:production": "now -t $NOW_TOKEN -c --prod",
		"deploy:preview": "now -t $NOW_TOKEN -c"
	}
}
```

## CircleCI の設定

CircleCI の設定ファイルを作成する。  
now コマンドはプロジェクトのディレクトリが Vercel のプロジェクト名として定義されるので、`working_directory`プロパティを定義して Vercel の Production/Staging のプロジェクトを出し分ける必要がある。  
CircleCI ではデフォルトのディレクトリ名が`project`なので、`working_directory`を指定しなかった場合、Vercel に`project`という名前のプロジェクトが作成される。

Vercel に`ctodo`, `stg-ctodo`のプロジェクトを用意して、`stg-ctodo`プロジェクトをプレビュー用に使うと仮定すると下記のような実装になる。  
（`now`コマンドの`alias`オプションを利用すれば`stg-ctodo`プロジェクトを用意する必要がなくなると思われる）

```yml
jobs:
  deploy:
    parameters:
      project:
        type: string
        default: stg-ctodo
    working_directory: ~/<< parameters.project >>
    executor:
      name: node/default
    steps:
      - setup
      - run:
          name: deploy to now
          command: |
            if [ ! ${CIRCLE_BRANCH} = staging ] && [ ! ${CIRCLE_BRANCH} = master ]; then
              yarn deploy:preview
            else
              yarn deploy:production
            fi

workflows:
  version: 2
  deploy:
    jobs:
      - deploy:
          name: Deploy to preview
          project: stg-ctodo
          filters:
            branches:
              ignore:
                - staging
                - master
                - development
      - deploy:
          name: Deploy to staging
          project: stg-ctodo
          filters:
            branches:
              only:
                - staging
      - deploy:
          name: Deploy to production
          project: ctodo
          filters:
            branches:
              only:
                - master
```

## 懸念点

Vercel はサービス名が Now から切り替わって間もないので、そのうち npm で提供されている now も`@vercel/cli`のようなパッケージ名に変更されそうな予感がある。  
そして変更に伴いオプション変更や設定ファイル（now.json）のアップデートも行われそうなので、ここに残した記事の賞味期限がかなり短そうだ。
