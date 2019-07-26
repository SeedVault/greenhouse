import request from 'supertest';
import app from '../src/app';

// do something before anything else runs
beforeAll(async () => {
  console.log('Jest starting!');
});

// close the server after each test
afterAll(() => {
  console.log('server closed!');
});

describe('basic route tests', () => {
  test('get home route GET /', async (done) => {
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('Welcome!');
    done();
  });
});
