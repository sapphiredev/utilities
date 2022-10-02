import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({
	target: 'es2019',
	bundle: true,
	entry: ['src/**/*.ts', '!src/**/*.d.ts'],
	format: ['esm', 'cjs'],
	dts: false,
	esbuildPlugins: [
		{
			name: 'add-mjs-to-file-imports-and-exports',
			setup(build) {
				const isEsm = build.initialOptions.define?.TSUP_FORMAT === '"esm"';
				build.onResolve({ filter: /.*/ }, (args) => {
					if (args.importer) {
						return {
							path: `${args.path}.${isEsm ? 'mjs' : 'js'}`,
							external: true
						};
					}
				});
			}
		}
	]
});
