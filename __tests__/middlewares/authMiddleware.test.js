const { authenticate, authorizeAdmin } = require('../../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('should return 401 if no token provided', async () => {
      await authenticate(mockReq, mockRes, nextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should call next if token is valid', async () => {
      const token = jwt.sign({ id: 'testid' }, process.env.JWT_SECRET);
      mockReq.cookies.accessToken = token;

      await authenticate(mockReq, mockRes, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
