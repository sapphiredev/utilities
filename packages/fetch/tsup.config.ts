import type { Options } from 'tsup';
import { createTsupConfig } from '../../scripts/tsup.config';

const options: Options = {
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
};

export default createTsupConfig({
	cjsOptions: options,
	esmOptions: options,
	iifeOptions: { ...options, globalName: 'SapphireFetch' }
});
