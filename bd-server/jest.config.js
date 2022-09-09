module.exports = {
  preset: 'ts-jest',
  reporters: ['default', 'jest-junit'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageProvider: 'v8',
};
