import ts from 'typescript';
import { format, relative, resolve, parse, type ParsedPath } from 'node:path';
import { findFilesRecursivelyStringEndsWith } from '../packages/node-utilities/src/index';
import { writeFile } from 'node:fs/promises';

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

		return ts.factory.createExportDeclaration(
			undefined,
			!useNormal && useTypes,
			this.isPrivate ? ts.factory.createNamedExports(exportSpecifiers) : undefined,
			ts.factory.createStringLiteral(`./${format({ dir: relative(packageDir, this.path.dir), base: this.path.name })}`, true),
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

async function processPackage(packageDir: string, printer: ts.Printer): Promise<string> {
	const indexPath = resolve(packageDir, './index.ts');

	// TODO: when we get Array.fromAsync, use that instead
	const modules = [];
	for await (const file of findFilesRecursivelyStringEndsWith(packageDir, '.ts')) {
		if (file === indexPath) continue;
		modules.push(file);
	}
	const indexProgram = ts.createProgram([indexPath].concat(modules), {});

	return printer.printList(
		ts.ListFormat.MultiLine,
		// @ts-expect-error: normal arrays do not coerce to ts.NodeArray typing, even though this is valid
		modules
			.toSorted()
			.map((moduleFile) => new ModuleFile(indexProgram.getSourceFile(moduleFile)!).toExportDeclaration(packageDir))
			.filter((node) => node),
		indexProgram.getSourceFile(indexPath)!
	);
}

async function main() {
	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
	const writeMode = process.argv.includes('-w');
	const packageName = process.argv.at(-1);
	const packageDir = resolve(__dirname, `../packages/${packageName}/src`);

	const result = await processPackage(packageDir, printer);
	if (writeMode) {
		return writeFile(resolve(packageDir, './index.ts'), result);
	}
	console.log(result);
}

void main();
