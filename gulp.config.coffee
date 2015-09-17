# @file config.coffee
dest  = './static'
src   = './src'

module.exports =
  dest: dest
  css:
    dest: dest + '/css'
  js:
    src: src + '/js/**'
    dest: dest + '/js'
    uglify: false
  webpack:
    entry: src + '/js/app.js'
    output:
      filename: 'bundle.js'
    resolve:
      extensions: [
        ''
        '.js'
      ]
      modulesDirectories: [
        'node_modules'
        'bower_components'
      ]
