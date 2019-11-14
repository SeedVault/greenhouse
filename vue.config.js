const server = require('./server/app');

module.exports = {
  devServer: {
    before: server,
    https: true,
    port: process.env.GREENHOUSE_PORT,
    public: `127.0.0.1:${process.env.GREENHOUSE_PORT}`,
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
};
