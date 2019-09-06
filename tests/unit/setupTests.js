import db from '../../domain/services/database';

const mongoose = require('mongoose');

beforeEach(async () => {
  if (mongoose.connection.readyState === 0) {
    await db();
  }
  Object.entries(mongoose.connection.collections).map(
    async ([c]) => mongoose.connection.collections[c].deleteMany({}),
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});
