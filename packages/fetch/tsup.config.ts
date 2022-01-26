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
						'globalThis && globalThis.fetch ? globalThis.fetch : globalThis.fetch = require("cross-fetch");'
					].join('\n')
				};
				break;
			}
			case 'esm': {
				options.banner = {
					js: [
						//
						'import crossFetch from "cross-fetch";',
						'globalThis && globalThis.fetch ? globalThis.fetch : globalThis.fetch = crossFetch;'
					].join('\n')
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
