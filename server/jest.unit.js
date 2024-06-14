const sharedConfig = require('./jest.config');

module.exports = {
  ...sharedConfig,
  coverageDirectory: 'coverage', //커버리지 파일 출력하는 디렉터리
  coverageReporters: ['text', 'lcov', 'cobertura'],
  collectCoverageFrom: [
    'src/**/**/*.ts',
    '!*/node_modules/**',
    '!<rootDir>/src/main.ts',
  ],
};
