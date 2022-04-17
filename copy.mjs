import { dump, load } from 'js-yaml';
import { readdir, readFile, writeFile } from 'node:fs/promises';

async function readJson(pathLike) {
	return JSON.parse(await readFile(pathLike, 'utf8'));
}

async function writeJson(pathLike, content) {
	return await writeFile(pathLike, JSON.stringify(content), 'utf8');
}

export async function readYaml(pathLike) {
	return load(await readFile(pathLike, { encoding: 'utf-8' }));
}

export async function writeYaml(data, pathLike) {
	return writeFile(pathLike, dump(data), { encoding: 'utf-8' });
}

const packagesDir = new URL('packages/', import.meta.url);
const cliffJumperAsyncQueue = await readYaml(new URL('async-queue/.cliff-jumperrc.yml', packagesDir));
const asyncQueueJson = await readJson(new URL('async-queue/package.json', packagesDir));

const baseBump = asyncQueueJson.scripts.bump;
const baseCheckUpdate = asyncQueueJson.scripts['check-update'];

const packages = (await readdir(packagesDir)).filter((name) => name !== 'async-queue');

for (const pkg of packages) {
	const pkgDir = new URL(`${pkg}/`, packagesDir);

	const newConfig = {
		...cliffJumperAsyncQueue,
		name: cliffJumperAsyncQueue.name.replaceAll('async-queue', pkg),
		packagePath: cliffJumperAsyncQueue.packagePath.replaceAll('async-queue', pkg)
	};

	const pkgJsonPath = new URL('package.json', pkgDir);
	const pkgJson = await readJson(pkgJsonPath);

	pkgJson.scripts.bump = baseBump;
	pkgJson.scripts['check-update'] = baseCheckUpdate;

	await writeJson(pkgJsonPath, pkgJson);

	await writeYaml(newConfig, new URL('.cliff-jumperrc.yml', pkgDir));
}
