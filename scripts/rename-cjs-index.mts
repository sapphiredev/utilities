import { bold, green } from 'colorette';
import { rename } from 'node:fs/promises';
import { join } from 'node:path';
import { findFilesRecursivelyStringEndsWith } from '../packages/node-utilities/src/index.js';

const inputPath = 'dist/cjs/';

const fullInputPathUrl = join(process.cwd(), inputPath);

for await (const file of findFilesRecursivelyStringEndsWith(fullInputPathUrl, '.d.ts')) {
	await rename(file, file.replace(/\.d\.ts$/, '.d.cts'));
}

console.log(green(`✅ Renamed .d.ts files in ${bold(fullInputPathUrl)} to .d.cts`));
