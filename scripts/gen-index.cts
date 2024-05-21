import { relative, resolve, parse } from 'node:path';
import { findFilesRecursivelyStringEndsWith } from '../packages/node-utilities/src/index';

async function main() {
	const packageName = process.argv[2];
	const packageDir = resolve(__dirname, `../packages/${packageName}/src`);
	const packageLibDir = resolve(packageDir, './lib');
	const typesEnding = new RegExp(/[tT]ypes.ts$/);

	const modules = [];
	const types = [];
	for await (const file of findFilesRecursivelyStringEndsWith(packageLibDir, '.ts')) {
		const filePath = parse(file);
		typesEnding.test(filePath.base) ? types.push(filePath) : modules.push(filePath);
	}

	const moduleExports = modules.map((file) => `export * from './${relative(packageDir, file.dir)}/${file.name}';`).join('\n');

	// TODO: add typeExports

	console.log(moduleExports, types);
}

void main();
