/* eslint-disable @typescript-eslint/naming-convention */
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import fsExtra from 'fs-extra';

const { copy, mkdirp } = fsExtra;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const moduleDir = resolve(__dirname, '..');

await mkdirp(join(moduleDir, 'temp'));
await copy(join(moduleDir, 'tsconfig.json'), join(moduleDir, 'temp', 'tsconfig.json'));
await copy(join(moduleDir, 'src', 'tsconfig.json'), join(moduleDir, 'tsconfig.json'));
