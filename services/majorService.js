const Major = require('../models/Major');

class MajorService {
  async getAllMajors() {
    return await Major.find();
  }

  async getMajorById(id) {
    return await Major.findById(id);
  }

  async createMajor(majorData) {
    return await new Major(majorData).save();
  }

  async updateMajor(id, majorData) {
    return await Major.findByIdAndUpdate(id, majorData, { new: true });
  }

  async deleteMajor(id) {
    return await Major.findByIdAndDelete(id);
  }
}

module.exports = new MajorService();
