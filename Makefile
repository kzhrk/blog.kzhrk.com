# define variable
SRC := ./src
PUBLIC := ./static
TEMP := ./tmp
DEVELOPMENT := development

.PHONY: help
help:
	@echo make install : npm install
	@echo make start : production
	@echo make start env=development : development

.PHONY: install
install:
	# webpack
	@npm i -D webpack webpack-cli
	# babel
	@npm i -D babel-core babel-loader babel-preset-env
	# eslint & prettier
	@npm i -D eslint eslint-config-prettier eslint-plugin-prettier prettier
	# postcss
	@npm i -D postcss-cli precss postcss-import cssnano autoprefixer
	# css vendoer
	@npm i -D reset-css
	# watch
	@npm i -D watch
	# copy
	@npm i -D cpx
	# font
	@npm i -D fontello-cli

.PHONY: start
start:
	@make hugo & postcss & make watch

.PHONY: build
build:
	@make postcss

.PHONY: webpack
webpack:
ifeq ($(env), $(DEVELOPMENT))
	@npx webpack -w --mode development
else
	@npx webpack -w --mode production
endif

.PHONY: postcss
postcss:
	@npx postcss ${SRC}/css/*.css -c ./postcss.config.js --no-map -b ${SRC}/css -x css -d ${PUBLIC}/css

.PHONY: hugo
hugo:
	@hugo server -D

.PHONY: eslint
eslint:
	@npx eslint --fix --ext .js ${SRC}/webpack

.PHONY: copy
copy:
	@npx cpx "${SRC}/assets/**/*" ${PUBLIC} -w

.PHONY: watch
watch:
	@npx watch "make postcss" ${SRC}/css --interval=15

.PHONY: font-install
font-install:
	@npx fontello-cli --config ./font.config.json install
	@mkdir -p ${SRC}/css/foundation/font
	@mkdir -p ${SRC}/font
	@mv ./fontello-*/css/* ${SRC}/css/foundation/font
	@mv ./fontello-*/font/* ${SRC}/font
	@rm -rf ./fontello-*