import { relative, resolve as resolveDir } from 'node:path';
import { defineConfig, type Format } from 'tsup';

export const createTsupConfig = (
	{ globalName = undefined, format = ['esm', 'cjs', 'iife'], target = 'es2021', sourcemap = true }: ConfigOptions = {
		globalName: undefined,
		format: ['esm', 'cjs', 'iife'],
		target: 'es2021',
		sourcemap: true
	}
) =>
	defineConfig({
		clean: true,
		dts: false,
		entry: ['src/index.ts'],
		format,
		minify: false,
		skipNodeModulesBundle: true,
		sourcemap,
		target,
		tsconfig: relative(__dirname, resolveDir(process.cwd(), 'src', 'tsconfig.json')),
		keepNames: true,
		banner: {
			js: '"use strict";'
		},
		globalName
	});

interface ConfigOptions {
	globalName?: string;
	format?: Format[];
	target?: 'es2019' | 'es2020' | 'es2021';
	sourcemap?: boolean;
}
