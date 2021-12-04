module.exports = {
  rootDir: '../',
  preset: 'ts-jest',
  testMatch: ['**/?(*.)(spec|test).(t|j)s?(x)'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  setupFiles: [],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/fileMock.js',
    '\\.(css|less)$': '<rootDir>/jest/styleMock.js',
  },
  transformIgnorePatterns: ['/node_modules/'],
  unmockedModulePathPatterns: ['react', 'react-dom'],
  globals: {
    ENV: {
      production: true,
    },
  },
  collectCoverageFrom: [
    'source/**/*.{js,jsx,ts,tsx}',
    '!source/libraries/**',
    '!source/styles/**',
    '!source/images/**',
    '!node_modules/**',
  ],
  coverageReporters: ['text', 'text-summary'],
};
