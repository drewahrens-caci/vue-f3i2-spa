module.exports = {
  devServer: {
    host: 'localhost'
  },
  assetsDir: 'static',
  publicPath: './',

  // publicPath: './',
  // transpileDependencies: ['strip-ansi', 'ansi-regex', 'xlsx-populate']
  filenameHashing: false,

  runtimeCompiler: true,
  productionSourceMap: false
}
