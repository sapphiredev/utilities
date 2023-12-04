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

export function createTsupConfig(options: EnhancedTsupOptions) {
	return [
		defineConfig({
			...baseOptions,
			outDir: 'dist/cjs',
			format: 'cjs',
			outExtension: () => ({ js: '.cjs' }),
			...options.cjsOptions
		}),
		defineConfig({
			...baseOptions,
			outDir: 'dist/esm',
			format: 'esm',
			...options.esmOptions
		}),
		...(options.iifeOptions?.disabled
			? []
			: [
					defineConfig({
						...baseOptions,
						dts: false,
						entry: ['src/index.ts'],
						outDir: 'dist/iife',
						format: 'iife',
						...options.iifeOptions
					})
			  ])
	];
}

interface EnhancedTsupOptions {
	cjsOptions?: Options;
	esmOptions?: Options;
	iifeOptions?: Options & {
		disabled?: boolean;
	};
}
