import { defineConfig, defaultExclude } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
			enabled: true,
			reporter: ['text', 'lcov'],
			exclude: [...defaultExclude, 'src/lib/buffer/DuplexBuffer.ts', 'src/lib/types/base/IType.ts']
		}
	}
});
