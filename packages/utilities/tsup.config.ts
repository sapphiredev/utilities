import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({
	target: 'es2019',
	bundle: true,
	entry: ['src/**/*.ts', '!src/**/*.d.ts'],
	format: ['esm', 'cjs'],
	dts: false,
	esbuildPlugins: [esbuildPluginFilePathExtensions()]
});
