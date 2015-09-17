# @file webpack.js
gulp          = require 'gulp'
webpack       = require 'gulp-webpack'
concat        = require 'gulp-concat'
csso          = require 'gulp-csso'
csscomb       = require 'gulp-csscomb'
uglify        = require 'gulp-uglify'

config        = require './gulp.config'
runSequence   = require 'run-sequence'

# CSS
CSS_LIB_FILES = [
  './node_modules/normalize.css/normalize.css'
  './node_modules/highlight/lib/vendor/highlight.js/styles/github.css'
]

gulp.task 'css', ->
  runSequence('css:lib')

gulp.task 'css:lib', ->
  gulp.src CSS_LIB_FILES
    .pipe concat('libs.css')
    .pipe csscomb()
    .pipe csso()
    .pipe gulp.dest(config.css.dest)

gulp.task 'webpack', ->
  gulp.src config.webpack.entry
    .pipe webpack(config.webpack)
    .pipe uglify()
    .pipe gulp.dest(config.js.dest)
