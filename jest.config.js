module.exports = {
	displayName: 'unit test',
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/packages/**/tests/*.test.ts', '<rootDir>/packages/**/tests/*.test.js'],
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/tsconfig.base.json'
		}
	},
	coveragePathIgnorePatterns: [
		'<rootDir>/packages/utilities/tests/util/common.ts'
	]
};
