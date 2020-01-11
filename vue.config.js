module.exports = {
  devServer: {
    host: 'localhost'
  },
  assetsDir: 'static',
  publicPath: '/sites/f3i2/SiteAssets/html/',

  // publicPath: './',
  // transpileDependencies: ['strip-ansi', 'ansi-regex', 'xlsx-populate']
  filenameHashing: false,

  runtimeCompiler: true,
  productionSourceMap: false
}
