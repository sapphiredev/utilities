import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({
	globalName: 'SapphireFetch',
	esbuildOptions: (options, context) => {
		switch (context.format) {
			case 'cjs': {
				options.banner = {
					js: [
						'"use strict";',
						'const baseFetch = window?.fetch;',
						'if (baseFetch === undefined) {',
						'\tbaseFetch = require("node-fetch")',
						'}'
					].join('\n')
				};
				break;
			}
			case 'esm': {
				options.banner = {
					js: [
						'import { fetch as nodeFetch } from "node-fetch"',
						'const baseFetch = window?.fetch;',
						'if (baseFetch === undefined) {',
						'\tbaseFetch = nodeFetch',
						'}'
					].join('\n')
				};
				break;
			}
			case 'iife': {
				options.banner = {
					js: 'const baseFetch = window.fetch'
				};
				break;
			}
		}
	}
});
