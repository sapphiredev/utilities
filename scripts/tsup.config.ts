import { relative, resolve as resolveDir } from 'node:path';
import { defineConfig, type Options } from 'tsup';

const baseOptions: Options = {
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2021',
	tsconfig: relative(__dirname, resolveDir(process.cwd(), 'src', 'tsconfig.json')),
	keepNames: true,
	treeshake: true
};

export const createTsupConfig = (cjsOptions: Options = {}, esmOptions: Options = cjsOptions, iifeOptions: IifeOptions = cjsOptions) => [
	defineConfig({
		...baseOptions,
		outDir: 'dist/cjs',
		format: 'cjs',
		outExtension: () => ({ js: '.cjs' }),
		...cjsOptions
	}),
	defineConfig({
		...baseOptions,
		outDir: 'dist/esm',
		format: 'esm',
		...esmOptions
	}),
	...(iifeOptions.disabled
		? []
		: [
				defineConfig({
					...baseOptions,
					dts: false,
					entry: ['src/index.ts'],
					outDir: 'dist/iife',
					format: 'iife',
					...iifeOptions
				})
		  ])
];

export interface IifeOptions extends Options {
	disabled?: boolean;
}
