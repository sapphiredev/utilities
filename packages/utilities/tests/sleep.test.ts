import { AbortError, sleep, sleepSync } from '../src';
import { DOMException } from '../src/lib/sleep';
import { expectError } from './util/macros/comparators';

describe('sleep', () => {
	test('GIVEN a number of ms THEN resolve the promise after that time', async () => {
		const start = Date.now();
		await sleep(1000);
		expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
	});

	test('GIVEN a number of ms and a value THEN resolve the promise after that time with the value', async () => {
		const start = Date.now();
		const value = await sleep(1000, 'test');
		expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
		expect<string>(value).toBe('test');
	});

	test('GIVEN a abort signal THEN reject the promise', async () => {
		const controller = new AbortController();
		const promise = sleep(1000, 'test', { signal: controller.signal });
		controller.abort();
		await expectError(
			() => promise,
			new AbortError('The operation was aborted', {
				cause: new DOMException('The operation was aborted', 'AbortError')
			})
		);
	});
});

describe('sleepSync', () => {
	test('GIVEN a number of ms THEN return after that time', () => {
		const start = Date.now();
		sleepSync(1000);
		expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
	});

	test('GIVEN a number of ms and a value THEN return after that time with the value', () => {
		const start = Date.now();
		const value = sleepSync(1000, 'test');
		expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
		expect<string>(value).toBe('test');
	});
});
