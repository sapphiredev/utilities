import ts from 'typescript';
import { relative, resolve, parse, type ParsedPath } from 'node:path';
import { findFilesRecursivelyStringEndsWith } from '../packages/node-utilities/src/index';

function isExported(node: ts.Declaration): boolean {
	return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) > 0;
}

function isType(node: ts.Node): boolean {
	return [ts.SyntaxKind.InterfaceDeclaration, ts.SyntaxKind.TypeAliasDeclaration].includes(node.kind);
}

interface ModuleExportNodes {
	normal: ts.Declaration[];
	types: ts.Declaration[];
	exports_all: boolean;
}

class ModuleFile {
	public path: ParsedPath;
	private sourceFile: ts.SourceFile;

	public constructor(sourceFile: ts.SourceFile) {
		this.sourceFile = sourceFile;
		this.path = parse(sourceFile.fileName);
	}

	public isPrivate(): boolean {
		return this.path.name.startsWith('_');
	}

	public getExports(): ModuleExportNodes {
		const normal: ts.Declaration[] = [];
		const types: ts.Declaration[] = [];
		let _nodeCount = 0;

		this.sourceFile.forEachChild((node) => {
			// imports count as declarations, so exports_all will be inaccurate if this condition is not checked.
			if (!ts.isDeclarationStatement(node) || ts.isImportDeclaration(node)) return;
			_nodeCount++;
			if (!isExported(node)) return;
			isType(node) ? types.push(node) : normal.push(node);
		});

		return {
			normal,
			types,
			// TODO: find out if there is a better way to do this
			exports_all: normal.length + types.length === _nodeCount
		};
	}
}

/**
 * Rules:
 * 1. Find normal and type modules
 * 2. If the module begins with `_`, ignore it
 *    a) unless the module contains types, in which case those exclusively should be included
 * 3. If the module contains types
 *    a) use specific exports
 *       i. if it exclusively contains types, use `export type { ... }`
 *      ii. if types are contained, but not the only exported items, use `export { ..., type ... }`
 *    b) if it does not, use `export *`
 **/
async function main() {
	const packageName = process.argv[2];
	const packageDir = resolve(__dirname, `../packages/${packageName}/src`);
	const packageLibDir = resolve(packageDir, './lib');

	const modules = [];
	for await (const file of findFilesRecursivelyStringEndsWith(packageLibDir, '.ts')) {
		modules.push(file);
	}

	const indexPath = resolve(packageDir, './index.ts');
	const indexProgram = ts.createProgram([indexPath].concat(modules), {});
	for (const modulePath of modules) {
		const sourceFile = indexProgram.getSourceFile(modulePath)!;
		const module = new ModuleFile(sourceFile);
		const exports = module.getExports();
	}
}

void main();
