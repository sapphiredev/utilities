import { defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
			enabled: true,
			reporter: ['text', 'lcov'],
			exclude: [...defaultExclude, '**/dist/**', 'packages/utilities/src/lib/debounce/debounce.ts']
		},
		projects: ['./packages/*']
	}
});
