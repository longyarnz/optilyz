import request from 'supertest';
import { App } from '../app.js';
import { mongoose } from '../connection/database.js';

describe('Test the app root path', () => {
  test('It should return a 200 status to the GET method', async () => {
    const response = await request(App).get('/');
    expect(response.statusCode).toBe(200);
  })

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});