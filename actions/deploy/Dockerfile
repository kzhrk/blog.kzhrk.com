FROM node:8.12.0-alpine

LABEL "com.github.actions.name"="deploy"
LABEL "com.github.actions.description"="deploy"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="https://github.com/kzhrk/blog.kzhrk.com"
LABEL "homepage"="https://github.com/kzhrk/blog.kzhrk.com"
LABEL "maintainer"="kzhrk <info@kzhrk.com>"

RUN npm install -g gh-pages

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
