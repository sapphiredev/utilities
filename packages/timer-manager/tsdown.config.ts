import { defineConfig } from 'tsdown';
import { nodeGlobals } from '../../scripts/node-globals.ts';

export default defineConfig({
	plugins: [nodeGlobals()],
	entry: 'src/index.ts',
	format: 'esm',
	outDir: 'dist',
	outExtensions: () => ({ js: '.mjs', dts: '.d.mts' }),
	target: 'es2024',
	tsconfig: 'src/tsconfig.json',
	dts: true,
	sourcemap: true,
	minify: false,
	clean: true,
	treeshake: true
});
