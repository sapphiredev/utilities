import { bold, green, red } from 'colorette';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { format } from 'prettier';
import { findFilesRecursivelyStringEndsWith } from '../packages/node-utilities/src/index';
import prettierConfig from '../packages/prettier-config/src/index.mjs';

interface ExportEntry {
	types: string;
	default: string;
}

interface ExportType {
	import: ExportEntry;
	require: ExportEntry;
	browser?: string;
}

async function main() {
	const packageName = process.argv[2];
	const check = process.argv[3] === '--check';

	const { aliasStore } = await import(`./aliases/${packageName}.cjs`);

	const exportMap = new Map<string, ExportType>([
		[
			'.',
			{
				import: {
					types: './dist/esm/index.d.mts',
					default: './dist/esm/index.mjs'
				},
				require: {
					types: './dist/cjs/index.d.cts',
					default: './dist/cjs/index.cjs'
				},
				browser: './dist/iife/index.global.js'
			}
		]
	]);

	for await (const file of findFilesRecursivelyStringEndsWith(resolve(__dirname, `../packages/${packageName}/src/lib`), '.ts')) {
		const name = basename(file).replace(/\.ts$/, '');
		const splitted = file.split('lib');
		splitted.shift();
		if (name === 'index') continue;
		if (name.startsWith('_')) continue;

		if (packageName === 'utilities' && name === 'debounce') {
			exportMap.set(`./${name}`, {
				import: {
					types: `./dist/esm/lib/debounce/${name}.d.mts`,
					default: `./dist/esm/lib/debounce/${name}.mjs`
				},
				require: {
					types: `./dist/cjs/lib/debounce/${name}.d.cts`,
					default: `./dist/cjs/lib/debounce/${name}.cjs`
				}
			});
		} else if (packageName === 'iterator-utilities' && name === 'comparators') {
			exportMap.set(`./${name}`, {
				import: {
					types: `./dist/esm/lib/shared/${name}.d.mts`,
					default: `./dist/esm/lib/shared/${name}.mjs`
				},
				require: {
					types: `./dist/cjs/lib/shared/${name}.d.cts`,
					default: `./dist/cjs/lib/shared/${name}.cjs`
				}
			});
		} else {
			exportMap.set(`./${name}`, {
				import: {
					types: `./dist/esm/lib/${name}.d.mts`,
					default: `./dist/esm/lib/${name}.mjs`
				},
				require: {
					types: `./dist/cjs/lib/${name}.d.cts`,
					default: `./dist/cjs/lib/${name}.cjs`
				}
			});
		}

		const aliasStoreEntry = aliasStore.get(name);
		if (aliasStoreEntry) {
			if (Array.isArray(aliasStoreEntry)) {
				for (const entry of aliasStoreEntry) {
					exportMap.set(`./${entry}`, {
						import: {
							types: `./dist/esm/lib/${name}.d.mts`,
							default: `./dist/esm/lib/${name}.mjs`
						},
						require: {
							types: `./dist/cjs/lib/${name}.d.cts`,
							default: `./dist/cjs/lib/${name}.cjs`
						}
					});
				}
			} else {
				exportMap.set(`./${aliasStoreEntry}`, {
					import: {
						types: `./dist/esm/lib/${name}.d.mts`,
						default: `./dist/esm/lib/${name}.mjs`
					},
					require: {
						types: `./dist/cjs/lib/${name}.d.cts`,
						default: `./dist/cjs/lib/${name}.cjs`
					}
				});
			}
		}
	}

	const exportObj = Object.fromEntries([...exportMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));

	const packageJsonRaw = await readFile(resolve(__dirname, `../packages/${packageName}/package.json`), 'utf8');
	const packageJSON = JSON.parse(packageJsonRaw);

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

	const formattedNewPackageJSON = await format(newPackageJSON, { ...prettierConfig, parser: 'json-stringify' });
	await writeFile(resolve(__dirname, `../packages/${packageName}/package.json`), formattedNewPackageJSON);

	console.log(green(`The package.json file for ${packageName} is updated successfully!`));
}

void main();
