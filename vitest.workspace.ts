import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'./packages/async-queue/vitest.config.ts',
	'./packages/bitfield/vitest.config.ts',
	'./packages/cron/vitest.config.ts',
	'./packages/decorators/vitest.config.ts',
	'./packages/discord-utilities/vitest.config.ts',
	'./packages/duration/vitest.config.ts',
	'./packages/eslint-config/vitest.config.ts',
	'./packages/eslint-plugin-result/vitest.config.ts',
	'./packages/event-iterator/vitest.config.ts',
	'./packages/fetch/vitest.config.ts',
	'./packages/iterator-utilities/vitest.config.ts',
	'./packages/lexure/vitest.config.ts',
	'./packages/node-utilities/vitest.config.ts',
	'./packages/prettier-config/vitest.config.ts',
	'./packages/ratelimits/vitest.config.ts',
	'./packages/result/vitest.config.ts',
	'./packages/snowflake/vitest.config.ts',
	'./packages/stopwatch/vitest.config.ts',
	'./packages/string-store/vitest.config.ts',
	'./packages/timer-manager/vitest.config.ts',
	'./packages/timestamp/vitest.config.ts',
	'./packages/ts-config/vitest.config.ts',
	'./packages/utilities/vitest.config.ts'
]);
