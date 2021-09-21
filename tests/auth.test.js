import request from 'supertest';
import { hash } from 'bcrypt';
import { App } from '../app.js';
import { mongoose, connect } from '../connection/database.js';

describe('Test the /auth/register endpoint', () => {
  beforeAll(async () => await connect());

  test('It should return an error response when no user inputs are sent', async () => {
    const response = await request(App)
      .post('/auth/register')
      .send();
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid Inputs');
  });

  test('It should return an error response when new user inputs are not valid', async () => {
    const response = await request(App)
      .post('/auth/register')
      .send({
        'email': 100,
        'password': 'strong_password',
        'name': 'test_user'
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid Inputs');
  });

  test('It should create a new user when data is posted to the /register path', async () => {
    const response = await request(App)
      .post('/auth/register')
      .send({
        'email': 'test@gmail.com',
        'password': 'strong_password',
        'name': 'test_user'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBeTruthy();
    expect(response.body.token).toBeTruthy();
  });

  test('It should return an error response when the new user already exists', async () => {
    const response = await request(App)
      .post('/auth/register')
      .send({
        'email': 'test@gmail.com',
        'password': 'strong_password',
        'name': 'test_user'
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Email is already signed up');
  });

  afterAll(async () => {
    await mongoose.model('User').deleteOne({ name: 'test_user' });
    mongoose.disconnect();
  });
});

describe('Test the /auth/login endpoint', () => {
  let token;

  beforeAll(async () => {
    await connect();
    await mongoose.model('User').create({
      'email': 'login@gmail.com',
      'password': await hash('login_password', 10),
      'name': 'login_user'
    });
  });

  test('It should return an error response when no login inputs are sent', async () => {
    const response = await request(App)
      .post('/auth/login')
      .send();
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid Inputs');
  });

  test('It should return an error response when login inputs are not valid', async () => {
    const response = await request(App)
      .post('/auth/login')
      .send({
        'email': 100,
        'password': 'strong_password',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid Inputs');
  });

  test('It should login a user when data is posted to the /login matches a record in the DB', async () => {
    const response = await request(App)
      .post('/auth/login')
      .send({
        'email': 'login@gmail.com',
        'password': 'login_password'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBeTruthy();
    expect(response.body.token).toBeTruthy();
    token = response.body.token;
  });

  test('It should return an error response when data is posted to the /login does not match a record in the DB', async () => {
    const response = await request(App)
      .post('/auth/login')
      .send({
        'email': 'fake@gmail.com',
        'password': 'fake_password'
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Email and password does not exist');
  });

  test('It should logout a user', async () => {
    const response = await request(App)
      .get('/auth/logout')
      .set('authorization', token);
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.model('User').deleteOne({ name: 'login_user' });
    mongoose.disconnect();
  });
});

