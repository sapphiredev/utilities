import { green } from 'colorette';
import { rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { URL } from 'node:url';
import { fetch } from 'undici';

async function importFileFromWeb({ url, temporaryFileName }: { url: string; temporaryFileName: string }) {
	const result = await fetch(url);
	const body = await result.text();

	const temporaryOutputFile = new URL(temporaryFileName, import.meta.url);

	await writeFile(temporaryOutputFile, body);

	// @ts-expect-error Node supports URLs just fine
	const loadedModule = await import(temporaryOutputFile);

	await rm(temporaryOutputFile);

	return loadedModule;
}

async function main() {
	const filePrefix = [
		'/**',
		' * Regex that can capture a Twemoji (Twitter Emoji)',
		' * @raw {@linkplain https://github.com/twitter/twemoji-parser/blob/master/src/lib/regex.js See official source code}',
		' */',
		'export const TwemojiRegex =',
		'\t'
	].join('\n');
	const fileSuffix = [';', ''].join('\n');

	const twemojiRegexFileUrl = resolve(__dirname, '../packages/discord-utilities/src/lib/TwemojiRegex.ts');

	const { default: regexFromWeb } = await importFileFromWeb({
		url: 'https://raw.githubusercontent.com/twitter/twemoji-parser/master/src/lib/regex.js',
		temporaryFileName: 'regex.mjs'
	});

	await writeFile(twemojiRegexFileUrl, `${filePrefix}${regexFromWeb}${fileSuffix}`);

	console.log(green(`Successfully wrote updated Twemoji Regex to file`));
}

void main();
