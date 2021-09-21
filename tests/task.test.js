import request from 'supertest';
import { hash } from 'bcrypt';
import { App } from '../app.js';
import { mongoose, connect } from '../connection/database.js';

describe('Test the /task endpoint', () => {
  let token, taskId;
  const newTask = {
    title: 'task_test_title',
    description: 'Test app with express',
    endTime: '2021-09-20T21:23:12.573Z',
    reminderTime: '2021-09-20T20:23:12.573Z'
  }

  beforeAll(async () => {
    await connect();
    await mongoose.model('User').create({
      'email': 'task@gmail.com',
      'password': await hash('task_password', 10),
      'name': 'task_user'
    });

    const login = await request(App)
      .post('/auth/login')
      .send({
        'email': 'task@gmail.com',
        'password': 'task_password'
      })

    token = login.body.token;
  });

  test('It should return an error response when you send a request to the /task endpoint without a signed token', async () => {
    const response = await request(App)
      .post('/task')
      .send({
        'title': 'task_test_title',
        'description': 'Test app with express',
        'endTime': '2021-09-20T21:23:12.573Z',
        'reminderTime': '2021-09-20T20:23:12.573Z'
      })
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthenticated User');
  })
  
  test('It should create a new task when data is posted to the /task path', async () => {
    const response = await request(App)
    .post('/task')
    .set('authorization', token)
    .send(newTask)
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(newTask.title);
    expect(response.body.description).toBe(newTask.description);
    expect(response.body.endTime).toBe(newTask.endTime);
    expect(response.body.reminderTime).toBe(newTask.reminderTime);
    expect(response.body.isCompleted).toBe(false);
    taskId = response.body._id;
  })
  
  test('It should return all user tasks when a GET request is sent to the task endpoint', async () => {
    const response = await request(App)
    .get('/task')
    .set('authorization', token)
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  })
  
  test('It should return a user tasks when a task ID is sent as a query on GET request is sent to the task endpoint', async () => {
    const response = await request(App)
    .get(`/task/${taskId}`)
    .set('authorization', token)
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(newTask.title);
    expect(response.body.description).toBe(newTask.description);
    expect(response.body.endTime).toBe(newTask.endTime);
    expect(response.body.reminderTime).toBe(newTask.reminderTime);
    expect(response.body.isCompleted).toBe(false);
  })
  
  test('It should update a task when data is PUT to the task endpoint', async () => {
    const response = await request(App)
    .put(`/task/${taskId}`)
    .set('authorization', token)
    .send({ ...newTask, isCompleted: true })
    expect(response.statusCode).toBe(200);
    expect(response.body.isCompleted).toBe(true);
  })
  
  test('It should return an empty response an null update is PUT to the task endpoint', async () => {
    const response = await request(App)
    .put(`/task/${taskId}`)
    .set('authorization', token)
    .send()
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid Inputs');
  })

  test('It should delete a task when a DELETE request is sent to the task endpoint', async () => {
    const response = await request(App)
      .delete(`/task/${taskId}`)
      .set('authorization', token)
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(true);
  })
  
  afterAll(async () => {
    await mongoose.model('User').deleteOne({ name: 'task_user' });
    mongoose.disconnect();
  });
});