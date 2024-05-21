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
	public exports: ModuleExportNodes;
	private sourceFile: ts.SourceFile;

	public constructor(sourceFile: ts.SourceFile) {
		this.sourceFile = sourceFile;
		this.path = parse(sourceFile.fileName);
		this.exports = this.getExports();
	}

	public get isPrivate(): boolean {
		return this.path.name.startsWith('_');
	}

	public generateExportSpecifiers(which: keyof Omit<ModuleExportNodes, 'exports_all'>, useTypes: boolean) {
		return [...new Set(this.exports[which].map((node) => ts.getNameOfDeclaration(node)!.getText(this.sourceFile)!))].map((name) =>
			ts.factory.createExportSpecifier(useTypes, undefined, name)
		);
	}

	private getExports(): ModuleExportNodes {
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
 * 1. If the module begins with `_`, ignore it
 *    a) unless the module contains types, in which case those exclusively should be included
 * 2. If the module contains types
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
	modules.sort();

	const indexPath = resolve(packageDir, './index.ts');
	const indexProgram = ts.createProgram([indexPath].concat(modules), {});
	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
	for (const modulePath of modules) {
		const sourceFile = indexProgram.getSourceFile(modulePath)!;
		const module = new ModuleFile(sourceFile);

		// rule 1
		if (module.isPrivate && !module.exports.types.length) continue;
		// rule 2
		const useNormal = !module.isPrivate && module.exports.normal.length > 0;
		const useTypes = module.exports.types.length > 0;
		const useIndividualTypes = useNormal && useTypes;

		const typeExportSpecifiers = module.generateExportSpecifiers('types', useIndividualTypes);
		const exportSpecifiers = typeExportSpecifiers.concat(useNormal ? module.generateExportSpecifiers('normal', false) : []);

		console.log(
			printer.printNode(
				ts.EmitHint.Unspecified,
				ts.factory.createExportDeclaration(
					undefined,
					!useNormal && useTypes,
					useNormal && !useTypes ? undefined : ts.factory.createNamedExports(exportSpecifiers),
					ts.factory.createStringLiteral(`./${relative(packageDir, module.path.dir)}/${module.path.name}`, true),
					undefined
				),
				sourceFile
			)
		);
	}
}

void main();
