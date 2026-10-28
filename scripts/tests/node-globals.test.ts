import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { TextDecoder, TextEncoder } from 'node:util';
import { runInNewContext } from 'node:vm';
import { Rolldown } from 'tsdown';
import { describe, expect, test, vi } from 'vitest';
import { nodeGlobals } from '../node-globals.ts';

async function bundle(source: string, format: 'esm' | 'iife' = 'esm') {
	const directory = await mkdtemp(join(tmpdir(), 'sapphire-node-globals-'));
	try {
		const input = join(directory, 'index.ts');
		await writeFile(input, source);
		const build = await Rolldown.rolldown({ input, plugins: [nodeGlobals()], external: /^node:/ });
		try {
			const { output } = await build.generate({ format, name: 'fixture', sourcemap: true });
			const chunk = output.find((entry) => entry.type === 'chunk');
			if (!chunk) throw new Error('Expected a JavaScript chunk');
			return chunk;
		} finally {
			await build.close();
		}
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
}

describe('nodeGlobals', () => {
	test('uses global timers while preserving import aliases and source maps', async () => {
		const { code, imports, map } = await bundle(
			`import { setTimeout as schedule, clearTimeout as cancel, setInterval, clearInterval } from 'node:timers';
			export { schedule, cancel, setInterval, clearInterval };`,
			'iife'
		);
		const timers = { setTimeout: vi.fn(), clearTimeout: vi.fn(), setInterval: vi.fn(), clearInterval: vi.fn() };
		const result = runInNewContext(`${code}\nfixture;`, timers) as Record<string, unknown>;

		expect(imports).toEqual([]);
		expect(result.schedule).toBe(timers.setTimeout);
		expect(result.cancel).toBe(timers.clearTimeout);
		expect(result.setInterval).toBe(timers.setInterval);
		expect(result.clearInterval).toBe(timers.clearInterval);
		expect(map?.sources.some((source) => source.endsWith('index.ts'))).toBe(true);
	});

	test('uses browser text encoders without importing Node modules', async () => {
		const { code, imports } = await bundle(
			`import { TextEncoder, TextDecoder } from 'node:util';
			export const value = new TextDecoder().decode(new TextEncoder().encode('Hello 😀'));`,
			'iife'
		);
		const result = runInNewContext(`${code}\nfixture;`, { TextEncoder, TextDecoder }) as { value: string };

		expect(imports).toEqual([]);
		expect(result.value).toBe('Hello 😀');
	});

	test('allows optional Node globals to be absent in a browser', async () => {
		const { code, imports } = await bundle(
			`import process from 'node:process';
			import { Buffer } from 'node:buffer';
			export const hasProcess = typeof process !== 'undefined';
			export const isBuffer = Buffer?.isBuffer({}) ?? false;`,
			'iife'
		);
		const result = runInNewContext(`${code}\nfixture;`) as { hasProcess: boolean; isBuffer: boolean };

		expect(imports).toEqual([]);
		expect(result.hasProcess).toBe(false);
		expect(result.isBuffer).toBe(false);
	});

	test('retains genuine Node APIs, namespace imports, and import-like strings', async () => {
		const { code, imports } = await bundle(
			`import { TextEncoder as Encoder, promisify, type InspectOptions } from 'node:util';
			import * as timers from 'node:timers';
			import { readFile } from 'node:fs/promises';
			export { Encoder, promisify, timers, readFile };
			export type { InspectOptions };
			export const message = "import { TextEncoder } from 'node:util';";`
		);

		expect(imports).toEqual(expect.arrayContaining(['node:util', 'node:timers', 'node:fs/promises']));
		expect(code).toContain('globalThis.TextEncoder');
		expect(code).toContain("import { TextEncoder } from 'node:util';");
	});
});
