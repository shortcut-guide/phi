/** @type {import('jest').Config} */
export default {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    '^react$': 'preact/compat',
    '^react-dom$': 'preact/compat',
    '^react/jsx-runtime$': 'preact/jsx-runtime'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!preact|@testing-library/preact)',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};