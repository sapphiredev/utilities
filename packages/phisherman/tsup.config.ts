import { esbuildPluginVersionInjector } from 'esbuild-plugin-version-injector';
import { Options } from 'tsup';
import { createTsupConfig } from '../../scripts/tsup.config';

const defaultOptions: Options = {
	esbuildPlugins: [esbuildPluginVersionInjector()]
};

export default createTsupConfig({
	cjsOptions: defaultOptions,
	esmOptions: defaultOptions,
	iifeOptions: { disabled: true }
});
