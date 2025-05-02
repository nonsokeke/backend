const majorService = require('../../services/majorService');
const Major = require('../../models/Major');

describe('MajorService', () => {
  const mockMajor = {
    name: 'Computer Science',
    department: 'Computing and Mathematics'
  };

  describe('getAllMajors', () => {
    it('should return all majors', async () => {
      await Major.create(mockMajor);
      await Major.create({
        name: 'Economics',
        department: 'Business'
      });

      const majors = await majorService.getAllMajors();
      expect(majors).toHaveLength(2);
    });
  });

  describe('createMajor', () => {
    it('should create a new major', async () => {
      const major = await majorService.createMajor(mockMajor);
      expect(major.name).toBe(mockMajor.name);
      expect(major.department).toBe(mockMajor.department);
    });
  });

  describe('updateMajor', () => {
    it('should update an existing major', async () => {
      const major = await majorService.createMajor(mockMajor);
      const updatedMajor = await majorService.updateMajor(
        major._id,
        { name: 'Updated CS' }
      );

      expect(updatedMajor.name).toBe('Updated CS');
    });
  });
});