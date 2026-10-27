import { rm } from 'fs/promises';

const rootDir = new URL('../', import.meta.url);
const packagesDir = new URL('packages/', rootDir);
const options = { recursive: true, force: true };

const paths = [
	// Dist folders
	new URL('async-queue/dist/', packagesDir),
	new URL('bitfield/dist/', packagesDir),
	new URL('cron/dist/', packagesDir),
	new URL('decorators/dist/', packagesDir),
	new URL('discord-utilities/dist/', packagesDir),
	new URL('discord.js-utilities/dist/', packagesDir),
	new URL('duration/dist/', packagesDir),
	new URL('eslint-config/dist/', packagesDir),
	new URL('event-iterator/dist/', packagesDir),
	new URL('fetch/dist/', packagesDir),
	new URL('iterator-utilities/dist/', packagesDir),
	new URL('lexure/dist/', packagesDir),
	new URL('node-utilities/dist/', packagesDir),
	new URL('phisherman/dist/', packagesDir),
	new URL('prettier-config/dist/', packagesDir),
	new URL('ratelimits/dist/', packagesDir),
	new URL('result/dist/', packagesDir),
	new URL('snowflake/dist/', packagesDir),
	new URL('stopwatch/dist/', packagesDir),
	new URL('string-store/dist/', packagesDir),
	new URL('time-utilities/dist/', packagesDir),
	new URL('timer-manager/dist/', packagesDir),
	new URL('timestamp/dist/', packagesDir),
	new URL('utilities/dist/', packagesDir),
];

await Promise.all(paths.map((path) => rm(path, options)));
