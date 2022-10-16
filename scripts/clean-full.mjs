import { rm } from 'fs/promises';

const rootDir = new URL('../', import.meta.url);
const packagesDir = new URL('packages/', rootDir);
const options = { recursive: true, force: true };

const paths = [
	// Root node_modules
	new URL('node_modules/', rootDir),

	// Nested node_modules folders
	new URL('async-queue/node_modules/', packagesDir),
	new URL('bitfield/node_modules/', packagesDir),
	new URL('cron/node_modules/', packagesDir),
	new URL('decorators/node_modules/', packagesDir),
	new URL('discord-utilities/node_modules/', packagesDir),
	new URL('discord.js-utilities/node_modules/', packagesDir),
	new URL('duration/node_modules/', packagesDir),
	new URL('eslint-config/node_modules/', packagesDir),
	new URL('event-iterator/node_modules/', packagesDir),
	new URL('fetch/node_modules/', packagesDir),
	new URL('lexure/node_modules/', packagesDir),
	new URL('node-utilities/node_modules/', packagesDir),
	new URL('phisherman/node_modules/', packagesDir),
	new URL('prettier-config/node_modules/', packagesDir),
	new URL('ratelimits/node_modules/', packagesDir),
	new URL('result/node_modules/', packagesDir),
	new URL('snowflake/node_modules/', packagesDir),
	new URL('stopwatch/node_modules/', packagesDir),
	new URL('time-utilities/node_modules/', packagesDir),
	new URL('timer-manager/node_modules/', packagesDir),
	new URL('timestamp/node_modules/', packagesDir),
	new URL('ts-config/node_modules/', packagesDir),
	new URL('utilities/node_modules/', packagesDir),

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
	new URL('lexure/dist/', packagesDir),
	new URL('node-utilities/dist/', packagesDir),
	new URL('phisherman/dist/', packagesDir),
	new URL('prettier-config/dist/', packagesDir),
	new URL('ratelimits/dist/', packagesDir),
	new URL('result/dist/', packagesDir),
	new URL('snowflake/dist/', packagesDir),
	new URL('stopwatch/dist/', packagesDir),
	new URL('time-utilities/dist/', packagesDir),
	new URL('timer-manager/dist/', packagesDir),
	new URL('timestamp/dist/', packagesDir),
	new URL('utilities/dist/', packagesDir)
];

await Promise.all(paths.map((path) => rm(path, options)));
