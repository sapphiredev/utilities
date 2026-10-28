import { parse as parseTypescript } from '@babel/parser';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, parse as parsePath, relative, resolve, sep } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const WRITE_MODE = process.argv.includes('--write');
const CHECK_MODE = process.argv.includes('--check');
const PACKAGE_NAME = process.argv[2];
const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));

if (!PACKAGE_NAME) {
	throw new Error('A package name is required.');
}

interface ModuleExports {
	normal: boolean;
	types: string[];
}

function parseModuleExports(source: string): ModuleExports {
	const ast = parseTypescript(source, {
		sourceType: 'module',
		plugins: ['decorators-legacy', 'typescript']
	});
	const result: ModuleExports = { normal: false, types: [] };

	for (const statement of ast.program.body) {
		if (statement.type !== 'ExportNamedDeclaration' || !statement.declaration) continue;

		const { declaration } = statement;
		if (declaration.type === 'TSInterfaceDeclaration' || declaration.type === 'TSTypeAliasDeclaration') {
			result.types.push(declaration.id.name);
		} else {
			result.normal = true;
		}
	}

	return result;
}

function parseExternalExports(source: string): string[] {
	const ast = parseTypescript(source, {
		sourceType: 'module',
		plugins: ['decorators-legacy', 'typescript']
	});

	return ast.program.body.flatMap((statement) => {
		if (statement.type !== 'ExportNamedDeclaration' && statement.type !== 'ExportAllDeclaration') return [];
		const moduleName = statement.source?.value;
		if (typeof moduleName !== 'string' || moduleName.includes('./')) return [];

		return [
			source
				.slice(statement.start ?? 0, statement.end ?? undefined)
				.trim()
				.replace(/;?$/, ';')
		];
	});
}

async function findIndexOrModules(directory: string, depth = 0): Promise<string[]> {
	const contents = await readdir(directory, { withFileTypes: true });
	let results: string[] = [];

	for (const item of contents) {
		if (item.name === 'common') continue;
		const itemPath = join(directory, item.name);

		if (item.isFile()) {
			if (!item.name.endsWith('.ts')) continue;
			if (item.name === 'index.ts') {
				if (depth === 0) continue;
				results = [itemPath];
				break;
			}

			results.push(itemPath);
		} else if (item.isDirectory() && !contents.some((entry) => `${item.name}.ts` === entry.name)) {
			results = results.concat(await findIndexOrModules(itemPath, depth + 1));
		}
	}

	return results;
}

function toExportDeclaration(file: string, packageDir: string, source: string): string | undefined {
	const exports = parseModuleExports(source);
	const parsedPath = parsePath(file);
	const isPrivate = parsedPath.name.startsWith('_');
	const hasTypes = exports.types.length > 0;
	if (isPrivate && !hasTypes) return;

	const relativeDirectory = relative(packageDir, parsedPath.dir);
	const modulePath = (parsedPath.base === 'index.ts' ? relativeDirectory : join(relativeDirectory, parsedPath.name)).split(sep).join('/');
	const moduleSpecifier = `./${modulePath}`;

	if (isPrivate) {
		return `export type { ${exports.types.join(', ')} } from '${moduleSpecifier}';`;
	}

	const exportKind = !exports.normal && hasTypes ? 'type ' : '';
	return `export ${exportKind}* from '${moduleSpecifier}';`;
}

async function processPackage(packageDir: string): Promise<string> {
	const indexPath = resolve(packageDir, './index.ts');
	const modules = await findIndexOrModules(packageDir);
	modules.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

	const sourceIndex = await readFile(indexPath, 'utf8');
	const exports = parseExternalExports(sourceIndex);

	for (const modulePath of modules) {
		const source = await readFile(modulePath, 'utf8');
		const declaration = toExportDeclaration(modulePath, packageDir, source);
		if (declaration) exports.push(declaration);
	}

	return exports.length > 0 ? `${exports.join('\n')}\n` : '';
}

async function main() {
	const packageDir = resolve(SCRIPTS_DIR, '../packages', PACKAGE_NAME, 'src');
	const indexPath = join(packageDir, 'index.ts');
	const [currentFile, result] = [await readFile(indexPath, 'utf8'), await processPackage(packageDir)];

	if (CHECK_MODE) {
		if (currentFile !== result) {
			console.error(`Index file for ${PACKAGE_NAME} is out of date.`);
			process.exitCode = 1;
		}
	} else if (WRITE_MODE) {
		await writeFile(indexPath, result);
	} else {
		console.log(result);
	}
}

await main();
