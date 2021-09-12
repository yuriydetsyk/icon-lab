module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom-sixteen',
  reporters: ['default', 'jest-junit'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageProvider: 'v8',
};
