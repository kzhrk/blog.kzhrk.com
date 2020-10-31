FROM klakegg/hugo:0.76.5-onbuild AS hugo

FROM nginx
COPY --from=hugo /target /usr/share/nginx/html