import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  setupFiles: ['<rootDir>/src/config/envLoader.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports',
        outputName: 'junit-report.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: './reports',
        filename: 'test-report.html',
        expand: true,
        pageTitle: 'Servita Automation Test Report',
      },
    ],
  ],
  // UI tests use a custom environment for screenshot-on-failure tracking
  projects: [
    {
      displayName: 'api',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/tests/api/**/*.test.ts'],
      setupFiles: ['<rootDir>/src/config/envLoader.ts'],
      transform: { '^.+\.(ts|js)$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
      transformIgnorePatterns: ['node_modules/(?!@faker-js)'],
      moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@api/(.*)$': '<rootDir>/src/api/$1',
      },
    },
    {
      displayName: 'ui',
      preset: 'ts-jest',
      testEnvironment: '<rootDir>/src/config/screenshotEnvironment.ts',
      testMatch: ['<rootDir>/src/tests/ui/**/*.test.ts'],
      setupFiles: ['<rootDir>/src/config/envLoader.ts'],
      transform: { '^.+\.(ts|js)$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
      transformIgnorePatterns: ['node_modules/(?!@faker-js)'],
      moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@ui/(.*)$': '<rootDir>/src/ui/$1',
      },
    },
  ],
  testTimeout: 60000,
  verbose: true,
};

export default config;
