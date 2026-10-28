import { bold, green, red } from 'colorette';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import process from 'node:process';

interface ExportEntry {
	default: string;
	types: string;
}

const aliasStores: Record<string, Map<string, string[] | string>> = {
	'iterator-utilities': new Map<string, string[] | string>([
		['append', 'concat'],
		['difference', ['except', 'omit']]
	]),
	utilities: new Map<string, string[] | string>([
		['filterNullAndUndefined', 'filterNullish'],
		['filterNullAndUndefinedAndEmpty', ['filterNullishAndEmpty', 'filterNullishOrEmpty']],
		['filterNullAndUndefinedAndZero', ['filterNullishAndZero', 'filterNullishOrZero']],
		['isNullOrUndefined', 'isNullish'],
		['isNullOrUndefinedOrEmpty', 'isNullishOrEmpty'],
		['isNullOrUndefinedOrZero', 'isNullishOrZero'],
		['snakeToCamelCase', 'kebabToCamelCase'],
		['tryParseJSON', 'tryParse'],
		['tryParseURL', 'parseURL']
	])
};

async function* findFilesRecursivelyStringEndsWith(directory: string, suffix: string): AsyncGenerator<string> {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const file = resolve(directory, entry.name);
		if (entry.isDirectory()) {
			yield* findFilesRecursivelyStringEndsWith(file, suffix);
		} else if (entry.isFile() && entry.name.endsWith(suffix)) {
			yield file;
		}
	}
}

const packageName = process.argv[2];
const check = process.argv[3] === '--check';
const aliasStore = aliasStores[packageName];
if (!aliasStore) throw new Error(`Unknown package: ${packageName}`);

const exportMap = new Map<string, ExportEntry>([
	[
		'.',
		{
			types: './dist/index.d.mts',
			default: './dist/index.mjs'
		}
	]
]);

for await (const file of findFilesRecursivelyStringEndsWith(resolve(process.cwd(), 'src/lib'), '.ts')) {
	const name = basename(file).replace(/\.ts$/, '');
	const splitted = file.split('lib');
	splitted.shift();
	if (name === 'index') continue;
	if (name.startsWith('_')) continue;

	if (packageName === 'utilities' && name === 'debounce') {
		exportMap.set(`./${name}`, {
			types: `./dist/lib/debounce/${name}.d.mts`,
			default: `./dist/lib/debounce/${name}.mjs`
		});
	} else if (packageName === 'iterator-utilities' && name === 'comparators') {
		exportMap.set(`./${name}`, {
			types: `./dist/lib/shared/${name}.d.mts`,
			default: `./dist/lib/shared/${name}.mjs`
		});
	} else {
		exportMap.set(`./${name}`, {
			types: `./dist/lib/${name}.d.mts`,
			default: `./dist/lib/${name}.mjs`
		});
	}

	const aliasStoreEntry = aliasStore.get(name);
	if (aliasStoreEntry) {
		if (Array.isArray(aliasStoreEntry)) {
			for (const entry of aliasStoreEntry) {
				exportMap.set(`./${entry}`, {
					types: `./dist/lib/${name}.d.mts`,
					default: `./dist/lib/${name}.mjs`
				});
			}
		} else {
			exportMap.set(`./${aliasStoreEntry}`, {
				types: `./dist/lib/${name}.d.mts`,
				default: `./dist/lib/${name}.mjs`
			});
		}
	}
}

const exportObj = Object.fromEntries([...exportMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));

const packageJsonPath = resolve(process.cwd(), 'package.json');
const packageJsonRaw = await readFile(packageJsonPath, 'utf8');
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

const formattedNewPackageJSON = `${JSON.stringify(JSON.parse(newPackageJSON), null, '\t')}\n`;
await writeFile(packageJsonPath, formattedNewPackageJSON);

console.log(green(`The package.json file for ${packageName} is updated successfully!`));
