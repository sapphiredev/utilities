module.exports = {
	displayName: 'unit test',
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/packages/**/tests/**/*.test.ts', '<rootDir>/packages/**/tests/**/*.test.js'],
	setupFilesAfterEnv: ['<rootDir>/packages/decorators/tests/jest.setup.ts', '<rootDir>/packages/snowflake/tests/jest.setup.ts'],
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/tsconfig.dev.json'
		}
	},
	coveragePathIgnorePatterns: ['<rootDir>/packages/utilities/tests/util/common.ts', '<rootDir>/packages/decorators/tests/mocks']
};
