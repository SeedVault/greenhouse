import db from '../../domain/services/database';

const mongoose = require('mongoose');

beforeEach(async () => {
  if (mongoose.connection.readyState === 0) {
    await db();
  }
  const allCollections = Object.entries(mongoose.connection.collections).map(async ([c]) => {
    await mongoose.connection.collections[c].deleteMany({});
  });
  await Promise.all(allCollections);
});

afterAll(async () => {
  await mongoose.connection.close();
});
