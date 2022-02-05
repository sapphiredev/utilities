import type { Config } from '@jest/types';

// eslint-disable-next-line @typescript-eslint/require-await
export default async (): Promise<Config.InitialOptions> => ({
	displayName: 'unit test',
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRunner: 'jest-circus/runner',
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	setupFilesAfterEnv: ['jest-extended/all'],
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tests/tsconfig.json'
		}
<<<<<<< HEAD
	},
	coveragePathIgnorePatterns: ['<rootDir>/tests/util/common.ts']
=======
	}
>>>>>>> b77b5ebe00bbbed2da1e5258708c642cf535a0d9
});
