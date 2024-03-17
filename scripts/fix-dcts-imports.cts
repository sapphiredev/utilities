import { green } from 'colorette';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { findFilesRecursivelyStringEndsWith } from '../packages/node-utilities/src/index';

async function main() {
	const inputPath = 'dist/cjs/';

	const fullInputPathUrl = join(process.cwd(), inputPath);

	for await (const file of findFilesRecursivelyStringEndsWith(fullInputPathUrl, '.d.cts')) {
		const fileContent = await readFile(file, 'utf-8');

		const lines = fileContent.split('\n');
		const updatedLines = lines.map((line) => {
			if (line.startsWith('import') || line.startsWith('export')) {
				return line.replace(/('\.(?:\/lib)?(?:\/debounce)?\/[a-zA-Z]+\.)js(';?)/, '$1cjs$2');
			}
			return line;
		});

		const updatedFileContent = updatedLines.join('\n');

		await writeFile(file, updatedFileContent);
	}

	console.log(green(`✅ Fixed imports in .d.cts to reference .cjs files`));
}

void main();
