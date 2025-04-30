module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'services/**/*.js',
    'routes/**/*.js',
    'middlewares/**/*.js'
  ],
  setupFilesAfterEnv: ['./__tests__/setup.js']
};
