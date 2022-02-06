import { rm } from 'fs/promises';

const rootDir = new URL('../', import.meta.url);
const packagesDir = new URL('packages/', rootDir);
const options = { recursive: true, force: true };

const paths = [
	// Dist folders
	new URL('async-queue/dist/', packagesDir),
	new URL('discord.js-utilities/dist/', packagesDir),
	new URL('event-iterator/dist/', packagesDir),
	new URL('ratelimits/dist/', packagesDir),
	new URL('time-utilities/dist/', packagesDir),
	new URL('decorators/dist/', packagesDir),
	new URL('embed-jsx/dist/', packagesDir),
	new URL('fetch/dist/', packagesDir),
	new URL('snowflake/dist/', packagesDir),
	new URL('ts-config/build/', packagesDir),
	new URL('discord-utilities/dist/', packagesDir),
	new URL('eslint-config/dist/', packagesDir),
	new URL('prettier-config/dist/', packagesDir),
	new URL('stopwatch/dist/', packagesDir),
	new URL('utilities/dist/', packagesDir),
	new URL('phisherman/dist/', packagesDir),
	new URL('result/dist/', packagesDir),

	// Turbo folders
	new URL('async-queue/.turbo/', packagesDir),
	new URL('discord.js-utilities/.turbo/', packagesDir),
	new URL('event-iterator/.turbo/', packagesDir),
	new URL('ratelimits/.turbo/', packagesDir),
	new URL('time-utilities/.turbo/', packagesDir),
	new URL('decorators/.turbo/', packagesDir),
	new URL('embed-jsx/.turbo/', packagesDir),
	new URL('fetch/.turbo/', packagesDir),
	new URL('snowflake/.turbo/', packagesDir),
	new URL('ts-config/.turbo/', packagesDir),
	new URL('discord-utilities/.turbo/', packagesDir),
	new URL('eslint-config/.turbo/', packagesDir),
	new URL('prettier-config/.turbo/', packagesDir),
	new URL('stopwatch/.turbo/', packagesDir),
	new URL('utilities/.turbo/', packagesDir),
	new URL('phisherman/.turbo/', packagesDir),
	new URL('result/.turbo/', packagesDir)
];

await Promise.all(paths.map((path) => rm(path, options)));
