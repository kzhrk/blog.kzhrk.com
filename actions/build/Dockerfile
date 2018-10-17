FROM golang:1.10.3-alpine3.7

LABEL "com.github.actions.name"="build"
LABEL "com.github.actions.description"="build by hugo"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="https://github.com/kzhrk/blog.kzhrk.com"
LABEL "homepage"="https://github.com/kzhrk/blog.kzhrk.com"
LABEL "maintainer"="kzhrk <info@kzhrk.com>"

ENV GOPATH $GOPATH:/go/src

RUN apk update && \
    apk add --update git && \
    rm -rf /var/cache/apk/* && \
    mkdir ~/src && \
    cd ~/src && \
    git clone https://github.com/gohugoio/hugo.git && \
    cd hugo && \
    go install

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
