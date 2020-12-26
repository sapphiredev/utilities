import type { Config } from '@jest/types';

// eslint-disable-next-line @typescript-eslint/require-await
export default async (): Promise<Config.InitialOptions> => ({
	displayName: 'unit test',
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/packages/**/tests/**/*.test.ts', '<rootDir>/packages/**/tests/**/*.test.js'],
	setupFilesAfterEnv: ['<rootDir>/packages/snowflake/tests/jest.setup.ts'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.dev.json'
		}
	},
	coveragePathIgnorePatterns: [
		'<rootDir>/packages/utilities/tests/util/common.ts',
		'<rootDir>/packages/decorators/tests/mocks',
		'<rootDir>/packages/utilities/dist/index.js',
		'<rootDir>/packages/utilities/src/index.ts'
	]
});
