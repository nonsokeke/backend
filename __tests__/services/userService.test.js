const userService = require('../../services/userService');
const User = require('../../models/User');

describe('UserService', () => {
  const mockUser = {
    user_name: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    password: 'password123',
    year_graduated: 2020
  };

  describe('getAllUsers', () => {
    it('should return only approved users', async () => {
      await User.create({ ...mockUser, approved: true });
      await User.create({ ...mockUser, email: 'test2@example.com', approved: false });

      const users = await userService.getAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0].approved).toBe(true);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = await userService.createUser(mockUser);
      expect(user.email).toBe(mockUser.email);
    });

    it('should throw error if email exists', async () => {
      await User.create(mockUser);
      await expect(userService.createUser(mockUser)).rejects.toThrow('Email already registered');
    });
  });
});
