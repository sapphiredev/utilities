import { createVitestConfig } from './scripts/vitest.config';

export default createVitestConfig({
	test: {
		setupFiles: ['./packages/fetch/tests/vitest.setup.ts']
	},
	esbuild: {
		target: 'es2020'
	}
});
