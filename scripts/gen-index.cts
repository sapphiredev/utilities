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
}

class ModuleFile {
	public exports: ModuleExportNodes;
	public readonly isPrivate: boolean;
	public readonly path: ParsedPath;
	private sourceFile: ts.SourceFile;

	public constructor(sourceFile: ts.SourceFile) {
		this.sourceFile = sourceFile;
		this.path = parse(sourceFile.fileName);
		this.isPrivate = this.path.name.startsWith('_');
		this.exports = this.getExports();
	}

	public generateExportSpecifiers(which: keyof ModuleExportNodes) {
		return [...new Set(this.exports[which].map((node) => ts.getNameOfDeclaration(node)!.getText(this.sourceFile)!))].map((name) =>
			ts.factory.createExportSpecifier(false, undefined, name)
		);
	}

	private getExports(): ModuleExportNodes {
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

/**
 * Rules:
 * 1. If the module begins with `_`, ignore it
 *    a) unless the module contains types, in which case those exclusively should be included
 * 2. If the module exclusively contains types, use `export type *`, otherwise use `export *`
 **/
async function processPackage(packageName: string, printer: ts.Printer): Promise<string> {
	const packageDir = resolve(__dirname, `../packages/${packageName}/src`);
	const packageLibDir = resolve(packageDir, './lib');

	// TODO: surely there's a way to collect the iterator
	const modules = [];
	for await (const file of findFilesRecursivelyStringEndsWith(packageLibDir, '.ts')) {
		modules.push(file);
	}
	modules.sort();

	const indexPath = resolve(packageDir, './index.ts');
	const indexProgram = ts.createProgram([indexPath].concat(modules), {});
	const accumulator: ts.ExportDeclaration[] = [];
	// TODO: make this a function of ModuleFile?
	// potential optimisation: since modules are bundled into indexProgram, use indexProgram.getSourceFiles()
	for (const modulePath of modules) {
		const sourceFile = indexProgram.getSourceFile(modulePath)!;
		const module = new ModuleFile(sourceFile);

		// TODO: make these a function of ModuleFile?
		let useNormal: boolean;
		let useTypes: boolean;

		if (module.isPrivate) {
			// rule 1
			if (!module.exports.types.length) continue;
			useNormal = false;
			useTypes = true;
		} else {
			// rule 2
			useNormal = module.exports.normal.length > 0;
			useTypes = module.exports.types.length > 0;
		}

		// TODO: make this more efficient
		const typeExportSpecifiers = module.generateExportSpecifiers('types');
		const exportSpecifiers = typeExportSpecifiers.concat(useNormal ? module.generateExportSpecifiers('normal') : []);

		accumulator.push(
			ts.factory.createExportDeclaration(
				undefined,
				!useNormal && useTypes,
				module.isPrivate ? ts.factory.createNamedExports(exportSpecifiers) : undefined,
				ts.factory.createStringLiteral(`./${relative(packageDir, module.path.dir)}/${module.path.name}`, true),
				undefined
			)
		);
	}
	return printer.printList(ts.ListFormat.MultiLine, accumulator as ts.NodeArray<ts.ExportDeclaration>, indexProgram.getSourceFile(indexPath)!);
}

async function main() {
	const packageName = process.argv[2];
	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

	console.log(await processPackage(packageName, printer));
}

void main();
