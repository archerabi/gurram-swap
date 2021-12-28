/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  collectCoverage: true,
  coverageReporters: ["json", "html", "lcov", "text"],
  "moduleFileExtensions": [
    "ts",
    "js",
    "json",
    "node"
  ],
};