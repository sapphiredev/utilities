import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({
	globalName: 'SapphireUtilities',
	target: 'es2019',
	entry: ['src/index.ts'],
	format: ['iife'],
	clean: false,
	dts: false
});
