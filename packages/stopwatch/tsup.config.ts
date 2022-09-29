import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({
	format: ['esm', 'cjs', 'iife'],
	globalName: 'Stopwatch',
	esbuildOptions: (options, context) => {
		switch (context.format) {
			case 'cjs': {
				options.banner = {
					js: 'const { performance } = require("node:perf_hooks");'
				};
				break;
			}
			case 'esm': {
				options.banner = {
					js: "import { performance } from 'node:perf_hooks';"
				};
				break;
			}
			case 'iife': {
				// iife doesn't need any fetch replacements
				break;
			}
		}
	}
});
