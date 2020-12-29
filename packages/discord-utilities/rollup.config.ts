import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { resolve as resolveDir } from 'path';
import cleaner from 'rollup-plugin-cleaner';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
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
		{
			file: './dist/index.umd.js',
			format: 'umd',
			name: 'SapphireDiscordUtilities',
			sourcemap: true
		}
	],
	plugins: [
		cleaner({
			targets: ['./dist/']
		}),
		resolve(),
		commonjs(),
		typescript({ tsconfig: resolveDir(__dirname, 'src', 'tsconfig.json') }),
		terser({
			ecma: 2019,
			// This will ensure that whenever Rollup is in watch (dev) mode, console logs will not be removed
			compress: { drop_console: !Reflect.has(process.env, 'ROLLUP_WATCH') },
			format: { comments: false },
			keep_classnames: true,
			keep_fnames: true
		})
	]
};
