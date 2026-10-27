import { defineConfig } from 'tsdown';
import Replace from 'unplugin-replace/rolldown';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
	entry: 'src/index.ts',
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
	plugins: [
		Replace({
			values: [
				{
					find: /\[VI\]{{inject}}\[\/VI\]/,
					replacement: version
				}
			]
		})
	]
});
