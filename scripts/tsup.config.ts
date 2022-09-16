import { relative, resolve as resolveDir } from 'node:path';
import { defineConfig, type Options } from 'tsup';

export const createTsupConfig = (options: Options = {}) =>
	defineConfig({
		clean: true,
		dts: true,
		entry: ['src/index.ts'],
		format: ['esm', 'cjs', 'iife'],
		minify: false,
		skipNodeModulesBundle: true,
		sourcemap: true,
		target: 'es2021',
		tsconfig: relative(__dirname, resolveDir(process.cwd(), 'src', 'tsconfig.json')),
		keepNames: true,
		treeshake: true,
		...options
	});
