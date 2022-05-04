/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	displayName: 'unit test',
	preset: 'ts-jest',
	testMatch: ['<rootDir>/packages/**/tests/**/*.test.ts', '<rootDir>/packages/**/tests/**/*.test.js', '<rootDir>/packages/**/tests/**/*.test.tsx'],
	collectCoverageFrom: ['<rootDir>/packages/src/**/*.ts'],
	setupFilesAfterEnv: ['jest-extended/all'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.dev.json'
		}
	},
	coveragePathIgnorePatterns: [
		'<rootDir>/packages/utilities/tests/util/common.ts',
		'<rootDir>/packages/decorators/tests/mocks',
		'<rootDir>/packages/utilities/dist/index.js',
		'<rootDir>/packages/utilities/src/index.ts',
		'<rootDir>/packages/utilities/src/lib/debounce/index.ts'
	],
	reporters: ['default', 'github-actions']
};

export default config;
