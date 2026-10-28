import { defineConfig } from 'vitest/config';

export default defineConfig({
	root: import.meta.dirname,
	test: {
		name: 'scripts',
		include: ['tests/**/*.test.ts']
	}
});
