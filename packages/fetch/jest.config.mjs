/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	displayName: 'unit test',
	preset: 'ts-jest',
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
	setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tests/tsconfig.json'
		}
	}
};

export default config;
