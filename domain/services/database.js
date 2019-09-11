const credentials = `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}`;
const server   = `${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
const mongoUri = `mongodb://${credentials}@${server}`;
let database = process.env.GREENHOUSE_DATABASE;
if (process.env.NODE_ENV === 'testing') {
  database = process.env.GREENHOUSE_TEST_DATABASE;
}

let mongoose = require('mongoose');

module.exports = async () => {

  await mongoose.connect(mongoUri, {
    dbName: database,
    useNewUrlParser: true,
    useCreateIndex: true,
    auth: {authdb:"admin"},
    useUnifiedTopology: true
  });

  mongoose.connection.on('connected', () => {
    if (process.env.NODE_ENV === 'debug') {
      console.log('Mongoose status: connected');
    }
  });

  mongoose.connection.on('error', (err) => {
    if (process.env.NODE_ENV === 'debug') {
      console.log('Mongoose status: error - ', err);
    }
  });

  mongoose.connection.on('disconnected', () => {
    if (process.env.NODE_ENV === 'debug') {
      console.log('Mongoose status: disconnected');
    }
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      if (process.env.NODE_ENV === 'debug') {
        console.log('Mongoose status: disconnected due to application termination');
      }
      process.exit(0);
    });
  });
}
