import { bold, green, red } from 'colorette';
import { writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { format } from 'prettier';
import { findFilesRecursivelyStringEndsWith } from '../packages/node-utilities/dist/index.js';
import prettierConfig from '../packages/prettier-config/dist/index.cjs';

const packageName = process.argv[2];
const check = process.argv[3] === '--check';

const { aliasStore } = await import(`./aliases/${packageName}.mjs`);

const exportMap = new Map([
	[
		'.',
		{
			types: './dist/types/index.d.ts',
			import: './dist/esm/index.js',
			require: './dist/cjs/index.js',
			browser: './dist/index.global.js'
		}
	]
]);

for await (const file of findFilesRecursivelyStringEndsWith(new URL(`../packages/${packageName}/src/lib`, import.meta.url), '.ts')) {
	const name = basename(file).replace(/\.ts$/, '');
	const splitted = file.split('lib');
	splitted.shift();

	if (name === 'index') continue;

	const filePath = `./dist/%SUBFOLDER%/lib${splitted.join('').replace(/\.ts$/, '')}`.replace(/\\/g, '/');

	const typesFilePath = filePath.replace('%SUBFOLDER%', 'types');
	const esmFilePath = filePath.replace('%SUBFOLDER%', 'esm');
	const cjsFilePath = filePath.replace('%SUBFOLDER%', 'cjs');

	exportMap.set(`./${name}`, {
		types: `${typesFilePath}.d.ts`,
		import: `${esmFilePath}.js`,
		require: `${cjsFilePath}.js`
	});

	const aliasStoreEntry = aliasStore.get(name);
	if (aliasStoreEntry) {
		if (Array.isArray(aliasStoreEntry)) {
			for (const entry of aliasStoreEntry) {
				exportMap.set(`./${entry}`, {
					types: `${typesFilePath}.d.ts`,
					import: `${esmFilePath}.js`,
					require: `${cjsFilePath}.js`
				});
			}
		} else {
			exportMap.set(`./${aliasStoreEntry}`, {
				types: `${typesFilePath}.d.ts`,
				import: `${esmFilePath}.js`,
				require: `${cjsFilePath}.js`
			});
		}
	}
}

const exportObj = Object.fromEntries([...exportMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));

const { default: packageJSON } = await import(`../packages/${packageName}/package.json`, {
	assert: {
		type: 'json'
	}
});

const newPackageJSON = JSON.stringify({
	...packageJSON,
	exports: exportObj
});

const oldPackageJSON = JSON.stringify(packageJSON);

if (oldPackageJSON === newPackageJSON) {
	console.log(green(`The package.json file for ${packageName} is up to date!`));
	process.exit(0);
}

if (check) {
	console.error(red(`The package.json file for ${packageName} is not up to date! Run ${green(bold('yarn check-subpath'))} to update it.`));
	process.exit(1);
}

const formattedNewPackageJSON = format(newPackageJSON, { ...prettierConfig, parser: 'json-stringify' });
await writeFile(new URL(`../packages/${packageName}/package.json`, import.meta.url), formattedNewPackageJSON);

console.log(green(`The package.json file for ${packageName} is updated successfully!`));
