import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, parse, relative, resolve, type ParsedPath } from 'node:path';
import { sep as posixSep } from 'node:path/posix';
import { sep as winSep } from 'node:path/win32';
import ts from 'typescript';

const PRINTER = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const WRITE_MODE = process.argv.includes('--write');
const CHECK_MODE = process.argv.includes('--check');
const PACKAGE_NAME = process.argv[2];

function isExported(node: ts.Declaration): boolean {
	return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) > 0;
}

function isType(node: ts.Node): boolean {
	return [ts.SyntaxKind.InterfaceDeclaration, ts.SyntaxKind.TypeAliasDeclaration].includes(node.kind);
}

interface ModuleExportNodes {
	normal: ts.Declaration[];
	types: ts.Declaration[];
}

interface ModuleExportInclusions {
	useModule: boolean;
	useNormal: boolean;
	useTypes: boolean;
}

class ModuleFile {
	public readonly exports: ModuleExportNodes;
	public readonly isPrivate: boolean;
	public readonly exportInclusions: ModuleExportInclusions;
	public readonly path: ParsedPath;
	public readonly sourceFile: ts.SourceFile;

	public constructor(sourceFile: ts.SourceFile) {
		this.sourceFile = sourceFile;
		this.path = parse(sourceFile.fileName);
		this.isPrivate = this.path.name.startsWith('_');
		this.exports = this.parseExports();
		this.exportInclusions = this.deriveExportInclusions();
	}

	public generateExportSpecifiers(): ts.ExportSpecifier[] {
		return this.exports.types
			.concat(this.exportInclusions.useNormal ? this.exports.normal : [])
			.map((node) => ts.getNameOfDeclaration(node)!.getText(this.sourceFile))
			.map((name) => ts.factory.createExportSpecifier(false, undefined, name));
	}

	/**
	 * Rules:
	 * 1. If the module begins with `_`, ignore it
	 *    a) unless the module contains types, in which case those exclusively should be included
	 * 2. If the module exclusively contains types, use `export type *`, otherwise use `export *`
	 **/
	public toExportDeclaration(packageDir: string): ts.ExportDeclaration | undefined {
		const { useModule, useNormal, useTypes } = this.exportInclusions;
		if (!useModule) return;

		const exportSpecifiers = this.generateExportSpecifiers();

		const relativePath = relative(packageDir, this.path.dir);
		const adjustedPath = (this.path.base === 'index.ts' ? relativePath : join(relativePath, this.path.name)).split(winSep).join(posixSep);

		return ts.factory.createExportDeclaration(
			undefined,
			!useNormal && useTypes,
			this.isPrivate ? ts.factory.createNamedExports(exportSpecifiers) : undefined,
			ts.factory.createStringLiteral(`./${adjustedPath}`, true),
			undefined
		);
	}

	private deriveExportInclusions(): ModuleExportInclusions {
		const typesAvailable = this.exports.types.length > 0;

		return {
			useModule: !this.isPrivate || typesAvailable, // rule 1 & 1a
			useNormal: !this.isPrivate && this.exports.normal.length > 0,
			useTypes: typesAvailable
		};
	}

	private parseExports(): ModuleExportNodes {
		const normal: ts.Declaration[] = [];
		const types: ts.Declaration[] = [];

		this.sourceFile.forEachChild((node) => {
			if (!ts.isDeclarationStatement(node) || !isExported(node)) return;
			isType(node) ? types.push(node) : normal.push(node);
		});

		return {
			normal,
			types
		};
	}
}

function parseExternalExports(sourceFile: ts.SourceFile): ts.ExportDeclaration[] {
	const normal: ts.ExportDeclaration[] = [];
	sourceFile.forEachChild((node) => {
		if (!ts.isExportDeclaration(node)) return;
		if (node.moduleSpecifier!.getText(sourceFile).includes('./')) return;
		normal.push(node);
	});

	return normal;
}

async function findIndexOrModules(dir: string, depth: number = 0): Promise<string[]> {
	const contents = await readdir(dir, { withFileTypes: true });
	let results: string[] = [];
	for (const item of contents) {
		if (item.name === 'common') continue;
		const itemPath = join(dir, item.name);
		if (item.isFile()) {
			if (!item.name.endsWith('.ts')) continue;
			if (item.name === 'index.ts') {
				if (depth === 0) continue;
				results = [itemPath];
				break;
			}
			results.push(itemPath);
		} else if (item.isDirectory() && !contents.find((entry) => `${item.name}.ts` === entry.name))
			results = results.concat(await findIndexOrModules(itemPath, depth + 1));
	}

	return results;
}

async function processPackage(packageDir: string): Promise<string> {
	const indexPath = resolve(packageDir, './index.ts');

	const modules = await findIndexOrModules(packageDir);
	modules.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	const indexProgram = ts.createProgram([indexPath].concat(modules), {});
	const indexExternalExports = parseExternalExports(indexProgram.getSourceFile(indexPath)!);

	return PRINTER.printList(
		ts.ListFormat.MultiLine,
		// @ts-expect-error: normal arrays do not coerce to ts.NodeArray typing, even though this is valid
		indexExternalExports.concat(
			modules
				.map((moduleFile) => new ModuleFile(indexProgram.getSourceFile(moduleFile)!).toExportDeclaration(packageDir))
				.filter((node) => node) as ts.ExportDeclaration[]
		),
		indexProgram.getSourceFile(indexPath)!
	);
}

async function main() {
	const packageDir = resolve(__dirname, `../packages/${PACKAGE_NAME}/src`);
	const indexPath = join(packageDir, 'index.ts');
	const [currentFile, result] = [await readFile(join(packageDir, 'index.ts'), { encoding: 'utf-8' }), await processPackage(packageDir)];

	if (CHECK_MODE && currentFile !== result) {
		console.error(`Index file for ${PACKAGE_NAME} is out of date.`);
		process.exit(1);
	} else if (WRITE_MODE) {
		return writeFile(indexPath, result);
	}

	return console.log(result);
}

void main();
