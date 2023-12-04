import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { Options } from 'tsup';
import { createTsupConfig } from '../../scripts/tsup.config';

const options: Options = {
	target: 'es2019',
	bundle: true,
	entry: ['src/**/*.ts', '!src/**/*.d.ts'],
	esbuildPlugins: [esbuildPluginFilePathExtensions()]
};

export default createTsupConfig(options, options, { ...options, globalName: 'SapphireUtilities' });
