const paths = require('./config/paths');

// good reference for ts-jest:
// https://github.com/basarat/typescript-book/blob/master/docs/testing/jest.md

module.exports = {
  roots: ['<rootDir>/src'],
  verbose: true,
  setupTestFrameworkScriptFile: '<rootDir>/config/jest/setup.ts',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
    //'^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(ts|tsx|js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  //transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx|js|jsx)$'],
  //transformIgnorePatterns: ['<rootDir>/node_modules/(?!antd)'],
  moduleDirectories: paths.resolveModules,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
