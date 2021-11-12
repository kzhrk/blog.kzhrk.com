---
layout: post
title: "Deploy Next.js project to now"
date: 2020-05-06T00:00:00+09:00
---

Next.jsでつくったプロジェクトを、CircleCIから[Vercel](https://vercel.com/)(旧now)にデプロイするときに躓いたので忘備録として記事を残しておく。

### Next.jsでTODOをつくった

Next.jsの習作としてTODOをつくってみた。  
VSCodeのCommand Paletteの操作感が好きなのでキーボード操作でタスクの追加と削除ができるUIになっている。  
Next.js + Material UI + TypeScript + VSCodeで開発すると、型がUIのドキュメンテーションとして機能していて、開発体験が非常によかった。

[CTODO](https://ctodo.now.sh/)

### Vercelへのデプロイ

Vercelへデプロイする場合、最も簡単な方法は[Git Intergration](https://vercel.com/docs/v2/git-integrations/vercel-for-github)でGitHubのリポジトリをVercelプロジェクトに結びつける方法だ。

この方法だと、GitHubにPushしたら必ずデプロイが実行されるようになる。  
テストやlintをパスした状態でデプロイ実行したかったのでCircleCIでWorkflowを定義した。

### VercelのTokenの設定

CircleCIからVercelへデプロイする場合、まず[Account Settings > Tokens](https://vercel.com/account/tokens)のCreateボタンを押下して、Create Tokenモーダルで適当なToken名を設定してTokenを作成する。

次に、CircleCIの環境変数にVercelのTokenを定義する。  
Project Settings > Environment VariablesにNOW_TOKENという名前で先ほどのTokenを設定する。

### デプロイコマンド

npmで提供されているデプロイに使うnowをインストールする。

```
$ yarn add -D now
```

npm-scriptsにデプロイ用のコマンドを追記する。このとき、先ほど作成したCircleCIの環境変数を`token`オプションとして渡す。  
`prod`オプションをつけないとプロジェクト名+ランダム文字列のURLのプレビューURLが発行されるので、production用とpreview用のコマンドを用意した。

```json
{
  "scripts": {
    "deploy:production": "now -t $NOW_TOKEN -c --prod",
    "deploy:preview": "now -t $NOW_TOKEN -c"
  }
}
```

### CircleCIの設定

CircleCIの設定ファイルを作成する。  
nowコマンドはプロジェクトのディレクトリがVercelのプロジェクト名として定義されるので、`working_directory`プロパティを定義してVercelのProduction/Stagingのプロジェクトを出し分ける必要がある。  
CircleCIではデフォルトのディレクトリ名が`project`なので、`working_directory`を指定しなかった場合、Vercelに`project`という名前のプロジェクトが作成される。

Vercelに`ctodo`, `stg-ctodo`のプロジェクトを用意して、`stg-ctodo`プロジェクトをプレビュー用に使うと仮定すると下記のような実装になる。  
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

### 懸念点

Vercelはサービス名がNowから切り替わって間もないので、そのうちnpmで提供されているnowも`@vercel/cli`のようなパッケージ名に変更されそうな予感がある。  
そして変更に伴いオプション変更や設定ファイル（now.json）のアップデートも行われそうなので、ここに残した記事の賞味期限がかなり短そうだ。
