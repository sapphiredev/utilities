import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({
	globalName: 'SapphireFetch',
	esbuildOptions: (options, context) => {
		switch (context.format) {
			case 'cjs': {
				options.banner = {
					js: [
						//
						'"use strict";',
						'const { fetch: baseFetch } = require("node-fetch");'
					].join('\n')
				};
				break;
			}
			case 'esm': {
				options.banner = {
					js: 'import { fetch as baseFetch } from "node-fetch"'
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
