import { resolve as resolveDir } from 'path';
import cleaner from 'rollup-plugin-cleaner';
import typescript from 'rollup-plugin-typescript2';

/**
 * Creates a Rollup configuration
 * @param {{ umdName: string, plugins: array, extraOptions: object }} options The options to pass into the baseConfig
 */
const createRollupConfig = (options) => {
	if (!Reflect.has(options, 'umdName')) options.umdName = '';
	if (!Reflect.has(options, 'plugins')) options.plugins = [];
	if (!Reflect.has(options, 'extraOptions')) options.extraOptions = {};

	const { umdName, plugins, extraOptions } = options;

	return {
		input: 'src/index.ts',
		output: [
			{
				file: './dist/index.js',
				format: 'cjs',
				exports: 'named',
				sourcemap: true
			},
			{
				file: './dist/index.mjs',
				format: 'es',
				exports: 'named',
				sourcemap: true
			},
			...(umdName && [
				{
					file: './dist/index.umd.js',
					format: 'umd',
					name: umdName,
					sourcemap: true
				}
			])
		],
		plugins: [
			cleaner({
				targets: ['./dist/']
			}),
			...plugins,
			typescript({ tsconfig: resolveDir(process.cwd(), 'src', 'tsconfig.json') })
		],
		...extraOptions
	};
};

export default createRollupConfig;
