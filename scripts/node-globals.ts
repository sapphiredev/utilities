import { parse } from '@babel/parser';
import { Rolldown, type TsdownPlugin } from 'tsdown';

type ImportDeclaration = Extract<ReturnType<typeof parse>['program']['body'][number], { type: 'ImportDeclaration' }>;
type ImportSpecifier = Extract<ImportDeclaration['specifiers'][number], { type: 'ImportSpecifier' }>;

const globalsByModule = new Map<string, readonly string[]>([
	['node:timers', ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval']],
	['node:util', ['TextEncoder', 'TextDecoder']],
	['node:buffer', ['Buffer']],
	['node:process', ['default']]
]);

/**
 * Keeps Node imports in TypeScript while using the platform globals in emitted JavaScript.
 * Type-only imports and Node APIs without a global equivalent remain imported.
 * Buffer and process still require host support when their functionality is used.
 */
export function nodeGlobals(): TsdownPlugin {
	return {
		name: 'sapphire:node-globals',
		transform: {
			filter: { id: /\.[cm]?ts$/, code: /node:/ },
			handler(code, id) {
				// Declarations must retain their Node type imports.
				if (/\.d\.[cm]?ts$/.test(id)) return null;

				const ast = parse(code, { sourceType: 'module', plugins: ['decorators-legacy', 'typescript'] });
				const output = new Rolldown.RolldownMagicString(code);
				let changed = false;

				for (const statement of ast.program.body) {
					if (statement.type !== 'ImportDeclaration' || statement.importKind === 'type') continue;
					const globals = globalsByModule.get(statement.source.value);
					if (!globals) continue;

					const bindings: string[] = [];
					const remaining = statement.specifiers.filter((specifier) => {
						if (
							specifier.type === 'ImportNamespaceSpecifier' ||
							(specifier.type === 'ImportSpecifier' && specifier.importKind === 'type')
						) {
							return true;
						}

						const imported = specifier.type === 'ImportDefaultSpecifier' ? 'default' : importedName(specifier);
						if (!globals.includes(imported)) return true;

						const globalName = imported === 'default' ? 'process' : imported;
						bindings.push(`const ${specifier.local.name} = globalThis.${globalName};`);
						return false;
					});
					if (bindings.length === 0) continue;

					if (remaining.length > 0) bindings.unshift(retainedImport(code, statement, remaining));
					output.overwrite(statement.start!, statement.end!, bindings.join('\n'));
					changed = true;
				}

				if (changed)
					return { code: output.toString(), map: output.generateMap({ source: id, includeContent: true, hires: true }).toString() };
				return null;
			}
		}
	};
}

function importedName(specifier: ImportSpecifier): string {
	return specifier.imported.type === 'Identifier' ? specifier.imported.name : specifier.imported.value;
}

function retainedImport(code: string, statement: ImportDeclaration, specifiers: ImportDeclaration['specifiers']): string {
	const named = specifiers.filter((specifier) => specifier.type === 'ImportSpecifier');
	const clause = specifiers
		.filter((specifier) => specifier.type !== 'ImportSpecifier')
		.map((specifier) => code.slice(specifier.start!, specifier.end!));
	if (named.length > 0) clause.push(`{ ${named.map((specifier) => code.slice(specifier.start!, specifier.end!)).join(', ')} }`);
	return `import ${clause.join(', ')} from ${code.slice(statement.source.start!, statement.end!)}`;
}
