module.exports = {
  chainWebpack: config => {
    config.module
      .rule('toml')
      .test(/\.toml$/)
      .use('toml')
      .loader('toml-loader')
      .options({})
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 4000,
    https: false,
    hotOnly: false,
    // proxy: null,
    proxy: {
      '/api': {
        target: "http://localhost:3000",
        pathRewrite: {
          'api': '/'
        }
      },
    },
    before: () => {
    }
  }
}
