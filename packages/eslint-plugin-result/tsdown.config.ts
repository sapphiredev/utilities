import { defineConfig } from 'tsdown';
import Replace from 'unplugin-replace/rolldown';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
	entry: ['src/index.ts', 'src/configs/recommended.ts'],
	format: 'esm',
	outDir: 'dist',
	outExtensions: () => ({ js: '.mjs', dts: '.d.mts' }),
	target: 'es2021',
	tsconfig: 'src/tsconfig.json',
	dts: true,
	sourcemap: false,
	minify: false,
	clean: true,
	treeshake: true,
	unbundle: true,
	plugins: [
		Replace({
			values: [
				{
					find: /\[VI]{{inject}}\[\/VI]/,
					replacement: packageJson.version
				}
			]
		})
	]
});
