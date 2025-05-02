const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const { generateTokens } = require('../../middlewares/authMiddleware');

describe('Message Routes', () => {
  let authToken;
  let sender;
  let recipient;

  beforeEach(async () => {
    // Create test users
    sender = await User.create({
      user_name: 'sender',
      email: 'sender@test.com',
      password: 'password123'
    });

    recipient = await User.create({
      user_name: 'recipient',
      email: 'recipient@test.com',
      password: 'password123'
    });

    const tokens = generateTokens(sender);
    authToken = tokens.accessToken;
  });

  describe('POST /api/messages', () => {
    it('should create a new message', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('Cookie', [`accessToken=${authToken}`])
        .send({
          recipient: recipient._id,
          content: 'Test message'
        });

      expect(res.status).toBe(201);
      expect(res.body.content).toBe('Test message');
    });
  });

  describe('GET /api/messages/inbox', () => {
    it('should get user inbox', async () => {
      const res = await request(app)
        .get('/api/messages/inbox')
        .set('Cookie', [`accessToken=${authToken}`]);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});