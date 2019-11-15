const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? path.resolve(__dirname, 'dist') : '/',
  transpileDependencies: [
    'vuetify',
  ],
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }));
  },
};
