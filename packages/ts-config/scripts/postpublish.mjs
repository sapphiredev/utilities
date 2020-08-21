/* eslint-disable @typescript-eslint/naming-convention */
import fsExtra from 'fs-extra';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const { copy, remove } = fsExtra;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const moduleDir = resolve(__dirname, '..');

await copy(join(moduleDir, 'temp', 'tsconfig.json'), join(moduleDir, 'tsconfig.json'));
await remove(join(moduleDir, 'temp'));
