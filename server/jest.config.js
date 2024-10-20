module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/(coverage|dist|lib|tmp)./',
  ],
  moduleDirectories: ['node_modules', 'src'],
  rootDir: '.',
  moduleNameMapper: {
    '^@(database|common|config|app|user|game|domain|application|infrastructure|interface|mock|config)(.*)$':
      '<rootDir>/src/$1$2',
    '^@app.module$': '<rootDir>/src/app.module',
  },
};
