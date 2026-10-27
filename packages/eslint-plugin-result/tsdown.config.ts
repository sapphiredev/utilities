import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: 'src/index.ts',
	format: 'esm',
	outDir: 'dist',
	outExtensions: () => ({ js: '.mjs', dts: '.d.mts' }),
	target: 'es2021',
	tsconfig: 'src/tsconfig.json',
	dts: false,
	sourcemap: false,
	minify: false,
	clean: true,
	treeshake: true
});
