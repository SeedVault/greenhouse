const server = require('./server/app');
const webpack = require('webpack');

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
  
  configureWebpack: {
    plugins: [        
        new webpack.DefinePlugin({            
            'HADRON_URL': JSON.stringify(process.env.HADRON_URL),
            'RHIZOME_URL': JSON.stringify(process.env.RHIZOME_URL)
        })
    ]
  }
};
