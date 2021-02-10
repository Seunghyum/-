module.exports = {
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.(js)?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~src(.*)$': '<rootDir>/src$1',
    '^~api(.*)$': '<rootDir>/src/api$1',
    '^~utils(.*)$': '<rootDir>/src/utils$1',
    '^~pages(.*)$': '<rootDir>/src/pages$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
