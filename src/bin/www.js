#!/usr/bin/env node

import https from 'https';
import debugLib from 'debug';
import fs from 'fs';
import app from '../app';

const debug = debugLib('greenhouse:server');

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const httpPort = parseInt(val, 10);

  if (Number.isNaN(httpPort)) {
    // named pipe
    return val;
  }

  if (httpPort >= 0) {
    // port number
    return httpPort;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.GREENHOUSE_PORT || '9010');

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      /* eslint-disable no-console */
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Create HTTPS server.
 */
app.set('port', port);

const options = {
  key: fs.readFileSync(`${__dirname}/../../certs/key.pem`),
  cert: fs.readFileSync(`${__dirname}/../../certs/cert.pem`),
};

const server = https.createServer(options, app);


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
  debug(`Listening on ${bind}`);
}


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
