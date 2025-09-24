/* <!-- BEGIN RBP GENERATED: jest-config --> */
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
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
  // Mock Shopify Remix/App Bridge packages for unit tests
  '^@shopify/shopify-app-remix/react$': '<rootDir>/src/test/mocks/shopify-app-remix-react.tsx',
  '^@shopify/app-bridge-react$': '<rootDir>/src/test/mocks/shopify-app-bridge-react.tsx',
    '^\\.\\./proxy/catalog\\.server$': '<rootDir>/src/test/mocks/catalog-server.ts',
    '^\\.\\./proxy/paths\\.server$': '<rootDir>/src/test/mocks/paths-server.ts',
    '^\\.\\./proxy/ranking\\.server$': '<rootDir>/src/test/mocks/ranking-server.ts',
  '^\./paths\.server$': '<rootDir>/src/test/mocks/paths-server.ts',
    // If some routes import with two-dot segments:
    '^\\.\\.\\/\\.\\.\\/proxy/catalog\\.server$': '<rootDir>/src/test/mocks/catalog-server.ts',
    '^\\.\\.\\/\\.\\.\\/proxy/paths\\.server$': '<rootDir>/src/test/mocks/paths-server.ts',
    '^\\.\\.\\/\\.\\.\\/proxy/ranking\\.server$': '<rootDir>/src/test/mocks/ranking-server.ts',
  // Packager v2: tilde alias used by /src/app/routes
  '^~\/proxy\/catalog\.server$': '<rootDir>/src/test/mocks/catalog-server.ts',
  // Packager v2: route deps (from src/app/routes → deep relative back to gateway app)
  '^\.\.\/\.\.\/apps\/gateway\/api-gateway\/app\/proxy\/requireAccess\.server$': '<rootDir>/src/test/mocks/requireAccess.server.ts',
  '^\.\.\/\.\.\/apps\/gateway\/api-gateway\/app\/proxy\/packager\/plan\.server$': '<rootDir>/src/apps/gateway/api-gateway/app/proxy/packager/plan.server.ts',
  '^\.\.\/\.\.\/apps\/gateway\/api-gateway\/app\/proxy\/packager\/totals\.server$': '<rootDir>/src/apps/gateway/api-gateway/app/proxy/packager/totals.server.ts',
  '^\.\.\/\.\.\/packages\/builds\/package\/index$': '<rootDir>/src/test/mocks/builds-package-index.ts',
  '^\.\.\/\.\.\/\.\.\/rbp-shopify-app\/rod-builder-pro\/app\/shopify\.server$': '<rootDir>/src/test/mocks/shopify.server.ts',
    /* <!-- BEGIN RBP GENERATED: tenant-admin-devtools --> */
    '^@shopify/polaris/build/esm/styles\\.css\\?url$': '<rootDir>/src/test/mocks/style-url.ts',
    '.*\\.css\\?url$': '<rootDir>/src/test/mocks/style-url.ts',
    /* <!-- END RBP GENERATED: tenant-admin-devtools --> */
  },
  /* <!-- END RBP GENERATED: jest-config-mappers --> */
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  /* <!-- BEGIN RBP GENERATED: tenant-admin-catalog-v2 --> */
  // Ensure tests under src/**/__tests__ are discovered
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{ts,tsx}',
  ],
  /* <!-- END RBP GENERATED: tenant-admin-catalog-v2 --> */
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!**/__tests__/**'],
};
export default config;
/* <!-- END RBP GENERATED: jest-config --> */
