import { relative, resolve, parse } from 'node:path';
import { findFilesRecursivelyStringEndsWith } from '../packages/node-utilities/src/index';

async function main() {
	const packageName = process.argv[2];
	const packageDir = resolve(__dirname, `../packages/${packageName}/src`);
	const packageLibDir = resolve(packageDir, './lib');
	const typesEnding = new RegExp(/[tT]ypes.ts$/);

	let modules = [];
	let types = [];
	for await (const file of findFilesRecursivelyStringEndsWith(packageLibDir, '.ts')) {
		typesEnding.test(file) ? types.push(file) : modules.push(file);
	}

	const moduleExports = modules
		.map((file) => {
			const filePath = parse(file);
			return `export * from './${relative(packageDir, filePath.dir)}/${filePath.name}';`;
		})
		.join('\n');

	// TODO: add typeExports

	console.log(moduleExports, types);
}

void main();
