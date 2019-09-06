module.exports = {
  apps: [{
    name: 'greenhouse',
    script: './server/bin/www.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    node_args: '-r dotenv/config',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }],

  deploy: {
  },
};
