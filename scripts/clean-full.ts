import { glob, rm } from 'node:fs/promises';
import { URL } from 'node:url';

const rootDir = new URL('../', import.meta.url);
const options = { recursive: true, force: true };

const packagePaths = await Promise.all([
	Array.fromAsync(glob('packages/*/node_modules', { cwd: rootDir })),
	Array.fromAsync(glob('packages/*/dist', { cwd: rootDir }))
]);
const paths = [new URL('node_modules/', rootDir), ...packagePaths.flatMap((path) => new URL(path, rootDir))];

await Promise.all(paths.map(async (path) => rm(path, options)));
