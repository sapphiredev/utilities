import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({
	target: 'es2019',
	legacyOutput: true,
	bundle: false,
	entry: ['src/**/*.ts'],
	format: ['esm', 'cjs'],
	dts: false
});
