/* <!-- BEGIN RBP GENERATED: jest-config --> */
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'cjs', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  /* <!-- BEGIN RBP GENERATED: jest-config-mappers --> */
  moduleNameMapper: {
    // Keep ESM ".js" emitted by TS working in Jest
    '^(\\.{1,2}/.*)\\.js$': '$1',

    // Remap problematic server modules to safe mocks BEFORE Jest parses originals
    // Note: paths mirror the route's relative imports
    '^@remix-run/node$': '<rootDir>/src/test/mocks/remix-node.ts',
    '^\\.\\./proxy/catalog\\.server$': '<rootDir>/src/test/mocks/catalog-server.ts',
    '^\\.\\./proxy/paths\\.server$': '<rootDir>/src/test/mocks/paths-server.ts',
    '^\\.\\./proxy/ranking\\.server$': '<rootDir>/src/test/mocks/ranking-server.ts',
    // If some routes import with two-dot segments:
    '^\\.\\.\\/\\.\\.\\/proxy/catalog\\.server$': '<rootDir>/src/test/mocks/catalog-server.ts',
    '^\\.\\.\\/\\.\\.\\/proxy/paths\\.server$': '<rootDir>/src/test/mocks/paths-server.ts',
    '^\\.\\.\\/\\.\\.\\/proxy/ranking\\.server$': '<rootDir>/src/test/mocks/ranking-server.ts',
  },
  /* <!-- END RBP GENERATED: jest-config-mappers --> */
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!**/__tests__/**'],
};
export default config;
/* <!-- END RBP GENERATED: jest-config --> */
