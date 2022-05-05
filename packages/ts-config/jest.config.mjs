/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	displayName: 'ts-jest',
	preset: 'ts-jest',
	collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tests/tsconfig.json'
		}
	}
};

export default config;
