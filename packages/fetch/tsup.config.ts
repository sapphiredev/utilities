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
						'const baseFetch = globalThis && globalThis.fetch ? globalThis.fetch : require("node-fetch");'
					].join('\n')
				};
				break;
			}
			case 'esm': {
				options.banner = {
					js: [
						//
						'import nodeFetch from "node-fetch";',
						'const baseFetch = globalThis && globalThis.fetch ? globalThis.fetch : nodeFetch;'
					].join('\n')
				};
				break;
			}
			case 'iife': {
				options.banner = {
					js: 'const baseFetch = globalThis.fetch;'
				};
				break;
			}
		}
	}
});
