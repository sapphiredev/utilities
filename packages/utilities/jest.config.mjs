/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	displayName: 'unit test',
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
	setupFilesAfterEnv: ['jest-extended/all'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tests/tsconfig.json'
		}
	},
	coveragePathIgnorePatterns: ['<rootDir>/tests/util/common.ts']
};

export default config;
