import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { Options } from 'tsup';
import { createTsupConfig } from '../../scripts/tsup.config';

const cjsAndEsmOptions: Options = {
	bundle: true,
	entry: ['src/**/*.ts'],
	esbuildPlugins: [esbuildPluginFilePathExtensions()]
};

export default createTsupConfig({
	cjsOptions: cjsAndEsmOptions,
	esmOptions: cjsAndEsmOptions,
	iifeOptions: { globalName: 'SapphireIteratorUtilities' }
});
