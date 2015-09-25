# @file gulpfile.coffee

# load config
config      = require './gulp.config'

# modules
runSequence = require 'run-sequence'

# gulp modules
gulp        = require 'gulp'
concat      = require 'gulp-concat'
csso        = require 'gulp-csso'
csscomb     = require 'gulp-csscomb'
uglify      = require 'gulp-uglify'
scss        = require 'gulp-sass'

# css files
CSS_LIB_FILES = [
  './node_modules/bootstrap/dist/css/bootstrap.css'
  './node_modules/bootstrap-social/assets/css/font-awesome.css'
  './node_modules/highlight/lib/vendor/highlight.js/styles/github.css'
]

# js files
JS_LIB_FILES = [
  './node_modules/highlight/lib/vendor/highlight.js/highlight.pack.js',
]

# font files
FONT_FILES = [
  './node_modules/bootstrap/dist/fonts/*'
  './node_modules/bootstrap-social/assets/fonts/*'
]

# copy font
gulp.task 'copy:font', ->
  gulp.src FONT_FILES
    .pipe gulp.dest config.font.dest

# tasks related to css
gulp.task 'css', ->
  runSequence('scss', 'css:lib')

gulp.task 'css:lib', ->
  gulp.src CSS_LIB_FILES
    .pipe concat('libs.css')
    .pipe csscomb()
    .pipe csso()
    .pipe gulp.dest(config.css.dest)

gulp.task 'scss', ->
  gulp.src config.scss.src
    .pipe scss()
    .pipe csso()
    .pipe gulp.dest(config.scss.dest)

# tasks related to js
gulp.task 'js', ->
  runSequence('js:lib')

gulp.task 'js:lib', ->
  gulp.src JS_LIB_FILES
    .pipe concat('libs.js')
    .pipe uglify()
    .pipe gulp.dest(config.js.dest)

# watch
gulp.task 'watch', ->
  gulp
    .watch [config.css.src, config.scss.src], ['css']
  gulp
    .watch [config.js.src], ['js']

# initial task
gulp.task 'init', ->
  runSequence('copy:font', 'css', 'js')
