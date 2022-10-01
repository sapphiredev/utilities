import { sleep, sleepSync } from '../src';

describe('sleep', () => {
	test('GIVEN a number of ms THEN resolve the promise after that time', async () => {
		const start = Date.now();
		await sleep(100);
		expect(Date.now() - start).toBeGreaterThanOrEqual(100);
	});

	test('GIVEN a number of ms and a value THEN resolve the promise after that time with the value', async () => {
		const start = Date.now();
		const value = await sleep(100, 'test');
		expect(Date.now() - start).toBeGreaterThanOrEqual(100);
		expect<string>(value).toBe('test');
	});

	test('GIVEN a abort signal THEN reject the promise', async () => {
		const controller = new AbortController();
		const promise = sleep(1000, 'test', { signal: controller.signal });
		controller.abort();
		await expect(promise).rejects.toThrow('The operation was aborted');
	});
});

describe('sleepSync', () => {
	test('GIVEN a number of ms THEN return after that time', () => {
		const start = Date.now();
		sleepSync(100);
		expect(Date.now() - start).toBeGreaterThanOrEqual(100);
	});

	test('GIVEN a number of ms and a value THEN return after that time with the value', () => {
		const start = Date.now();
		const value = sleepSync(100, 'test');
		expect(Date.now() - start).toBeGreaterThanOrEqual(100);
		expect<string>(value).toBe('test');
	});
});
