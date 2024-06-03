import ts from 'typescript';
import { join, relative, resolve, parse, type ParsedPath } from 'node:path/posix';
import { writeFile, readdir } from 'node:fs/promises';

const PRINTER = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const WRITE_MODE = process.argv.includes('-w');
const PACKAGE_NAMES = process.argv.slice(WRITE_MODE ? 3 : 2);

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

	public generateExportSpecifiers(which: keyof ModuleExportNodes) {
		return [...new Set(this.exports[which].map((node) => ts.getNameOfDeclaration(node)!.getText(this.sourceFile)!))].map((name) =>
			ts.factory.createExportSpecifier(false, undefined, name)
		);
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

		// TODO: make this more efficient
		const typeExportSpecifiers = this.generateExportSpecifiers('types');
		const exportSpecifiers = typeExportSpecifiers.concat(useNormal ? this.generateExportSpecifiers('normal') : []);
		const relativePath = relative(packageDir, this.path.dir);

		return ts.factory.createExportDeclaration(
			undefined,
			!useNormal && useTypes,
			this.isPrivate ? ts.factory.createNamedExports(exportSpecifiers) : undefined,
			ts.factory.createStringLiteral(`./${this.path.base === 'index.ts' ? relativePath : join(relativePath, this.path.name)}`, true),
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

		// TODO: skip normals where this.isPrivate?
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

async function findIndexOrModules(dir: string, depth: number = 0): Promise<string[]> {
	const contents = await readdir(dir, { withFileTypes: true });
	let results: string[] = [];
	for (const item of contents) {
		if (item.name === 'common') continue;
		const itemPath = join(dir, item.name);
		if (item.isFile()) {
			if (!item.name.endsWith('.ts')) continue;
			if (item.name === 'index.ts') {
				// TODO: process index to support re-exports (see #750)
				if (depth === 0) continue;
				results = [itemPath];
				break;
			}
			results.push(itemPath);
			// TODO: there are likely more efficient ways to determine if a directory has an auxiliary index
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

	return PRINTER.printList(
		ts.ListFormat.MultiLine,
		// @ts-expect-error: normal arrays do not coerce to ts.NodeArray typing, even though this is valid
		modules.map((moduleFile) => new ModuleFile(indexProgram.getSourceFile(moduleFile)!).toExportDeclaration(packageDir)).filter((node) => node),
		indexProgram.getSourceFile(indexPath)!
	);
}

async function main() {
	// TODO: explore performance improvements, maybe via parallelism?
	const packages: [string, Promise<string>][] = PACKAGE_NAMES.map((packageName) => {
		const packageDir = resolve(__dirname, `../packages/${packageName}/src`);
		return [join(packageDir, 'index.ts'), processPackage(packageDir)];
	});
	// TODO: use .then with writeFile? see if condensing promises instead of having writeFile await result changes performance
	if (WRITE_MODE) return Promise.all(packages.map(async ([indexPath, result]) => writeFile(indexPath, await result)));
	return console.log((await Promise.all(packages.map(([_, result]) => result))).join('\n'));
}

void main();
