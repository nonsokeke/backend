const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');

describe('Auth Routes', () => {
  const mockUser = {
    user_name: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    password: 'password123',
    year_graduated: 2020
  };

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(mockUser);

      expect(res.status).toBe(201);
      expect(res.body.email).toBe(mockUser.email);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/signup')
        .send(mockUser);
    });

    it('should login successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });
});
