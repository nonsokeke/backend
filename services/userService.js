const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers() {
    return await User.find({ approved: true });
  }

  async getUserById(id) {
    return await User.findOne({ _id: id, approved: true });
  }

  async createUser(userData) {
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) {
      throw new Error('Email already registered');
    }
    return await new User(userData).save();
  }

  async updateUser(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async getUnapprovedUsers() {
    return await User.find({ approved: false });
  }

  async approveUser(id) {
    return await User.findByIdAndUpdate(id, { approved: true }, { new: true });
  }
}

module.exports = new UserService();
