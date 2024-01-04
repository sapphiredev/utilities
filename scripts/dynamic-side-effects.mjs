import { bold, green, red } from 'colorette';
import { writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { format } from 'prettier';
import { findFilesRecursivelyRegex } from '../packages/node-utilities/dist/esm/index.mjs';
import prettierConfig from '../packages/prettier-config/dist/index.mjs';

const packageName = process.argv[2];
const check = process.argv[3] === '--check';

const sideEffects = ['./dist/iife/index.global.js'];

for await (const file of findFilesRecursivelyRegex(
	new URL(`../packages/${packageName}/dist/esm`, import.meta.url),
	/chunk-[A-Z0-9]+\.mjs(?!\.map)/
)) {
	const name = basename(file);
	sideEffects.unshift(`./dist/esm/${name}`);
}

const { default: packageJSON } = await import(`../packages/${packageName}/package.json`, {
	assert: {
		type: 'json'
	}
});

const newPackageJSON = JSON.stringify({
	...packageJSON,
	sideEffects
});

const oldPackageJSON = JSON.stringify(packageJSON);

if (oldPackageJSON === newPackageJSON) {
	console.log(green(`The package.json file for ${packageName} is up to date!`));
	process.exit(0);
}

if (check) {
	console.error(red(`The package.json file for ${packageName} is not up to date! Run ${green(bold('yarn dynamic-side-effects'))} to update it.`));
	process.exit(1);
}

const formattedNewPackageJSON = await format(newPackageJSON, { ...prettierConfig, parser: 'json-stringify' });
await writeFile(new URL(`../packages/${packageName}/package.json`, import.meta.url), formattedNewPackageJSON);

console.log(green(`The package.json file for ${packageName} is updated successfully!`));
