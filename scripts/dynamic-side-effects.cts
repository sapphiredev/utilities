import { bold, green, red } from 'colorette';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { format } from 'prettier';
import { findFilesRecursivelyRegex } from '../packages/node-utilities/src/index';
import prettierConfig from '../packages/prettier-config/src/index.mjs';

async function main() {
	const packageName = process.argv[2];
	const check = process.argv[3] === '--check';

	const sideEffects = ['./dist/iife/index.global.js'];

	for await (const file of findFilesRecursivelyRegex(resolve(__dirname, `../packages/${packageName}/dist/esm`), /chunk-[A-Z0-9]+\.mjs(?!\.map)/)) {
		const name = basename(file);
		sideEffects.unshift(`./dist/esm/${name}`);
	}

	const packageJsonRaw = await readFile(resolve(__dirname, `../packages/${packageName}/package.json`), 'utf8');
	const packageJSON = JSON.parse(packageJsonRaw);

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
		console.error(
			red(`The package.json file for ${packageName} is not up to date! Run ${green(bold('yarn build:dynamic-side-effects'))} to update it.`)
		);
		process.exit(1);
	}

	const formattedNewPackageJSON = await format(newPackageJSON, { ...prettierConfig, parser: 'json-stringify' });
	await writeFile(resolve(__dirname, `../packages/${packageName}/package.json`), formattedNewPackageJSON);

	console.log(green(`The package.json file for ${packageName} is updated successfully!`));
}

void main();
