/* eslint-disable @typescript-eslint/naming-convention */
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import fsExtra from 'fs-extra';

const { copy, remove } = fsExtra;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const moduleDir = resolve(__dirname, '..');

await copy(join(moduleDir, 'temp', 'tsconfig.json'), join(moduleDir, 'tsconfig.json'));
await remove(join(moduleDir, 'temp'));
