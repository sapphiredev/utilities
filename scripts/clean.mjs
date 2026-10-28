import { glob, rm } from 'node:fs/promises';
import { URL } from 'node:url';

const rootDir = new URL('../', import.meta.url);
const options = { recursive: true, force: true };

const paths = (await Array.fromAsync(glob('packages/*/dist', { cwd: rootDir }))).map((path) => new URL(path, rootDir));

await Promise.all(paths.map(async (path) => rm(path, options)));
