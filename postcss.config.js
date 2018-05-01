module.exports = (ctx)=>({
  "plugins": {
    "postcss-import": {},
    "precss": {},
    "autoprefixer": {
      "browsers": [
        "ie >= 11",
        "last 2 versions"
      ]
    },
    "cssnano": {
      "zindex": false
    },
  }
});