import { createVitestConfig } from '../../scripts/vitest.config';

export default createVitestConfig({
	esbuild: {
		target: 'es2020'
	}
});
