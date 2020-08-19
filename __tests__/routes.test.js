require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('test routes', () => {
  // initialize token
  let token;

  // create fake todo task for user_2: 2
  const newTodoTask = {
    id: 4,
    todo: 'get ice cream',
    completed: false,
    user_id: 2
  };

  beforeAll(async done => {
    // flush db
    execSync('npm run setup-db');
    client.connect();

    // create a user
    const signInData = await fakeRequest(app)
      // make a POST req to signup 
      .post('/auth/signup')
      // use this email and password
      .send({
        email: 'test@test.com',
        password: 'test123'
      });

    // set user token (from signInData)
    token = signInData.body.token;
    
    // finish test
    return done();
  });

  afterAll(done => {
    return client.end(done);
  });

  // TESTS a new todo is created 
  test('returns a new todo task when creating a new todo', async(done) => {
    // make fake request
    const data = await fakeRequest(app)
      .post('/api/todos')
      .send(newTodoTask)
      // set Authorization to the token 
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual(newTodoTask);

    // finish test
    done();
  });

});
