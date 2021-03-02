import { resolve as resolveDir } from 'path';
import cleaner from 'rollup-plugin-cleaner';
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
			name: 'SapphireType',
			sourcemap: true
		}
	],
	plugins: [
		cleaner({
			targets: ['./dist/']
		}),
		typescript({ tsconfig: resolveDir(__dirname, 'src', 'tsconfig.json') })
	]
};
