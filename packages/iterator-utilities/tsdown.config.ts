import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/**/*.ts'],
	format: 'esm',
	outDir: 'dist',
	outExtensions: () => ({ js: '.mjs', dts: '.d.mts' }),
	target: 'es2021',
	tsconfig: 'src/tsconfig.json',
	dts: true,
	sourcemap: true,
	minify: false,
	clean: true,
	treeshake: true,
	unbundle: true
});
