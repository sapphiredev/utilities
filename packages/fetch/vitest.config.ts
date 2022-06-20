import { createVitestConfig } from '../../scripts/vitest.config';

export default createVitestConfig({
	test: {
		setupFiles: ['./tests/vitest.setup.ts']
	}
});
