import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			enabled: true,
			reporter: ['text', 'lcov', 'clover']
		},
		setupFiles: ['./packages/fetch/tests/vitest.setup.ts']
	},
	esbuild: {
		target: 'es2020'
	}
});
