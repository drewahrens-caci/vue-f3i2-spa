module.exports = {
  devServer: {
    host: 'localhost'
  },

  assetsDir: 'static',
  publicPath: '/sites/f3i2/SiteAssets/html/',
  //publicPath: '/sites/f3i2/SiteAssets/dev/',

  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        automaticNameDelimiter: '_',
        minSize: 0
      }
    }
  },

  chainWebpack: config => {
    // console.log(config.plugins)
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
  },

  filenameHashing: true,
  productionSourceMap: false,
  runtimeCompiler: true
}
