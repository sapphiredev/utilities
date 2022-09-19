import { opendir, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { format } from 'prettier';
import { red, green } from 'colorette';

const packageName = process.argv[2];
const check = process.argv[3] === '--check';

/**
 *
 * @param {PathLike} path
 * @param {string} [ext]
 * @return {AsyncIterableIterator<string>}
 */
async function* walk(path, ext) {
	try {
		const dir = await opendir(path);
		for await (const item of dir) {
			if (item.isFile() && (!ext || item.name.endsWith(ext))) yield join(dir.path, item.name);
			else if (item.isDirectory()) yield* walk(join(dir.path, item.name), ext);
		}
	} catch (error) {
		if (error.code !== 'ENOENT') console.error(error);
	}
}

const { aliasStore } = await import(`./aliases/${packageName}.mjs`);

const exportMap = new Map([
	[
		'.',
		{
			types: './dist/index.d.ts',
			import: './dist/index.mjs',
			require: './dist/index.js',
			browser: './dist/index.global.js'
		}
	]
]);

for await (const file of walk(new URL(`../packages/${packageName}/src/lib`, import.meta.url), '.ts')) {
	const name = basename(file).replace(/\.ts$/, '');
	const splitted = file.split('lib');
	splitted.shift();
	const filePath = `./dist/lib${splitted.join('').replace(/\.ts$/, '')}`.replace(/\\/g, '/');
	if (name === 'index') continue;

	exportMap.set(`./${name}`, {
		types: `${filePath}.d.ts`,
		import: `${filePath}.mjs`,
		require: `${filePath}.js`
	});

	if (aliasStore.has(name)) {
		exportMap.set(`./${aliasStore.get(name)}`, {
			types: `${filePath}.d.ts`,
			import: `${filePath}.mjs`,
			require: `${filePath}.js`
		});
	}
}

const exportObj = Object.fromEntries([...exportMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));

const { default: packageJSON } = await import(`../packages/${packageName}/package.json`, {
	assert: {
		type: 'json'
	}
});

const newPackageJSON = format(
	JSON.stringify({
		...packageJSON,
		...{
			exports: exportObj
		}
	}),
	{
		filepath: `../packages/${packageName}/package.json`
	}
);

const oldPackageJSON = format(JSON.stringify(packageJSON, null, '\t'), {
	filepath: `../packages/${packageName}/package.json`
});
if (oldPackageJSON === newPackageJSON) {
	console.log(green(`The package.json file for ${packageName} is up to date!`));
	process.exit(0);
}

if (check) {
	console.error(red(`The package.json file for ${packageName} is not up to date!`));
	process.exit(1);
}

await writeFile(new URL(`../packages/${packageName}/package.json`, import.meta.url), newPackageJSON);
console.log(green(`The package.json file for ${packageName} is updated successfully!`));
