import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { MagicRegExpTransformPlugin } from 'magic-regexp/transform';
import { Options } from 'tsup';
import { createTsupConfig } from '../../scripts/tsup.config';

const options: Options = {
	target: 'es2019'
};

const cjsAndEsmOptions: Options = {
	...options,
	bundle: true,
	entry: ['src/**/*.ts'],
	esbuildPlugins: [esbuildPluginFilePathExtensions(), MagicRegExpTransformPlugin.esbuild()]
};

export default createTsupConfig({
	cjsOptions: cjsAndEsmOptions,
	esmOptions: cjsAndEsmOptions,
	iifeOptions: { ...options, globalName: 'SapphireUtilities' }
});
