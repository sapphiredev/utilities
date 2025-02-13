import type { ESBuildOptions } from 'vite';
import { defineConfig, type ViteUserConfig } from 'vitest/config';

export const createVitestConfig = (options: ViteUserConfig = {}) =>
	defineConfig({
		...options,
		test: {
			...options?.test,
			globals: true,
			coverage: {
				...options.test?.coverage,
				provider: 'v8',
				enabled: true,
				reporter: ['text', 'lcov'],
				exclude: [
					...(options.test?.coverage?.exclude ?? []),
					'**/node_modules/**',
					'**/dist/**',
					'**/tests/**',
					'**/tsup.config.ts',
					'**/vitest.config.ts',
					'packages/utilities/src/lib/debounce/index.ts'
				]
			}
		},
		esbuild: {
			...options?.esbuild,
			target: (options?.esbuild as ESBuildOptions | undefined)?.target ?? 'es2021'
		}
	});
