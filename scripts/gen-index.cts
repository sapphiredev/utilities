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

/**
 * Rules:
 * 1. If the module begins with `_`, ignore it
 *    a) unless the module contains types, in which case those exclusively should be included
 * 2. If the module exclusively contains types, use `export type *`, otherwise use `export *`
 **/
async function processPackage(packageName: string, printer: ts.Printer): Promise<string> {
	const packageDir = resolve(__dirname, `../packages/${packageName}/src`);
	const packageLibDir = resolve(packageDir, './lib');
	const indexPath = resolve(packageDir, './index.ts');

	// TODO: when we get Array.fromAsync, use that instead
	let modules = [];
	for await (const file of findFilesRecursivelyStringEndsWith(packageLibDir, '.ts')) {
		modules.push(file);
	}
	const indexProgram = ts.createProgram([indexPath].concat(modules), {});
	modules = modules.toSorted().map((moduleFile) => new ModuleFile(indexProgram.getSourceFile(moduleFile)!));

	const accumulator: ts.ExportDeclaration[] = [];
	// TODO: make this a function of ModuleFile?
	for (const module of modules) {
		const { useModule, useNormal, useTypes } = module.exportInclusions;
		if (!useModule) continue;

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
